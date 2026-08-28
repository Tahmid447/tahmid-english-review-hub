# Operations Guide / 運用ガイド

Updated: 2026-08-28 (Asia/Tokyo)

This guide distinguishes repository state, manually applied database changes
and deployed behavior. The working branch is
`upgrade/review-hub-v9-final-product`; the formal site is
`https://tahmid-english-review-hub.netlify.app/`. The current documentation
checkpoint is branch HEAD (`git rev-parse HEAD`); this file cannot embed the
final hash of the commit that contains itself. Historical rollout/logical-
restore checkpoint `fcf561d` remains limited and must not be treated as a full
database backup. Migrations `015`–`023` and the matching updated
`membership-access` Edge Function are live on shared Supabase project
`ycmybggetemkhorkhfnf`.

## 1. Learner accounts and profile completion

Learners choose **Create account** and use Google or email/password. Registration
collects privacy-conscious profile fields. A first-time Google user must finish
the required profile fields before paid membership, access-code redemption, or
direct paid lesson access can proceed. The verified sign-in email is displayed
read-only. Returning users with a complete profile do not repeat this step.

The first live Google profile save exposed a client-side permission mismatch:
the old upsert included insert-only `user_id` on update, producing
`permission denied for table review_profiles`. Do not grant `UPDATE(user_id)`.
The deployed fix splits insert/update, omits `user_id` from updates, shows modal
status, avoids the stale automatic race, uses PWA cache v3, and cache-busts the
query. That application fix required no database migration; later numbered
migrations serve separate Premium-topic and lesson-expansion releases.

- Prefer Supabase invitation, email confirmation, or password-reset email.
- Never ask a learner to send a password to the teacher.
- Never put a password in Notion, GitHub, site HTML, screenshots, chat, or a
  normal database table.
- Teacher Studio may send a password-reset email only; it cannot reveal or store
  learner passwords.

The former `/takiwaki` URL redirects to the common learner experience in the
final-product code. General/Takiwaki/Both remains historical audience/access
metadata, not a reason to maintain a second learner interface.

## 2. Authorise a teacher account

Create the Supabase Auth user with Review Hub metadata, then add that user's
Auth UUID from the trusted SQL editor:

```sql
insert into public.review_teachers (user_id, display_name)
values ('TEACHER-AUTH-UUID', 'Tahmid Ahmed')
on conflict (user_id) do update
set display_name = excluded.display_name,
    active = true;
```

Teacher access is enforced by Supabase RLS and database functions, not by
hiding `/teacher.html`. Never create an email-based owner backdoor.

## 3. Teacher Studio jobs

The final-product Teacher Studio is organised into seven jobs:

1. **Dashboard** — review counts and work that needs attention.
2. **Learners** — search/filter accounts; manage membership, assignments,
   access exceptions, and activity history.
3. **Access codes** — create, edit, reissue, disable, and delete codes.
4. **Lessons & content** — manage lesson/question publication and plan access.
5. **Submissions** — review submitted speaking and essay work.
6. **Sources** — see content origin and sync status.
7. **Insights** — inspect learning activity and outcomes.

Teacher Studio displays English or Japanese one at a time and persists that
choice. It supports learner plan/status filters and submission-status filters.

The teacher-only learner preview selects Free, Standard, Premium, or Premium+.
It is visibly labelled, does not modify any learner membership or progress, and
disables learner submission controls. This preview depends on migration `015`
which is now live, but it must still be authenticated and exercised in the
deployed preview before production.

## 4. Approve membership or issue an access code

After confirming payment separately with the learner:

1. Open **Learners**.
2. Select the learner and choose the plan, access period, and relevant scope.
3. Confirm the start/end date and save.
4. Reopen the learner and verify the effective plan and expiry.

For an access code:

1. Open **Access codes**.
2. Choose Standard, Premium, or Premium+, the 1–730-day access period, scope,
   maximum uses, and optional label.
3. Copy the complete generated code from the one-time result.
4. Later lists must show only the safe suffix, not the complete code.

Migration `015` makes redemption and reissue transactional and serialised. It
rejects incompatible overlapping plan/scope grants rather than over-granting
time. Migration `015` and the matching Edge Function are deployed; do not treat
that fact alone as final verification because the authenticated create, redeem,
reissue, disable, expiry, exhaustion, and cleanup lifecycle is still pending.

