# SPL Fierljeppen — GitHub Pages launch guide

Deze map bevat het complete spel + alle bestanden die nodig zijn om het als **gratis installeerbare web-app** online te zetten via **GitHub Pages**. Lever je de URL op aan vrienden, dan kunnen ze het spel **als app op hun telefoon installeren** (Android en iPhone).

---

## 📦 Wat zit er in deze map?

```
github/
├── fierljeppen.html      ← het spel zelf (standalone — alles ingebakken)
├── manifest.json         ← PWA-metadata (naam, icoon, kleuren)
├── service-worker.js     ← maakt het spel offline-bruikbaar na 1e bezoek
├── logo.png              ← app-icoon (groot)
├── logo-small.png        ← app-icoon (klein)
├── README.md             ← deze handleiding
├── bg-*.png              ← achtergrond-lagen (worden niet meer apart geladen
│                            sinds standalone-build, maar handig voor latere
│                            updates)
├── sprite-*.png          ← karakter-sprites
├── bg-music.mp3, frank-fail.mp4
```

De spelers hoeven uiteindelijk niks van deze structuur te weten — ze krijgen één URL.

---

## 🚀 STAP 1 — Eenmalig: GitHub account + repository

Heb je al een GitHub-account, sla deze stap dan over.

1. Ga naar **https://github.com** en klik **Sign up**.
2. Kies een gebruikersnaam, mail, wachtwoord. Verifieer je e-mail.
3. Eenmaal ingelogd: klik rechtsboven op **+** → **New repository**.
4. Vul in:
   - **Repository name**: `spl-fierljeppen` (of zelf kiezen — wordt deel van de URL)
   - **Description** (optioneel): "Fierljep drankspel voor SPL"
   - **Public** aanvinken (Pages werkt alleen op public repos in de gratis versie)
   - **Add a README file** UIT laten (we hebben er al een)
5. Klik **Create repository**.

---

## 📤 STAP 2 — Upload de inhoud van deze map

**Optie A — Web-upload (makkelijkst, geen tools nodig):**

1. Op de repo-pagina, klik **Add file** → **Upload files**.
2. Sleep ALLE bestanden uit deze `github/` map het venster in (selecteer alles met Ctrl+A in Verkenner). Niet de mapnaam zelf — alleen de inhoud.
3. Wacht tot alles is geüpload (kan even duren — fierljeppen.html is ~33 MB).
4. Onderaan: bij "Commit changes" laat je de standaard staan en klik **Commit changes**.

**Optie B — GitHub Desktop (handig als je vaker updates pusht):**

1. Download **GitHub Desktop** via https://desktop.github.com — installeer + log in.
2. **File → Clone repository** → kies je nieuwe repo → kies een lokale locatie.
3. Open die map in Verkenner. Kopieer alle bestanden uit deze `github/` map erin.
4. Terug in GitHub Desktop: typ een commit-message ("eerste versie") en klik **Commit to main** → **Push origin**.

---

## 🌐 STAP 3 — GitHub Pages aanzetten

1. Op je repo-pagina, klik bovenin op **Settings** (tabblad).
2. Linker menu: scroll naar **Pages**.
3. Onder **Source**: kies **Deploy from a branch**.
4. Onder **Branch**: kies **main** en **/ (root)**. Klik **Save**.
5. Wacht **1–3 minuten**. Refresh de Pages-pagina. Bovenin zie je nu een groen vinkje + de URL:
   ```
   ✅ Your site is live at https://<jouw-username>.github.io/spl-fierljeppen/
   ```
6. Open die URL in een nieuwe tab. Het spel laadt → klaar.

**Volledige game-URL voor delen:**
```
https://<jouw-username>.github.io/spl-fierljeppen/fierljeppen.html
```
(De root-URL werkt vaak ook omdat browsers automatisch index zoeken — maar `fierljeppen.html` is de zekere variant.)

---

## 📱 STAP 4 — Installeren op telefoon

Stuur de URL via WhatsApp / iMessage / app naar de spelers. Daar volgt de installatie per platform:

