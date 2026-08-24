# Review Hub v9 final current-state audit

Audit date: 2026-08-14 (Asia/Tokyo)

Audited baseline commit: `aad5749`

Implementation branch: `upgrade/review-hub-v9-final-product`

This document records the state that existed before the final-product work began. A static source check is not treated as live proof. “Verified” means the named behavior was exercised by an automated test or observed on the deployed site; “partial” means a real foundation exists but the acceptance requirement is not yet complete; “missing” means no usable implementation was found; “live QA pending” means source may be present but authenticated end-to-end behavior was not proved.

## Final-product checkpoint status

- Working branch: `upgrade/review-hub-v9-final-product`.
- Latest checked application commit: `18571bd82be51986e43621fc5242c2e6386221b6`.
  It is published to the current-account Preview as Netlify deploy
  `6a8c2e337479160008093171`; exact permalink:
  `https://6a8c2e337479160008093171--tahmid-english-review-hub-preview.netlify.app`.
  August 24 verification covers the Premium/Premium+ redesign, 8-question
  Quick Practice and five licensed, web-optimised Study Music recordings.
  Production remains pre-v9 and was not deployed.
- Exact deployed application commit:
  `049b5ff4da6606fcffc461f412f314d253916e13`; historical rollout/logical-
  restore checkpoint: `fcf561d78da6de405d6ca54b78ebfc99df3d3a0a`.
  This line records the earlier dedicated-v9 Preview artifact, not the latest
  current-account Preview above.
- Current documentation checkpoint is branch HEAD (`git rev-parse HEAD`); a
  documentation commit cannot contain its own final hash.
- The dedicated v9 preview is published from exact application commit
  `049b5ff` as Netlify deploy `6a7e9a1002ab210008522e82`. Production static
  files remain pre-v9.
- Migrations `202608140015_teacher_preview_and_premium_workflows.sql` and
  `202608140016_visual_question_content_corrections.sql`, and the matching
  updated `membership-access` Edge Function, are live.
- Local implementation, the final integrated suite, live migration
  postconditions, and Preview publication evidence are recorded below.
  Authenticated end-to-end Supabase behavior,
  final deployed Lighthouse measurements, and physical-device behavior are not
  represented as verified.

## Deployment facts observed

- The dedicated v9 preview published `upgrade/review-hub-v9-final-product@049b5ff` as deploy `6a7e9a1002ab210008522e82`. Exact permalink: `https://6a7e9a1002ab210008522e82--tahmid-english-review-hub-v9-preview.netlify.app`.
- The public production URL `https://jocular-chaja-86e78d.netlify.app` was fetched directly. It does not contain the four-plan v9 platform files or Premium+ implementation, so v9 is not in production.
- The currently signed-in Netlify account can administer the dedicated v9 preview, but the production project returned “Page not found” in that account. Production administration therefore remains blocked unless the correct Netlify account is used or the production site is deliberately recreated after all gates pass.
- Supabase project `ycmybggetemkhorkhfnf` is on the Free plan and offered no
  official dashboard backup. Privacy-safe schema
  `codex_backup_20260814_fcf561d` is a locked-down migration-specific logical
  restore point; it excludes learner/Auth personal data and is not full
  disaster recovery.
- Migration `015` and then `016` were manually applied in separate SQL Editor
  transactions. Live postconditions verified 34 active Premium tasks (17 exact
  speaking/essay pairs), expected functions and privacy/ownership policies, 85
  changed visual rows, all 17 lessons at `content_version >= 4`, 85 unique
  English/Japanese hints, and no missing guidance/invalid choice sets.
- The matching `membership-access` Edge Function is deployed and its fresh
  timestamp was observed. The migration ledger remains absent, so no ledger
  entry is claimed.
- Preview and production share this Supabase project. The backend is therefore
  shared even though production static files were not changed.
- Public QA on parent `fcf561d` found that a correct Retry incorrectly changed
  the official score from `0/1` to `0/2`. Commit `ecf8726` fixed the denominator;
  the exact live retest stayed `0/1`. The complete `npm test`, `npm run build`,
  and `npm run verify:visuals` sequence passed after the fix.
