# Tahmid English Review Hub

Private development repository for the upgraded English Review Hub.

The supplied Takiwaki Review Hub v7 is preserved as the baseline. Upgrade work
lives in this repository and on dedicated branches. The unrelated legacy
`Tahmid447/Takiwaki` repository remains untouched.

## Routes

- `/` — general learner Review Hub
- `/lesson/june-28` — shared lesson player
- `/phrases` — public Phrase Library
- `/takiwaki` — authenticated personal hub
- `/teacher` — authenticated Teacher Studio

Deployments:

- Production: `https://jocular-chaja-86e78d.netlify.app/`
- `https://tahmid-english-review-hub-preview.netlify.app/`
- Deploys automatically from `upgrade/review-hub-v8` (the reviewed v9 commit is
  promoted to this preview branch after tests)
- Production was promoted through a verified Netlify Drop package on July 30,
  2026.

The general and personal hubs share the same quiz, audio, settings, and
Supabase modules. Personal history and private lesson data are protected by
Supabase Auth and Row Level Security.

## Content inventory

- 143 migrated original questions across six verified lessons
- 78 added listening, dictation, speaking, and mixed-format activities
- 264 activities across 11 Notion-derived, now-published lessons
- 485 activities in the reviewed source bundle
- 14 implemented activity formats

All 17 reviewed lessons are now published to both the general catalogue and
the authenticated Takiwaki hub. Teacher Studio can change the audience or
archive a lesson without a code deployment.

## Local commands

```bash
npm run build
npm test
npm run verify:live
npm run preview
```

`npm run build` regenerates the reviewed data and the protected Supabase
question migration. The public `dist/` allowlist deliberately excludes
`notion-drafts.json` and `curriculum.js`.

## Supabase

Apply the migrations in filename order:

1. `202607300001_review_hub.sql`
2. `202607300002_review_hub_catalog.sql`
3. `202607300003_review_hub_questions.sql`
4. `202607300004_v9_publish_and_preview.sql`

All new objects use the `review_` prefix. The migrations do not alter or drop
the existing Do/Does tables. The browser receives only the public anon key;
no service-role key or password is stored in this repository.

## Safety

- `backups/takiwaki_review_hub_v7_original.zip` is an unchanged source backup.
- `backup/v8-calm-baseline` is the one-step rollback branch for the previous
  calm interface.
- `backups/general-entrance-original.html` is the unchanged supplied general
  entrance design.
- `legacy-site/` is an untouched extracted copy of the ZIP.
- The unrelated legacy `Tahmid447/Takiwaki` repository is not used.
- Netlify deploy history and `backup/v8-calm-baseline` provide two independent
  rollback paths.

See:

- [`docs/migration-report.md`](docs/migration-report.md)
- [`docs/notion-import-catalog.md`](docs/notion-import-catalog.md)
- [`docs/operations-guide.md`](docs/operations-guide.md)
- [`docs/test-report.md`](docs/test-report.md)