For account access problems, use password-reset email. Do not invent, inspect,
or transmit a learner password.

## 5. Plans, prices, and contact-first sales

Use these exact public values:

| Plan | Monthly | Six months | Saving | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: |
| Free | ¥0 | ¥0 | ¥0 | ¥0 |
| Standard | ¥3,980 | ¥20,300 | ¥3,580 (about 15%) | ¥3,383 |
| Premium | ¥6,980 | ¥35,600 | ¥6,280 (about 15%) | ¥5,933 |
| Premium+ | ¥16,800 | ¥85,700 | ¥15,100 (about 15%) | ¥14,283 |

`/plans` starts a real LINE or Instagram conversation. It does not collect
payment or claim payment success. The learner may add a name, edit the prepared
message, copy the current text, and reset it deliberately. Confirm payment and
access separately.

The public plan presentation uses a 2×2 desktop grid: Free and Standard first,
then Premium and Premium+. It collapses to one column on small screens. Keep
English and Japanese headings in separate `data-ui-lines` spans; do not return
to slash-dependent line wrapping. `/pricing-layout-preview` is a private,
no-index comparison route and defaults to the adopted layout.

Premium promises one reviewed speaking task and one reviewed essay per lesson;
Premium+ also advertises three 50-minute live 1:1 lessons per month. Before
launch, set a sustainable active-member/submission cap and booking policy. The
detailed workload warning is in `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`.

There is no automatic or AI grading. The compatibility database flag is always
written `false`. Tahmid reads/listens, decides the feedback, and publishes it.

## 6. Premium submission review

Migration `015` seeds exactly 34 active tasks: one speaking and one essay for
each of 17 lessons. The live inventory check found all 17 exact pairs. After
the authenticated submission/RLS flow passes preview QA:

1. Open **Submissions** and filter the queue.
2. Open a submitted item. Learner drafts must not appear in the queue or be
   readable by the teacher.
3. Review the text or signed private recording.
4. Save draft teacher feedback if needed, then explicitly publish or return the
   work.
5. For returned work, confirm that resubmission refreshes queue timestamps and
   does not expose stale review state.

The final review action uses one transactional RPC so feedback and status do
not split into partially completed writes. Speaking paths must belong to the
learner and active speaking task, reference an existing private object, and
pass upload limits. Essay submissions cannot attach audio.

Do not download or copy learner recordings into public storage. Do not include
private text, recordings, answers, or feedback in service-worker caches.

## 7. Add, review, and publish content

Teacher Studio supports lesson creation/editing, draft/review/published/archive
states, source metadata, assignments, question creation/editing/ordering, and
question plan access. Use **New Draft Lesson** for normal authoring. **Sync
Bundled Content** is a maintenance operation, not the normal way to add a
lesson. Archive/deactivate instead of hard-deleting wherever possible.

Before publishing a lesson or question:

1. Confirm at least one active question exists.
2. Preview the complete lesson at each intended plan.
3. Check English, Japanese, official answer, prompt, all choices, hint,
   explanation, audio, image, alt text, and distractors.
4. Confirm only one defensible answer exists.
5. Confirm audience and minimum plan.
6. Publish only after the review is complete.

For a question below a learner's tier, **Safe teaser** may return only position,
format, and required plan. **Hidden** returns no row. Prompt, choices, hint,
explanation, answer, and stable private payload remain protected by RLS. Blur is
not authorization.

The August 14 visual re-audit covers all 85 illustration questions. Four images
were replaced, one alt/brief was corrected without replacing the valid image,
six ambiguous distractor sets were corrected, and all 85 received unique
bilingual guidance. Read `docs/VISUAL_CONTENT_REAUDIT_2026-08-14.md` before
editing visual content. Migration `016` carries these 85 reviewed corrections
to the live database. It has been applied; verification found all 85 rows
changed, all 17 lessons at `content_version >= 4`, 85 unique English and 85
unique Japanese hints, and no missing guidance or invalid choice sets.

## 8. Notion-sourced lessons

1. Read the source page from `📘 Lessons (Takiwaki)` without editing it.
2. Record its exact Notion page ID and URL.
3. Check whether `(source_type, source_notion_page_id, source_segment)` already
   exists. Different segments may intentionally represent Part 1 and Part 2 of
   the same source page.
