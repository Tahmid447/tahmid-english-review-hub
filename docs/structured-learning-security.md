# Structured Learning Hub security and recovery

## Tested release boundary

Migrations 024 and 025 remain release-frozen, one-time operations. 026 is additive and replay-safe; it adds category rules, private packs, private-lesson scope and hardened public views. 027 updates the reviewed curriculum fields using checked before/after values. None of these changes deletes existing lesson, assignment, submission or progress data.

`npm run test:security` runs the actual application migrations 001–027 in PostgreSQL/WASM with isolated Supabase Auth/Storage fixtures and two teachers plus three learners. It runs 026 a second time to verify replay. It exercises:

- Teacher A reads and manages only Student A; Teacher B cannot read or mutate Student A's settings, assignments, progress or packs.
- Words, Phrases and Phonics have independent ranges and individual unlock/lock rules. A level lock wins over a level unlock.
- An explicit item block and a hidden category win over a personal pack. An active pack can extend level/plan access only for its assigned student. Pack item IDs remain hidden when their content is blocked.
- A missing authoritative settings row, failed signed-in access query and account pause fail closed.
- A personal lesson's body, question payload, public metadata, teacher-preview RPC and permanent-deletion RPC are unavailable to an unrelated teacher. A teacher cannot change another private lesson to public, insert questions, or gain access by assigning its guessed UUID to an owned learner or adding an allow override.
- The author can create a private draft with `INSERT RETURNING`, edit it and add questions before assigning a learner. Permanent deletion still requires an unused archived lesson and exact non-null confirmation. The author and a teacher legitimately managing an existing assigned learner can access a private lesson. This preserves access when student ownership is transferred.
- Personal homework can be opened independently when the general Review Lessons surface is off. Turning both surfaces off closes the lesson; an account pause closes all learning access.
- Signed-out requests receive only the deliberate preview curriculum (7 items) and preview lesson questions. Public preview material is intentionally public; logging out is not a way to obtain private material.

## Public-view advisor findings

Supabase flags `review_public_lessons`, `review_public_questions` and `review_question_teasers` as owner-executed views. This is an explicit compatibility exception, not a claim that owner views inherit base-table RLS. Supabase documents that ordinary owner views bypass base-table RLS: https://supabase.com/docs/guides/database/postgres/row-level-security#views

The public catalogue has a different data contract from the protected lesson table: visitors may see title/date/summary and counts for published catalogue entries without obtaining their lesson payload. Merely switching these views to `security_invoker = true` would either remove that catalogue (because the anonymous role cannot select the protected base tables), or require broader base-table grants/policies that risk exposing full rows. The release keeps the existing limited view projections and validates each exposure predicate explicitly:

| View | Required boundary | Exposed payload |
| --- | --- | --- |
| `review_public_lessons` | `review_can_read_catalog_lesson(id)`: publication/audience, private assignment scope, account and Review Lessons switch, student lesson block | Preview content only when `review_can_read_lesson(id)` permits it. Otherwise only the existing themes teaser. |
| `review_public_questions` | Published, active Free preview question plus `review_can_read_question(id)` | Full payload for the permitted preview only. |
| `review_question_teasers` | `review_can_read_lesson(lesson_id)` and `NOT review_can_read_question(id)` | ID, order, section, format and plan only; no prompt, answer, options, hint or explanation. |

The tests explicitly select these views as anonymous, Student A, Student B, Teacher A and Teacher B. A private plan-locked question exposes exactly the six teaser metadata columns to its assigned learner and no row to unrelated users. Turning off the learner surfaces returns no preview payload or teaser metadata. The private teacher-preview RPC has an additional guard because it runs with elevated database privileges. All new privileged helpers pin an empty search path, revoke default PUBLIC execution and grant only the roles used by their callers. Tables keep explicit narrow grants and RLS.

## Production verification

- `scripts/sql/structured-hub-preflight.sql`: read-only aggregate inventory before applying 024.
- `scripts/sql/structured-hub-postflight.sql`: verifies 96 levels, 480 items, ownership/settings integrity, RLS, protected pack grants, view guards and preserved legacy row counts.
- `scripts/sql/structured-hub-production-rls.sql`: uses only transaction-local role/JWT settings, runs aggregate read checks against existing accounts, then rolls back. It does not mutate a table or create an account.

Compare these outputs with a restricted local backup and the actual migration ledger before applying only the selected pending migrations. Do not run a blind `supabase db push` against a mismatched legacy ledger.

## Recovery

A failed transactional migration rolls back its database changes. Keep the pre-deployment schema/row backup and the previously deployed application commit available. If the application must be rolled back after a successful deployment, leave the additive 026 columns/tables in place; do not drop them or revert RLS to broad teacher access. Packs can be archived, category rules can be returned to `{}` to inherit the preserved original range, and item overrides can be returned to `inherit` through the guarded Teacher Studio controls. Existing progress remains attached to the same item IDs. Restore a curriculum field from the checked before-values only after reviewing any later teacher edits; do not overwrite live edits with an old seed.
