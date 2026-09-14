# Interactive Personal Lesson Notes

個別レッスンの学びを、先生が編集できる教材と、生徒自身の復習スペースに分けて保存します。教材画像は補助資料です。英語を中心に、日本語は先生が必要な部分だけ入力します。

## 1. What was built

Teacher Studio の「Lesson Notes / 個別ノート」と、My Page の「Lesson Notes / レッスンノート」。下書き・公開・取り下げ・保管、意味別ブロック、一括取り込み、複数の非公開画像、表示プレビュー、生徒の自動保存メモ・修正提案・画像・コメント、限定された直接編集、変更履歴と復元、更新通知、既存お気に入りへの表現保存を一体化しました。

## 2. Actual architecture inspected

The current application is **not Next.js**. It uses HTML multi-page routes, native JavaScript ES modules, shared CSS and a locally served Supabase JavaScript SDK. There is no TypeScript, Tailwind, server-action layer or block-editor package. Authentication/data are the existing Supabase project `ycmybggetemkhorkhfnf`. Mutations use PostgreSQL security-definer RPCs and RLS.

The source of production is GitHub `main`, deployed to Cloudflare Pages project `tahmid-english-hub` with `npm run build:cloudflare`, output `dist`, Node 22. Domain: `https://tahmidenglishhub.dpdns.org`. Pronunciation runs on the existing Cloudflare Worker at `https://speech.tahmidenglishhub.dpdns.org/api/natural-speech`. Netlify is not used for this feature.

The implementation branch began at verified live/main `42a589540cc525358025411d9e5394aec8a3a601`. Old Netlify-era source was not used as the baseline. Existing email work and its delivery problem are separate; no mail settings, DNS, domains or credentials are changed here. During final verification a separate email task added migration `20260914144000_owner_email_notifications`; it is not part of the notebook implementation and was preserved.

## 3. Reused systems

- Canonical `review_profiles`, `review_teachers`, `review_teacher_students` and `review_teacher_can_manage` enforce assigned-teacher ownership.
- Existing learner/teacher Supabase clients and member preference/session handling; the `homework` visibility setting also controls learner lesson notes.
- `review_personal_cards` plus `review_personal_card_favorites` hold saved phrase snapshots, shown in the existing My Page Favorites categories.
- `speakText`, voice settings, tap-unlocked audio player and the Cloudflare US Ava / UK Libby service.
- Existing site colors, typography, buttons, responsive member header, Teacher Studio navigation and build asset-versioning/CSP.

## 4. Files

New runtime files:

- `lesson-notes.html` — private learner page shell.
- `src/lesson-note-model.js` — block types, permissions, field schema, importer, validation, portable document helpers.
- `src/lesson-note-api.js` — Supabase reads/RPCs, signed images, JPEG/thumbnail preparation, upload recovery and duplication.
- `src/lesson-note-view.js` — semantic learner rendering, autosaving annotations, image viewer, suggestions/direct-edit dialog, source cards.
- `src/lesson-note-studio.js` — teacher list/editor/media/preview/activity/history.
- `src/lesson-notes.js` — authenticated learner index/detail routes.
- `src/lesson-notes.css` — scoped, responsive notebook design and semantic colors.

Integration changes: `teacher.html`, `src/teacher.js`, `my-page.html`, `src/member-pages.css`, `src/personal-cards.js`, `scripts/build.mjs`, `scripts/prepare-cloudflare.mjs`, `scripts/serve.mjs`, `package.json` and its lockfile.

Tests/development only: `scripts/test-lesson-notes.mjs`, `scripts/helpers/lesson-note-test-db.mjs`, `scripts/serve-notes-qa.mjs`, `scripts/qa-lesson-notes.html`, `scripts/qa-lesson-notes.js`. The build whitelist excludes these and all database sources from the public website.

## 5. Migration

`supabase/migrations/20260914130000_interactive_lesson_notes.sql` is a forward migration. Check `WORKING_HANDOFF.md` for its actual live application status before doing anything. Never replay the historical migrations or reapply an already recorded version. A production application must use a private backup and matching migration ledger row.

