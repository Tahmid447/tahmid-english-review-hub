# Lesson Workflow Improvement Report

Status: published and smoke-verified on 2026-09-16 JST as 10.8.0, runtime `24417f3e0daef754a6997ec9d51469971b5aa91a`, deployment `65aa899d-3bb0-4b1c-a190-7033dd197dfa`. Implementation `ac1e41e` was merged by fast-forward into existing production/main from `b44322687f37c6d97fc5b54ec5a15a06d82705c9`. No new hosting environment.

## 1. Inspected
Existing source, AGENTS and handoff, prior task history, production Teacher Studio/My Page/notes, semantic importer, note versions/status RPCs, practice snapshots, personal-card source metadata, notification flow, public build allowlist and live migration/RLS/storage state.

The former Codex task remains readable. Desktop logs show `turn/start` failing with `thread_not_found` on September 15 at 23:01 JST. This is evidence of a Codex task-start failure, not a website exception or lost repository. Its underlying service cause is not established. Repository documents and Git history are the continuity record.

## 2. UX Problems
Import did not complete the lesson metadata; existing populated fields needed explicit protection. Note management required entering the editor. My Page separated Lesson Notes visually and counted announcements rather than unseen updates. Useful practice/source links stopped at note level. Teacher overview emphasized totals before actual work. Mobile headers/navigation consumed too much space.

## 3. Changes
Extended existing modules with metadata preview, reusable block editors, note-list actions, small student/teacher priority lists, update badges, source/block links and learner-specific creation. Kept existing bilingual styling and compact controls. Added mobile two-column navigation and reduced My Page header space.

## 4. Deliberately Unchanged
No rebuild, new identity model, duplicate archive system, permanent deletion, new grading system, motivational rewards or invented review urgency. Auth/email, speech providers, images, annotation/suggestion/history storage and memberships remain unchanged. Favorites need no extra count. Free-text responses are not automatically labelled as teacher-review obligations because that workflow has no persisted review state.

## 5. Quick Import Metadata
Recognizes `Lesson Title:`, `Short Introduction:` (also `A Short Introduction:`), `Today's Focus:` (including curly apostrophe) and `Topics:` in the metadata preamble. Multiline values and comma/newline-separated topics work. Existing teaching/practice parsing follows afterward.

Missing metadata is proposed from actual headings, semantic teaching types and the first teaching point. No external AI request is made; unsupported domains such as Health are not invented from generic grammar content. Explicit metadata takes precedence over generated suggestions.

Preview includes editable title/introduction/focus/topics, rendered semantic blocks and expandable existing block editors. Nonempty current fields appear beside proposed values and remain unchanged unless their individual Replace checkbox is selected. Empty fields populate automatically; blocks append. Validation occurs on a clone, so a failed import never partially modifies the note. Editing pasted input invalidates the preview before Apply can run again.

## 6. My Page Next Actions
At most three actions: new/updated published note, unfinished or needs-review practice in another note, unread announcement, then new teacher personal card. Avoids duplicate actions for one note. No actionable records means an honest empty state. Loading/failure states are not reported as successful zero counts. Practice links target the first unfinished/current question block.

## 7. Indicators
Lesson Notes new/update counts use database-backed viewed version versus current version. Practice uses current question snapshot equality, excluding obsolete answers. Announcements are acknowledged when the detail dialog opens; For You teacher cards when rendered in their visible panel. These two acknowledgements are stored per user in this browser only, bounded to 1,000 IDs/timestamps; clearing browser storage or using another device resets them. Self-saved note phrases are not counted as new teacher cards. Zero badges are hidden.

## 8. Teacher Priorities
Suggestions, unread learner activity, then unfinished note drafts, with direct activity/editor links. The oldest waiting premium submission uses the existing filtered review queue. New lesson-note creation is available on Dashboard and the learner list/dialog. Plan/account totals remain available in a collapsed overview rather than leading the page. Existing in-site update events refresh note priorities; they do not create a second notification system.

## 9. List Actions
Existing Open editor plus contextual Preview and Archive. Archived notes offer Restore as draft and Move to Trash. Trash offers Restore as draft. State changes require confirmation and existing optimistic versions/RPCs. Archive hides the note from the learner; restore never silently republishes it. No permanent-delete operation was introduced.

