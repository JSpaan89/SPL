/* =============================================================================
 *  SPL Fierljeppen — Service Worker (auto-update editie)
 *  ---------------------------------------------------------------------------
 *  Strategie:
 *    • HTML / manifest / SW zelf  →  NETWORK-FIRST (3 s timeout → cache fallback)
 *      Hierdoor zien geïnstalleerde gebruikers nieuwe versies direct na refresh.
 *    • Afbeeldingen / audio       →  CACHE-FIRST + stale-while-revalidate
 *      Snelle laadtijd, en de cache wordt op de achtergrond bijgewerkt.
 *
 *  Auto-reload:
 *    Bij install doen we skipWaiting() en bij activate clients.claim() — dit
 *    triggert een `controllerchange` event in de pagina, en de client-side
 *    listener (in fierljeppen.html) reloads dan automatisch. De gebruiker
 *    hoeft niets te doen.
 *
 *  Bij elke meaningful push: bump CACHE_VERSION zodat de SW herinstalleert
 *  en oude asset-caches worden opgeruimd.
 * ============================================================================= */

const CACHE_VERSION = 'v17-cleanup';
const CACHE_NAME    = `spl-fierljeppen-${CACHE_VERSION}`;

// Core shell — voor offline boot. Alleen pre-cachen wat ALTIJD nodig is.
const CORE_URLS = [
  './',
  './fierljeppen.html',
  './manifest.json',
  './logo.png',
  './app-icon.png',
];

// Network-first patronen: altijd verse versie proberen, fallback naar cache.
const NETWORK_FIRST_PATTERNS = [
  /\/fierljeppen\.html$/,
  /\/service-worker\.js$/,
  /\/manifest\.json$/,
  /\/$/,                       // root-index
];

// Cache-first runtime assets (afbeeldingen, audio, video, sprites).
const RUNTIME_PATTERNS = [
  /sprite-/,
  /bg-/,
  /flag-/,
  /pole|poolstok/,
  /referee/,
  /\/logo(-small)?\.png$/,
  /\/app-icon\.png$/,
  /\.mp3$/,
  /\.mp4$/,
];

self.addEventListener('install', (event) => {
  // Pre-cache de shell en activeer direct (skipWaiting) zodat nieuwe versies
  // niet hoeven te wachten tot alle tabs gesloten zijn.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_URLS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Drop oude caches en pak de controle over alle bestaande clients —
  // dit triggert `controllerchange` in de pagina, wat de auto-reload start.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // never touch cross-origin

  if (NETWORK_FIRST_PATTERNS.some((re) => re.test(url.pathname))) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

/* ---- Strategies ------------------------------------------------------- */

async function networkFirst(req) {
  // 3 s timeout zodat offline-clients niet hangen.
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await Promise.race([
      fetch(req, { cache: 'no-store' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req) || await caches.match(req);
    if (cached) return cached;
    // Last resort: serve the cached game shell so the app boots at all.
    const fallback = await caches.match('./fierljeppen.html');
    return fallback || new Response('Offline en niets in cache.', { status: 503 });
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) {
    // Stale-while-revalidate: serve cache, update in background.
    event_safeRefresh(req);
    return cached;
  }
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok && shouldStore(new URL(req.url).pathname)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (e) {
    return new Response('Offline en asset niet in cache.', { status: 503 });
  }
}

function event_safeRefresh(req) {
  // Background-refresh zonder de fetch-respons te blokkeren.
  fetch(req).then((resp) => {
    if (resp && resp.ok) {
      caches.open(CACHE_NAME).then((cache) => cache.put(req, resp.clone()));
    }
  }).catch(() => { /* offline, leave cache alone */ });
}

function shouldStore(pathname) {
  return CORE_URLS.some((p) => pathname.endsWith(p.replace(/^\.\//, ''))) ||
    RUNTIME_PATTERNS.some((re) => re.test(pathname));
}

/* ---- Optional: forced update message van client kant ----------------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
