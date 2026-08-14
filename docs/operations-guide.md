# Operations Guide / 運用ガイド

Updated: 2026-08-14 (Asia/Tokyo)

This guide distinguishes the final-product code prepared locally from behavior
already available on the hosted sites. The working branch is
`upgrade/review-hub-v9-final-product`; implementation checkpoint `338d09d` is
committed locally and its final remote push must be confirmed before rollout.
The dedicated v9 preview is still the older `aad5749` deployment and production
is still pre-v9. Migration `015`, migration `016`, and the matching updated
`membership-access` Edge Function are not live.

## 1. Learner accounts and profile completion

Learners choose **Create account** and use Google or email/password. Registration
collects privacy-conscious profile fields. A first-time Google user must finish
the required profile fields before paid membership, access-code redemption, or
direct paid lesson access can proceed. The verified sign-in email is displayed
read-only. Returning users with a complete profile do not repeat this step.

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
and must be authenticated in the deployed preview before production.

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
time. This is local code until migration `015` and the matching Edge Function
are deployed; do not treat the older hosted flow as final verification.

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

Premium promises one reviewed speaking task and one reviewed essay per lesson;
Premium+ also advertises three 50-minute live 1:1 lessons per month. Before
launch, set a sustainable active-member/submission cap and booking policy. The
detailed workload warning is in `docs/PREMIUM_PLANS_AND_SUBMISSIONS.md`.

There is no automatic or AI grading. The compatibility database flag is always
written `false`. Tahmid reads/listens, decides the feedback, and publishes it.

## 6. Premium submission review

Migration `015` seeds exactly 34 active tasks: one speaking and one essay for
each of 17 lessons. After the migration and Edge rollout pass preview QA:

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
to the live database and has not been applied.

## 8. Notion-sourced lessons

1. Read the source page from `📘 Lessons (Takiwaki)` without editing it.
2. Record its exact Notion page ID and URL.
3. Check whether `(source_type, source_notion_page_id)` already exists.
4. Prepare varied activities as a private draft.
5. Insert/upsert through a trusted server-side import or forward migration.
6. Review every learner-visible field in Teacher Studio.
7. Publish only after approval.

Never place a Notion integration secret in browser JavaScript. Any future
automatic import must run server-side and create a draft first.

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

Apply numbered migrations in filename order. Do not edit or replay a previously
released migration to carry new behavior. Earlier project records report the
Review Hub migrations through `014` and the older compatible Edge Function
live; the August 14 audit did not independently re-read that remote ledger.

For this release, use this exact order:

1. Export/back up the current schema and relevant `review_` data.
2. Verify the target Supabase project is `ycmybggetemkhorkhfnf`.
3. Apply `202608140015_teacher_preview_and_premium_workflows.sql`.
4. Verify its functions, policies, and exact 34-task postcondition.
5. Apply `202608140016_visual_question_content_corrections.sql`.
6. Verify its exact 85-row update postcondition.
7. Deploy the matching `supabase/functions/membership-access/index.ts`.
8. Run anonymous, learner, and teacher negative/positive RLS checks in preview.

Migration `015`, migration `016`, and the matching Edge Function are **not
live** as of August 14. A website deploy before the matching backend is unsafe.

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
- all 17 lessons have exactly one active speaking and one active essay task.

## 11. Preview gate, production promotion, and rollback

For code/design/backend changes:

1. Run the final integrated suite, build, visual verification, and
   `git diff --check` on the exact worktree.
2. Commit intentionally and push `upgrade/review-hub-v9-final-product`.
3. Complete the Supabase/Edge rollout above after taking a backup.
4. Deploy the exact pushed commit to
   `https://tahmid-english-review-hub-v9-preview.netlify.app`.
5. Test desktop, tablet, 430 px, and 390 px; light/dark Lighthouse; console and
   overflow; all auth/access/submission workflows; and production-like headers.
6. Test real iPhone Safari and Android Chrome touch, microphone, PWA, and
   offline behavior.
7. Promote only after all gates pass and the correct production Netlify account
   is available.

Keep the previous successful production deploy as a recoverable rollback. A
Netlify rollback restores website files but does not roll back Supabase schema
or learner data. Database changes therefore require the backup/export and a
forward-fix plan; do not use destructive rollback SQL casually.

The exact current status and next command sequence are maintained in
`docs/CODEX_HANDOFF_2026-08-02.md`.
