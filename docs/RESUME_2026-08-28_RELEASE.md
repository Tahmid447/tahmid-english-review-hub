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

Live verification after `023`:

- 31 public lessons and 1,100 public questions
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
and review the dirty worktree before staging anything. The database rollout is
complete; remaining work is application verification and one intentional code
release.

Run the complete local gate on the same worktree:

```bash
npm test
npm run build
npm run verify:visuals
npm run verify:audio
git diff --check
```

If every command passes and the diff contains only the intended release, make
one release commit and push once:

```bash
git add -A
git diff --cached --stat
git diff --cached --check
git commit -m "Release 31-lesson Review Hub expansion"
git push origin upgrade/review-hub-v9-final-product
```

Do not repeatedly deploy intermediate edits. Let the connected Netlify project
build the pushed branch once, monitor the deploy log until it is Published, and
record the commit SHA plus immutable deploy permalink.

## Production QA after Netlify publishes

1. Open `https://tahmid-english-review-hub.netlify.app/` in a fresh browser
   session and confirm the home inventory shows 31 lessons and 1,100 questions.
2. Check Home, Plans, Phrase Library, Teacher Studio sign-in gate, Quick
   Practice, and one Full Lesson in desktop and mobile Light/Dark modes.
3. Confirm Study Music starts after the one-tap fallback when autoplay is
   blocked, and verify click, correct, retry, and completion feedback.
4. Open one prior Notion lesson and one new split lesson; confirm 33 questions,
   all 14 formats, Lesson Guide coverage, and no `[object Object]` text.
5. Run the live read-only checks from a network-enabled terminal:

```bash
npm run verify:live
npm run audit:audio-live
```

6. Record any real-device limitations separately. Do not claim iPhone/Android
   microphone, touch, PWA install, or offline behavior unless those checks were
   actually performed.