- Prior `ecf8726` public QA passed the home inventory, prices and Dark persistence,
  phrase progressive rendering, shuffle/radio behavior, visual guidance, 0.5x
  and mixed-language controls, locked payload boundary, Teacher public gate and
  language switch, Taki redirect, replacement WebP, and clean browser log.
- Google learner and Teacher starts reached the official account chooser; the
  Teacher return target was correct. Learner auth was subsequently completed;
  Teacher auth remains pending.
- First learner profile save reproducibly failed with
  `permission denied for table review_profiles`: the old upsert included
  insert-only `user_id` on update. `d0b244b` split payloads/added modal status,
  `50656f8` avoided the stale race, `a69ab08` bumped PWA cache v3, and `049b5ff`
  cache-busted the query. No migration `017` or `UPDATE(user_id)` grant was added.
- Live retest passed modal/page success, gate close, complete reload, Standard
  shown through August 2, 2027, all 44 June 30 questions, and safe cross-tab
  sign-out/lock. Premium task cards also appeared, so the identity seems
  Teacher-elevated and cannot prove strict Standard-versus-Premium denial.
- Shared Supabase was unchanged by this hotfix. The full test/build/visual suite
  passed after the code fixes, and the latest full test/build passed after the
  final cache-bust.

## Baseline verification

The following commands passed against `aad5749` before implementation:

- `npm test` — PASS: 17 lessons, 616 activities, 85 visuals, learning checks, Teacher controls, Premium schema and four-plan checks.
- `npm run build` — PASS: static output built with private draft sources excluded.
- `npm run verify:visuals` — PASS: 85 required visual assets present and valid.
- `git diff --check` — PASS.

These tests are valuable, but several are static source assertions. They do not prove authenticated Google, access-code, RLS, microphone, cross-device, or real-device behavior.

## Requirement-by-requirement classification

