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


## Sep 10 implementation checkpoint — 10.4.0 prepared

- The initial audio hotfix 10.3.0 / `9a16ec1ae1b707d4e040352e359e528d9017d168` is already live. US and UK Netlify requests returned 200 and actual production UI playback reached completion for both voices.
- Current work adds a lighter homepage, `/lessons` (31 metadata-only cards), `/my-page`, editable names/private compact avatar, announcement detail, categorized/searchable favorites including lesson/question references, and personal teacher practice cards.
- Additional user requests: remember BGM on/off/track/volume on reload, relogin and other signed-in browsers; softer click/correct/retry/completion sounds; show and support choice pronunciation in both lesson settings panels.
- Latest added user request: teacher-created words, phrases, sentences and notes for one learner, optional US Ava / UK Libby audio, student favorites and filters. Teacher Studio → Learners → select learner → Personal cards. My Page → For you.
- `20260910070630_learner_my_page.sql` **has been applied to production**, with matching Supabase migration ledger entry. Do not apply it again. Adds private `review-avatars` bucket (one WebP ≤100KB/account), lesson/question favorites, personal cards/favorites, verified owner self-settings and curriculum preview activity permissions.
- Backup before the migration: `/Users/tahmidahmed/Documents/Codex/private-backups/2026-09-10-my-page/before.json` (private, outside Git).
- Live database size verified 19MB. No learner progress was deleted; no recurring purge was installed. Monthly bandwidth/invocation quotas were not measured and are not reset by deleting records.
- New SQL test `scripts/test-my-page.mjs` passes actual PostgreSQL/PGlite migrations and tests student separation, assigned teacher access, avatar restrictions, valid question references, personal card visibility/favorites, revocation and owner settings persistence.
- Full existing test suite and production build passed. Browser checked 31 catalogue entries, no horizontal overflow at desktop, both lesson settings toggles, Japanese choice text, and US/UK actual playback. Remaining release checks: production logged-in My Page, profile/favorite round-trip, personal card controls, mobile layout, final deploy identity.
- User has been asked to log into the production learner site with their usual checking account; reply pending. Never request their password.

### Performance and audio architecture

- Browser calls `/.netlify/functions/natural-speech` (pinned Node Edge TTS) on the existing Netlify site. Old Supabase speech function remains deployed as historical compatibility endpoint, but current frontend uses Netlify. Contract identities: US en-US-AvaNeural; UK en-GB-LibbyNeural; JP Nanami. No device-voice substitution.
- Safari reuses a speech element unlocked by the actual tap; clips cache per account/voice/text for up to 7 days, capped at 8MB/160 entries. Long passages split into bounded chunks. Audio content is not placed in shared service worker/CDN caches.
- Home no longer downloads all lesson questions. Catalogue requests only metadata; an opened lesson fetches only its own questions, and guide phrase extraction uses that lesson.
- Supabase SDK 2.57.4 is served locally from `assets/vendor/`, with its MIT licence. Service worker prefetch is minimal and only versioned public code is cached for instant reuse. Private data/images remain outside that cache. Local dev registration is retired to avoid stale edits.
- Final asset query is `20260910-member1`, public cache v26, package version 10.4.0. Bump these again for a later release; preserve historical hotfix notes.

- Teacher Studio includes an explicit `/my-page?owner_preview=1` link. Only this route mode reuses the existing teacher session, and `review_is_site_owner` must confirm the owner before returning a learner session. Own-profile/settings/favorites use the real owner UUID and RLS. Preview links carry the mode through supported learning pages; normal student sessions remain separate. No credential is copied or minted.

- Additional checks passed: settings pending-save recovery, remote on/off/track/volume, auth-change guards and owner-preview denial for a non-owner; phone-width lesson settings and plan cards; Japanese choices stay visible even with English UI. Local US and UK choice-click audio both reached "Ready to play again". A 31-row public catalogue metadata request was 14,329 bytes and returned in 665ms in one sample (not a general speed guarantee).