## 6. Database tables and columns

New tables:

| Table | Purpose |
| --- | --- |
| `review_lesson_notes` | Student/teacher identity, date, title, summary, focus, tags, structured content, status, six permissions, cover image, version, timestamps/actor |
| `review_lesson_note_annotations` | One student-owned memo per lesson or stable block ID; independent version for safe autosave |
| `review_lesson_note_suggestions` | Original/proposed block snapshots, pending/accepted/rejected/resolved state and reviewer |
| `review_lesson_note_comments` | Actor-labelled discussion entries |
| `review_lesson_note_assets` | Server-assigned owner, private full/thumbnail paths, type, alt/caption/title/order and pending/ready/archived state |
| `review_lesson_note_revisions` | Before-change note + teacher asset snapshots, actor, time and affected block IDs |
| `review_lesson_note_review_status` | Viewed/reviewed content versions and timestamps |
| `review_lesson_note_activity` | Meaningful audit events, grouped per action/entity/30-minute interval |
| `review_lesson_note_notifications` | One accumulated unread teacher inbox item per note/student |

Existing `review_personal_cards` gains nullable `source_note_id`, `source_block_id`, `source_lesson_date`, plus `source_tags`. A partial unique index deduplicates a learner’s save of the same source block. Existing card/favorite APIs continue to work. No user/profile tables are duplicated and no prior learning data is rewritten.

## 7. RLS policies

All nine new tables enable RLS. Authenticated users receive SELECT only; direct INSERT/UPDATE/DELETE is revoked. Mutations are validated in dedicated RPCs. Anonymous table and function access is denied.

- Assigned active teacher + matching note author: read/manage their notes, including drafts, archived versions, activity and revisions.
- Student: own published notes with the existing homework feature enabled. Other students’ IDs and drafts remain unavailable.
- Annotations, suggestions, comments and media depend on their parent note’s access. Creation/editing also checks the relevant permission inside the RPC.
- Revision history, audit and notification inbox are teacher-only.
- Permissions, note ownership, versions, actor identity and image ownership come from the database, not client flags.
- Internal snapshot/event helpers cannot be called by authenticated users. Each external RPC validates its own caller.

## 8. Storage

New bucket: `review-lesson-note-assets`, **private**, maximum stored file 5MB, PNG/JPEG/WebP MIME allowlist.

The UI decodes supported images and re-encodes them as JPEG to strip embedded metadata. It creates a separate small JPEG thumbnail. Input limit 20MB, maximum source 80 megapixels; optimized full image up to 8192px on its longest side / 16 megapixels, reduced further if required to fit 5MB. Thumbnail up to 640px and 256KB. Unsupported formats and decoding errors get a visible message.

Before upload an RPC creates random immutable paths:

`studentUUID/noteUUID/uploaderUUID/assetUUID.jpg`

and `assetUUID-thumb.jpg`. Original filenames do not control Storage paths. Storage INSERT requires a matching server-created pending manifest, current caller, note access and upload permission. Finalization verifies both files’ stored MIME/size before making them visible. No object UPDATE policy exists. Only unfinished own uploads can be removed directly; replaced/archived published images are retained for teacher history.

Students read only current visible assets of their own published notes. Archived versions are teacher-only. Signed links expire after five minutes; already issued links can remain usable until that expiry. URLs are never stored as permanent lesson data. No public bucket, public listing, private API caching or service-role credential is introduced.

## 9. Environment variables

**No new environment variables or secrets.** The existing public Supabase configuration and Cloudflare speech endpoint are reused. Existing optional `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` work as before; never supply a service-role key to frontend configuration.

## 10. Dependencies

**No new runtime or development dependencies.** Native controls fit this application’s architecture. The already installed PGlite runs real PostgreSQL migrations/RLS in isolated tests; no Tiptap/Lexical/React/Next.js installation is necessary.

