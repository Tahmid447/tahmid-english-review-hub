# Tahmid English Review Hub

Personal English lessons, practice, learner progress and Teacher Studio. This is the existing application and source history, now published by Cloudflare Pages.

- **Website:** https://tahmidenglishhub.dpdns.org
- **Repository:** https://github.com/Tahmid447/tahmid-english-review-hub
- **Publishing branch:** `main`
- **Cloudflare Pages project:** `tahmid-english-hub`
- **Pages address:** https://tahmid-english-hub.pages.dev

To make a change: edit the file → commit and push to `main` → Cloudflare builds and updates the website automatically. No ZIP upload is needed.

## Development

Plain HTML, CSS and native JavaScript modules with a custom Node build. Use Node 22.

```sh
npm ci
npm run dev
```

Build for Cloudflare with `npm run build:cloudflare`; output is `dist`. Framework preset is None and the project root is the repository root. `.node-version` selects Node 22. Build scripts generate content/SQL files but never apply database migrations.

Relevant release checks: `npm test`, `npm run verify:voices`, then `npm run build:cloudflare` and `npm run test:cloudflare`. Static Pages behavior can be tested with `npx wrangler pages dev dist --port 8788`.

## Architecture and account safety

The existing Supabase project supplies Google/email authentication, database, private recordings, learner access and membership functions. Student identities, data and migration history are preserved. Public assets are explicitly allowlisted by the build; private APIs and recordings are excluded from the service-worker cache.

`src/config.js` contains the public Supabase project URL and anon key only. Cloudflare needs no private build variables. If overriding the public configuration, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` together in Cloudflare Pages → Settings → Variables and secrets. The importer rejects service-role and secret keys. Private backend secrets stay in Supabase or Netlify.

**Keep Netlify running.** https://tahmid-english-review-hub.netlify.app remains the original website and the required pronunciation backend for Ava, Libby and Nanami. Its production branch is still `upgrade/review-hub-v9-final-product`. Cloudflare frontend requests speech directly without sending a Supabase key or user session to Netlify.

## Important pages

- `/lessons` — lesson catalogue
- `/lesson/june-28` — example nested lesson route
- `/my-page` — profile, favourites and personal learning
- `/learn`, `/words`, `/phonics`, `/phrases` — learning libraries
- `/plans` — membership information
- `/teacher` — protected Teacher Studio

## Continuing work

Read [AGENTS.md](AGENTS.md), [working handoff](docs/WORKING_HANDOFF.md) and [Cloudflare deployment](docs/CLOUDFLARE_DEPLOYMENT.md) before changing the app. Future work needs authorization from its own conversation. Never reset the database, replay historical migrations, reset branches or force-push.

The [previous README](docs/README_BEFORE_CLOUDFLARE_2026-09-13.md) preserves older feature descriptions and rollout notes. Its pending-release statements and branch instructions are historical, not current deployment instructions.
