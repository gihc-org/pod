# Pod 🎙

En web-version af [AntennaPod](https://antennapod.org/) bygget som en Progressive Web App. Søg efter podcasts, tilmeld dig kanaler og lyt direkte i browseren — med planer om at pakke det ind i Ionic/Capacitor til Android.

## Features

- **Søgning** på tværs af iTunes Podcast-katalog
- **Abonnementer** — tilmeld og fjern podcasts
- **Episodeliste** med dato og varighed
- **Afspiller** — persistent bund-bar med seek, play/pause og albumcover

## Kom i gang

Du skal bruge Node.js 18+ og Angular CLI 22+.

**1. Klon og installér:**
```bash
git clone <repo-url>
cd pod
npm install
cd backend && npm install && cd ..
```

**2. Start backend** (port 3000):
```bash
cd backend
node server.js
```

**3. Start frontend** (port 4200):
```bash
npx ng serve
```

Åbn `http://localhost:4200` i browseren.

## Projektstruktur

```
pod/
├── src/               # Angular 22 frontend
│   └── app/
│       ├── components/player/   # Afspiller-bar
│       ├── pages/               # Search, Subscriptions, Episodes
│       └── services/            # PlayerService, PodcastService, SearchService
└── backend/           # Node.js/Express API
    └── routes/        # podcasts.js, subscriptions.js
```

Se [AGENTS.md](AGENTS.md) for en detaljeret teknisk gennemgang.

## Roadmap

- [ ] Database til abonnementer (SQLite)
- [ ] Podcast Index API som ekstra søgekilde
- [ ] Synkronisering med AntennaPod via gpodder.net
- [ ] PWA-support (offline, installerbar)
- [ ] Ionic/Capacitor-wrapper til Android
- [ ] Afspilningshastighed og sleep-timer