| Area | Baseline status | Evidence and exact gap | Final-product action |
|---|---|---|---|
| Fixed four-plan prices | Verified by code/test | `src/plans.js` and plan tests contain Free ¥0/¥0, Standard ¥3,980/¥20,300, Premium ¥6,980/¥35,600, Premium+ ¥16,800/¥85,700. | Preserve as a single source of truth. |
| Pricing sales journey | Partial | Four cards and a billing toggle exist, but there is no complete comparison experience, exact yen saving/monthly equivalent, clear “best for”, or professional trust/FAQ journey. | Redesign without copying the standalone prototype. |
| Editable contact message | Missing/bug | `pricing.html` marks the textarea `readonly`; `refreshDialog()` replaces its value whenever settings render. No name field, dirty state or reset action exists. | Editable name/message; copy current text; preserve dirty edits; intentional reset. |
| Pricing/Teacher/library navigation | Partial | Important learner links replace the active lesson; Teacher Studio opens in the learner tab; the hub filter is memory-only; lesson return handling is hard-coded. | Open role change and lesson→plans safely, preserve allow-listed return state, retain filters/progress. |
| Email signup | Partial; live QA pending | Signup/login/password fields and validation exist. Email confirmation, casing, duplicate/provider linking, logout/reload and errors are not end-to-end tested. | Keep implementation and add regression/live coverage. |
| Google first-time onboarding | Partial and bypassable | OAuth session and metadata prefill exist, but incomplete profile merely opens a `<details>` element; redemption and normal signed-in content remain usable. Returning-user behavior is not tested. | Make profile completion an actual first-time gate; do not repeat it for complete profiles. |
| Owner backdoor | No owner backdoor found | Teacher entitlement currently resolves to Premium+ as a role capability, but there is no learner simulation tool. | Add teacher-authorized, clearly labelled learner preview; never add an email-based owner bypass. |
| Preview as learner | Missing | Teacher “preview” only opens `?preview=1`; it does not select Free/Standard/Premium/Premium+ or reproduce plan-safe payload behavior. | Add plan selector/banner and a teacher-only safe backend path where needed. |
| Immediate retry | Partial | First official result and retry history already exist, but Try again is available only at session end. | Add an immediate bilingual retry action after an incorrect result and preserve the first score. |
| Check answered / partial grading | Partial with correctness risk | Batch grading skips wholly empty answers, but incomplete order/matching/sorting responses can be locked as the first score; the button does not show N; denominator includes unanswered questions. | Add format-aware gradeability, dynamic N and checked-only partial totals. |
| Question/choice shuffle | Verified by current tests | Every new practice run shuffles question and choice order; a resumed run retains its saved order. | Preserve and regression-test. |
| Vibration | Present but unverified | Setting, default and browser vibration calls remain; no reliable real-device evidence exists. | Retire learner-visible setting and unused hooks as requested; never simulate vibration. |
| Question/content quality | Verified programmatically; prior human visual record present | `docs/question-quality-audit.md` lists all 616 activities and prior corrections; `scripts/visual-human-qa.json` records all 85 scenes checked after correction. Programmatic checks cover bilingual guidance, answer integrity and media mapping. | Preserve the detailed report; spot-check rendered output during final QA and never claim a new visual inspection that was not performed. |
| Locked lesson presentation | Partial | Question teasers use 4px blur/gold shimmer/reduced-motion, but hub lesson cards retain only 0.55px blur and weak differentiation. | Stronger premium treatment, safe teaser copy and reduced-motion fallback. |
| Premium learner experience | Partial | Generic essay/recording/submission/review components exist, but visual hierarchy is close to a normal form and the full authenticated workflow is untested. | Redesign task context, steps, limits, status, feedback and locked preview; run authenticated QA. |
| Premium task inventory | Missing | No seed/migration inserts the promised one speaking plus one essay task for each of 17 lessons. | Add 34 lesson-specific active tasks with a count/content regression test. |
| Premium draft privacy | Partial/security mismatch | UI hides drafts from Teacher Studio, but current teacher SELECT RLS can read all learner drafts. | Forward-only migration `015+` to make drafts learner-private until submitted. |
| Premium review transaction | Partial | Feedback and submission status update in separate requests, so one can succeed without the other. Returned resubmissions retain stale queue/review timestamps. | Transactional review RPC and corrected state-transition timestamps in `015+`. |
| Teacher Studio information architecture | Missing relative to final requirement | Five implementation-oriented tabs exist; no clear Dashboard/Learners/Access Codes/Lessons & Content/Submissions/Sources structure, dashboard counts, learner search, or source job. | Reorganize around teacher jobs while preserving underlying controls. |
| Teacher Studio language | Missing | English and Japanese are shown simultaneously and there is no Teacher Studio language preference. | One language at a time, with an easy English/Japanese switch. |
| Teacher Studio clarity | Partial | Strong controls exist, but terms such as override/priority/payload are visible and several switches are not actually consumed by learner UI. | Replace jargon with task/result language and hide or explain ineffective metadata. |
| Access-code controls | Partial; live QA pending | Static tests cover create/edit/reissue/disable/delete branches. Redemption is multi-step with manual compensation, reissue may copy an expired date, Free cannot be selected, and real create→redeem→cleanup is untested. | Make redemption atomic if feasible, fix reissue expiry, and complete authenticated QA. |
| Shared learner experience / Takiwaki | Missing | `takiwaki.html`, rewrite rules, dedicated JS branches, audience filters and data rules still create a student-specific site fork. | Redirect old route to the common learner experience while retaining historical access/data compatibility. |
| Lesson Guides and provenance | Partial | All 17 guides meet structured content minimums; teacher source links are allow-listed. Missing links are labelled “Manual”, legacy origin is vague, and guide/public access policy needs an explicit decision. | Improve source labels and missing-link honesty; preserve protected content boundary. |
| Phrase/Vocabulary library | Partial | Audio, favourites, meanings and source lessons exist. Classification relies mainly on token count, has no sentence-pattern type/slots/POS, and at least one Japanese/English inversion was found. | Correct high-confidence data issues and introduce stable, meaningful types without orphaning history. |
| Performance | Unprofiled | Likely hotspots include full-page fixed effects, backdrop blur, heavy shadows and rendering the full phrase catalogue. No trace proves the main cause. | Measure local/deployed desktop/mobile before optimizing; document evidence. |
| Gamification | Missing as a common feature | Existing attempts and first scores are usable, but streak, weekly goal, mastery, retry improvement and milestones are not shown in the shared learner experience. | Build restrained adult-learning motivation from existing progress only. |
| Theme | Missing | CSS declares light only; no System/Light/Dark state or dark palette exists. | Add one theme setting and token-based accessible dark surfaces. |
| PWA | Missing | No manifest, service worker, offline fallback, install metadata or cache policy. | Add an update-safe shell cache limited to public static assets; exclude Supabase/private data/recordings. |
| Responsive/accessibility | Partial | Skip links, focus styles, native dialogs and many 44px controls exist. Risks include very small text, incomplete selected-state semantics, no `aria-current` in question navigation, toast safe-area issues, and unverified 390/430 widths. | Test named viewports, fix overflow/semantics/contrast and record visual evidence. |
| Audio defaults and mixed-language speech | Verified by code/static tests; live regression required | Default rate is 1.0, en-US preference/fallback and auto-pronounce controls exist; natural audio and mixed JP/quoted-EN paths were previously verified. | Preserve and repeat live checks after redesign. |
| Production promotion | Blocked by gates | Production is still pre-v9 and the current Netlify account cannot open its admin project. | Preview first; authenticated and real-device QA; only then obtain correct production access or explicitly recreate/promote. |