## 11. Routes

- `/my-page/notes` — authenticated learner index.
- `/my-page/notes/<note-uuid>` — authenticated private notebook detail, including hard-refresh support through Pages rewrites.
- `/teacher?studio=notes` — Teacher Studio notebook management.
- `/teacher?studio=notes&note=<uuid>&view=activity` — teacher activity deep link.
- Existing `/my-page#favorites` continues to show saved phrases/words.

## 12. Reusable UI components

`blockMarkup` / `contentMarkup`, `mountNoteView`, `cardMarkup`, `mountAnnotation`, `openImageViewer`, `changeSnapshot`, `lazyPrivateImages` and `mountLessonNoteStudio`. Styles use semantic `ln-tone-*` tokens with labels and icons; color is supplementary.

## 13. Structured bilingual blocks

The saved document is `{schemaVersion:1, blocks:[...]}`. Every block has a stable ID and semantic type. Educational fields include `englishText`, optional `japaneseSupport`, support mode (`none`, `short`, `explanation`), examples, explanation, tags, pronunciation metadata and display options. Corrections add original/correct expressions; comparisons add a second expression; practice adds an optional model answer; images reference an asset ID.

Supported types: heading, paragraph, bullet list, Japanese→English, natural-English upgrade, common mistake, grammar, nuance, pronunciation, useful phrase, vocabulary, teacher tip, example, comparison, quick practice, callout, collapsible section, image and divider.

English is prominent. Japanese is a smaller supporting line or keyboard-accessible expandable explanation. There is no machine translation. Section blocks contain following blocks until the next section; key phrases are collected at the top and remain visible. Open/closed state remembers only booleans scoped by user/note/section in the browser.

## 14. Create the first lesson note

1. 先生画面 → **Lesson Notes / 個別ノート**。生徒の詳細画面からも、その生徒のノートを開けます。
2. **Create lesson note / 作成** → 生徒、日付、タイトル、概要、**Today’s Focus / 今日のポイント**を入力。
3. 教材ブロックを追加、または Quick Import で取り込む。必要な部分だけ日本語・例文・発音ボタンを付けます。
4. **Save draft / 下書き保存**。生徒にはまだ見えません。
5. 画像とプレビューを確認し、**Publish / 生徒に公開**。その生徒だけのマイページに表示されます。

公開中のノートは **Update published note** で更新、**Unpublish to draft** で公開を取り下げられます。**Archive safely** は履歴ごと保管して非表示にします。永久削除は行いません。

## 15. Quick Import

Markdownまたは構造化テキストを貼り付け → **Preview import** → 内容を確認 → **Add these blocks**。取り込んだブロックは通常の入力欄で修正できます。取り込みだけでは保存・公開しません。

`Japanese → English`, `Natural English Upgrade`, `Common Mistake`, `Grammar`, `Nuance`, `Pronunciation`, `Useful Phrase`, `Vocabulary`, `Quick Practice` などを認識します。`English:`, `Japanese:`, `Original:`, `Natural:`, `Incorrect:`, `Correct:`, `Example:`, `Explanation:`, `Answer:` の行を対応する項目へ入れます。不明なテキストは本文として残します。

HTMLの埋め込み要素やリンク先は除去します。表示は常にエスケープされたテキストです。スクリプト、iframe、イベント属性や埋め込みJavaScriptは実行しません。取り込みは180KB、ノート全体は150ブロック/220KBまで。

## 16. Multiple infographics

下書きを保存後、**Images / 画像**で複数ファイルを選び、説明・種類を入力してアップロードします。1回6枚まで。各画像に個別のタイトル、説明、altテキスト、資料タイプを設定できます。一覧は縮小画像を使用し、全サイズは拡大表示時だけ読み込みます。

## 17. Reorder, cover and replace

