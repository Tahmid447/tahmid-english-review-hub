# August 28 release recovery / アカウント切替後の再開手順

Use this checkpoint when continuing the release from another Codex account or
after an interrupted session.

## Fixed release context

- Repository:
  `/Users/tahmidahmed/Documents/Codex/2026-08-03/codex-handoff-tahmid-english-review-hub/work/tahmid-english-review-hub`
- Branch: `upgrade/review-hub-v9-final-product`
- Production: `https://tahmid-english-review-hub.netlify.app/`
- Database project: `ycmybggetemkhorkhfnf`
- Migrations `019 → 020 → 021 → 022 → 023` were already applied manually and
  verified. Do not replay them and do not use a blind `supabase db push`; this
  project has no tracked migration ledger.

Live database verification after `023`:

- 31 published lessons and 1,100 authored questions in the full inventory
- the production catalog exposes metadata for all 31 lessons and reports 1,100
  authored questions; anonymous full question payloads remain limited to the
  two Free preview lessons
- prior 11 Notion lessons: 363 questions, exactly 33 each and all 14 formats
- new 14 Notion lessons: 462 questions, exactly 33 each and all 14 formats
- new lessons: 14/14 published with audience `both`
- 28 new Premium tasks: 14 speaking and 14 essay

## Resume safely

```bash
cd "/Users/tahmidahmed/Documents/Codex/2026-08-03/codex-handoff-tahmid-english-review-hub/work/tahmid-english-review-hub"
git branch --show-current
git status --short
git diff --check
```

Confirm the branch name exactly matches `upgrade/review-hub-v9-final-product`
and review the worktree before staging anything. The database rollout is
complete and must not be repeated.

The first production release was commit
`b0dc5e095acba9ac86f698c9298eb2ca2acb4890` (Netlify deploy
`6a9194c4eb00b70008c5490a`). Production QA then found an old service-worker
module cached against the new `lesson.js`, which caused the lesson route to
remain on its loading state. Commit
`bcb946037584f9e5758c843e175d2ddf8691a91a` (Netlify deploy
`6a9198df98d1fc00086dc183`) applied the complete `release3` graph, cache v17,
network-first public shell refresh and `updateViaCache: "none"`.

The same production acceptance pass then found that the whole-library query was
truncated at Supabase's 1,000-row response ceiling. The current follow-up uses
stable paginated reads, defensive summary totals, corrected 31/1,100 catalog
copy, the `release4` module graph and cache `te-review-public-v18`. Keep this
final set together; it does not change the database.

Run the complete local gate on the same worktree:

```bash
npm test
npm run build
npm run verify:visuals
npm run verify:audio
npm run verify:live
npm run audit:audio-live
git diff --check
```

If every command passes and the diff contains only the intended release4
pagination/count refresh, make one final follow-up commit and push once:

```bash
git add -A
git diff --cached --stat
git diff --cached --check
git commit -m "fix: load complete production lesson inventory"
git push origin upgrade/review-hub-v9-final-product
```

If the worktree is already clean, do not create another release commit. Confirm
that `git rev-parse HEAD` matches the Published Netlify deploy and continue with
fresh production QA.

Do not repeatedly deploy intermediate edits. Let the connected Netlify project
build the pushed branch once, monitor the deploy log until it is Published, and
record the commit SHA plus immutable deploy permalink.

## Production QA after Netlify publishes

1. Open `https://tahmid-english-review-hub.netlify.app/` in a fresh browser
   session and confirm the Home inventory shows 31 lessons and 1,100 questions.
   The full catalog metadata is public, while non-preview question payloads
   remain protected by plan and membership access.
2. Check Home, Plans, Phrase Library, Teacher Studio sign-in gate, Quick
   Practice, and one Full Lesson in desktop and mobile Light/Dark modes.
3. Confirm Study Music starts after the one-tap fallback when autoplay is
   blocked, and verify click, correct, retry, and completion feedback.
4. Open an accessible prior lesson and confirm Quick Practice loads rather than
   staying on `Loading lesson…`, with no module-export error in the console.
   Confirm a protected new split lesson shows the correct access gate, and use
   the authenticated/database checks for its 33 questions, all 14 formats,
   Lesson Guide coverage, and absence of `[object Object]` text.
5. Run the live read-only checks from a network-enabled terminal:

```bash
npm run verify:live
npm run audit:audio-live
```

6. Record any real-device limitations separately. Do not claim iPhone/Android
   microphone, touch, PWA install, or offline behavior unless those checks were
   actually performed.
