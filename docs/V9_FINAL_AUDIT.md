# Review Hub v9 final current-state audit

Audit date: 2026-08-14 (Asia/Tokyo)

Audited baseline commit: `aad5749`

Implementation branch: `upgrade/review-hub-v9-final-product`

This document records the state that existed before the final-product work began. A static source check is not treated as live proof. “Verified” means the named behavior was exercised by an automated test or observed on the deployed site; “partial” means a real foundation exists but the acceptance requirement is not yet complete; “missing” means no usable implementation was found; “live QA pending” means source may be present but authenticated end-to-end behavior was not proved.

## Final-product checkpoint status

- Working branch: `upgrade/review-hub-v9-final-product`.
- Canonical GitHub implementation checkpoint: `c14625d5`; published handoff
  checkpoint: `a87eb5e1`.
- The dedicated v9 preview is still the older `aad5749` deployment. Production is still pre-v9.
- Migrations `202608140015_teacher_preview_and_premium_workflows.sql` and `202608140016_visual_question_content_corrections.sql`, and the matching updated `membership-access` Edge Function, are local only and are not live.
- Local implementation, the final integrated suite, and public-flow responsive
  Browser evidence are recorded below. Authenticated/live Supabase behavior,
  final deployed Lighthouse measurements, and physical-device behavior are not
  represented as verified.

## Deployment facts observed

- The dedicated v9 preview at `https://tahmid-english-review-hub-v9-preview.netlify.app` was observed in Netlify as published from `upgrade/review-hub-v9-premium-platform@aad5749` on 2026-08-11.
- The public production URL `https://jocular-chaja-86e78d.netlify.app` was fetched directly. It does not contain the four-plan v9 platform files or Premium+ implementation, so v9 is not in production.
- The currently signed-in Netlify account can administer the dedicated v9 preview, but the production project returned “Page not found” in that account. Production administration therefore remains blocked unless the correct Netlify account is used or the production site is deliberately recreated after all gates pass.
- Repository documentation says Supabase migrations through `014` and the matching `membership-access` Edge Function are live. This audit has not yet independently proved the remote migration ledger or authenticated RLS behavior, so those items remain live-QA pending rather than being re-labelled as verified.

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

## Final-product local implementation delta

| Area | Local status on August 14 | Evidence or remaining boundary |
|---|---|---|
| Fixed four-plan prices | Implemented and regression-tested locally | Free ¥0/¥0, Standard ¥3,980/¥20,300, Premium ¥6,980/¥35,600, Premium+ ¥16,800/¥85,700 remain centralised. |
| Pricing sales journey | Implemented locally | Four cards, 13 comparison rows, exact savings/monthly equivalents, best-for copy, Premium recommendation, trust/FAQ content, and contact-first flow. Hosted final-product QA pending. |
| Editable contact message | Implemented locally | Editable name/message, dirty-state preservation, copy-current-text, and explicit reset are covered by local plan tests. |
| Navigation and state | Implemented locally | Safe lesson→plans return, new-tab role change, persistent library filters, and common return handling are present. Browser history/reload QA remains part of preview testing. |
| First-time Google onboarding | Implemented locally; auth QA pending | Incomplete profiles are gated and verified email is read-only. First-time and returning OAuth flows require the preview backend and real accounts. |
| Teacher preview as learner | Implemented locally; backend not live | Teacher-only Free/Standard/Premium/Premium+ preview is labelled and non-mutating. It depends on migration `015` and authenticated RLS QA. |
| Immediate retry | Implemented and regression-tested locally | Incorrect checked answers provide a bilingual immediate retry while the first official result remains immutable. |
| Check answered / partial grading | Implemented and regression-tested locally | Format-aware completeness, dynamic **Check N answered**, checked-only denominator, and incomplete complex-answer protection cover all 14 formats. |
| Shuffle | Preserved and regression-tested locally | New runs reshuffle questions and applicable choices; resumed runs retain saved order. |
| Vibration | Retired locally | The unreliable learner preference and browser vibration calls were removed; local learner regressions assert that they do not return. |
| Question/content quality | Re-audited locally | All 85 visual questions received individual image/prompt/choice/hint/explanation/alt review. Four WebPs were replaced, one alt/brief corrected, six ambiguous distractor sets corrected, and all 85 now have unique bilingual guidance. Migration `016` is not live. |
| Premium experience and inventory | Implemented locally; backend not live | Migration `015` seeds one speaking and one essay task for each of 17 lessons, exactly 34 tasks. Submission/RLS/upload workflows require deployment and authenticated QA. |
| Premium draft privacy and review transaction | Implemented locally; backend not live | Migration `015` hides drafts from teachers and uses atomic review/state transitions. Remote RLS behavior remains unverified. |
| Teacher Studio information architecture | Implemented locally | Seven jobs: Dashboard, Learners, Access codes, Lessons & content, Submissions, Sources, Insights; one-language English/Japanese display and filters are included. |
| Access-code safety | Implemented locally; backend not live | Migration `015` and the updated Edge Function use transactional redemption/reissue and conflict handling. The complete live lifecycle remains pending. |
| Shared Takiwaki experience | Implemented locally | The old route redirects to the common learner experience while historical audience/access data remains compatible. Hosted redirect/session QA remains pending. |
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

## Required deployment sequence

1. Take a recoverable Supabase backup/export and preserve the current working deployment.
2. Confirm the recorded passing final integrated test/build/visual suite still
   matches the exact commit to deploy; rerun it if any file changes.
3. Apply migration `015`.
4. Apply migration `016` only after `015` succeeds.
5. Deploy the matching updated `membership-access` Edge Function.
6. Deploy the exact pushed final-product commit to the dedicated v9 preview.
7. Complete authenticated teacher and four-tier learner QA, then real-device QA.
8. Promote production only after every gate passes and production Netlify access is confirmed.

## Security and data rules for implementation

- Never rewrite migration `014`; all database work is forward-only as `015` or later.
- Never expose learner passwords, private recordings, answers, teacher feedback, authenticated API responses or service-role credentials in static assets or PWA caches.
- A blur is presentation, not authorization. Ineligible question prompt/choice/hint/explanation/answer payloads must remain withheld by RLS-safe data paths.
- Preview-as-learner must be teacher-authorized, visibly labelled, temporary and incapable of changing a real learner’s membership.
- Payment is arranged through a real conversation; the site must not claim payment completion.

## Final verification still required

- Full integrated test/build/visual/live-security commands on the final commit.
- Desktop, laptop, tablet, 430px and 390px visual checks with console inspection.
- Final light/dark Lighthouse checks for home, phrases, pricing and lesson, including 390 px and tablet breakpoints.
- Authenticated teacher plus Free/Standard/Premium/Premium+ learner checks.
- Google first-time and returning onboarding; email signup/login/logout/reload.
- Access-code create/edit/reissue/redeem/expired/exhausted/disable/delete and cleanup.
- Premium essay and microphone flows from submission through return/resubmission/published feedback.
- Real iPhone Safari and Android Chrome checks, or an explicit user-assisted record if direct device control is unavailable.
- Migration `015`, then migration `016`, then the matching Edge Function, with backup and preview gates.
- Preview deployment of the exact final-product commit before any production action.
