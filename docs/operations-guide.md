# Operations Guide / 運用ガイド

## 1. Create and approve a Review Hub learner account

Normally, the learner chooses **Create account** on the public site and uses
Google or email/password. Email registration asks for name, optional age group,
native language, English level, and an optional learning goal. It never exposes
the password to the teacher.

The new learner appears under **Learners & memberships** in Teacher Studio.
After bank-transfer confirmation:

1. Enter any access period from 1 to 730 days (for example, 30 days for one month or 180 days for six months).
2. Choose General, Takiwaki, or Both.
3. Press **Approve**.

Access codes use the same 1-to-730-day range and also let you choose the scope
and maximum number of uses. The complete code is shown only once; later the
dashboard shows only its final four characters.

Manual Supabase creation remains available for an administrator:

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

Use **New Draft Lesson** for normal day-to-day authoring. **Sync Bundled
Content** is a maintenance tool for rebuilding the supplied lesson bundle; it
is not needed for a normal new lesson. **Archive** hides an old lesson without
deleting its content or learning history.

Selecting `General`, `Takiwaki`, or `Both` and changing the status to
`published` updates the learner sites from Supabase immediately. A Netlify
deployment is needed only for code, design, or feature changes.

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
6. Promote the reviewed package to production after approval.

### Beginner-friendly rollback

No coding is required to restore the previous visual version:

1. Open Netlify and choose the production project.
2. Open **Deploys**.
3. Choose the last successful deploy before the v10 membership release.
4. Select **Publish deploy**.

This restores the old website files. It does not delete lessons, learners, or
study history in Supabase. For a developer rollback, the calm baseline remains
on `backup/v8-calm-baseline`; the last verified v9 release is commit `b7e4ac9`.

## 7. Supabase migrations

Apply the numbered migration files in filename order. Migration 003 is generated
from the private reviewed source and stores the protected question payloads
behind RLS; migration 009 expands the current source to 562 activities.
Migration 004 publishes all 17 reviewed lessons to both audiences, adds the
teacher account’s private learner-preview profile, and attaches the three
late-July illustrations.

Migration 005 adds privacy-conscious learner profiles, memberships, manual
approval, expiry dates, access codes, two public previews, and protected full
lesson questions. It was applied through the trusted SQL Editor on August 2,
2026. Authentication Site URL and approved redirect URLs were updated for the
production site, preview site, and local review address. Email signup is
enabled with confirmation. Google OAuth is now enabled in Supabase; local
Google sign-in, callback cleanup and sign-out were verified on August 3. Every
new hosted Netlify URL must still be added to the Supabase redirect allow-list
before its Google callback is tested.

Migrations 007, 008, 009, 010 and 011 are present in the live schema. Migrations
010 and 011 were applied through the authenticated SQL Editor on August 3,
2026. The dashboard verifies the private `review-premium-recordings` bucket,
its 10 MB limit and four allowed audio MIME types, plus the SELECT, INSERT and
DELETE storage policies for authenticated users.

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
