# Codex Handoff — Tahmid English Review Hub

Updated: 2026-08-02 (Asia/Tokyo)

## Open this project

- Repository folder: `/Users/tahmidahmed/Documents/Codex/2026-07-30/referenced-chatgpt-conversation-this-is-untrusted/work/tahmid-english-review-hub`
- Working branch: `upgrade/review-hub-v9-playful-jp`
- Production: https://jocular-chaja-86e78d.netlify.app
- Preview: https://tahmid-english-review-hub-preview.netlify.app
- Supabase project ref: `ycmybggetemkhorkhfnf`

Do not place OAuth client secrets, passwords, service-role keys, or access tokens in this file, Git, screenshots, or chat.

## Completed in the current working tree

- Natural-audio playback speed now applies 0.5x, 1x, and 1.5x to every audio path.
- Japanese explanation playback can switch naturally between Japanese and quoted English voices.
- Teacher Studio now has learner detail views, assignment and learner-lock controls, archive restore, guarded permanent deletion, complete newly generated access-code display/copy, and safer access-code validation/timeout UX.
- Standard/Premium database foundation was added for speaking/essay submissions, teacher feedback, tier controls, and feature overrides.
- All 11 lessons were expanded to 31 activities each: 5 visual, 6 listening, 5 speaking, and 15 varied reading/writing/dialogue activities.
- Google OAuth client was created in Google Cloud, registered in Supabase, limited to `openid`, email, and profile, and pushed to production status.
- Supabase Site URL and redirect allow-list already include production, preview, and local test URLs.

## Must be completed before deployment

1. Generate all 55 WebP illustration assets listed in `scripts/visual-question-manifest.json` and store them under `assets/questions/visual/`.
2. Run `npm run verify:visuals`; it must pass before publishing the expanded lesson payload.
3. Apply Supabase migrations in order:
   - `202608020007_teacher_controls.sql`
   - `202608020008_premium_plans_and_submissions.sql`
4. Run the full test/build suite and test Google login, access-code redemption, sign-out, audio speed, mixed-language audio, Teacher Studio learner controls, archive/restore, and premium submission permissions.
5. Deploy preview first, complete browser/mobile QA, and only then deploy production.

## Verification commands

```sh
npm test
npm run build
npm run verify:visuals
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