## 10. Handoff
[WEEKLY_PROGRESS.md](WEEKLY_PROGRESS.md) is the concise current-week summary. [WORKING_HANDOFF.md](WORKING_HANDOFF.md) begins with the verified 10.8 production release and preserves earlier checkpoints as history.

## 11. Files and Schema
- `src/lesson-note-model.js`, `lesson-note-studio.js`, `lesson-note-view.js`, `lesson-note-api.js`, `lesson-notes.css`: importer, preview, actions and exact block navigation.
- `src/learning-overview.js` / `.css`, `my-page.js`, `member-pages.css`, `personal-cards.js`, `teacher.js`, `teacher.html`: priority lists, markers and navigation.
- `scripts/build.mjs`, `package.json`: public module inclusion and regression test registration.
- `scripts/test-note-workflow.mjs`, QA server/client/seed helpers: actual-page local fixtures backed by PostgreSQL/RLS. QA helpers are not shipped in the public build.
- New forward migration `20260915230000_note_workflow_overview.sql`: one stable, read-only, security-invoker aggregate RPC, authenticated only. No table or RLS policy changes. Teacher mode is explicitly scoped to the caller's assigned notes; owner My Page does not expose teaching notes as learner work. Returns at most 30 notes by default (maximum 100), counts and progress, not full content or learner responses.

## 12. Verification
- Full `npm test`, including existing notebook assertions, practice tests, new metadata/workflow/PostgreSQL/RLS tests, profile/preferences, teacher and email regressions.
- `npm run build:cloudflare`, `npm run test:cloudflare`, changed-JavaScript syntax and `git diff --check`.
- `npm run verify:voices`: 480 items, 2,112 payloads, 32 phonics levels. Voice implementation unchanged; new live playback is not claimed.
- Browser: explicit import preview, protected focus, save/publish, archive cancellation and execution, status filtering, Trash and restore, real My Page announcements/For You/Favorites/Profile/Settings, saved-source and unfinished-question deep links, progress 1/2 to 2/2, teacher activity acknowledgement and learner-specific create action.
- Student B has no Student A data; anonymous/other-teacher access is denied in real local PostgreSQL tests. Existing private asset tests still pass. Live preflight was read-only.
- Desktop and 390px screenshots/DOM overflow checks on changed teacher/student surfaces. No lint/typecheck exists or is claimed.

Local actual-page QA: `NOTE_QA_PORT=4177 NOTE_QA_WORKFLOW=1 node scripts/serve-notes-qa.mjs`. Open `http://127.0.0.1:4177/my-page` or `/teacher`; `?qa_role=other` selects the isolated other student. The loopback-only database is synthetic/in-memory; restarting it resets fixtures. It never writes production.

## 13. Limits and Release
Published with explicit current-conversation approval. Only `20260915230000_note_workflow_overview.sql` was applied, atomically with its matching ledger source, before the existing main/Cloudflare deployment. Ledger count is 14; never replay it. A small current-row checkpoint was saved privately, complementing the existing recovery baseline. All 50 existing table fingerprints and existing RLS/policies matched after migration and after final production smoke. Auth/email/DNS/hosting configuration and speech implementation are unchanged.

Production smoke: main routes 200; existing teacher session opens Dashboard, Notes and Quick Import (cancelled without saving); owner My Page shows next actions; anonymous private reads and overview return 401; actual My Page and Teacher at 390px have no horizontal document overflow; no captured console errors. Existing full automated/local/voice QA was reused, not repeated. Release build and output checks passed for 10.8.

Physical iPhone and fresh actual-student production login remain untested. Announcement/card acknowledgements are browser-local; those lists refresh on page load, while notebook summaries reuse existing notification events. Overview bounds the response, but aggregation still examines the caller's visible notes; revisit query cost with real scale rather than claiming constant-time performance. Import suggestions are conservative, not human-level topic inference.

## 14. Top Three Next Improvements
1. Physical iPhone and fresh student acceptance test after the authorized release.
2. Cross-device announcement/card acknowledgements if the extra database state is justified by usage.
3. A separately designed, persisted teacher-review state for free responses, before adding stronger review queues or urgency labels.
