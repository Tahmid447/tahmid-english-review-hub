# Codex Handoff — Tahmid English Review Hub

Updated: 2026-08-03 (Asia/Tokyo)

## Open this project

- Repository folder: `/Users/tahmidahmed/Documents/Codex/2026-07-30/referenced-chatgpt-conversation-this-is-untrusted/work/tahmid-english-review-hub`
- Working branch: `upgrade/review-hub-v9-playful-jp`
- Production: https://jocular-chaja-86e78d.netlify.app
- Current v9 preview: https://tahmid-english-review-hub-v9-preview.netlify.app
- Legacy preview: https://tahmid-english-review-hub-preview.netlify.app
- Supabase project ref: `ycmybggetemkhorkhfnf`

Do not place OAuth client secrets, passwords, service-role keys, or access tokens in this file, Git, screenshots, or chat.

## Completed in the current working tree

- Natural-audio playback speed now applies 0.5x, 1x, and 1.5x to every audio path.
- Japanese explanation playback can switch naturally between Japanese and quoted English voices.
- Teacher Studio now has learner detail views, assignment and learner-lock controls, archive restore, guarded permanent deletion, complete newly generated access-code display/copy, and safer access-code validation/timeout UX.
- Standard/Premium database foundation was added for speaking/essay submissions, teacher feedback, tier controls, and feature overrides.
- The complete library contains 17 lessons and 562 activities. The 11
  Notion-derived lessons have 31 activities each: 5 visual, 6 listening, 5
  speaking, and 15 varied reading/writing/dialogue activities.
- Google OAuth client was created in Google Cloud, registered in Supabase, limited to `openid`, email, and profile, and pushed to production status.
- Supabase Site URL and redirect allow-list already include production, preview, and local test URLs.
- All 55 WebP illustration assets are present and visually inspected;
  `npm run verify:visuals` passes. One July 25 image mismatch was replaced and
  rechecked.
- `npm test`, `npm run build`, `npm run verify:live`, question-quality audit,
  and the 17-lesson live audio audit pass. The detailed per-question ledger is
  in `docs/question-quality-audit.md`.
- New practice runs always shuffle question and choice order. Resumed runs keep
  their saved order.
- Supabase migrations 007, 008, 009, 010, 011 and 012 are reflected in the live
  schema. Migration 011 was verified in the dashboard: the private
  `review-premium-recordings` bucket has a 10 MB limit, four allowed audio
  MIME types, and the three authenticated storage policies.
- Migration 012 adds secure per-question Free, Standard and Premium controls.
  Teacher Studio can choose a payload-free teaser or complete hiding below the
  required plan. The live schema check confirmed both columns, the safe teaser
  view and the question-access function. All existing 562 questions remain
  Free until the teacher deliberately changes an individual question.
- `membership-access` Edge Function version 2 is live and returns bounded,
  reason-specific access-code errors.
- The v9 preview deploys automatically from
  `upgrade/review-hub-v9-playful-jp`. Its origin is present in the Edge CORS
  allow-list and the Supabase Auth redirect allow-list. Hosted Google callback,
  sign-out, 55/55 WebP delivery, shuffle, audio speed selection and
  English/Japanese audio complete without browser console errors.

## Must be completed before deployment

1. With a valid teacher-authorised account, test access-code
   create/edit/reissue/delete and one real redemption; learner controls;
   archive/restore; and Premium task submission/teacher return.
2. Complete real-device mobile QA and microphone recording. The in-app browser
   viewport control did not enter 390 px mode, so mobile is deliberately not
   reported as passed.
3. Use a valid teacher account to set at least one test question to Standard or
   Premium on a non-production test lesson, then confirm both payload-free
   teaser and complete hiding behaviour with below-tier learner accounts.
4. Only after the preview passes, publish production.

## Verification commands

```sh
npm test
npm run build
npm run verify:visuals
npm run verify:live
npm run audit:audio-live
node scripts/test-teacher-controls.mjs
node scripts/validate-premium-schema.mjs
```

## Important product decisions

- Never reveal or store learner passwords. Teachers may send password-reset email only.
- Standard launch price recommendation: ¥3,980/month.
- Premium launch price recommendation: ¥5,980/month with a capped number of teacher-reviewed submissions.
- Six-month prepaid discount: about 15%, not 20–30%, because human feedback has ongoing cost.
- Publish one polished general lesson per week at launch; publish the private learner lesson after each real lesson.
- Prefer pre-generated static neural audio on Netlify/GitHub when possible; store only private learner recordings in protected storage.

## Collaboration handoff

Share the ChatGPT Project with the collaborator as an editor and give them GitHub access. In their new Codex task, ask them to open this repository and read this file first. A live Codex task is not automatically shared with a ChatGPT Project, so Git plus this handoff document is the reliable continuation point.
