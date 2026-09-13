# Cloudflare Pages deployment

Status: migration prepared and locally tested; GitHub connection, hosted deployment, domain and signed-in verification are still pending.

## Project and source

Tahmid English Review Hub is a static HTML/CSS/JavaScript application with a custom Node build. Supabase continues to provide Google/email sign-in, Postgres, private storage and membership functions.

- Repository: https://github.com/Tahmid447/tahmid-english-review-hub
- Intended production URL: https://tahmidenglishhub.dpdns.org
- Existing production and rollback: https://tahmid-english-review-hub.netlify.app
- Migration branch: `codex/cloudflare-pages-migration`
- Current production source branch: `upgrade/review-hub-v9-final-product`
- `main` is historical. Do not deploy that old version.

## Local development and verification

Use Node 22, run `npm ci`, then `npm run dev`.

For a Cloudflare build, run `npm run build:cloudflare`. The output directory is `dist`. Run `npm test`, `npm run verify:voices`, and, after the Cloudflare build, `npm run test:cloudflare`.

`npx wrangler pages dev dist --port 8788` serves the output using the Pages runtime for clean-route and redirect verification. `npm run build` continues to create the original Netlify output. Neither command applies database migrations.

## Cloudflare build settings

- Connect the existing GitHub repository using the official Cloudflare Workers and Pages GitHub App, restricted to this repository.
- Framework preset: None.
- Build command: `npm run build:cloudflare`.
- Build output: `dist`.
- Node: 22, also specified in `.node-version`.
- Select the verified current source branch explicitly; do not accept `main` by default.
- Production branch and the assigned Pages URL must be recorded after the project is created.

The committed `src/config.js` contains only the existing public Supabase URL and anon key. Optional build overrides are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; set both together in Cloudflare's environment settings. The importer rejects service-role/secret keys. Never add private Supabase keys, database passwords or login tokens to the frontend, repository or build output.

## Pronunciation audio remains on Netlify

The Cloudflare build uses the existing `https://tahmid-english-review-hub.netlify.app/.netlify/functions/natural-speech` endpoint. Direct browser requests preserve Netlify's per-client rate limiting. The browser sends speech text and the fixed voice profile; it sends no Supabase key, user session or cookie to this endpoint. Audio uses a Blob URL and private/no-store responses.

Netlify must remain available both as the original website and as this pronunciation backend. Migrating that Node/WebSocket service is a separate step requiring live Ava, Libby and Nanami verification. Do not remove Netlify merely because the new homepage works.

## Authentication and domain checklist

Before going live, add the exact Pages test origin and new production origin to Supabase's allowed redirects, retaining the Netlify entries. Add those exact origins to the existing membership function's CORS allowlist after inspecting its deployed source. Set the new Supabase Site URL only once the new domain is ready. Keep the existing Supabase project and Google callback.

Inspect DigitalPlat DNS/delegation and Cloudflare's custom-domain requirements before selecting nameservers. Attach the custom domain in Pages before pointing DNS to it. Verify HTTPS, nested lesson refreshes, OAuth returns including query parameters, real reads/writes and logout.

`/release.json` records the source commit and hosting platform with no-cache delivery. Confirm automatic deployment by committing a harmless visible change to the eventual production branch, observing the Cloudflare deployment, and checking that the custom domain serves that commit and change.

## Future edits

Once the migration is verified: edit the file, commit and push to the configured production branch, and Cloudflare will build and publish it automatically. A ZIP upload is not part of this workflow.