## Final-product implementation and rollout delta

| Area | Status on August 14 | Evidence or remaining boundary |
|---|---|---|
| Fixed four-plan prices | Implemented and regression-tested locally | Free ¥0/¥0, Standard ¥3,980/¥20,300, Premium ¥6,980/¥35,600, Premium+ ¥16,800/¥85,700 remain centralised. |
| Pricing sales journey | Deployed public QA passed | Four cards, 13 comparison rows, exact monthly/six-month values, best-for copy, Premium recommendation, trust/FAQ content, contact-first flow, and Dark persistence were checked on the exact Preview deploy. |
| Editable contact message | Implemented locally | Editable name/message, dirty-state preservation, copy-current-text, and explicit reset are covered by local plan tests. |
| Navigation and state | Implemented locally | Safe lesson→plans return, new-tab role change, persistent library filters, and common return handling are present. Browser history/reload QA remains part of preview testing. |
| First-time Google onboarding | Learner live QA passed; scope caveat | Google sign-in, profile save, gate close, reload persistence, observed Standard membership/lesson access, and sign-out passed after the hotfix. Teacher auth and dedicated non-teacher tier negatives remain pending. |
| Teacher preview as learner | Backend live; auth QA pending | Teacher-only Free/Standard/Premium/Premium+ preview is labelled and non-mutating. Migration `015` is live; authenticated RLS behavior remains to be exercised. |
| Immediate retry | Deployed regression fixed and passed | Public QA found `0/1` becoming `0/2` on parent `fcf561d`; commit `ecf8726` fixes it, and exact-deploy retest preserved official `0/1` after a correct retry. |
| Check answered / partial grading | Implemented and regression-tested locally | Format-aware completeness, dynamic **Check N answered**, checked-only denominator, and incomplete complex-answer protection cover all 14 formats. |
| Shuffle | Preserved and regression-tested locally | New runs reshuffle questions and applicable choices; resumed runs retain saved order. |
| Vibration | Retired locally | The unreliable learner preference and browser vibration calls were removed; local learner regressions assert that they do not return. |
| Question/content quality | Re-audited and migrated | All 85 visual questions received individual image/prompt/choice/hint/explanation/alt review. Four WebPs were replaced, one alt/brief corrected, six ambiguous distractor sets corrected, and all 85 now have unique bilingual guidance. Migration `016` changed all 85 live rows and passed its postconditions. |
| Premium experience and inventory | Backend inventory live; auth QA pending | Migration `015` seeded exactly one speaking and one essay task for each of 17 lessons (34 active tasks). Submission/RLS/upload workflows still require authenticated QA. |
| Premium draft privacy and review transaction | Backend policies/RPC live; auth QA pending | Migration `015` installed the draft-privacy policies and atomic review/state transitions. Policy definitions and direct-grant negatives were verified; full role-based browser behavior remains unverified. |
| Teacher Studio information architecture | Implemented locally | Seven jobs: Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, Insights; one-language English/Japanese display and filters are included. |
| Access-code safety | Backend and Edge live; lifecycle QA pending | Migration `015` and the updated Edge Function use transactional redemption/reissue and conflict handling. The complete authenticated create/redeem/reissue lifecycle remains pending. |
| Shared Takiwaki experience | Public redirect passed | The old route redirected to the common learner experience on the exact Preview deploy. Authenticated session compatibility remains pending. |
| Phrase/Vocabulary library | Implemented locally | Progressive rendering, meaningful types, corrected presentation/data issues, favourites, audio, and retained filters are covered by local regressions. |
| Learner progress | Implemented locally | Asia/Tokyo streak, weekly goal, unique completions, first-attempt accuracy, retry improvement, and restrained milestones derive from real stored progress. |
| Theme | Implemented locally | Persisted System/Light/Dark is shared across home, phrases, lessons, and pricing. Final deployed contrast/Lighthouse checks remain pending. |
| PWA | Implemented locally | Public static shell and offline fallback only; protected routes, API/auth requests, private learner data, answers, and recordings are excluded. Install/update/offline real-device QA remains pending. |
| Accessibility/responsive | Implemented locally; deployed measurement pending | Contrast, touch targets, 621–900 px compact header, radio keyboard behavior, lazy QR, and smaller header logo are present. Public flows were checked locally at 390/430/621/768/900/1024/1440 px with no checked page-level overflow, and key Dark/pricing/retry interactions were exercised. Final deployed 390/768 light/dark Lighthouse and physical-device checks are pending. |
| AI grading | Intentionally absent | There is no automatic or AI grading. The compatibility column is always written `false`; a human teacher reviews and publishes feedback. |