画像ごとの↑↓で並び替え、**Set cover**で表紙を指定。**Replace**で新しい画像に差し替え、順番と表紙指定を引き継ぎます。画像を保管すると生徒画面では非表示になり、変更履歴から復元できます。ノートを作り直す必要はありません。ノート複製は新しい下書きと画像コピーを作り、画像ブロックも新しい参照へ置き換えます。

## 18. Student annotations

レッスン全体の **My notes** と、各ブロックの **My note**。入力を止めて約1秒、または欄を離れたタイミングで保存します。「保存中／保存済み」を表示し、通信エラーでは入力内容を残して再試行できます。他のタブで同じメモが更新された場合は上書きを拒否します。先生の教材本文は変わりません。

メモを編集中にページを離れる場合は未保存警告があります。本文をブラウザの永続ストレージへ保存する設計ではないため、保存前にブラウザ自体を強制終了すると未保存テキストは失われ得ます。

## 19. Suggestions

ノートごとに許可ONの場合、ブロックから修正を提案できます。英語・日本語・例文・訂正文などの該当するテキスト項目を編集します。先生の **Student activity** に変更前後を表示し、採用・不採用・変更せず完了を選択します。採用前に元のブロックが変わっていた場合は競合として止め、古い提案で新しい教材を上書きしません。

## 20. Direct edits and history

直接編集は初期OFF。先生がノート全体の許可と、編集可能な各ブロックを両方ONにした場合だけ、生徒はそのテキストを変更できます。権限、公開状態、ブロックID、表示設定などは変更できません。

更新前に本文・先生画像の構成を保存し、実際の変更者、日時、対象ブロックを記録します。先生の **History** で以前の版を確認・復元できます。復元前の現在版も履歴に残り、復元結果は必ず非公開の下書きになります。生徒の個人メモは巻き戻しません。

## 21. Student image permissions

初期OFF。ON時だけ画像追加UIが出て、Storage/RPCでも許可を検証します。所有者はサーバーが生徒本人に設定し、`student_attachment`として先生教材とは分けて表示します。先生には投稿者・日時・説明が見えます。生徒は許可がある間、自分の説明の更新・画像の取り外しができます。先生資料への差し替えや他人の画像操作はできません。

## 22. Notifications and audit

先生のノート通知数と **Activity inbox** に、生徒・ノートごとにまとめて表示します。メモ2件、画像1件、提案1件といった内訳を確認し、対象ノートの更新画面へ進めます。メモの同一項目への自動保存は30分単位でまとめ、入力文字ごとの通知を作りません。先生は確認済みにでき、ノートごとに通知OFFも可能です。

通知とは別に、作成・公開・更新・画像変更・提案の判断・直接編集・復元を監査履歴に残します。既存の監査表は先生IDを前提とするため、生徒の操作と集約されたイベントは専用のノート操作履歴に保存します。このノート機能からメールは送信しません。別作業で追加されたオーナー向けメール機能とも、ノート通知は未接続です。新しいメールプロバイダーや送信費用は追加しません。

## 23. Save to My Phrases

保存ボタンは既存の個別復習カードとお気に入りを利用します。英語、日本語、先生、ノートID・日付、ブロックID、タグを持つスナップショットを保存。My Page → Favorites → Words / Phrases から復習できます。同じブロックを重複登録しません。元の教材が後から更新されても、保存した表現を無言で差し替えません。元ノートへのリンクは、その時点の閲覧権限に従います。

## 24. Pronunciation

先生が発音を有効にした英語ブロックに **US Ava / UK Libby** を表示。既存の `speakText` とCloudflare音声サービス、再生設定を使います。保存した表現にも設定を引き継ぎます。新しい読み上げエンジン・端末音声への代替・Netlifyへの戻りはありません。既存の音声OFF設定、ブラウザの再生制約、音声サービスの可用性は引き続き適用されます。

## 25. EN / EN+JP preview

**Student View**で未保存の編集内容も確認できます。**EN Primary**は日本語補足を隠し、**EN + JP Support**は先生が設定した短い訳・開閉式解説を表示します。保存内容には影響しません。Desktop / Mobileでノートの表示幅も確認できます。

