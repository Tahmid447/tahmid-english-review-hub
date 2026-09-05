# Public build release audit — 2026-09-06

The local production build was inspected independently of the demo and database tests. No release-blocking public-data exposure or broken module/asset reference was found. One offline dependency omission was corrected in `sw.js`.

| Check | Result |
|---|---|
| Published files | 614 files; 11 HTML pages; 124 local HTML references resolved. |
| Module integrity | All 30 JavaScript modules linked without evaluation or missing exports. New `speech-contract`, `curriculum-audio`, `curriculum-access` and `phonics-visuals` modules are included. |
| Curriculum illustrations | All 448 credited output files exist; full SHA-256 values match the ledger and filename hashes. Total 6,014,893 bytes. No active scripts, event handlers or external image references in the SVGs. |
| Credits | `illustration-credits.html`, the 448-file attribution ledger, `ATTRIBUTIONS.md` and the local Mulberry licence are included; local links resolve. |
| Private content | No full 480-item curriculum JSON, authoring curriculum directory, migration SQL, demo data, Notion drafts, environment files, source maps or private key files are bundled. |
| Public fallback | Only the advertised `june-28` and `june-29` legacy lessons are bundled. Public illustrations and their item/source attribution identifiers remain intentionally public. |
| Credentials | No secret Supabase keys, service-role/user JWTs, GitHub tokens or private-key blocks were found. The included JWT has only the `anon` role. The configuration importer rejects privileged keys. |
| Service Worker | `te-review-public-v23`; explicit same-origin public-file allowlist; no private REST/Auth/Storage/Edge API cache eligibility. Authorization-bearing and `no-store` requests are excluded. Navigation responses are not written to cache. |
| Cache headers | Service Worker uses `no-cache, no-store, must-revalidate`; hashed curriculum assets use a one-year immutable public cache. |

The offline shell imported `lesson-source.js` and `lesson-guide-targets.js` without precaching them. Both public modules are now included in the final built Service Worker, bringing the shell to 38 entries. A dependency closure check against `dist/sw.js` finds no remaining omission. The built Service Worker and final stylesheet match their source files byte for byte. The credits-page music header fix is included; Netlify pins Node 22 for the build dependencies.

## Final local verification

All commands completed with exit code 0, sequentially against the final working tree:

| Command | Evidence |
|---|---|
| `npm test` | Full suite passed, including 1,542 integrity/security assertions, 1,100 activity checks, 480 curriculum visuals, Teacher controls, forward migration preservation and demo isolation. Repeated successfully after the final credits-header CSS change. |
| `npm run test:security` | All application migrations through 027 executed in PostgreSQL; student/teacher isolation, category/item access, personal packs, homework, account pause and missing-settings protections passed. |
| `npm run verify:voices` | 480 items and 2,112 exact UI payloads checked, including all 32 phonics levels and identity/prosody rejection cases. This command does not test live playback. |
| `npm audit --omit=dev` | 0 vulnerabilities. |
| `npm audit` | 0 vulnerabilities, including development dependencies. |
| `npm run build:demo` | Production `dist` and separate local-only `demo-dist` built successfully; immutable 025 and forward 027 verified with 480 stable IDs and 96 learning goals. Netlify publishes only `dist`. |
| Static built-output audit | 30 module graphs linked, 124 local references resolved, all 448 asset hashes matched, 38 Service Worker entries checked, no secret findings or missing offline dependencies. |

The final inspected `dist/release.json` was built at `2026-09-05T16:38:56.262Z` (2026-09-06 in Japan). Its commit is the pre-commit baseline `8537cb53129e6c5743b19d977332bb5c6b9cf152`, so this is evidence for the prepared working tree, not the final deployed revision. The final commit build and production smoke test establish the deployed SHA and response headers. Machine-readable static evidence is saved in [`qa/public-build-audit.json`](qa/public-build-audit.json).

Supabase's [current API-key guidance](https://supabase.com/docs/guides/api/api-keys) distinguishes public keys from privileged secrets; the [changelog](https://supabase.com/changelog) was checked for relevant changes. This static audit does not replace the separate production RLS, student-isolation, voice or browser interaction checks.