4. Prepare varied activities as a private draft.
5. Insert/upsert through a trusted server-side import or forward migration.
6. Review every learner-visible field in Teacher Studio.
7. Publish only after approval.

Never place a Notion integration secret in browser JavaScript. Any future
automatic import must run server-side and create a draft first.

## 8A. Quick Practice and Study Music

- Keep the lesson-card choice between **Quick Practice** and **Full Lesson**.
  Quick Practice must remain exactly eight unique questions, approximately
  5–10 minutes, and should preserve the balanced family selection in
  `selectQuickPracticeIds`. Do not silently turn Quick into the full set.
- Keep the question-local **Practice settings** button in the quiz toolbar. It
  must open the same complete dialog as the page-header control, including
  voice, selected-choice pronunciation, SFX, Study Music, checking mode, hint
  behavior, language and theme. Do not create a second independent settings
  state.
- Keep Lesson Guides useful to a learner who did not attend the source lesson:
  retain all useful phrases and a bilingual model target for every question.
  Run `node scripts/audit-lesson-guide-coverage.mjs`; it must pass all 31
  lessons and all 1,100 activities before publishing content.
- Study Music defaults ON at 18%. Try playback immediately, but expect Safari,
  Chrome and other browsers to block audible autoplay on some visits. When
  blocked, show the fixed `Begin with music / BGMと一緒に始める` prompt and
  begin after that one explicit tap. Voice playback ducks the music; BGM must
  not share the voice or SFX volume setting.
- Music On/Off, track and volume are device-level settings and must follow the
  learner across Hub, lesson, phrase/vocabulary library, plans, Teacher Studio,
  music licence route, contact flow and the public error page. Never pretend
  that a blocked track is already playing.
- The five local recordings are CC BY 4.0 and must retain the artist, ISRC,
  official source and licence attribution in the quiet footer licence line,
  `/music-credits`, and `assets/audio/ambient/LICENSE.md`. Do not add Beatles or other commercial
  recordings unless the exact recording has a verified licence that permits
  this public use.
- Run `npm run verify:audio` after adding, replacing, renaming or recompressing
  a track. Keep music files out of the service-worker precache; the audio files
  may use immutable CDN caching because every changed asset receives a new
  filename or matching module/cache version.

## 9. PWA, themes, and public caching

The final-product code supports persisted System/Light/Dark themes and a PWA
public shell. The service worker may cache versioned public static assets and
the offline fallback only. It must not cache protected routes, Supabase/API
responses, authenticated requests, learner records, question answers, teacher
feedback, or recordings.

Before release, test install, update, navigation, and offline fallback on a real
iPhone and Android phone. Clear old preview service-worker data between release
candidates when validating a new cache version.

## 10. Forward-only Supabase rollout

Apply future numbered migrations in filename order. Do not edit or replay a
previously released migration to carry new behavior.

This release was applied manually to project `ycmybggetemkhorkhfnf` in this
order:

1. Supabase Free did not offer an official dashboard backup, so privacy-safe
   logical restore schema `codex_backup_20260814_fcf561d` was created. It
   excludes learner/Auth personal data and has RLS/access revocation. It is not
   full-project disaster recovery.
2. `202608140015_teacher_preview_and_premium_workflows.sql` was applied in its
   own SQL Editor transaction. Functions, policies, and the exact 34-task/17-pair
   postcondition passed.
3. `202608140016_visual_question_content_corrections.sql` was applied in a
   separate transaction. Its 85-row and content/guidance postconditions passed.
4. The matching `supabase/functions/membership-access/index.ts` was deployed and
   its fresh dashboard timestamp checked.
5. Parent commit `fcf561d` was first published to Netlify Preview. Public QA
   found a Retry denominator defect; application commit `ecf8726` fixed it and
   passed `npm test`, `npm run build`, and `npm run verify:visuals`, plus the
   exact live Retry retest.
6. Profile-save commits `d0b244b`, `50656f8`, `a69ab08`, and `049b5ff` fixed
   payload/status, stale-race, PWA-cache, and query-cache behavior. They added
   no migration `017` and made no Supabase change.
