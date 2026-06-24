# Pod — Podcast Web App

Angular 22 PWA med Node.js/Express backend. Målet er en web-version af AntennaPod med podcast-søgning, abonnementer og afspilning — på sigt wrappet i Ionic/Capacitor til Android.

## Arkitektur

```
/
├── src/                     # Angular frontend (PWA)
│   └── app/
│       ├── components/
│       │   └── player/      # Persistent afspiller-bar i bunden
│       ├── pages/
│       │   ├── search/      # Søgeside (iTunes API via backend)
│       │   ├── subscriptions/ # Liste over abonnerede podcasts
│       │   └── episodes/    # Episodeliste for én podcast
│       ├── services/
│       │   ├── player.service.ts    # Delt afspiller-state (signals)
│       │   ├── podcast.service.ts   # Feed-hentning og abonnementer
│       │   └── search.service.ts    # Podcast-søgning
│       └── models/
│           └── podcast.model.ts     # Podcast, Episode, SearchResult
└── backend/                 # Node.js/Express API
    ├── server.js
    └── routes/
        ├── podcasts.js      # /api/podcasts/search, /api/podcasts/feed
        └── subscriptions.js # /api/subscriptions (in-memory, midlertidig)
```

## Udvikling

**Start begge servere** (to terminaler):

```bash
# Terminal 1 — backend på port 3000
cd backend && node server.js

# Terminal 2 — frontend på port 4200
npx ng serve
```

Åbn `http://localhost:4200`.

**Build frontend:**
```bash
npx ng build
```

**Kør tests:**
```bash
npx ng test
```

## Backend API

Alle endpoints under `http://localhost:3000/api/`.

| Method | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/health` | Sundhedstjek |
| GET | `/podcasts/search?q=<query>` | Søg på tværs af iTunes |
| GET | `/podcasts/feed?url=<feedUrl>` | Hent og parse RSS-feed |
| GET | `/subscriptions` | Hent alle abonnementer |
| POST | `/subscriptions` | Tilføj abonnement `{ feedUrl, title, author, image }` |
| DELETE | `/subscriptions/:id` | Fjern abonnement |

Abonnementer er i øjeblikket **in-memory** — de forsvinder når backend genstartes. Skal erstattes med en database (SQLite eller PostgreSQL).

## Frontend-konventioner

- **Angular 22 standalone components** — ingen NgModules. Brug `imports: []` direkte i `@Component`.
- **Signals** til state (`signal()`, `computed()`). Brug ikke `BehaviorSubject` til UI-state.
- **Lazy-loaded routes** via `loadComponent` i `app.routes.ts`.
- **`provideHttpClient()`** er registreret i `app.config.ts` — ikke `HttpClientModule`.
- CSS-variabler til theming defineret i `src/styles.scss`: `--bg`, `--surface`, `--border`, `--accent`, `--text-primary`, `--text-muted`.
- Komponent-SCSS bruger kun lokale klasser — ingen global CSS udenfor `styles.scss`.

## Afspiller

`PlayerService` holder den delte state (hvilken episode der spiller, om den er i gang). `PlayerComponent` er inkluderet i `app.html` og lever hele appens levetid — den slipper aldrig DOM'en, så `@ViewChild({ static: true })` på `<audio>`-elementet virker.

Effekter til at styre `audio.src` og `play()`/`pause()` oprettes i `ngAfterViewInit` med `{ injector: this.injector }` fordi de tilgår `ViewChild`.

## Kendte mangler / næste skridt

- [ ] Abonnementer i database (SQLite anbefales til start)
- [ ] Brugergodkendelse (JWT)
- [ ] Podcast Index API som ekstra søgekilde (kræver API-nøgle)
- [ ] gpodder.net-synkronisering med AntennaPod
- [ ] PWA: service worker og offline-support (`ng add @angular/pwa`)
- [ ] Ionic/Capacitor-wrapper til Android
- [ ] Downloadede episoder (IndexedDB)
- [ ] Afspilningshastighed og sleep-timer
