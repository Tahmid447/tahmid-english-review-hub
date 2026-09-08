# Experience & campaigns — 2026-09-08

This release extends the existing Review Hub. It preserves curriculum IDs, artwork, learner history and existing membership agreements.

## Teacher workflow

Open Teacher Studio → Learners → **Experience & campaigns / 表示・キャンペーン管理**.

1. Choose Standard / 標準表示 or Campaign / 期間限定表示.
2. Toggle Welcome offer / 新規登録特典 independently.
3. Edit the bilingual name, start/end dates and each plan's monthly reference/offer prices. The displayed percentage is calculated, rounded down to a whole percent.
4. Choose Everyone (including public visitors) or selected learners. The welcome popup additionally requires an account created during the campaign and no active paid membership. Hidden pricing and paused accounts do not get a popup.
5. Set global learner features. Learners using global defaults inherit these; explicit per-learner custom settings take precedence. Existing hidden-feature configurations were preserved as custom settings.
6. Preview the welcome card without sending it to learners, then save once to apply settings and audience atomically.

Initial campaign: September 8–30, 2026, Japan time. Ends at October 1 00:00 JST (the UI says September 30 23:59). Standard ¥4,980 → ¥3,980; Premium ¥8,980 → ¥6,980; Premium+ ¥21,800 → ¥16,800. Reference prices are explicitly labelled prices **after the offer**, not historical sales prices. New monthly applications only; six-month totals are unchanged. Existing contracts are not repriced. Standard mode restores the original plan presentation and original base prices. Welcome offers use the same quotes rather than stacking another discount.

The Learners screen has an Announcements / お知らせ section for all learners assigned to the teacher or one selected learner. Publication and target insertion are one database transaction. INSERT RETURNING now directly authorizes the new teacher-owned row instead of re-querying it through a STABLE helper that cannot see it yet.

Assigned counts expand into actual lesson names. Individual recommendations update in place, retaining the tab, selection and scroll. Larger refreshes preserve the learner tab. Pack checkboxes use explicit dimensions and a bounded text column.

## Owner preview and access

The sole active teacher verified before migration is recorded in an owner table without direct client grants. Authorization uses the authenticated UUID and active teacher record, not a client email comparison or editable user metadata. The owner receives an effective level 1–32 / all-feature preview and Premium+ presentation when signing in to the learner site. Other learners' access rules and private progress isolation remain enforced.

Migration `20260908080538_experience_campaigns.sql` was created using the CLI, dry-run against production in a rolled-back transaction, then applied through the Supabase migration API; the local filename matches the resulting ledger version. Existing migrations were not replayed on production. A private backup of affected settings, announcements, policies, helper and ledger exists outside Git.

New private tables have RLS and explicit grants. RPCs accept no caller-supplied identity for owner checks. Target selection and announcement publication verify teacher ownership. Dismissal is account/campaign scoped, persisted in the database and locally; refreshing does not reset the absolute expiry. New authenticated-only RPCs explicitly revoke PUBLIC and anon execution.

## Ava and speech reliability

US Ava changes from the multilingual model to the English-specific `en-US-AvaNeural`. UK Libby and Japanese Nanami keep their voice identities. `natural-v3` invalidates older audio memory cache entries. Already-open v2 clients retain their matching voice/profile during rollout.

Tokyo Edge Function requests stalled against the speech provider during release testing, including unchanged Libby and v2 Ava requests. The same requests succeeded in the project's Mumbai region. New clients explicitly select Mumbai; the function relays older Tokyo clients once, using a fixed same-project destination and no user credentials. Provider synthesis has a bounded timeout. [Supabase regional invocation documentation](https://supabase.com/docs/guides/functions/regional-invocation).

Four production audio samples were checked: “Hi, I'm Ren.” with Ava and Libby, “book”, and “Could you say that again, please?” with Ava. All returned HTTP 200, matching voice/profile metadata and MP3 files that decoded without errors; the legacy relay also returned 200. See `voice-sample-check-2026-09-08.json`. This is technical validation, not a claim that subjective pronunciation quality was certified by a human. No full live curriculum audio regeneration was performed.

## Validation

- Shared quote arithmetic: discount, end boundary, base mode, six-month scope and fixed countdown.
- Full existing local test suite; static voice contract check.
- PostgreSQL/PGlite with actual application migrations: owner-only controls, cross-student targeting, global/custom feature RLS, new signup eligibility, dismissal, actual expiry, atomic announcement targets, legacy private lesson/access isolation.
- Production owner read-only check: all 480 curriculum items, 32 levels, 31 lessons and effective Premium+.
- Production announcement create/target checks as the authenticated owner: both succeeded inside a transaction that was rolled back; no test announcement was delivered.
- Local browser: pricing quote and inquiry consistency, six-month switching, owner controls, preview popup, 390px width with no horizontal overflow.
- Supabase advisors reviewed: new RPC-only private tables intentionally have no direct policies/grants. Existing security-definer public views retain their explicit access predicates and passed isolation tests. Existing project-wide legacy warnings were not represented as newly resolved issues. [Advisor documentation](https://supabase.com/docs/guides/database/database-linter).

Design references: the user's Higgsfield screenshot and [Higgsfield pricing](https://higgsfield.ai/pricing), plus the clear comparison/plan organization on [Notion pricing](https://www.notion.com/pricing). No brand assets or illustrations were copied or replaced.

## Production completion

Netlify production deployed release 10.2.0 (`680a936c04280d7409416211284ba7ea55d515ff`, public cache v24). The authenticated Teacher Studio successfully loaded and saved the campaign configuration. A production-only safe-update guard required an explicit WHERE predicate for target removal; forward migration `20260908082230_campaign_save_scope.sql` changes replacement to delete only deselected targets and upsert retained/new targets. Save was retried successfully through the actual Teacher Studio UI. No setting was partially saved on the failed attempt because the operation is transactional.

Production browser verification also confirmed the five existing assignment titles, correct pack checkbox/text layout, and the all/individual announcement form. Test pack selection was cleared without saving. Existing learner custom feature choices were preserved. The public pricing page displayed the configured prices and computed discounts. No new student account or real announcement was created for testing.