7. `202608180017_premium_task_topics.sql` added the first 17 lessons' Premium
   topic choices and passed its 34-task/51-topic postconditions.
8. Apply the August 28 lesson expansion strictly as
   `019 → 020 → 021 → 022 → 023`.
   Migration `019` adds `source_segment`; `020` stores 14 lessons and 462
   questions; `021` stores 28 Premium tasks and 42 new topics; `022` publishes
   only after every provenance, question, format and Premium precondition
   passes; `023` adds typing and labelled-grid parity to the prior 11 Notion
   lessons without changing teacher-managed controls. Live verification
   returned 14 newly published lessons with 462 questions, the prior 11 Notion
   lessons with 363 questions (33 each and all 14 formats), 31 public lessons
   with 1,100 questions overall, and 14 speaking plus 14 essay tasks for the
   new lessons.

The project has no `supabase_migrations.schema_migrations` table and the
dashboard reports no tracked migrations. Do not infer ledger entries or rerun
`015`–`023` merely to create history. Record future manual applications and
their postconditions explicitly. Anonymous, learner, and teacher negative and
positive RLS/browser checks remain in progress.

After rollout, confirm:

- anonymous users receive no profile, assignment, attempt, answer, speaking,
  phrase-history, setting, submission, or feedback rows;
- below-tier question payloads are withheld;
- learner drafts and draft recordings are invisible to teachers;
- learners cannot forge another user's recording path or attach audio to an
  essay;
- teacher preview is authorised, plan-scoped, labelled, and non-mutating;
- code redemption/reissue is transactional under concurrent requests;
- incomplete profiles remain Free/locked until required fields are saved;
- all 31 lessons have exactly one active speaking and one active essay task.

## 11. Preview gate, production promotion, and rollback

For code/design/backend changes:

1. Run the final integrated suite, build, visual verification, and
   `git diff --check` on the exact worktree.
2. Commit intentionally and push `upgrade/review-hub-v9-final-product`.
3. Confirm the recorded Supabase/Edge postconditions and do not blindly replay
   the manually applied migrations.
4. Confirm the current-account Netlify Preview serves application checkpoint
   `8fb49e0` at its immutable permalink:
   `https://6a8eee9d22a46700081feb04--tahmid-english-review-hub-preview.netlify.app`.
   This checkpoint includes 17/17 verified Teacher Studio source links,
   Quick Practice, licensed cross-page Study Music with one-tap fallback,
   transcript-aware speaking feedback, the entrance/value-story polish,
   the adopted 2×2 pricing layout, bilingual typography, question-local
   settings and complete Lesson Guide Practice maps.
5. Preserve the recorded public QA evidence: home inventory; pricing and Dark
   persistence; phrases 24→30; shuffle/radio behavior; visual guidance; fixed
   Retry score; 0.5x and mixed-language controls; locked payload; Teacher gate
   and language switch; Taki redirect; replacement WebP; clean browser log.
6. Preserve passed Google learner evidence: modal/page save success, gate close,
   complete reload, Standard through August 2, 2027, all 44 June 30 questions,
   and safe sign-out/reload/cross-tab lock.
7. Complete authenticated Teacher and dedicated non-teacher tier/RLS/access-
   code/submission checks, plus remaining responsive/Lighthouse checks.
8. Test real iPhone Safari and Android Chrome touch, microphone, PWA, and
   offline behavior.
9. Promote only after all gates pass and the correct production Netlify account
   is available.

Google learner auth/profile/reload/sign-out passes for the scoped identity.
Premium task cards appeared despite a Standard label, so it seems
Teacher-elevated and cannot prove Standard-versus-Premium denial. The learner
is signed out; Teacher auth remains pending. Use dedicated non-teacher tier
accounts for permission QA.

Keep the previous successful production deploy as a recoverable rollback. A
Netlify rollback restores website files but does not roll back Supabase schema
or learner data. Preview and production share the Supabase project, so backend
changes already affect both frontends even while production static files remain
pre-v9. The logical restore schema is limited and excludes personal/Auth data;
database problems therefore require a carefully tested forward-fix plan. Do not
use destructive rollback SQL casually.

The exact current status and next command sequence are maintained in
`docs/CODEX_HANDOFF_2026-08-02.md`.