### 🤖 Android (Chrome / Edge / Samsung Internet)

1. Open de URL in **Chrome** (of Edge / Samsung Internet — Firefox ondersteunt PWAs minder goed).
2. Wacht tot het spel volledig is geladen.
3. Tik op het **drie-puntjes-menu** rechtsboven (⋮).
4. Kies **App installeren** of **Aan startscherm toevoegen**.
5. Bevestig met **Installeren**.
6. Een SPL-icoon verschijnt op je startscherm. Tik erop → het spel opent full-screen als app.

**Pop-up niet zichtbaar?** Sommige Chrome-versies tonen automatisch onderaan een banner "App installeren — Fierljeppen". Anders is het in het ⋮-menu te vinden.

### 🍎 iPhone / iPad (Safari)

PWA-installatie op iOS gaat alleen via **Safari** — niet Chrome of Edge.

1. Open de URL in **Safari**.
2. Wacht tot het spel volledig is geladen.
3. Tik op het **Deel-icoon** onderaan (vierkant met pijl omhoog ⬆).
4. Scroll omlaag, kies **Zet op beginscherm** (of "Add to Home Screen").
5. Tik **Voeg toe** rechtsboven.
6. Het SPL-icoon staat nu op je beginscherm. Tik erop → het spel opent full-screen.

### 💻 Desktop (Chrome / Edge / Brave)

1. Open de URL.
2. Rechts in de adresbalk verschijnt een **install-icoon** (een schermpje met pijltje, of ⊕).
3. Klik erop → **Installeren**.
4. Het spel staat nu als app in je Start-menu (Windows) of Programma's (Mac).

---

## 🔄 Updates pushen

Heb je later wijzigingen in `fierljeppen.html`? Upload de nieuwe versie op dezelfde manier (Add file → Upload, of via GitHub Desktop). GitHub Pages publiceert binnen 1–2 minuten.

**Belangrijk**: open `service-worker.js` en verhoog `CACHE_VERSION` (bv. `'v1'` → `'v2'`). Anders blijven geïnstalleerde apps de oude versie tonen uit hun cache.

---

## 🐛 Troubleshooting

**De Pages-URL geeft 404.**
- Wacht nog 2 minuten — de eerste deploy duurt soms langer.
- Check Settings → Pages: staat 'Branch' op `main` en '/ (root)'?
- Naam van het bestand correct? `fierljeppen.html` (kleine letters).

**Het spel laadt maar de install-knop verschijnt nergens.**
- Heb je je via HTTPS bekeken? GitHub Pages serveert https — dat moet aanstaan.
- Op Android: probeer Chrome i.p.v. een andere browser.
- Op iOS: gebruik **Safari** (geen Chrome).
- Wacht ~30 seconden — sommige browsers tonen het install-icoon pas na het registreren van de service worker.

**Spel werkt op desktop maar de muziek/sprites missen op telefoon.**
- Hard refresh (sleep van boven naar onder, of clear-cache in browser).
- Check of alle 25+ asset-bestanden in de repo staan.

**Wijzigingen lijken niet door te komen na een update.**
- Verhoog `CACHE_VERSION` in `service-worker.js`.
- In je browser: ga naar de URL, open DevTools → Application → Service Workers → klik **Unregister**, dan hard-refresh.

---

## 🔐 Privé houden

GitHub Pages is **public** in de gratis versie — iedereen met de URL kan het spel laden. Voor een drankspel-feestgame is dat geen issue (geen privé-data), maar wees je ervan bewust.

Wil je 'm écht privé? Hosten via **Netlify Drop** (gratis, met optionele wachtwoord-bescherming): sleep deze map naar https://app.netlify.com/drop, klaar. Werkt identiek aan GitHub Pages voor de installatie-flow.

---

## 📜 Credits

- Spel-concept en visuele stijl: SPL (Salire Perticea Longa, Nyenrode Business Universiteit)
- Engine: vanilla JS + Canvas 2D, single-file PWA
- Karakter-sprites: AI-generated per speler

Veel plezier en weinig shotjes 🥃
