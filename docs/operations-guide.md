# Operations Guide / 運用ガイド

## 1. Create a Review Hub learner account

1. Open Supabase Dashboard → Authentication → Users.
2. Choose **Add user** or **Send invitation**.
3. Use the learner’s email. Do not store the password in a database table.
4. Add user metadata `{"app":"review_hub","display_name":"Learner"}`.
5. For a personal Takiwaki account, run this once in the trusted SQL editor:

```sql
insert into public.review_profiles (user_id, display_name, access_scope)
values ('STUDENT-AUTH-UUID', 'Learner', 'takiwaki')
on conflict (user_id) do update
set display_name = excluded.display_name,
    access_scope = excluded.access_scope;
```

Use `general` instead of `takiwaki` for an ordinary learner.

## 2. Create or authorise a teacher account

Create the Auth user with Review Hub metadata, then add the Auth UUID:

```sql
insert into public.review_teachers (user_id, display_name)
values ('TEACHER-AUTH-UUID', 'Tahmid Ahmed')
on conflict (user_id) do update
set display_name = excluded.display_name,
    active = true;
```

Teacher access is checked by Supabase RLS, not by hiding `/teacher.html`.

## 3. Hand login information to a learner

- Prefer Supabase’s invitation or password-reset email.
- If a temporary password must be used, send the email and temporary password
  through separate private channels.
- Ask the learner to change it immediately.
- Never place a password in Notion, GitHub, the site HTML, or a normal database
  table.

## 4. Add and publish content

Teacher Studio supports:

- lesson creation and metadata editing
- draft/review/published/archived status
- general/Takiwaki/both audience
- draft preview
- lesson assignment
- activity/history review
- question creation, editing, ordering, and deactivation

Archive or deactivate content instead of hard-deleting it.

Before publishing:

1. Confirm at least one active question exists.
2. Preview the complete lesson.
3. Check English, Japanese, official answer, hint, explanation, audio, and
   distractors.
4. Confirm the audience.
5. Change the status to `published`.

The database rejects client-side publication of an empty lesson.

## 5. Turn a new Notion note into a lesson

1. Read the new page from `📘 Lessons (Takiwaki)`.
2. Record its exact Notion page ID and URL.
3. Check whether `(source_type, source_notion_page_id)` already exists.
4. Prepare varied activities as a private draft.
5. Insert/upsert through a trusted server-side import or migration.
6. Review in Teacher Studio.
7. Publish only after approval.

Do not place a Notion integration secret in browser JavaScript. A future
automatic import must run in a Netlify Function or Supabase Edge Function and
must still create a draft first.

## 6. Code and deployment updates

For lesson content managed entirely in Supabase, no website deployment is
needed.

For code, design, or new feature changes:

1. Work on a branch.
2. Run `npm run build`.
3. Run `npm test`.
4. Push to the private GitHub repository.
5. Check the separate Netlify preview.
6. Merge or change the production branch only after approval.

The current `jocular-chaja-86e78d` production site must remain unchanged until
the upgrade is accepted.

## 7. Supabase migrations

Apply the three migration files in order. Migration 003 is generated from the
private reviewed source and stores all 485 question payloads behind RLS.

The July 30 preview setup was applied through the trusted Supabase SQL Editor.
The local CLI could link to the project, but the shared project’s existing
`cli_login_postgres` role returned PostgreSQL `42501` before a normal
`db push`. No role or database password was reset. The migrations are
idempotent, so they can be safely rerun after that project-level CLI role is
repaired.

After application, verify:

- anonymous users receive no profile, assignment, attempt, answer, speaking,
  phrase-history, or setting rows
- anonymous users see only published general/both catalogue views
- private drafts do not appear in the public site
- a general learner cannot open Takiwaki-only content
- the intended teacher account passes `is_review_teacher()`

Run the repeatable anonymous live check:

```bash
npm run verify:live
```
