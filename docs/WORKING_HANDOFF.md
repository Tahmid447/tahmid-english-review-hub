# Active work — 2026-09-10

This is the existing Tahmid English Review Hub, NOT a new project.

## Release and recovery
- Repository: https://github.com/Tahmid447/tahmid-english-review-hub
- Working branch: `codex/structured-learning-hub`
- Netlify production branch: `upgrade/review-hub-v9-final-product`
- Production: https://tahmid-english-review-hub.netlify.app
- Supabase: `ycmybggetemkhorkhfnf`
- Last verified production source before this work: `95fc29ab62f1015fa4a6bcdb3d644293fcfda107` (10.2.0).
- User explicitly authorizes fixes and production publishing to this existing site. Do not create a new site or reset/force-push branches. Keep credentials out of Git.
- Existing database ledger includes migrations 001–027 plus `20260908080538_experience_campaigns.sql` and `20260908082230_campaign_save_scope.sql`. Inspect ledger before new migrations; never replay old migrations against production.

## Current request — complete every item
- [ ] Reliable US Ava / UK Libby audio across library, phrasebook, lessons; verify browser playback, not just an HTTP response.
- [ ] Japanese choice translations visible in BOTH lesson settings panels, independent of UI language.
- [ ] Strong red reference-price / percentage discount presentation on all three plans; retain accurate reference-price labels.
- [ ] Faster home and navigation; dedicated lesson catalogue in a new tab.
- [ ] Learner My Page with editable name and optional compact photo; assigned teacher can see profile.
- [ ] My Page announcement list and readable individual details, respecting all/individual audience rules.
- [ ] Save lessons/questions as well as existing curriculum/phrasebook favorites; group all saved items on My Page.
- [ ] Inspect Supabase usage; reduce unnecessary data transfer/storage. Do not delete progress or auto-purge records unless clearly necessary and agreed. Deleting database rows does not reset monthly transfer/function quotas.
- [ ] Durable recovery instructions in GitHub; local session cleanup must not be needed for project recovery.
- [ ] Build, focused tests, security tests for new data, production deploy and browser checks.

## Findings
- Sep 10 live US request returned HTTP 502 after ~12.8 seconds from Mumbai, `Speech generation failed`; local Node synthesis of the same Ava request returned valid 8,640-byte audio in 225ms. Previous region-only mitigation did not establish reliable service.
- `lesson.html` wrongly marks the Japanese choice toggle `settings-global-only`; the renderer also gates it on interface language. Both need correction.
- `fetchDatabaseLessons` fetches every accessible question payload for a catalogue; homepage also serializes many independent requests. Use metadata-only catalogue retrieval.
- Existing avatar_url profile column, curriculum favorites and phrasebook favorites can be reused without merging unrelated student identities.

Update this document at implementation/deployment checkpoints. Final release notes must distinguish technical audio checks from human listening and actual UI playback.