## 26. Security summary

Private parent-note ownership is checked for every dependent operation. Concurrent edits use explicit expected versions and row locks. Annotations cannot modify the master. Suggestions cannot grant display/permission flags. Direct edits are constrained to already existing permitted block IDs. Student snapshots cannot expose another note. Files require immutable server-assigned manifests and RLS. Private files and API payloads are not added to the service-worker cache. No secret is embedded in HTML/JS or Git.

## 27. Manual QA checklist

- [x] Local teacher creates/imports a note and saves a draft; Student A sees no draft.
- [x] Publish; Student A sees the note. Automated PostgreSQL checks deny Student B and another teacher.
- [x] English/Japanese hierarchy and intentional correction/mistake layouts.
- [x] Existing collection save; annotation autosave; suggestion submission and teacher acceptance.
- [x] Multiple actual image files normalized/uploaded through browser to isolated private Storage fixture; student attachment shown with uploader/time.
- [x] Teacher inbox groups annotation, suggestion and image into one entry.
- [x] 390px page width equals document scroll width; fullscreen image viewer and 150% zoom work.
- [x] EN preview hides Japanese, EN+JP restores it without dirtying saved content.
- [x] Explicitly permitted block editing records the student actor/time and previous content, inspectable by the teacher. Restore is verified in PostgreSQL tests; the optional browser restore click was stopped by a native confirmation/automation issue.
- [x] Live Cloudflare custom domain and authenticated Teacher Studio: real private draft save/reload, no console errors, US Ava and UK Libby playback complete, then guarded QA draft cleanup.
- [x] Live anonymous REST protection (401), index/detail route refresh, My Page link, and unchanged existing learner data checked.

Student interaction tests use synthetic learners and local PostgreSQL. The live save check used a never-published draft for the existing owner-controlled Email Test account; it was backed up and removed. No fabricated lesson or comment was sent to a real learner. A physical iPhone is not emulated by viewport resizing.

## 28. Checks

The project has no configured lint or TypeScript typecheck. It remains JavaScript; do not report a nonexistent TypeScript/lint run as passed. Use syntax checks, real PostgreSQL tests, existing regression suite and browser checks.

- `npm run test:lesson-notes`: 86 explicit assertions plus importer validations covering permissions, drafts, cross-account privacy, source snapshots, annotations, notifications, suggestions, direct-edit history, images and restore.
- `npm test`: existing regression suite plus new acceptance tests.
- `npm run build:cloudflare` and `npm run test:cloudflare`: production build, clean routes, private-source exclusion, public-module cache versions, CSP and absence of Netlify references.
- `npm run verify:voices`: existing fixed voice contract.
- `node --check`: changed JavaScript syntax.

All listed tests/build checks passed for the published 10.6.0 runtime. Live release: `2468b2313012e22dc07747bcc35eed5fd9da0fe1`. See `WORKING_HANDOFF.md` for the verification evidence and limits.

## 29. Limits

- Images first; PDF uploads are intentionally not added. PNG/JPEG/WebP are supported.
- History preserves assets and therefore uses Storage. Up to 30 visible images per contributor role and 100 stored image versions per note; no recurring destructive purge or paid plan is introduced.
- Index search/filter works on loaded metadata, with Load more pagination; full body search and cross-notebook search indexing are future enhancements.
- UI history displays the latest 100 revisions; older records remain in the database.
- Annotation text is not a guaranteed offline backup; save status matters before closing the browser.
- Signed URLs can remain valid until their five-minute expiry after permissions change.
- Site notifications are implemented; consolidated email delivery is not enabled.
- No externally created infographic artwork is generated here, and no content/student name is hard-coded.

## 30. Follow-up improvements

Only if real usage justifies them: full-text notebook search, opt-in email digest after the existing delivery issue is resolved, richer practice scoring, export/print layout refinement, storage usage reporting and an explicitly approved old-version retention policy. These are separate from the working core notebook feature.