## Visual-content correction summary

The detailed per-question ledger is `docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md`.
It records all 17 lessons × five visual questions, the exact mismatch and fix,
and the static/manual evidence. The four replacement assets are:

- `july-13-03-rush-back.webp`;
- `july-19-02-either-day.webp`;
- `july-22-01-availability.webp`;
- `july-27-02-poured-sauce.webp`.

The valid `july-27-03-splashed-water.webp` image was retained; its incorrect alt
text and scene brief were corrected. Six ambiguous distractor sets were also
replaced. All 85 visual questions now have unique, non-answer-revealing
bilingual hints, a correct-evidence pair, and three exact distractor-conflict
reason pairs.

## Deployment sequence and current position

1. **Completed with limitation:** created the privacy-safe logical restore point;
   an official Free-plan backup was unavailable.
2. **Completed:** confirmed the final integrated test/build/visual suite and
   exact pushed commit.
3. **Completed:** applied and verified migration `015`.
4. **Completed:** applied and verified migration `016` in a separate transaction.
5. **Completed:** deployed the matching updated `membership-access` Edge Function.
6. **Completed:** deployed exact application commit `049b5ff` and completed
   recorded public plus scoped Google learner QA.
7. **In progress:** complete authenticated Teacher and dedicated non-teacher
   four-tier/RLS QA; then Lighthouse and real-device QA.
8. Promote production only after every gate passes and production Netlify
   access is confirmed.

## Security and data rules for implementation

- Never rewrite migration `014`; all database work is forward-only as `015` or later.
- Never expose learner passwords, private recordings, answers, teacher feedback, authenticated API responses or service-role credentials in static assets or PWA caches.
- A blur is presentation, not authorization. Ineligible question prompt/choice/hint/explanation/answer payloads must remain withheld by RLS-safe data paths.
- Preview-as-learner must be teacher-authorized, visibly labelled, temporary and incapable of changing a real learner’s membership.
- Payment is arranged through a real conversation; the site must not claim payment completion.

## Final verification still required

- Fresh live-security/live-audio commands from a network-enabled environment.
- Remaining deployed desktop/tablet/430px/390px visual and overflow checks not
  covered by the exact public run; the checked browser log was clean.
- Final light/dark Lighthouse checks for home, phrases, pricing and lesson, including 390 px and tablet breakpoints.
- Authenticated Teacher plus dedicated non-teacher Free/Standard/Premium/
  Premium+ negative/positive checks; do not use the elevated learner identity
  as strict tier-denial evidence.
- Email auth and remaining returning-Google cases not covered by the successful
  learner profile/reload/sign-out run.
- Access-code create/edit/reissue/redeem/expired/exhausted/disable/delete and cleanup.
- Premium essay and microphone flows from submission through return/resubmission/published feedback.
- Real iPhone Safari and Android Chrome checks, or an explicit user-assisted record if direct device control is unavailable.
- Confirm shared-backend compatibility with the still-pre-v9 production static
  frontend; use forward fixes rather than assuming a Netlify rollback reverts
  Supabase.
