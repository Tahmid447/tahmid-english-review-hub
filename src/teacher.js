import {
  createTeacherAccessCode,
  deleteTeacherAccessCode,
  getTeacherLearnerAuthStatus,
  getTeacherClient,
  getTeacherSession,
  googleStudentAuthAvailable,
  onTeacherAuthChange,
  reissueTeacherAccessCode,
  saveTeacherSubmissionReview,
  signInTeacher,
  signInTeacherWithGoogle,
  signOutTeacher,
  updateTeacherAccessCode,
} from "./supabase.js?v=20260905-release5";
import { planFor } from "./plans.js?v=20260905-release5";
import { uiText } from "./i18n.js?v=20260905-release5";
import { readHumanText } from "./lesson-guide-targets.js?v=20260905-release5";
import {
  sourceSegmentFromLesson,
  sourceSegmentIsValid,
  sourceSegmentPartIndex,
} from "./lesson-source.js?v=20260905-release5";
import {
  DEFAULT_HUB_SETTINGS,
  fetchTeacherHubSettings,
  saveTeacherCurriculumAccess,
  saveTeacherHubSettings,
} from "./curriculum-api.js?v=20260905-hub1";

const client = getTeacherClient();

const elements = {
  loginPanel: document.querySelector("#teacherLoginPanel"),
  loginForm: document.querySelector("#teacherLoginForm"),
  email: document.querySelector("#teacherEmail"),
  password: document.querySelector("#teacherPassword"),
  googleSignIn: document.querySelector("#teacherGoogleSignIn"),
  loginStatus: document.querySelector("#teacherLoginStatus"),
  app: document.querySelector("#teacherApp"),
  logout: document.querySelector("#teacherLogout"),
  language: document.querySelector("#teacherLanguage"),
  mobileSettingsToggle: document.querySelector("#teacherMobileSettingsToggle"),
  settingsControls: document.querySelector("#teacherSiteSettingsControls"),
  previewPlan: document.querySelector("#teacherPreviewPlan"),
  name: document.querySelector("#teacherName"),
  students: document.querySelector("#teacherStudentCount"),
  published: document.querySelector("#teacherPublishedCount"),
  drafts: document.querySelector("#teacherDraftCount"),
  sessions: document.querySelector("#teacherSessionCount"),
  dashboardMetrics: document.querySelector("#teacherApp > .dashboard-shell"),
  panel: document.querySelector("#teacherPanel"),
  tabs: [...document.querySelectorAll("[data-teacher-tab]")],
  newLesson: document.querySelector("#newLessonButton"),
  editor: document.querySelector("#lessonEditor"),
  editorForm: document.querySelector("#lessonEditorForm"),
  editorHeading: document.querySelector("#editorHeading"),
  editorId: document.querySelector("#editorLessonId"),
  editorTitle: document.querySelector("#editorTitle"),
  editorDate: document.querySelector("#editorDate"),
  editorStatus: document.querySelector("#editorStatus"),
  editorAudience: document.querySelector("#editorAudience"),
  editorIsPreview: document.querySelector("#editorIsPreview"),
  editorSummary: document.querySelector("#editorSummary"),
  editorMessage: document.querySelector("#editorStatusMessage"),
  editorQuestionSummary: document.querySelector("#editorQuestionSummary"),
  manageLessonQuestions: document.querySelector("#manageLessonQuestionsButton"),
  saveLesson: document.querySelector("#saveLessonButton"),
  preview: document.querySelector("#previewDraftButton"),
  questionManager: document.querySelector("#questionManager"),
  questionManagerHeading: document.querySelector("#questionManagerHeading"),
  questionManagerMeta: document.querySelector("#questionManagerMeta"),
  questionManagerStatus: document.querySelector("#questionManagerStatus"),
  questionManagerPanel: document.querySelector("#questionManagerPanel"),
  previewQuestions: document.querySelector("#previewQuestionsButton"),
  newQuestion: document.querySelector("#newQuestionButton"),
  questionEditor: document.querySelector("#questionEditor"),
  questionEditorForm: document.querySelector("#questionEditorForm"),
  questionEditorHeading: document.querySelector("#questionEditorHeading"),
  questionRecordId: document.querySelector("#questionRecordId"),
  questionStableKey: document.querySelector("#questionStableKey"),
  questionSection: document.querySelector("#questionSection"),
  questionFormat: document.querySelector("#questionFormat"),
  questionRequiredPlan: document.querySelector("#questionRequiredPlan"),
  questionLockedDisplay: document.querySelector("#questionLockedDisplay"),
  questionPromptEn: document.querySelector("#questionPromptEn"),
  questionPromptJa: document.querySelector("#questionPromptJa"),
  questionHintEn: document.querySelector("#questionHintEn"),
  questionHintJa: document.querySelector("#questionHintJa"),
  questionExplanationEn: document.querySelector("#questionExplanationEn"),
  questionExplanationJa: document.querySelector("#questionExplanationJa"),
  questionAudioText: document.querySelector("#questionAudioText"),
  questionSpeakText: document.querySelector("#questionSpeakText"),
  questionSpeakJa: document.querySelector("#questionSpeakJa"),
  questionAnswerPayload: document.querySelector("#questionAnswerPayload"),
  questionAnswerHelp: document.querySelector("#questionAnswerHelp"),
  easyChoiceFields: document.querySelector("#easyChoiceFields"),
  easyAcceptedField: document.querySelector("#easyAcceptedField"),
  easyChoiceAEn: document.querySelector("#easyChoiceAEn"),
  easyChoiceAJa: document.querySelector("#easyChoiceAJa"),
  easyChoiceBEn: document.querySelector("#easyChoiceBEn"),
  easyChoiceBJa: document.querySelector("#easyChoiceBJa"),
  easyCorrectChoice: document.querySelector("#easyCorrectChoice"),
  easyAcceptedAnswers: document.querySelector("#easyAcceptedAnswers"),
  questionTemplate: document.querySelector("#questionTemplateButton"),
  questionEditorStatus: document.querySelector("#questionEditorStatus"),
  cancelQuestion: document.querySelector("#cancelQuestionButton"),
  learnerDialog: document.querySelector("#learnerDialog"),
  learnerDialogHeading: document.querySelector("#learnerDialogHeading"),
  learnerDialogContent: document.querySelector("#learnerDialogContent"),
  toast: document.querySelector("#toast"),
};

const state = {
  session: null,
  teacher: null,
  tab: "dashboard",
  lessons: [],
  profiles: [],
  memberships: [],
  accessCodes: [],
  attempts: [],
  assignments: [],
  accessOverrides: [],
  planOverrides: [],
  premiumTasks: [],
  taskSubmissions: [],
  submissionFeedback: [],
  premiumSchemaReady: true,
  teacherControlsReady: true,
  answers: [],
  analyticsQuestions: [],
  speaking: [],
  phrases: [],
  analyticsView: "overview",
  syncing: false,
  questionLesson: null,
  questions: [],
  questionLoading: false,
  questionSaving: false,
  lessonListView: "all",
  learnerSearch: "",
  learnerPlanFilter: "all",
  learnerStatusFilter: "all",
  submissionStatusFilter: "waiting",
  lastGeneratedCode: null,
  learnerAuthStatus: {},
  learnerAuthStatusRequests: {},
  structuredHub: {
    ready: null,
    loading: null,
    error: null,
    settings: [],
    items: [],
    access: [],
    progress: [],
    favorites: [],
    announcements: [],
    announcementTargets: [],
  },
};

const TEACHER_LANGUAGE_STORAGE_KEY = "te-review-hub:teacher-language:v1";
const TEACHER_PREVIEW_PLAN_STORAGE_KEY = "te-review-hub:teacher-preview-plan:v1";
const STRUCTURED_HUB_FEATURES = Object.freeze([
  ["show_dashboard", "Dashboard", "ダッシュボード"],
  ["show_words", "Words", "単語"],
  ["show_phrases", "Phrases", "フレーズ"],
  ["show_phonics", "Phonics", "フォニックス"],
  ["show_review_lessons", "Review lessons", "復習レッスン"],
  ["show_homework", "Homework", "宿題"],
  ["show_progress", "Progress", "学習進捗"],
  ["show_pricing", "Pricing", "料金案内"],
  ["show_contact_teacher", "Contact teacher", "先生への連絡"],
  ["show_trial_cta", "Trial call-to-action", "体験案内"],
  ["show_payment_plan", "Payment plan", "支払いプラン"],
  ["show_announcements", "Announcements", "お知らせ"],
]);
const STRUCTURED_HUB_CATEGORIES = Object.freeze([
  ["words", "Words", "単語"],
  ["phrases", "Phrases", "フレーズ"],
  ["phonics", "Phonics", "フォニックス"],
]);
const TEACHER_JAPANESE_COPY = Object.freeze({
  "Access codes": "アクセスコード",
  "Generate a code after bank-transfer confirmation, or use manual approval below. Set any period from 1 to 730 days (30 = 1 month, 180 = 6 months).": "銀行振込の確認後にアクセスコードを発行できます。利用期間は1〜730日で設定してください（30日＝1か月、180日＝6か月）。",
  "Plan label (e.g. July 6-month plan)": "プラン名（例：7月・6か月プラン）",
  "Days": "日数",
  "Access period in days (1–730). Examples: 30 = one month, 180 = six months.": "利用日数（1〜730日）。例：30日＝1か月、180日＝6か月。",
  "General": "一般",
  "Takiwaki only": "Takiwaki専用",
  "Both": "両方",
  "Generate secure code": "安全なコードを発行",
  "Code history — masked for security. “••••1234” is only the last four characters and cannot be used to unlock an account.": "コード履歴（安全のため一部を非表示）。「••••1234」は末尾4文字だけの記録で、ログイン解除には使えません。",
  "New full code — copy and send this now": "新しい完全コード—今すぐコピーして送ってください",
  "Copy full code": "完全コードをコピー",
  "Save changes": "変更を保存",
  "Reissue": "再発行",
  "Disable & preserve history": "無効化（履歴は保持）",
  "Delete unused code": "未使用コードを削除",
  "Only an enabled code can be reissued. Create a new code instead.": "再発行できるのは有効なコードだけです。新しいコードを作成してください。",
  "No fixed expiry": "有効期限なし",
  "No codes have been created yet.": "アクセスコードはまだありません。",
  "Loading secure dashboard…": "安全な管理画面を読み込んでいます…",
  "The dashboard could not be loaded.": "管理画面を読み込めませんでした。",
  "Lesson": "レッスン",
  "Date": "日付",
  "Status": "状態",
  "Audience": "公開先",
  "Questions": "問題",
  "Source": "出典",
  "Actions": "操作",
  "Edit": "編集",
  "Preview": "プレビュー",
  "Archive": "アーカイブ",
  "Restore": "復元",
  "Delete permanently": "完全に削除",
  "Return this lesson to Published": "このレッスンを公開状態へ戻します",
  "Only possible when no learner history exists": "生徒の学習履歴がない場合のみ実行できます",
  "Apply the Teacher Controls database update first": "先にTeacher Controlsのデータベース更新を適用してください",
  "Draft": "下書き",
  "Ready for review": "確認待ち",
  "Published": "公開中",
  "Archived": "非表示",
  "Learners": "生徒",
  "Search name or email": "名前・メールで検索",
  "No student profiles have been created yet.": "生徒プロフィールはまだありません。",
  "No email recorded": "メール未登録",
  "Level not set": "レベル未設定",
  "Age not shared": "年齢区分未設定",
  "Language not set": "母語未設定",
  "No learning goal recorded yet.": "学習目標はまだ登録されていません。",
  "Loading secure account status…": "安全なアカウント情報を読み込んでいます…",
  "Account status could not be loaded.": "アカウント情報を読み込めませんでした。",
  "Never": "なし",
  "Yes": "はい",
  "No": "いいえ",
  "Pending": "承認待ち",
  "Pending approval": "承認待ち",
  "Active": "有効",
  "Expired": "期限切れ",
  "Paused": "一時停止",
  "Approve / extend": "承認・期間延長",
  "Pause access": "利用を停止",
  "Send password-reset email": "パスワード再設定メールを送信",
  "Recent learning activity": "最近の学習状況",
  "No learning activity has been recorded yet.": "学習記録はまだありません。",
  "For security, teachers can never see or retrieve learner passwords. A reset email lets the learner choose a new password privately.": "安全のため、先生が生徒のパスワードを見たり取得したりすることはできません。再設定メールから、生徒本人が新しいパスワードを設定します。",
  "Select": "選択",
  "Recommend": "おすすめ設定",
  "Access exception": "個別の公開設定",
  "Assignment settings": "課題設定",
  "Practice": "練習",
  "Apply to selected": "選択したレッスンに適用",
  "Save settings": "設定を保存",
  "Save override": "例外設定を保存",
  "Clear override": "例外設定を解除",
  "Publish a lesson before assigning it.": "割り当てる前にレッスンを公開してください。",
  "Learning insights": "学習分析",
  "Overview": "概要",
  "Question mistakes": "間違えた問題",
  "Weak formats": "苦手な形式",
  "Listening & dictation": "リスニング・書き取り",
  "Retry detail": "再挑戦の詳細",
  "Lesson scores": "レッスン別スコア",
  "Sessions": "学習回",
  "Speaking records": "発話記録",
  "All recorded practice": "すべての発話練習",
  "Latest accuracy": "最新の正答率",
  "After any retries": "再挑戦後を含む",
  "Recovered on retry": "再挑戦で正解",
  "Listening first accuracy": "リスニング初回正答率",
  "Phrase repetitions": "フレーズ練習回数",
  "Unavailable": "利用不可",
  "Create a Premium review task": "プレミアム添削課題を作成",
  "Speaking and essay tasks are visible only to Premium learners who can open the selected lesson.": "スピーキング・英作文課題は、選択したレッスンを利用できるPremium生徒だけに表示されます。",
  "Speaking recording": "スピーキング録音",
  "Essay": "英作文",
  "English task title": "英語の課題タイトル",
  "Japanese title": "日本語タイトル",
  "English prompt": "英語の課題文",
  "Japanese prompt": "日本語の課題文",
  "Extra instructions (English)": "追加指示（英語）",
  "Extra instructions (Japanese)": "追加指示（日本語）",
  "Required phrases, comma separated": "推奨フレーズ（カンマ区切り）",
  "Required vocabulary, comma separated": "推奨単語（カンマ区切り）",
  "Target seconds": "目標秒数",
  "Minimum words": "最小語数",
  "Maximum words": "最大語数",
  "Attempts": "提出回数",
  "Create task": "課題を作成",
  "Premium tasks": "Premium課題",
  "No Premium tasks have been created yet.": "Premium課題はまだありません。",
  "Task": "課題",
  "Type": "種類",
  "Submissions": "提出数",
  "Hide": "非表示",
  "Reopen": "再公開",
  "Hide (history kept)": "非表示（履歴は保持）",
  "Delete": "削除",
  "Hidden": "非表示",
  "Submission queue": "提出・添削",
  "Feedback drafts stay private until Publish or Return is selected. The teacher writes and remains responsible for every published review.": "添削の下書きは「公開」または「修正を依頼」を選ぶまで生徒には表示されません。公開する内容は先生が作成し、責任を持って確認します。",
  "Read submitted essay": "提出された英作文を読む",
  "Open private recording": "非公開録音を開く",
  "Score / 100": "スコア／100",
  "Feedback in English": "英語フィードバック",
  "Feedback in Japanese": "日本語フィードバック",
  "Save private draft": "非公開の下書きを保存",
  "Publish feedback": "添削を公開",
  "Return for revision": "修正を依頼",
  "Apply the Premium database migration before using review tasks.": "添削課題を使う前にPremium用データベース更新を適用してください。",
  "Question manager": "問題管理",
  "Lesson questions": "レッスン問題",
  "Preview active questions": "有効な問題をプレビュー",
  "Add question": "問題を追加",
  "Question editor": "問題編集",
  "Edit question": "問題を編集",
  "Stable key": "管理キー",
  "Section": "セクション",
  "Format": "形式",
  "Multiple choice": "選択問題",
  "Situation choice": "場面選択",
  "True / false": "○×問題",
  "Typing": "入力問題",
  "Translation": "英訳問題",
  "Word order": "語順問題",
  "Matching": "組み合わせ",
  "Sorting": "分類問題",
  "Position grid": "位置問題",
  "Listening choice": "聞き取り選択",
  "Listening dictation": "聞き取り入力",
  "Speaking": "スピーキング",
  "Dialogue": "会話問題",
  "Correct the mistake": "誤り訂正",
  "Prompt — English": "問題文（英語）",
  "Prompt — Japanese": "問題文（日本語）",
  "Hint — English": "ヒント（英語）",
  "Hint — Japanese": "ヒント（日本語）",
  "Explanation — English": "説明（英語）",
  "Explanation — Japanese": "説明（日本語）",
  "Listening audio text": "リスニング音声文",
  "Speaking target — English": "発話目標（英語）",
  "Speaking target — Japanese": "発話目標（日本語）",
  "Cancel": "キャンセル",
  "Save question": "問題を保存",
  "Draft editor": "下書き編集",
  "New lesson": "新しいレッスン",
  "New draft lesson": "新しい下書きレッスン",
  "Edit lesson": "レッスンを編集",
  "Lesson title": "レッスン名",
  "Lesson date": "レッスン日",
  "Summary": "概要",
  "Learner": "生徒",
  "Learner profile & controls": "生徒プロフィール・設定",
  "Close": "閉じる",
  "Close question manager": "問題管理を閉じる",
  "Close question editor": "問題編集を閉じる",
  "Close learner profile": "生徒プロフィールを閉じる",
  "Email": "メールアドレス",
  "Password": "パスワード",
  "Continue with Google": "Googleで続ける",
  "or use email": "またはメールアドレス",
  "Something went wrong. Please try again.": "問題が発生しました。もう一度お試しください。",
  "Notion note ↗": "Notion元資料 ↗",
  "All": "すべて",
  "Drafts": "下書き",
  "There are no private drafts waiting for review.": "確認待ちの非公開下書きはありません。",
  "There are no archived lessons.": "アーカイブ中のレッスンはありません。",
  "There are no published lessons yet.": "公開中のレッスンはまだありません。",
  "Unknown lesson": "不明なレッスン",
  "Override expiry must be in the future.": "例外設定の終了日時は未来にしてください。",
  "The learner feature override could not be saved.": "生徒の個別設定を保存できませんでした。",
  "Learner plan exception saved. It applies until it expires or is cleared.": "生徒の個別プラン設定を保存しました。期限切れまたは解除まで適用されます。",
  "Learner override cleared; normal membership rules now apply.": "個別設定を解除しました。通常の会員プラン設定が適用されます。",
  "Cancelled": "解約済み",
  "Membership could not be activated.": "会員期間を有効化できませんでした。",
  "Membership could not be paused.": "会員利用を停止できませんでした。",
  "Membership paused.": "会員利用を停止しました。",
  "Full access code copied.": "完全コードをコピーしました。",
  "Copy failed. Select the full code and copy it manually.": "コピーできませんでした。完全コードを選択して手動でコピーしてください。",
  "Disabled": "無効",
  "Used up": "使用上限到達",
  "Partly used": "一部使用",
  "Unused": "未使用",
  "Enter a plan label before saving.": "保存前にプラン名を入力してください。",
  "The access code could not be updated.": "アクセスコードを更新できませんでした。",
  "Access code settings updated.": "アクセスコード設定を更新しました。",
  "The access code could not be reissued.": "アクセスコードを再発行できませんでした。",
  "New full code created. Copy it now; the old code is disabled.": "新しい完全コードを発行しました。今すぐコピーしてください。以前のコードは無効です。",
  "The access code could not be removed.": "アクセスコードを削除または無効化できませんでした。",
  "Used code disabled; redemption history preserved.": "使用済みコードを無効化し、利用履歴は保持しました。",
  "Unused code deleted.": "未使用コードを削除しました。",
  "Access code generated.": "アクセスコードを発行しました。",
  "The access code could not be generated.": "アクセスコードを発行できませんでした。",
  "The lesson recommendation could not be changed.": "おすすめレッスンを変更できませんでした。",
  "Lesson added to this learner’s plan.": "この生徒のおすすめにレッスンを追加しました。",
  "Lesson removed from this learner’s plan.": "この生徒のおすすめからレッスンを外しました。",
  "The closing date must be later than the opening date.": "公開終了日時は公開開始日時より後にしてください。",
  "The assignment settings could not be saved.": "課題設定を保存できませんでした。",
  "Assignment visibility, dates and plan requirement saved.": "課題の表示・期間・必要プランを保存しました。",
  "Select at least one lesson first.": "先にレッスンを1件以上選択してください。",
  "The selected lessons could not be updated.": "選択したレッスンを更新できませんでした。",
  "Apply the Teacher Controls database update before using lesson locks.": "レッスンの個別表示設定を使う前に、Teacher Controlsのデータベース更新を適用してください。",
  "The learner-specific lesson access could not be changed.": "生徒ごとのレッスン利用設定を変更できませんでした。",
  "No account email is recorded for this learner.": "この生徒にはアカウント用メールアドレスが登録されていません。",
  "The password-reset email could not be sent.": "パスワード再設定メールを送信できませんでした。",
  "Password-reset email sent. Passwords are never visible to the teacher.": "パスワード再設定メールを送信しました。先生にはパスワードは表示されません。",
  "Follow plan": "プラン設定に従う",
  "Allow this lesson": "このレッスンを利用可能にする",
  "Hide this lesson": "このレッスンを非表示にする",
  "Configure": "設定する",
  "Create & configure": "作成して設定",
  "Standard or above": "Standard以上",
  "Premium or Premium+": "PremiumまたはPremium+",
  "Premium+ only": "Premium+のみ",
  "Show assignment": "課題を表示",
  "Teacher review": "先生の確認あり",
  "Use membership plan": "会員プランを使用",
  "Use plan default": "プラン標準を使用",
  "Enable": "有効にする",
  "Disable": "無効にする",
  "Premium visual missions": "Premium画像ミッション",
  "Speaking submissions": "スピーキング提出",
  "Essay submissions": "英作文提出",
  "Live coaching": "個別コーチング",
  "Monthly progress note": "月次進捗メモ",
  "Override reason": "例外設定の理由",
  "Override expiry": "例外設定の終了日時",
  "Practice sessions": "学習回数",
  "Premium submissions": "Premium提出数",
  "Assigned lessons": "割り当てレッスン",
  "Membership & account safety": "会員期間・アカウント安全管理",
  "Membership duration in days": "会員利用日数",
  "Speaking practice": "スピーキング練習",
  "Recognition available": "音声認識あり",
  "Great / good": "とても良い／良い",
  "First-answer accuracy": "初回答の正答率",
  "Pronunciation practice": "発音練習",
  "First score": "初回スコア",
  "Accuracy": "正答率",
  "Answered": "回答数",
  "Wrong": "誤答数",
  "Mode": "方式",
  "Duration": "所要時間",
  "Completed": "完了日時",
  "Instant": "すぐ確認",
  "Manual": "まとめて確認",
  "Practice recorded": "練習記録あり",
  "Choose a lesson and add an English title and prompt.": "レッスンを選び、英語のタイトルと課題文を入力してください。",
  "The Premium task could not be created.": "Premium課題を作成できませんでした。",
  "Premium review task created.": "Premium添削課題を作成しました。",
  "The Premium task could not be updated.": "Premium課題を更新できませんでした。",
  "Premium task reopened.": "Premium課題を再公開しました。",
  "Premium task hidden from learners.": "Premium課題を生徒から非表示にしました。",
  "The unused Premium task could not be deleted.": "未使用のPremium課題を削除できませんでした。",
  "Unused Premium task deleted.": "未使用のPremium課題を削除しました。",
  "The private recording could not be opened.": "非公開録音を開けませんでした。",
  "Add English or Japanese feedback before saving.": "保存前に英語または日本語のフィードバックを入力してください。",
  "The review could not be saved.": "添削を保存できませんでした。",
  "Feedback published to the learner.": "生徒へフィードバックを公開しました。",
  "Submission returned with feedback.": "フィードバックを添えて修正を依頼しました。",
  "Private feedback draft saved; learner cannot see it yet.": "非公開の添削下書きを保存しました。生徒にはまだ表示されません。",
  "Question updated.": "問題を更新しました。",
  "Question added.": "問題を追加しました。",
  "The question could not be saved.": "問題を保存できませんでした。",
  "Saving question…": "問題を保存しています…",
  "Manage questions": "問題を作る・編集",
  "Save draft & add questions": "保存して問題作成へ",
  "Publish changes": "変更を公開",
  "Save changes": "変更を保存",
  "The lesson could not be archived.": "レッスンをアーカイブできませんでした。",
  "Lesson archived. Nothing was deleted.": "レッスンをアーカイブしました。問題や学習記録は削除されていません。",
  "This lesson has no active questions. Restore questions first, then publish it.": "このレッスンには有効な問題がありません。先に問題を復元してから公開してください。",
  "Lesson restored and published.": "レッスンを復元して公開しました。",
  "The lesson could not be restored.": "レッスンを復元できませんでした。",
  "The confirmation did not match. Nothing was deleted.": "確認用の文字が一致しません。何も削除していません。",
  "The unused lesson was permanently deleted.": "未使用のレッスンを完全に削除しました。",
  "The lesson could not be saved.": "レッスンを保存できませんでした。",
  "Draft saved. Add the first practice question now.": "下書きを保存しました。続けて最初の練習問題を作成してください。",
  "Lesson published.": "レッスンを公開しました。",
  "Lesson saved privately.": "レッスンを非公開で保存しました。",
  "The lesson could not be assigned.": "レッスンを割り当てできませんでした。",
  "Assignment saved.": "割り当てを保存しました。",
  "Bundled content could not be synced.": "同梱教材を再同期できませんでした。",
  "The six published lessons and activities are now in sync.": "公開済みの6レッスンとアクティビティを同期しました。",
  "The secure connection library could not be loaded.": "安全な接続機能を読み込めませんでした。",
  "Question unavailable": "問題を利用できません",
  "Untitled question": "タイトル未設定の問題",
  "Structured response": "構造化された回答",
  "Still needs work": "引き続き練習が必要",
  "Changed to incorrect": "再挑戦で不正解に変更",
  "Stayed correct": "正解を維持",
  "Not scored": "採点対象外",
  "That question is no longer available.": "その問題は現在利用できません。",
  "Question-level mistakes": "問題別の誤答",
  "First-answer misses identify what needs reteaching; latest accuracy shows whether retries helped.": "初回答の誤答から復習すべき内容を確認し、最新正答率から再挑戦の効果を確認できます。",
  "No scored question mistakes have been recorded yet.": "採点済み問題の誤答記録はまだありません。",
  "Question": "問題",
  "First misses": "初回誤答",
  "First accuracy": "初回答正答率",
  "Latest accuracy": "最新正答率",
  "Recovered": "再挑戦で正解",
  "Extra tries": "追加挑戦",
  "Action": "操作",
  "Listening and dictation breakdown": "リスニング・書き取りの内訳",
  "Weak activity formats": "苦手な問題形式",
  "Compare listening recognition with full-sentence dictation.": "聞き取り選択と英文書き取りの結果を比較できます。",
  "Formats are ordered from the lowest first-answer accuracy upward.": "初回答の正答率が低い形式から順に表示します。",
  "No listening or dictation answers have been recorded yet.": "リスニング・書き取りの回答記録はまだありません。",
  "No scored activity-format data is available yet.": "問題形式別の採点データはまだありません。",
  "Responses": "回答数",
  "Retry result detail": "再挑戦の結果詳細",
  "The first response remains the official score; this view shows what changed during retries.": "最初の回答を正式スコアとして保持し、再挑戦で何が変わったかを表示します。",
  "No within-session retries have been recorded yet.": "同じ学習回での再挑戦記録はまだありません。",
  "Student": "生徒",
  "First answer": "初回答",
  "Latest answer": "最新回答",
  "Result": "結果",
  "Points": "得点",
  "Tries": "挑戦回数",
  "Last answered": "最終回答",
  "Lesson-by-lesson scores": "レッスン別スコア",
  "Weighted score keeps multi-point activities accurate; session average treats every session equally.": "複数点の問題は加重スコアで正確に集計し、学習回平均は各回を同じ重みで計算します。",
  "No lesson score data has been recorded yet.": "レッスン別スコアはまだ記録されていません。",
  "Weighted first score": "加重初回スコア",
  "Average session": "学習回平均",
  "Latest answer accuracy": "最新回答の正答率",
  "Wrong answers": "誤答数",
  "Last practice": "最終学習",
  "Speaking records are separate from listening and dictation scores.": "スピーキング記録は、リスニング・書き取りのスコアと分けて表示します。",
  "No speaking practice has been recorded yet.": "スピーキング練習はまだ記録されていません。",
  "Official first scores remain separate from later retry improvements.": "正式な初回スコアと、その後の再挑戦による改善を分けて表示します。",
  "No practice sessions have been saved yet.": "学習記録はまだ保存されていません。",
  "RLS-protected answer records, attempts, speaking, and phrase activity.": "安全に保護された回答・学習回・スピーキング・フレーズ練習の記録です。",
  "Pronunciation practice": "発音練習",
  "No questions yet. Add the first question, then preview and publish the lesson.": "問題はまだありません。最初の問題を追加し、プレビュー後にレッスンを公開してください。",
  "Order": "順番",
  "Access": "利用条件",
  "State": "状態",
  "Mark inactive": "無効にする",
  "Move up": "上へ移動",
  "Move down": "下へ移動",
  "Inactive": "無効",
  "Loading questions…": "問題を読み込んでいます…",
  "Loading secure question data…": "安全な問題データを読み込んでいます…",
  "Question data is unavailable right now.": "現在、問題データを利用できません。",
  "Saving the new order…": "新しい順番を保存しています…",
  "Question order saved.": "問題の順番を保存しました。",
  "Restoring…": "復元しています…",
  "Updating…": "更新しています…",
  "Opening Google sign-in…": "Googleログインを開いています…",
  "Google sign-in is not available right now.": "現在Googleログインを利用できません。",
  "Signing in…": "ログインしています…",
  "Sign-in failed.": "ログインできませんでした。",
  "Save the lesson first; the question builder will open automatically.": "先にレッスンを保存してください。続けて問題作成画面が自動で開きます。",
  "Save the draft before previewing it.": "プレビュー前に下書きを保存してください。",
});
const teacherPairFor = (value) => {
  const clean = String(value || "").trim();
  const match = clean.match(/^(.*?)\s+\/\s+(.+?[\u3040-\u30ff\u3400-\u9fff].*)$/u);
  if (match) return { en: match[1].trim(), ja: match[2].trim() };
  return TEACHER_JAPANESE_COPY[clean] ? { en: clean, ja: TEACHER_JAPANESE_COPY[clean] } : null;
};
const initialTeacherLanguage = () => {
  try {
    const saved = window.localStorage.getItem(TEACHER_LANGUAGE_STORAGE_KEY);
    if (["en", "ja"].includes(saved)) return saved;
  } catch {
    // Use the browser language when storage is unavailable.
  }
  return String(navigator.language || "").toLowerCase().startsWith("ja") ? "ja" : "en";
};
let teacherLanguage = initialTeacherLanguage();
const teacherTextPairs = new WeakMap();

const teacherText = (english, japanese) => uiText(english, japanese, teacherLanguage);

const localizeTeacherText = (value) => {
  const pair = teacherPairFor(value);
  return pair ? teacherText(pair.en, pair.ja) : String(value ?? "");
};

const applyTeacherLanguage = (root = document) => {
  document.documentElement.lang = teacherLanguage === "ja" ? "ja" : "en";
  root.querySelectorAll?.("[data-teacher-en][data-teacher-ja]").forEach((node) => {
    node.textContent = teacherText(node.dataset.teacherEn, node.dataset.teacherJa);
  });
  root.querySelectorAll?.("[data-teacher-placeholder-en][data-teacher-placeholder-ja]").forEach((node) => {
    node.placeholder = teacherText(node.dataset.teacherPlaceholderEn, node.dataset.teacherPlaceholderJa);
  });
  root.querySelectorAll?.("[data-teacher-title-en][data-teacher-title-ja]").forEach((node) => {
    node.title = teacherText(node.dataset.teacherTitleEn, node.dataset.teacherTitleJa);
  });
  root.querySelectorAll?.("[data-teacher-aria-en][data-teacher-aria-ja]").forEach((node) => {
    node.setAttribute("aria-label", teacherText(node.dataset.teacherAriaEn, node.dataset.teacherAriaJa));
  });
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (node.parentElement?.closest("[data-teacher-en][data-teacher-ja]")) return;
    const pair = teacherTextPairs.get(node) || teacherPairFor(node.nodeValue);
    if (pair) {
      teacherTextPairs.set(node, pair);
      node.nodeValue = teacherText(pair.en, pair.ja);
    }
  });
  if (elements.language) elements.language.value = teacherLanguage;
};

const setTeacherLanguage = (language) => {
  teacherLanguage = language === "ja" ? "ja" : "en";
  try {
    window.localStorage.setItem(TEACHER_LANGUAGE_STORAGE_KEY, teacherLanguage);
  } catch {
    // The selection still applies for this page visit.
  }
  applyTeacherLanguage();
  if (state.session) renderActiveTab();
};

const setupTeacherHeaderSettings = () => {
  const close = ({ restoreFocus = false } = {}) => {
    if (elements.mobileSettingsToggle?.getAttribute("aria-expanded") !== "true") return;
    elements.mobileSettingsToggle.setAttribute("aria-expanded", "false");
    elements.settingsControls?.classList.remove("mobile-open");
    if (restoreFocus) elements.mobileSettingsToggle.focus();
  };

  elements.mobileSettingsToggle?.addEventListener("click", () => {
    const expanded = elements.mobileSettingsToggle.getAttribute("aria-expanded") === "true";
    elements.mobileSettingsToggle.setAttribute("aria-expanded", String(!expanded));
    elements.settingsControls?.classList.toggle("mobile-open", !expanded);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close({ restoreFocus: true });
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest?.(".site-header")) return;
    close();
  });
};

// A learner's saved essay draft is private until they explicitly submit it.
// Teachers can still protect the underlying task from destructive deletion by
// checking every stored row, but draft text must not appear in learner activity,
// submission counts, or the review queue.
const teacherVisibleSubmissions = () => state.taskSubmissions.filter(
  (item) => item.status !== "draft",
);

function submissionStatusLabel(status) {
  return {
    draft: teacherText("Draft", "下書き"),
    submitted: teacherText("Submitted", "提出済み"),
    in_review: teacherText("Teacher reviewing", "添削中"),
    reviewed: teacherText("Feedback ready", "フィードバック公開済み"),
    returned: teacherText("Returned for revision", "修正依頼済み"),
  }[status] || status;
}

function make(tag, options = {}) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) {
    const original = String(options.text);
    const pair = teacherPairFor(original);
    if (pair) {
      node.dataset.teacherEn = pair.en;
      node.dataset.teacherJa = pair.ja;
    }
    node.textContent = localizeTeacherText(original);
  }
  if (options.type) node.type = options.type;
  if (options.title) {
    const pair = teacherPairFor(options.title);
    if (pair) {
      node.dataset.teacherTitleEn = pair.en;
      node.dataset.teacherTitleJa = pair.ja;
    }
    node.title = localizeTeacherText(options.title);
  }
  return node;
}

function showToast(message, kind = "info") {
  if (!elements.toast) return;
  elements.toast.textContent = localizeTeacherText(message);
  elements.toast.dataset.kind = kind;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 3600);
}

function readableError(error, fallback) {
  const message = error?.message || "";
  if (/review_|relation .* does not exist/i.test(message)) {
    return teacherText(
      "Review Hub database setup is not complete yet. Run the supplied migration and catalogue seed first.",
      "Review Hubのデータベース設定が完了していません。先に必要な更新と初期データを適用してください。",
    );
  }
  if (/invalid login credentials/i.test(message)) {
    return teacherText("The email or password is not correct.", "メールアドレスまたはパスワードが正しくありません。");
  }
  if (/row-level security|permission denied/i.test(message)) {
    return teacherText("This account is not authorised for that teacher action.", "この先生アカウントには、この操作の権限がありません。");
  }
  if (/must contain at least one active question/i.test(message)) {
    return teacherText("Add and activate at least one question before publishing this lesson.", "公開前に、少なくとも1問を作成して有効にしてください。");
  }
  if (/digest\(|gen_random_bytes|pgcrypto/i.test(message)) {
    return teacherText("The secure access-code service needs its database update. No code was created.", "安全なアクセスコード機能に必要なデータベース更新が未適用です。コードは作成されませんでした。");
  }
  if (/duplicate key|review_questions_lesson_id_stable_key/i.test(message)) {
    return teacherText("That stable key is already used by another question in this lesson.", "その管理キーは、このレッスン内の別の問題で使用されています。");
  }
  return fallback ? localizeTeacherText(fallback) : message || teacherText("Something went wrong. Please try again.", "問題が発生しました。もう一度お試しください。");
}

function formatDate(value, includeTime = false) {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(teacherLanguage === "ja" ? "ja-JP" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function localDateTimeValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function isoDateTimeValue(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function statusLabel(status) {
  return {
    draft: teacherText("Draft", "下書き"),
    review: teacherText("Ready for review", "確認待ち"),
    published: teacherText("Published", "公開中"),
    archived: teacherText("Archived", "非表示"),
  }[status] || status;
}

function audienceLabel(audience) {
  return {
    general: teacherText("General", "一般"),
    takiwaki: teacherText("Takiwaki only", "Takiwaki専用"),
    both: teacherText("Both", "両方"),
  }[audience] || audience;
}

const QUESTION_FORMATS = Object.freeze({
  mcq: {
    label: "Multiple choice",
    example: {
      choices: [
        { id: "a", en: "First answer", jp: "最初の答え" },
        { id: "b", en: "Second answer", jp: "2つ目の答え" },
      ],
      correct: "a",
    },
  },
  situation: {
    label: "Situation choice",
    example: {
      choices: [
        { id: "a", en: "Natural response", jp: "自然な返答" },
        { id: "b", en: "Other response", jp: "別の返答" },
      ],
      correct: "a",
    },
  },
  truefalse: { label: "True / false", example: { correct: true } },
  typing: { label: "Typing", example: { accepted: ["Natural answer", "Another accepted answer"] } },
  translation: {
    label: "Translation",
    example: { accepted: ["Natural English answer"] },
  },
  order: {
    label: "Word order",
    example: {
      words: ["you", "How", "are"],
      correctWords: ["How", "are", "you"],
    },
  },
  matching: {
    label: "Matching",
    example: {
      pairs: [
        { en: "Good morning.", jp: "おはようございます。" },
        { en: "See you.", jp: "またね。" },
      ],
    },
  },
  sorting: {
    label: "Sorting",
    example: {
      categories: ["formal", "casual"],
      items: [
        ["Good morning.", "formal"],
        ["Hi!", "casual"],
      ],
    },
  },
  grid: { label: "Position grid", example: { correctCell: "bottom-left" } },
  listenChoice: {
    label: "Listening choice",
    example: {
      choices: [
        { id: "a", en: "Sentence heard", jp: "聞こえた文" },
        { id: "b", en: "Different sentence", jp: "別の文" },
      ],
      correct: "a",
    },
  },
  listenType: {
    label: "Listening dictation",
    example: { accepted: ["The sentence the learner hears."] },
  },
  speaking: { label: "Speaking", example: {} },
  dialogue: {
    label: "Dialogue",
    example: {
      context: "A: How are you?\nB: ...",
      contextJa: "A：元気ですか？\nB：…",
      choices: [
        { id: "a", en: "I’m good, thanks.", jp: "元気です、ありがとう。" },
        { id: "b", en: "At seven.", jp: "7時です。" },
      ],
      correct: "a",
    },
  },
  mistake: {
    label: "Correct the mistake",
    example: {
      wrongSentence: "He go to work.",
      accepted: ["He goes to work."],
    },
  },
});

const MANAGED_QUESTION_PAYLOAD_KEYS = new Set([
  "id",
  "format",
  "type",
  "section",
  "prompt",
  "promptJa",
  "promptJP",
  "hint",
  "hintJa",
  "explanation",
  "explanationJa",
  "audioText",
  "speakText",
  "speakJa",
  "isOriginal",
  "maxPoints",
  "points",
]);

function formatQuestionLabel(format) {
  return localizeTeacherText(QUESTION_FORMATS[format]?.label || format);
}

function bilingualValue(value, japaneseFallback = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const en = readHumanText(value, "en");
    const localizedJapanese = readHumanText(value, "jp");
    return {
      en,
      jp: localizedJapanese && localizedJapanese !== en
        ? localizedJapanese
        : readHumanText(japaneseFallback, "jp"),
    };
  }
  return {
    en: readHumanText(value, "en"),
    jp: readHumanText(japaneseFallback, "jp"),
  };
}

function questionPayloadDetails(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !MANAGED_QUESTION_PAYLOAD_KEYS.has(key)),
  );
}

async function fetchAll(table, columns, options = {}) {
  const pageSize = 1000;
  const rows = [];
  for (let from = 0; ; from += pageSize) {
    let query = client.from(table).select(columns).range(from, from + pageSize - 1);
    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true,
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

async function fetchOptional(table, columns, options = {}) {
  try {
    return { rows: await fetchAll(table, columns, options), available: true };
  } catch (error) {
    if (/relation .* does not exist|schema cache/i.test(error?.message || "")) {
      return { rows: [], available: false };
    }
    throw error;
  }
}

function resetStructuredHubData() {
  const previousRequestId = Number(state.structuredHub?.requestId || 0);
  state.structuredHub = {
    ready: null,
    loading: null,
    error: null,
    requestId: previousRequestId + 1,
    settings: [],
    items: [],
    access: [],
    progress: [],
    favorites: [],
    announcements: [],
    announcementTargets: [],
  };
}

async function ensureStructuredHubData({ force = false } = {}) {
  const hub = state.structuredHub;
  if (hub.loading) return hub.loading;
  if (!force && hub.ready !== null) return hub;

  const requestId = Number(hub.requestId || 0) + 1;
  hub.requestId = requestId;
  hub.error = null;
  hub.loading = (async () => {
    const settingsResult = await fetchTeacherHubSettings();
    if (settingsResult.reason === "migration-unavailable") {
      if (state.structuredHub === hub && hub.requestId === requestId) {
        hub.ready = false;
        hub.settings = [];
      }
      return hub;
    }
    if (settingsResult.error || settingsResult.reason) {
      throw settingsResult.error || new Error(settingsResult.reason);
    }

    const [items, access, progress, favorites, announcements, announcementTargets] = await Promise.all([
      fetchOptional(
        "review_curriculum_items",
        "id,category,level,title_en,title_ja,icon,required_plan,active,position,updated_at",
        { order: { column: "level", ascending: true } },
      ),
      fetchOptional(
        "review_student_curriculum_access",
        "student_id,item_id,access_mode,note,created_at,updated_at",
        { order: { column: "updated_at", ascending: false } },
      ),
      fetchOptional(
        "review_curriculum_progress",
        "student_id,item_id,status,self_rating,review_count,last_reviewed_at,next_review_at,created_at,updated_at",
        { order: { column: "updated_at", ascending: false } },
      ),
      fetchOptional(
        "review_curriculum_favorites",
        "student_id,item_id,created_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchOptional(
        "review_announcements",
        "id,teacher_id,audience,title_en,title_ja,body_en,body_ja,active,starts_at,ends_at,created_at,updated_at",
        { order: { column: "starts_at", ascending: false } },
      ),
      fetchOptional(
        "review_announcement_targets",
        "announcement_id,student_id,created_at",
        { order: { column: "created_at", ascending: false } },
      ),
    ]);
    if (state.structuredHub !== hub || hub.requestId !== requestId) return state.structuredHub;
    hub.settings = settingsResult.data || [];
    hub.items = items.rows.sort((left, right) => (
      String(left.category).localeCompare(String(right.category))
      || Number(left.level) - Number(right.level)
      || Number(left.position || 0) - Number(right.position || 0)
      || String(left.id).localeCompare(String(right.id))
    ));
    hub.access = access.rows;
    hub.progress = progress.rows;
    hub.favorites = favorites.rows;
    hub.announcements = announcements.rows;
    hub.announcementTargets = announcementTargets.rows;
    hub.ready = [items, access, progress, favorites, announcements, announcementTargets]
      .every((result) => result.available);
    return hub;
  })().catch((error) => {
    if (state.structuredHub === hub && hub.requestId === requestId) {
      hub.ready = false;
      hub.error = error;
    }
    return hub;
  }).finally(() => {
    if (state.structuredHub === hub && hub.requestId === requestId) hub.loading = null;
  });
  return hub.loading;
}

function hubSettingsFor(studentId) {
  const saved = state.structuredHub.settings.find((item) => item.student_id === studentId);
  return {
    ...DEFAULT_HUB_SETTINGS,
    ...(saved || {}),
    allowed_levels: Array.isArray(saved?.allowed_levels)
      ? saved.allowed_levels.map(Number).filter(Number.isInteger)
      : [],
  };
}

function replaceHubSettings(studentId, settings) {
  state.structuredHub.settings = state.structuredHub.settings
    .filter((item) => item.student_id !== studentId);
  state.structuredHub.settings.push({ student_id: studentId, ...settings });
}

function structuredHubUnavailableMessage() {
  return state.structuredHub.error
    ? readableError(
      state.structuredHub.error,
      teacherText(
        "Structured Hub controls could not be loaded. Existing teacher tools are still available.",
        "学習ハブ設定を読み込めませんでした。既存の先生用機能は引き続き利用できます。",
      ),
    )
    : teacherText(
      "Structured Hub controls will appear after the supplied database migration and curriculum seed are applied.",
      "指定のデータベース更新と教材初期データを適用すると、学習ハブ設定が表示されます。",
    );
}

async function verifyTeacher(session) {
  const { data, error } = await client
    .from("review_teachers")
    .select("user_id, display_name, active")
    .eq("user_id", session.user.id)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("This account is not authorised for Teacher Studio.");
  return data;
}

function showLogin(message = "") {
  state.session = null;
  state.teacher = null;
  state.learnerAuthStatus = {};
  state.learnerAuthStatusRequests = {};
  resetStructuredHubData();
  elements.loginPanel.hidden = false;
  elements.app.hidden = true;
  elements.logout.hidden = true;
  elements.loginStatus.textContent = message;
  elements.password.value = "";
}

async function enterStudio(session) {
  try {
    const teacher = await verifyTeacher(session);
    state.session = session;
    state.teacher = teacher;
    elements.loginPanel.hidden = true;
    elements.app.hidden = false;
    elements.logout.hidden = false;
    elements.name.textContent =
      teacher.display_name ||
      session.user.user_metadata?.display_name ||
      session.user.email?.split("@")[0] ||
      "Teacher";
    await refreshDashboard();
  } catch (error) {
    const message = readableError(error, "This account is not authorised for Teacher Studio.");
    if (!/setup is not complete/i.test(message)) await signOutTeacher();
    showLogin(message);
  }
}

async function refreshDashboard() {
  elements.panel.replaceChildren(make("p", { text: "Loading secure dashboard…" }));
  try {
    const [
      lessons,
      profiles,
      teachers,
      attempts,
      assignments,
      answers,
      analyticsQuestions,
      speaking,
      phrases,
      memberships,
      accessCodes,
      accessOverrides,
      planOverrides,
      premiumTasks,
      taskSubmissions,
      submissionFeedback,
    ] = await Promise.all([
      fetchAll("review_lessons", "*, review_questions(count)", {
        order: { column: "lesson_date", ascending: false },
      }),
      fetchAll("review_profiles", "user_id, display_name, first_name, last_name, contact_email, age_group, native_language, english_level, learning_goal, locale, access_scope, created_at"),
      fetchAll("review_teachers", "user_id, active"),
      fetchAll(
        "review_attempts",
        "id, user_id, lesson_id, assignment_id, practice_mode, first_score, max_score, answered_count, question_count, wrong_count, duration_seconds, started_at, completed_at",
        { order: { column: "completed_at", ascending: false } },
      ),
      fetchAll(
        "review_assignments",
        "id, lesson_id, student_id, assigned_by, due_at, status, note, visible_to_student, opens_at, closes_at, required_plan, teacher_review_required, created_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchAll(
        "review_answers",
        "id, attempt_id, question_id, user_id, lesson_id, answer, first_is_correct, first_points, latest_is_correct, latest_points, answer_count, feedback_band, first_answered_at, last_answered_at",
        { order: { column: "last_answered_at", ascending: false } },
      ),
      fetchAll(
        "review_questions",
        "id, lesson_id, stable_key, section, format, payload, active, required_plan, locked_display",
        { order: { column: "position", ascending: true } },
      ),
      fetchAll(
        "review_speaking_activity",
        "id, user_id, lesson_id, question_id, target_text, transcript, feedback_band, recognition_available, practiced_at",
        { order: { column: "practiced_at", ascending: false } },
      ),
      fetchAll(
        "review_phrase_activity",
        "id, user_id, phrase_id, practice_count, last_practiced_at, is_favorite",
        { order: { column: "last_practiced_at", ascending: false } },
      ),
      fetchAll(
        "review_memberships",
        "user_id,status,access_scope,plan_tier,plan_label,starts_at,expires_at,approval_source,approved_at,notes,created_at,updated_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchAll(
        "review_access_codes",
        "id,label,code_last4,duration_days,access_scope,plan_tier,max_uses,use_count,enabled,valid_until,created_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchOptional(
        "review_lesson_access_overrides",
        "lesson_id,student_id,access_mode,note,updated_at",
        { order: { column: "updated_at", ascending: false } },
      ),
      fetchOptional(
        "review_learner_plan_overrides",
        "user_id,plan_tier,feature_flags,reason,starts_at,expires_at,updated_at",
        { order: { column: "updated_at", ascending: false } },
      ),
      fetchOptional(
        "review_premium_tasks",
        "id,lesson_id,stable_key,task_type,title_en,title_ja,prompt_en,prompt_ja,instructions_en,instructions_ja,required_phrases,required_vocabulary,topics,target_seconds,min_word_count,max_word_count,max_attempts,active,created_at,updated_at",
        { order: { column: "created_at", ascending: false } },
      ),
      fetchOptional(
        "review_task_submissions",
        "id,task_id,user_id,attempt_number,status,selected_topic_key,text_response,audio_object_path,transcript,duration_seconds,submitted_at,reviewed_at,created_at,updated_at",
        { order: { column: "submitted_at", ascending: false } },
      ),
      fetchOptional(
        "review_submission_feedback",
        "id,submission_id,teacher_id,score,rubric,feedback_en,feedback_ja,ai_assisted,published_at,created_at,updated_at",
        { order: { column: "updated_at", ascending: false } },
      ),
    ]);

    state.lessons = lessons;
    const teacherIds = new Set(
      teachers
        .filter((teacher) => teacher.active)
        .map((teacher) => teacher.user_id),
    );
    state.profiles = profiles.filter((profile) => !teacherIds.has(profile.user_id));
    state.attempts = attempts;
    state.assignments = assignments;
    state.answers = answers;
    state.analyticsQuestions = analyticsQuestions;
    state.speaking = speaking;
    state.phrases = phrases;
    state.memberships = memberships;
    state.accessCodes = accessCodes;
    state.accessOverrides = accessOverrides.rows;
    state.planOverrides = planOverrides.rows;
    state.teacherControlsReady = accessOverrides.available;
    state.premiumTasks = premiumTasks.rows;
    state.taskSubmissions = taskSubmissions.rows;
    state.submissionFeedback = submissionFeedback.rows;
    state.premiumSchemaReady = premiumTasks.available && taskSubmissions.available && submissionFeedback.available;
    updateMetrics();
    renderActiveTab();
  } catch (error) {
    elements.panel.replaceChildren(
      make("p", { text: readableError(error, "The dashboard could not be loaded.") }),
    );
  }
}

function updateMetrics() {
  elements.students.textContent = String(state.profiles.length);
  elements.published.textContent = String(
    state.lessons.filter((lesson) => lesson.status === "published").length,
  );
  elements.drafts.textContent = String(
    state.lessons.filter((lesson) => ["draft", "review"].includes(lesson.status)).length,
  );
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  elements.sessions.textContent = String(
    state.attempts.filter((attempt) => new Date(attempt.completed_at).getTime() >= sevenDaysAgo)
      .length,
  );
}

function questionCount(lesson) {
  const value = lesson.review_questions;
  if (Array.isArray(value)) return Number(value[0]?.count || 0);
  return Number(value?.count || 0);
}

function makeTable(headers) {
  const table = make("table", { className: "data-table" });
  const thead = make("thead");
  const row = make("tr");
  for (const header of headers) row.append(make("th", { text: header }));
  thead.append(row);
  const tbody = make("tbody");
  table.append(thead, tbody);
  return { table, tbody };
}

function makeAction(label, handler, title = "") {
  const button = make("button", { text: label, type: "button", title });
  button.addEventListener("click", handler);
  return button;
}

function safeNotionLink(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !["notion.so", "www.notion.so", "app.notion.com"].includes(parsed.hostname)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

function unavailableLessonSourceLabel(lesson) {
  if (lesson.source_type === "legacy_zip") {
    return teacherText(
      "Bundled lesson · Source link missing",
      "同梱レッスン · 元資料リンク未登録",
    );
  }
  if (lesson.source_type === "notion") {
    return teacherText(
      "Notion lesson · Source link missing",
      "Notionレッスン · 元資料リンク未登録",
    );
  }
  return teacherText(
    "Teacher-created · Source link missing",
    "先生作成 · 元資料リンク未登録",
  );
}

function lessonRows(lessons) {
  const { table, tbody } = makeTable([
    "Lesson",
    "Date",
    "Status",
    "Audience",
    "Questions",
    "Source",
    "Actions",
  ]);

  for (const lesson of lessons) {
    const row = make("tr");
    const titleCell = make("td");
    titleCell.append(make("strong", {
      text: teacherLanguage === "ja" ? lesson.title_ja || lesson.title_en : lesson.title_en,
    }));

    const sourceCell = make("td");
    const notionUrl = safeNotionLink(lesson.source_notion_url);
    if (notionUrl) {
      const link = make("a", { text: teacherText("Notion source ↗", "Notion元資料 ↗") });
      link.href = notionUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      sourceCell.append(link);
    } else {
      sourceCell.textContent = unavailableLessonSourceLabel(lesson);
    }

    const actions = make("td", { className: "table-actions" });
    actions.append(
      makeAction("Edit", () => openEditor(lesson)),
      makeAction("Questions", () => openQuestionManager(lesson)),
      makeAction("Preview", () => previewLesson(lesson)),
    );
    if (lesson.status !== "archived") {
      actions.append(makeAction("Archive", () => archiveLesson(lesson)));
    } else {
      actions.append(makeAction("Restore", () => restoreLesson(lesson), "Return this lesson to Published"));
      const remove = makeAction(
        "Delete permanently",
        () => permanentlyDeleteLesson(lesson),
        "Only possible when no learner history exists",
      );
      remove.className = "danger-action";
      remove.disabled = !state.teacherControlsReady;
      if (!state.teacherControlsReady) {
        remove.title = teacherText(
          "Apply the Teacher Controls database update first",
          "先にTeacher Controlsのデータベース更新を適用してください",
        );
      }
      actions.append(remove);
    }

    row.append(
      titleCell,
      make("td", { text: formatDate(lesson.lesson_date) }),
      make("td", { text: statusLabel(lesson.status) }),
      make("td", { text: audienceLabel(lesson.audience) }),
      make("td", { text: questionCount(lesson) }),
      sourceCell,
      actions,
    );
    tbody.append(row);
  }
  return table;
}

function renderLessons(mode) {
  const filtered = mode === "drafts"
    ? state.lessons.filter((lesson) => ["draft", "review"].includes(lesson.status))
    : state.lessons.filter((lesson) => (
      state.lessonListView === "all" || lesson.status === state.lessonListView
    ));

  const wrap = make("div", { className: "teacher-list-view" });
  if (mode === "lessons") {
    const controls = make("div", { className: "lesson-list-filters" });
    const counts = Object.fromEntries(
      ["draft", "review", "published", "archived"].map((status) => [
        status,
        state.lessons.filter((lesson) => lesson.status === status).length,
      ]),
    );
    [
      ["all", teacherText("All", "すべて")],
      ["draft", `${teacherText("Drafts", "下書き")} (${counts.draft})`],
      ["review", `${teacherText("Ready for review", "確認待ち")} (${counts.review})`],
      ["published", `${teacherText("Published", "公開中")} (${counts.published})`],
      ["archived", `${teacherText("Archived", "非表示")} (${counts.archived})`],
    ].forEach(([value, label]) => {
      const button = makeAction(label, () => {
        state.lessonListView = value;
        renderLessons("lessons");
      });
      button.className = "filter-chip";
      button.setAttribute("aria-pressed", String(state.lessonListView === value));
      controls.append(button);
    });
    const explanation = make("p", { text: state.lessonListView === "archived"
      ? teacherText(
        "Archived lessons are hidden but keep questions and learning records.",
        "非表示のレッスンでも、問題と学習記録は保持されます。",
      )
      : teacherText(
        "Filter by the stage of the publishing job.",
        "公開作業の段階で絞り込めます。",
      ) });
    controls.append(explanation);
    wrap.append(controls);
  }

  if (!filtered.length) {
    wrap.append(make("p", {
      text: mode === "drafts"
        ? teacherText("There are no private drafts waiting for review.", "確認待ちの非公開下書きはありません。")
        : state.lessonListView === "archived"
          ? teacherText("There are no archived lessons.", "アーカイブ中のレッスンはありません。")
          : teacherText("There are no published lessons yet.", "公開中のレッスンはまだありません。"),
    }));
    elements.panel.replaceChildren(wrap);
    return;
  }
  const tableWrap = make("div", { className: "table-scroll" });
  tableWrap.append(lessonRows(filtered));
  wrap.append(tableWrap);
  elements.panel.replaceChildren(wrap);
}

function lessonTitle(lessonId) {
  const lesson = state.lessons.find((item) => item.id === lessonId);
  return (teacherLanguage === "ja" ? lesson?.title_ja || lesson?.title_en : lesson?.title_en)
    || teacherText("Unknown lesson", "不明なレッスン");
}

function profileName(userId) {
  return (
    state.profiles.find((profile) => profile.user_id === userId)?.display_name ||
    teacherText(`Student ${userId.slice(0, 6)}`, `生徒 ${userId.slice(0, 6)}`)
  );
}

function membershipFor(userId) {
  return state.memberships.find((membership) => membership.user_id === userId) || null;
}

function planOverrideFor(userId) {
  return state.planOverrides.find((override) => override.user_id === userId) || null;
}

async function saveLearnerPlanOverride(profile, values, button) {
  const featureFlags = Object.fromEntries(
    Object.entries(values.featureFlags || {}).filter(([, value]) => typeof value === "boolean"),
  );
  const expiresAt = values.expiresAt ? new Date(values.expiresAt) : null;
  if (expiresAt && (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now())) {
    showToast("Override expiry must be in the future.", "error");
    return;
  }
  button.disabled = true;
  const hasOverride = Boolean(values.planTier)
    || Object.keys(featureFlags).length > 0
    || Boolean(values.reason)
    || Boolean(expiresAt);
  const result = hasOverride
    ? await client.from("review_learner_plan_overrides").upsert({
      user_id: profile.user_id,
      plan_tier: values.planTier || null,
      feature_flags: featureFlags,
      reason: values.reason || null,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt?.toISOString() || null,
      updated_by: state.session.user.id,
    }, { onConflict: "user_id" }).select("user_id,plan_tier,feature_flags,reason,starts_at,expires_at,updated_at").single()
    : await client.from("review_learner_plan_overrides").delete().eq("user_id", profile.user_id);
  button.disabled = false;
  if (result.error) {
    showToast(readableError(result.error, "The learner feature override could not be saved."), "error");
    return;
  }
  state.planOverrides = state.planOverrides.filter((item) => item.user_id !== profile.user_id);
  if (hasOverride && result.data) state.planOverrides.push(result.data);
  showToast(
    hasOverride
      ? "Learner plan exception saved. It applies until it expires or is cleared."
      : "Learner override cleared; normal membership rules now apply.",
    "success",
  );
  openLearnerDialog(profile);
}

async function fetchLearnerAuthStatus(profile) {
  const cached = state.learnerAuthStatus[profile.user_id];
  if (cached) return cached;
  if (state.learnerAuthStatusRequests[profile.user_id]) {
    return state.learnerAuthStatusRequests[profile.user_id];
  }
  const teacherId = state.session?.user?.id || null;
  let request;
  request = (async () => {
    let data;
    let error;
    try {
      ({ data, error } = await getTeacherLearnerAuthStatus(profile.user_id));
    } catch (unexpectedError) {
      error = unexpectedError;
    }
    if (teacherId !== state.session?.user?.id || error || !data?.account) return null;
    state.learnerAuthStatus[profile.user_id] = data.account;
    return data.account;
  })().finally(() => {
    if (state.learnerAuthStatusRequests[profile.user_id] === request) {
      delete state.learnerAuthStatusRequests[profile.user_id];
    }
  });
  state.learnerAuthStatusRequests[profile.user_id] = request;
  return request;
}

async function loadLearnerAuthStatus(profile, output) {
  output.textContent = teacherText("Loading secure account status…", "安全なアカウント情報を読み込んでいます…");
  const account = await fetchLearnerAuthStatus(profile);
  if (!account) {
    output.textContent = teacherText(
      `Account registered: Unknown · Last sign-in: Unknown · Profile created: ${formatDate(profile.created_at, true)}. Secure account status could not be loaded.`,
      `アカウント登録日：不明 · 最終ログイン：不明 · プロフィール作成：${formatDate(profile.created_at, true)}。安全なアカウント情報を読み込めませんでした。`,
    );
    return;
  }
  if (!output.isConnected) return;
  output.textContent = teacherText(
    `Account: ${account.status} · Registered: ${formatDate(account.createdAt, true)} · Last sign-in: ${account.lastSignInAt ? formatDate(account.lastSignInAt, true) : "Never"} · Email confirmed: ${account.emailConfirmedAt ? "Yes" : "No"}`,
    `アカウント：${account.status} · 登録：${formatDate(account.createdAt, true)} · 最終ログイン：${account.lastSignInAt ? formatDate(account.lastSignInAt, true) : "なし"} · メール確認：${account.emailConfirmedAt ? "済み" : "未確認"}`,
  );
}

function activeMembershipStatus(membership) {
  if (!membership) return teacherText("Pending", "承認待ち");
  if (membership.status === "active" && new Date(membership.expires_at || 0).getTime() <= Date.now()) {
    return teacherText("Expired", "期限切れ");
  }
  return {
    pending: teacherText("Pending approval", "承認待ち"),
    active: teacherText("Active", "有効"),
    expired: teacherText("Expired", "期限切れ"),
    suspended: teacherText("Paused", "一時停止"),
    cancelled: teacherText("Cancelled", "解約済み"),
  }[membership.status] || membership.status;
}

async function activateMembership(profile, days, scope, plan, button) {
  const duration = Math.max(1, Math.min(730, Number(days || 30)));
  button.disabled = true;
  try {
    const { error } = await client.rpc("review_approve_membership_tiered", {
      learner_id: profile.user_id,
      duration_days: duration,
      membership_scope: scope,
      membership_plan: plan,
    });
    if (error) throw error;
    showToast(teacherText(
      `${profileName(profile.user_id)} now has ${duration} days of ${plan} · ${audienceLabel(scope)} access.`,
      `${profileName(profile.user_id)}に${plan}・${audienceLabel(scope)}の利用権を${duration}日間設定しました。`,
    ), "success");
    await refreshDashboard();
    if (elements.learnerDialog?.open) openLearnerDialog(profile);
  } catch (error) {
    showToast(readableError(error, "Membership could not be activated."), "error");
    button.disabled = false;
  }
}

async function pauseMembership(profile, button) {
  if (!window.confirm(teacherText(
    `Pause access for ${profileName(profile.user_id)}?`,
    `${profileName(profile.user_id)}の利用を一時停止しますか？`,
  ))) return;
  button.disabled = true;
  const { error } = await client.from("review_memberships")
    .update({ status: "suspended" })
    .eq("user_id", profile.user_id);
  if (error) {
    showToast(readableError(error, "Membership could not be paused."), "error");
    button.disabled = false;
    return;
  }
  showToast("Membership paused.", "success");
  await refreshDashboard();
  if (elements.learnerDialog?.open) openLearnerDialog(profile);
}

async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const field = make("textarea");
      field.value = value;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    showToast("Full access code copied.", "success");
  } catch {
    showToast("Copy failed. Select the full code and copy it manually.", "error");
  }
}

function generatedCodeResult() {
  if (!state.lastGeneratedCode?.code) return null;
  const output = make("section", { className: "generated-code" });
  const copy = makeAction("Copy full code", () => copyText(state.lastGeneratedCode.code));
  copy.className = "primary-btn";
  const code = make("code", { text: state.lastGeneratedCode.code });
  code.setAttribute("aria-label", teacherText("Full newly generated access code", "新しく発行された完全なアクセスコード"));
  const text = make("div");
  text.append(
    make("strong", { text: "New full code — copy and send this now" }),
    code,
    make("p", {
      text: teacherText(
        `${state.lastGeneratedCode.label} · ${state.lastGeneratedCode.durationDays} days · ${audienceLabel(state.lastGeneratedCode.accessScope)} · ${planFor(state.lastGeneratedCode.planTier).name}. For security, the history below shows only the last four characters.`,
        `${state.lastGeneratedCode.label} · ${state.lastGeneratedCode.durationDays}日 · ${audienceLabel(state.lastGeneratedCode.accessScope)} · ${planFor(state.lastGeneratedCode.planTier).name}。安全のため、下の履歴には末尾4文字だけを表示します。`,
      ),
    }),
  );
  output.append(text, copy);
  return output;
}

function accessCodeStatus(code) {
  if (!code.enabled) return { key: "disabled", label: teacherText("Disabled", "無効") };
  if (code.valid_until && new Date(code.valid_until).getTime() <= Date.now()) {
    return { key: "expired", label: teacherText("Expired", "期限切れ") };
  }
  if (Number(code.use_count || 0) >= Number(code.max_uses || 0)) {
    return { key: "used", label: teacherText("Used up", "使用上限到達") };
  }
  if (Number(code.use_count || 0) > 0) {
    return { key: "partial", label: teacherText("Partly used", "一部使用") };
  }
  return { key: "unused", label: teacherText("Unused", "未使用") };
}

function accessCodeEditor(code) {
  const details = make("details", { className: "code-history-item" });
  const status = accessCodeStatus(code);
  const summary = make("summary");
  const title = make("span");
  title.append(
    make("strong", { text: code.label }),
    make("small", {
      text: teacherText(
        `••••${code.code_last4} · ${planFor(code.plan_tier).name} · ${code.use_count}/${code.max_uses} uses`,
        `••••${code.code_last4} · ${planFor(code.plan_tier).name} · ${code.use_count}/${code.max_uses}回使用`,
      ),
    }),
  );
  summary.append(title, make("b", { className: `code-status code-status-${status.key}`, text: status.label }));

  const fields = make("div", { className: "code-edit-fields" });
  const label = make("input");
  label.value = code.label || "";
  label.maxLength = 100;
  label.setAttribute("aria-label", teacherText("Access code label", "アクセスコードのプラン名"));
  const days = make("input");
  days.type = "number";
  days.min = "1";
  days.max = "730";
  days.value = String(code.duration_days || 30);
  days.setAttribute("aria-label", teacherText("Access duration in days", "利用日数"));
  const scope = make("select");
  [["general", "General"], ["takiwaki", "Takiwaki"], ["both", "Both"]].forEach(([value, textValue]) => {
    const option = make("option", { text: textValue });
    option.value = value;
    scope.append(option);
  });
  scope.value = code.access_scope || "general";
  scope.setAttribute("aria-label", teacherText("Access scope", "公開範囲"));
  const plan = make("select");
  [["standard", "Standard"], ["premium", "Premium"], ["premium_plus", "Premium+"]].forEach(([value, textValue]) => {
    const option = make("option", { text: textValue });
    option.value = value;
    plan.append(option);
  });
  plan.value = code.plan_tier || "standard";
  plan.setAttribute("aria-label", teacherText("Membership plan", "会員プラン"));
  const uses = make("input");
  uses.type = "number";
  uses.min = String(Math.max(1, Number(code.use_count || 0)));
  uses.max = "1000";
  uses.value = String(code.max_uses || 1);
  uses.setAttribute("aria-label", teacherText("Maximum uses", "最大使用回数"));
  const expiry = make("input");
  expiry.type = "datetime-local";
  expiry.value = localDateTimeValue(code.valid_until);
  expiry.setAttribute("aria-label", teacherText("Code expiry; leave blank for no expiry", "コードの有効期限（無期限の場合は空欄）"));
  const enabledLabel = make("label", { className: "code-enabled-field" });
  const enabled = make("input");
  enabled.type = "checkbox";
  enabled.checked = Boolean(code.enabled);
  enabledLabel.append(enabled, document.createTextNode(teacherText(" Enabled", " 有効")));
  fields.append(label, days, scope, plan, uses, expiry, enabledLabel);

  const metadata = make("p", {
    className: "code-history-meta",
    text: teacherText(
      `Issued ${formatDate(code.created_at, true)} · Expires ${code.valid_until ? formatDate(code.valid_until, true) : "No fixed expiry"}. The full code is never stored and cannot be displayed again.`,
      `発行：${formatDate(code.created_at, true)} · 有効期限：${code.valid_until ? formatDate(code.valid_until, true) : "なし"}。完全なコードは保存されないため、再表示できません。`,
    ),
  });
  const actions = make("div", { className: "code-history-actions" });
  const save = makeAction("Save changes", async () => {
    const durationDays = Math.max(1, Math.min(730, Number(days.value || 30)));
    const maxUses = Math.max(Number(code.use_count || 0), Math.min(1000, Number(uses.value || 1)));
    if (!label.value.trim()) {
      showToast("Enter a plan label before saving.", "error");
      return;
    }
    save.disabled = true;
    const { error } = await updateTeacherAccessCode({
      codeId: code.id,
      label: label.value.trim(),
      durationDays,
      accessScope: scope.value,
      planTier: plan.value,
      maxUses,
      validUntil: isoDateTimeValue(expiry.value),
      enabled: enabled.checked,
    });
    if (error) {
      showToast(readableError(error, "The access code could not be updated."), "error");
      save.disabled = false;
      return;
    }
    showToast("Access code settings updated.", "success");
    await refreshDashboard();
  });
  const reissue = makeAction("Reissue", async () => {
    if (!window.confirm(teacherText(
      "Reissue this code? The old code will be disabled and a new full code will be shown once.",
      "このコードを再発行しますか？古いコードは無効になり、新しい完全コードが一度だけ表示されます。",
    ))) return;
    reissue.disabled = true;
    const { data, error } = await reissueTeacherAccessCode(code.id);
    if (error || !data?.accessCode) {
      showToast(readableError(error, "The access code could not be reissued."), "error");
      reissue.disabled = false;
      return;
    }
    state.lastGeneratedCode = {
      code: data.accessCode,
      label: teacherText(`${code.label} (reissued)`, `${code.label}（再発行）`),
      durationDays: code.duration_days,
      accessScope: code.access_scope,
      planTier: code.plan_tier || "standard",
    };
    showToast("New full code created. Copy it now; the old code is disabled.", "success");
    await refreshDashboard();
  });
  if (code.enabled === false) {
    reissue.disabled = true;
    reissue.title = teacherText("Only an enabled code can be reissued. Create a new code instead.", "再発行できるのは有効なコードだけです。新しいコードを作成してください。");
  }
  const remove = makeAction(Number(code.use_count || 0) > 0 ? "Disable & preserve history" : "Delete unused code", async () => {
    const prompt = Number(code.use_count || 0) > 0
      ? teacherText("This code has redemption history, so it will be disabled rather than erased. Continue?", "このコードには利用履歴があるため、削除せず無効化します。続けますか？")
      : teacherText("Permanently delete this unused code? This cannot be undone.", "この未使用コードを完全に削除しますか？元に戻せません。");
    if (!window.confirm(prompt)) return;
    remove.disabled = true;
    const { data, error } = await deleteTeacherAccessCode(code.id);
    if (error) {
      showToast(readableError(error, "The access code could not be removed."), "error");
      remove.disabled = false;
      return;
    }
    showToast(data?.disposition === "disabled"
      ? teacherText("Used code disabled; redemption history preserved.", "使用済みコードを無効化し、利用履歴は保持しました。")
      : teacherText("Unused code deleted.", "未使用コードを削除しました。"), "success");
    await refreshDashboard();
  });
  remove.classList.add("danger-action");
  actions.append(save, reissue, remove);
  details.append(summary, metadata, fields, actions);
  return details;
}

function renderAccessCodeManager() {
  const section = make("section", { className: "membership-admin" });
  const heading = make("div", { className: "teacher-panel-heading" });
  heading.append(
    make("div", { text: "Access codes / アクセスコード" }),
    make("p", { text: "Generate a code after bank-transfer confirmation, or use manual approval below. Set any period from 1 to 730 days (30 = 1 month, 180 = 6 months)." }),
  );
  const form = make("form", { className: "code-create-form" });
  const label = make("input");
  label.required = true;
  label.placeholder = teacherText("Plan label (e.g. July 6-month plan)", "プラン名（例：7月・6か月プラン）");
  const days = make("input");
  days.type = "number";
  days.min = "1";
  days.max = "730";
  days.value = "30";
  days.placeholder = teacherText("Days", "日数");
  days.title = teacherText("Access period in days (1–730). Examples: 30 = one month, 180 = six months.", "利用日数（1〜730日）。例：30日＝1か月、180日＝6か月。");
  days.setAttribute("aria-label", teacherText("Access duration in days", "利用日数"));
  const scope = make("select");
  [["general", "General"], ["takiwaki", "Takiwaki"], ["both", "Both"]].forEach(([value, textValue]) => {
    const option = make("option", { text: textValue });
    option.value = value;
    scope.append(option);
  });
  const plan = make("select");
  [["standard", "Standard"], ["premium", "Premium"], ["premium_plus", "Premium+"]].forEach(([value, textValue]) => {
    const option = make("option", { text: textValue });
    option.value = value;
    plan.append(option);
  });
  plan.setAttribute("aria-label", teacherText("Membership plan", "会員プラン"));
  const uses = make("input");
  uses.type = "number";
  uses.min = "1";
  uses.max = "1000";
  uses.value = "1";
  uses.setAttribute("aria-label", teacherText("Maximum uses", "最大使用回数"));
  const expiry = make("input");
  expiry.type = "datetime-local";
  expiry.setAttribute("aria-label", teacherText("Code expiry; leave blank for no expiry", "コードの有効期限（無期限の場合は空欄）"));
  const create = makeAction("Generate secure code", async () => {
    if (!label.value.trim()) return;
    const durationDays = Math.max(1, Math.min(730, Number(days.value || 30)));
    days.value = String(durationDays);
    create.disabled = true;
    try {
      const { data, error } = await createTeacherAccessCode({
        label: label.value.trim(),
        durationDays,
        accessScope: scope.value,
        planTier: plan.value,
        maxUses: Number(uses.value),
        validUntil: isoDateTimeValue(expiry.value),
      });
      if (error) throw error;
      const rawCode = data?.accessCode;
      if (!rawCode) throw new Error("The service did not return the new full code.");
      state.lastGeneratedCode = {
        code: rawCode,
        label: label.value.trim(),
        durationDays,
        accessScope: scope.value,
        planTier: plan.value,
      };
      showToast("Access code generated.", "success");
      await refreshDashboard();
    } catch (error) {
      showToast(readableError(error, "The access code could not be generated."), "error");
      create.disabled = false;
    }
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  form.append(label, days, scope, plan, uses, expiry, create);
  section.append(heading, form);
  const generated = generatedCodeResult();
  if (generated) section.append(generated);
  if (state.accessCodes.length) {
    section.append(make("p", {
      className: "code-history-note",
      text: "Code history — masked for security. “••••1234” is only the last four characters and cannot be used to unlock an account.",
    }));
    const codeList = make("div", { className: "code-list" });
    state.accessCodes.forEach((code) => codeList.append(accessCodeEditor(code)));
    section.append(codeList);
  }
  return section;
}

function assignmentFor(studentId, lessonId) {
  return state.assignments.find(
    (assignment) => assignment.student_id === studentId && assignment.lesson_id === lessonId,
  ) || null;
}

function accessOverrideFor(studentId, lessonId) {
  return state.accessOverrides.find(
    (override) => override.student_id === studentId && override.lesson_id === lessonId,
  ) || null;
}

async function setLessonAssignment(profile, lesson, assigned, control) {
  control.disabled = true;
  const existing = assignmentFor(profile.user_id, lesson.id);
  let result;
  if (assigned) {
    result = await client.from("review_assignments").upsert({
      lesson_id: lesson.id,
      student_id: profile.user_id,
      assigned_by: state.session.user.id,
      status: "assigned",
    }, { onConflict: "lesson_id,student_id" }).select("id,lesson_id,student_id,assigned_by,due_at,status,note,visible_to_student,opens_at,closes_at,required_plan,teacher_review_required,created_at").single();
  } else if (existing) {
    result = await client.from("review_assignments")
      .update({ status: "dismissed" })
      .eq("id", existing.id)
      .select("id,lesson_id,student_id,assigned_by,due_at,status,note,visible_to_student,opens_at,closes_at,required_plan,teacher_review_required,created_at")
      .single();
  } else {
    result = { data: null, error: null };
  }
  control.disabled = false;
  if (result.error) {
    control.checked = !assigned;
    showToast(readableError(result.error, "The lesson recommendation could not be changed."), "error");
    return;
  }
  if (result.data) {
    state.assignments = state.assignments.filter((item) => item.id !== result.data.id);
    state.assignments.push(result.data);
  }
  showToast(assigned ? "Lesson added to this learner’s plan." : "Lesson removed from this learner’s plan.", "success");
  renderStudents();
  openLearnerDialog(profile);
}

async function saveLessonAssignmentSettings(profile, lesson, settings, button) {
  const opensAt = isoDateTimeValue(settings.opensAt);
  const closesAt = isoDateTimeValue(settings.closesAt);
  if (opensAt && closesAt && new Date(closesAt).getTime() <= new Date(opensAt).getTime()) {
    showToast("The closing date must be later than the opening date.", "error");
    return;
  }
  button.disabled = true;
  const { data, error } = await client.from("review_assignments").upsert({
    lesson_id: lesson.id,
    student_id: profile.user_id,
    assigned_by: state.session.user.id,
    status: "assigned",
    visible_to_student: settings.visible,
    opens_at: opensAt,
    closes_at: closesAt,
    required_plan: settings.requiredPlan,
    teacher_review_required: settings.teacherReviewRequired,
  }, { onConflict: "lesson_id,student_id" })
    .select("id,lesson_id,student_id,assigned_by,due_at,status,note,visible_to_student,opens_at,closes_at,required_plan,teacher_review_required,created_at")
    .single();
  if (error) {
    showToast(readableError(error, "The assignment settings could not be saved."), "error");
    button.disabled = false;
    return;
  }
  state.assignments = state.assignments.filter((item) => item.id !== data.id);
  state.assignments.push(data);
  showToast("Assignment visibility, dates and plan requirement saved.", "success");
  openLearnerDialog(profile);
}

async function applyBulkLessonAction(profile, lessonIds, action, button) {
  if (!lessonIds.length) {
    showToast("Select at least one lesson first.", "error");
    return;
  }
  button.disabled = true;
  let result = { error: null };
  if (action === "recommend") {
    result = await client.from("review_assignments").upsert(
      lessonIds.map((lessonId) => ({
        lesson_id: lessonId,
        student_id: profile.user_id,
        assigned_by: state.session.user.id,
        status: "assigned",
      })),
      { onConflict: "lesson_id,student_id" },
    );
  } else if (action === "remove") {
    result = await client.from("review_assignments")
      .update({ status: "dismissed" })
      .eq("student_id", profile.user_id)
      .in("lesson_id", lessonIds);
  } else if (action === "inherit") {
    result = await client.from("review_lesson_access_overrides")
      .delete()
      .eq("student_id", profile.user_id)
      .in("lesson_id", lessonIds);
  } else {
    result = await client.from("review_lesson_access_overrides").upsert(
      lessonIds.map((lessonId) => ({
        lesson_id: lessonId,
        student_id: profile.user_id,
        access_mode: action,
        updated_by: state.session.user.id,
      })),
      { onConflict: "lesson_id,student_id" },
    );
  }
  if (result.error) {
    showToast(readableError(result.error, "The selected lessons could not be updated."), "error");
    button.disabled = false;
    return;
  }
  showToast(teacherText(
    `${lessonIds.length} lesson(s) updated.`,
    `${lessonIds.length}件のレッスンを更新しました。`,
  ), "success");
  await refreshDashboard();
  if (elements.learnerDialog?.open) openLearnerDialog(profile);
}

async function setLessonLock(profile, lesson, accessMode, control) {
  if (!state.teacherControlsReady) {
    showToast("Apply the Teacher Controls database update before using lesson locks.", "error");
    control.value = accessOverrideFor(profile.user_id, lesson.id)?.access_mode || "inherit";
    return;
  }
  control.disabled = true;
  let result;
  if (accessMode === "inherit") {
    result = await client.from("review_lesson_access_overrides")
      .delete()
      .eq("lesson_id", lesson.id)
      .eq("student_id", profile.user_id);
  } else {
    result = await client.from("review_lesson_access_overrides").upsert({
      lesson_id: lesson.id,
      student_id: profile.user_id,
      access_mode: accessMode,
      updated_by: state.session.user.id,
    }, { onConflict: "lesson_id,student_id" });
  }
  control.disabled = false;
  if (result.error) {
    control.value = accessOverrideFor(profile.user_id, lesson.id)?.access_mode || "inherit";
    showToast(readableError(result.error, "The learner-specific lesson access could not be changed."), "error");
    return;
  }
  state.accessOverrides = state.accessOverrides.filter(
    (item) => !(item.lesson_id === lesson.id && item.student_id === profile.user_id),
  );
  if (accessMode !== "inherit") {
    state.accessOverrides.push({
      lesson_id: lesson.id,
      student_id: profile.user_id,
      access_mode: accessMode,
      updated_at: new Date().toISOString(),
    });
  }
  showToast(
    accessMode === "block"
      ? teacherText("This lesson is now locked for the learner.", "この生徒には、このレッスンを非表示にしました。")
      : accessMode === "allow"
        ? teacherText("Teacher exception saved: this learner can open the lesson even when their plan would normally lock it.", "この生徒がプランに関係なくレッスンを開けるようにしました。")
        : teacherText("Normal membership and plan rules restored.", "通常の会員プラン設定に戻しました。"),
    "success",
  );
  renderStudents();
  openLearnerDialog(profile);
}

async function sendPasswordReset(profile, button) {
  const email = String(profile.contact_email || "").trim();
  if (!email) {
    showToast("No account email is recorded for this learner.", "error");
    return;
  }
  if (!window.confirm(teacherText(
    `Send a secure password-reset email to ${email}?`,
    `${email}へ安全なパスワード再設定メールを送信しますか？`,
  ))) return;
  button.disabled = true;
  const redirectTo = new URL("/", window.location.origin).href;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  button.disabled = false;
  if (error) {
    showToast(readableError(error, "The password-reset email could not be sent."), "error");
    return;
  }
  showToast("Password-reset email sent. Passwords are never visible to the teacher.", "success");
}

function learnerActivity(profile) {
  const events = [];
  state.attempts.filter((item) => item.user_id === profile.user_id).forEach((item) => {
    events.push({
      at: item.completed_at,
      title: teacherText(`Completed ${lessonTitle(item.lesson_id)}`, `${lessonTitle(item.lesson_id)}を完了`),
      detail: item.max_score > 0
        ? teacherText(
          `First score ${item.first_score}/${item.max_score} · ${item.wrong_count} wrong`,
          `初回スコア ${item.first_score}/${item.max_score} · 誤答 ${item.wrong_count}件`,
        )
        : teacherText("Practice recorded", "練習記録あり"),
    });
  });
  state.speaking.filter((item) => item.user_id === profile.user_id).forEach((item) => {
    events.push({
      at: item.practiced_at,
      title: teacherText(`Speaking · ${lessonTitle(item.lesson_id)}`, `スピーキング · ${lessonTitle(item.lesson_id)}`),
      detail: item.transcript
        ? teacherText(`Heard: “${item.transcript}”`, `認識結果：「${item.transcript}」`)
        : teacherText("Speaking practice recorded", "スピーキング練習を記録"),
    });
  });
  state.assignments.filter((item) => item.student_id === profile.user_id).forEach((item) => {
    events.push({
      at: item.created_at,
      title: teacherText(
        `${item.status === "dismissed" ? "Removed" : "Assigned"} · ${lessonTitle(item.lesson_id)}`,
        `${item.status === "dismissed" ? "割り当て解除" : "割り当て"} · ${lessonTitle(item.lesson_id)}`,
      ),
      detail: item.status === "completed"
        ? teacherText("Assignment completed", "課題完了")
        : teacherText(`Assignment status: ${item.status}`, `課題の状態：${item.status}`),
    });
  });
  teacherVisibleSubmissions().filter((item) => item.user_id === profile.user_id).forEach((item) => {
    const task = state.premiumTasks.find((candidate) => candidate.id === item.task_id);
    events.push({
      at: item.submitted_at || item.updated_at || item.created_at,
      title: teacherText(
        `Premium ${task?.task_type || "task"} · ${task?.title_en || "Submission"}`,
        `Premium ${task?.task_type === "speaking" ? "スピーキング" : task?.task_type === "essay" ? "英作文" : "課題"} · ${task?.title_ja || task?.title_en || "提出"}`,
      ),
      detail: teacherText(`Submission status: ${item.status}`, `提出状態：${item.status}`),
    });
  });
  return events
    .filter((item) => item.at)
    .sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime())
    .slice(0, 15);
}

function learnerLessonControls(profile) {
  const section = make("section", { className: "learner-control-section" });
  section.append(
    make("h3", { text: teacherText("Lesson plan & visibility", "レッスン割り当て・表示管理") }),
    make("p", {
      text: teacherText(
        "Recommendations add lessons to the learner’s plan. Assignment settings control dates and the required plan. Visibility exceptions affect only this learner.",
        "おすすめへの追加、公開期間、必要プランを設定できます。個別の表示設定は、この生徒だけに適用されます。",
      ),
    }),
  );
  if (!state.teacherControlsReady) {
    section.append(make("p", {
      className: "control-warning",
      text: teacherText(
        "Lesson visibility exceptions become available after the Teacher Controls database update. Assignments already work.",
        "レッスンの個別表示設定は、Teacher Controlsのデータベース更新後に利用できます。割り当て機能は現在も使用できます。",
      ),
    }));
  }
  const published = state.lessons.filter((lesson) => lesson.status === "published");
  if (!published.length) {
    section.append(make("p", { text: "Publish a lesson before assigning it." }));
    return section;
  }
  const selectedLessonIds = new Set();
  const bulk = make("div", { className: "lesson-bulk-controls" });
  const selectAllLabel = make("label");
  const selectAll = make("input");
  selectAll.type = "checkbox";
  selectAllLabel.append(selectAll, document.createTextNode(teacherText(" Select all", " 全選択")));
  const bulkAction = make("select");
  [
    ["recommend", teacherText("Recommend selected", "選択したレッスンをおすすめに追加")],
    ["remove", teacherText("Remove recommendations", "選択したおすすめを解除")],
    ["allow", teacherText("Allow selected lessons", "選択したレッスンを利用可能にする")],
    ["block", teacherText("Hide selected lessons", "選択したレッスンを非表示にする")],
    ["inherit", teacherText("Follow plan for selected", "選択したレッスンをプラン設定に戻す")],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    bulkAction.append(option);
  });
  const applyBulk = makeAction("Apply to selected", () => (
    applyBulkLessonAction(profile, [...selectedLessonIds], bulkAction.value, applyBulk)
  ));
  bulk.append(selectAllLabel, bulkAction, applyBulk);
  section.append(bulk);

  const selectionBoxes = [];
  selectAll.addEventListener("change", () => {
    selectionBoxes.forEach(({ id, checkbox }) => {
      checkbox.checked = selectAll.checked;
      if (selectAll.checked) selectedLessonIds.add(id);
      else selectedLessonIds.delete(id);
    });
  });

  const { table, tbody } = makeTable(["Select", "Lesson", "Recommend", "Access exception", "Assignment settings", "Practice"]);
  for (const lesson of published) {
    const assignment = assignmentFor(profile.user_id, lesson.id);
    const selected = make("input");
    selected.type = "checkbox";
    selected.setAttribute("aria-label", teacherText(
      `Select ${lesson.title_en} for bulk action`,
      `${lesson.title_ja || lesson.title_en}を一括操作の対象にする`,
    ));
    selected.addEventListener("change", () => {
      if (selected.checked) selectedLessonIds.add(lesson.id);
      else selectedLessonIds.delete(lesson.id);
      selectAll.checked = selectedLessonIds.size === published.length;
    });
    selectionBoxes.push({ id: lesson.id, checkbox: selected });
    const checkbox = make("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(assignment && assignment.status !== "dismissed");
    checkbox.setAttribute("aria-label", teacherText(
      `Recommend ${lesson.title_en}`,
      `${lesson.title_ja || lesson.title_en}をおすすめにする`,
    ));
    checkbox.addEventListener("change", () => setLessonAssignment(profile, lesson, checkbox.checked, checkbox));

    const visibility = make("select");
    [
      ["inherit", "Follow plan"],
      ["allow", "Allow this lesson"],
      ["block", "Hide this lesson"],
    ].forEach(([value, label]) => {
      const option = make("option", { text: label });
      option.value = value;
      visibility.append(option);
    });
    visibility.value = accessOverrideFor(profile.user_id, lesson.id)?.access_mode || "inherit";
    visibility.disabled = !state.teacherControlsReady;
    visibility.setAttribute("aria-label", teacherText(
      `Visibility of ${lesson.title_en}`,
      `${lesson.title_ja || lesson.title_en}の表示設定`,
    ));
    visibility.addEventListener("change", () => setLessonLock(profile, lesson, visibility.value, visibility));

    const assignmentSettings = make("details", { className: "assignment-settings" });
    assignmentSettings.append(make("summary", { text: assignment && assignment.status !== "dismissed" ? "Configure" : "Create & configure" }));
    const assignmentFields = make("div");
    const opens = make("input");
    opens.type = "datetime-local";
    opens.value = localDateTimeValue(assignment?.opens_at);
    opens.setAttribute("aria-label", teacherText(
      `Open ${lesson.title_en} assignment from`,
      `${lesson.title_ja || lesson.title_en}の公開開始日時`,
    ));
    const closes = make("input");
    closes.type = "datetime-local";
    closes.value = localDateTimeValue(assignment?.closes_at);
    closes.setAttribute("aria-label", teacherText(
      `Close ${lesson.title_en} assignment at`,
      `${lesson.title_ja || lesson.title_en}の公開終了日時`,
    ));
    const requiredPlan = make("select");
    [["standard", "Standard or above"], ["premium", "Premium or Premium+"], ["premium_plus", "Premium+ only"]].forEach(([value, label]) => {
      const option = make("option", { text: label });
      option.value = value;
      requiredPlan.append(option);
    });
    requiredPlan.value = assignment?.required_plan || "standard";
    requiredPlan.setAttribute("aria-label", teacherText(
      `Plan requirement for ${lesson.title_en}`,
      `${lesson.title_ja || lesson.title_en}の必要プラン`,
    ));
    const visibleLabel = make("label");
    const visible = make("input");
    visible.type = "checkbox";
    visible.checked = assignment?.visible_to_student !== false;
    visibleLabel.append(visible, document.createTextNode(teacherText(" Show assignment", " 課題を表示")));
    const reviewLabel = make("label");
    const teacherReview = make("input");
    teacherReview.type = "checkbox";
    teacherReview.checked = Boolean(assignment?.teacher_review_required);
    reviewLabel.append(teacherReview, document.createTextNode(teacherText(" Teacher review", " 先生の確認あり")));
    const saveSettings = makeAction("Save settings", () => saveLessonAssignmentSettings(profile, lesson, {
      opensAt: opens.value,
      closesAt: closes.value,
      requiredPlan: requiredPlan.value,
      visible: visible.checked,
      teacherReviewRequired: teacherReview.checked,
    }, saveSettings));
    assignmentFields.append(
      make("small", { text: teacherText("Opens", "公開開始") }), opens,
      make("small", { text: teacherText("Closes", "公開終了") }), closes,
      requiredPlan, visibleLabel, reviewLabel, saveSettings,
    );
    assignmentSettings.append(assignmentFields);

    const attempts = state.attempts.filter(
      (attempt) => attempt.user_id === profile.user_id && attempt.lesson_id === lesson.id,
    );
    const best = attempts.reduce((maximum, attempt) => {
      const value = Number(attempt.max_score || 0) > 0
        ? Number(attempt.first_score || 0) / Number(attempt.max_score)
        : 0;
      return Math.max(maximum, value);
    }, 0);
    const row = make("tr");
    const selectedCell = make("td");
    selectedCell.append(selected);
    const lessonCell = make("td");
    lessonCell.append(
      make("strong", { text: teacherLanguage === "ja" ? lesson.title_ja || lesson.title_en : lesson.title_en }),
      make("br"),
      make("small", { text: formatDate(lesson.lesson_date) }),
    );
    const recommendCell = make("td");
    recommendCell.append(checkbox);
    row.append(
      selectedCell,
      lessonCell,
      recommendCell,
      make("td"),
      make("td"),
      make("td", { text: attempts.length
        ? teacherText(`${attempts.length} session(s) · best ${Math.round(best * 100)}%`, `${attempts.length}回 · 最高 ${Math.round(best * 100)}%`)
        : teacherText("Not practised", "学習記録なし") }),
    );
    row.children[3].append(visibility);
    row.children[4].append(assignmentSettings);
    tbody.append(row);
  }
  const tableWrap = make("div", { className: "table-scroll" });
  tableWrap.append(table);
  section.append(tableWrap);
  return section;
}

function learnerFeatureControls(profile) {
  const current = planOverrideFor(profile.user_id);
  const section = make("section", { className: "learner-control-section" });
  section.append(
    make("h3", { text: teacherText("Plan & feature exceptions", "プラン・機能の例外設定") }),
    make("p", {
      text: teacherText(
        "Keep the plan default unless this learner needs a temporary exception. Feature changes apply until cleared or expired.",
        "通常はプラン標準のままにしてください。一時的な例外が必要な場合だけ変更し、解除または期限切れまで適用されます。",
      ),
    }),
  );

  const plan = make("select");
  [
    ["", "Use membership plan"],
    ["standard", "Standard"],
    ["premium", "Premium"],
    ["premium_plus", "Premium+"],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    plan.append(option);
  });
  plan.value = current?.plan_tier || "";
  plan.setAttribute("aria-label", teacherText("Temporary learner plan exception", "生徒の一時的なプラン例外設定"));

  const featureFields = {};
  const features = make("div", { className: "learner-feature-flags" });
  [
    ["premium_image_missions", "Premium visual missions"],
    ["speaking_submission", "Speaking submissions"],
    ["essay_submission", "Essay submissions"],
    ["teacher_review", "Teacher review"],
    ["live_coaching", "Live coaching"],
    ["monthly_progress_note", "Monthly progress note"],
  ].forEach(([key, label]) => {
    const wrapper = make("label");
    wrapper.append(make("span", { text: label }));
    const select = make("select");
    [["", "Use plan default"], ["true", "Enable"], ["false", "Disable"]].forEach(([value, text]) => {
      const option = make("option", { text });
      option.value = value;
      select.append(option);
    });
    const saved = current?.feature_flags?.[key];
    select.value = typeof saved === "boolean" ? String(saved) : "";
    select.setAttribute("aria-label", teacherText(`${label} exception`, `${localizeTeacherText(label)}の例外設定`));
    featureFields[key] = select;
    wrapper.append(select);
    features.append(wrapper);
  });

  const reason = make("input");
  reason.maxLength = 500;
  reason.value = current?.reason || "";
  reason.placeholder = teacherText("Reason (optional)", "理由（任意）");
  reason.setAttribute("aria-label", teacherText("Override reason", "例外設定の理由"));
  const expiry = make("input");
  expiry.type = "datetime-local";
  expiry.value = localDateTimeValue(current?.expires_at);
  expiry.setAttribute("aria-label", teacherText("Override expiry", "例外設定の終了日時"));
  const save = makeAction("Save override", () => saveLearnerPlanOverride(profile, {
    planTier: plan.value,
    featureFlags: Object.fromEntries(Object.entries(featureFields).map(([key, select]) => [
      key,
      select.value === "" ? null : select.value === "true",
    ])),
    reason: reason.value.trim(),
    expiresAt: expiry.value,
  }, save));
  const clear = makeAction("Clear override", () => {
    if (!current || window.confirm(teacherText(
      "Clear this learner's plan and feature exceptions?",
      "この生徒のプラン・機能の例外設定を解除しますか？",
    ))) {
      saveLearnerPlanOverride(profile, { planTier: "", featureFlags: {}, reason: "", expiresAt: "" }, clear);
    }
  });
  clear.className = "secondary-btn";
  const actions = make("div", { className: "learner-access-actions" });
  actions.append(plan, reason, expiry, save, clear);
  section.append(features, actions);
  return section;
}

function structuredHubProgressSummary(profile) {
  const progress = state.structuredHub.progress
    .filter((item) => item.student_id === profile.user_id);
  const started = progress.filter((item) => item.status !== "not_started");
  const favorites = state.structuredHub.favorites
    .filter((item) => item.student_id === profile.user_id);
  const due = progress.filter((item) => (
    item.next_review_at
    && new Date(item.next_review_at).getTime() <= Date.now()
    && item.status !== "mastered"
  ));
  const reviewed = progress.filter((item) => ["reviewed", "mastered"].includes(item.status));
  const mastered = progress.filter((item) => item.status === "mastered");
  const repetitions = progress.reduce((sum, item) => sum + Number(item.review_count || 0), 0);
  const recent = [...started].sort((left, right) => (
    new Date(right.last_reviewed_at || right.updated_at || 0).getTime()
    - new Date(left.last_reviewed_at || left.updated_at || 0).getTime()
  ))[0];
  const item = recent
    ? state.structuredHub.items.find((entry) => entry.id === recent.item_id)
    : null;

  const wrap = make("section", { className: "structured-hub-teacher-progress" });
  wrap.append(make("h4", { text: teacherText("Curriculum activity", "教材の学習状況") }));
  const metrics = make("div", { className: "structured-hub-teacher-metrics" });
  [
    [teacherText("Started", "学習開始"), started.length],
    [teacherText("Reviewed / mastered", "復習済み・習得"), reviewed.length],
    [teacherText("Mastered", "習得済み"), mastered.length],
    [teacherText("Review repetitions", "復習回数"), repetitions],
    [teacherText("Due now", "復習期限"), due.length],
    [teacherText("Favorites", "お気に入り"), favorites.length],
  ].forEach(([label, value]) => {
    const card = make("article");
    card.append(make("span", { text: label }), make("strong", { text: value }));
    metrics.append(card);
  });
  wrap.append(metrics);
  wrap.append(make("p", {
    text: recent
      ? teacherText(
        `Latest curriculum activity: ${item?.title_en || recent.item_id} · ${formatDate(recent.last_reviewed_at || recent.updated_at, true)}`,
        `最新の教材学習：${item?.title_ja || item?.title_en || recent.item_id} · ${formatDate(recent.last_reviewed_at || recent.updated_at, true)}`,
      )
      : teacherText(
        "No structured curriculum activity has been recorded yet.",
        "教材の学習記録はまだありません。",
      ),
  }));
  return wrap;
}

function structuredHubItemAccess(profile, settings) {
  const details = make("details", { className: "structured-hub-teacher-item-access" });
  details.append(make("summary", {
    text: teacherText(
      "Individual curriculum item access",
      "教材アイテムごとの公開設定",
    ),
  }));
  const explanation = make("p", {
    text: teacherText(
      "Category switches and published status always apply. Allow can bypass this learner's level or plan limit; block hides the item.",
      "カテゴリ表示と教材の公開状態は常に適用されます。「許可」はこの生徒のレベル・プラン制限を越えて公開でき、「非表示」は教材を隠します。",
    ),
  });
  const controls = make("div", { className: "structured-hub-teacher-item-filters" });
  const category = make("select");
  category.setAttribute("aria-label", teacherText("Curriculum category", "教材カテゴリ"));
  STRUCTURED_HUB_CATEGORIES.forEach(([value, en, ja]) => {
    const option = make("option", { text: teacherText(en, ja) });
    option.value = value;
    category.append(option);
  });
  const level = make("select");
  level.setAttribute("aria-label", teacherText("Curriculum level", "教材レベル"));
  for (let value = 1; value <= 32; value += 1) {
    const option = make("option", { text: teacherText(`Level ${value}`, `レベル ${value}`) });
    option.value = String(value);
    level.append(option);
  }
  level.value = String(settings.allowed_level_min || 1);
  const result = make("div", { className: "structured-hub-teacher-item-list" });
  const status = make("p", { className: "form-status" });
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  controls.append(category, level);
  details.append(explanation, controls, result, status);

  const renderItems = () => {
    const items = state.structuredHub.items.filter((item) => (
      item.category === category.value && Number(item.level) === Number(level.value)
    ));
    if (!items.length) {
      result.replaceChildren(make("p", {
        text: teacherText(
          "No seeded items are available for this category and level.",
          "このカテゴリ・レベルの教材はまだ登録されていません。",
        ),
      }));
      return;
    }
    const { table, tbody } = makeTable([
      teacherText("Item", "教材"),
      teacherText("Plan", "プラン"),
      teacherText("Published", "公開"),
      teacherText("Learner access", "生徒の利用設定"),
    ]);
    items.forEach((item) => {
      const saved = state.structuredHub.access.find((entry) => (
        entry.student_id === profile.user_id && entry.item_id === item.id
      ));
      let currentMode = saved?.access_mode || "inherit";
      const select = make("select");
      [
        ["inherit", teacherText("Follow level, category and plan", "レベル・カテゴリ・プラン設定に従う")],
        ["allow", teacherText("Allow within visible category", "表示中カテゴリ内で許可")],
        ["block", teacherText("Block this item", "この教材を非表示")],
      ].forEach(([value, label]) => {
        const option = make("option", { text: label });
        option.value = value;
        select.append(option);
      });
      select.value = currentMode;
      select.setAttribute("aria-label", teacherText(
        `Access to ${item.title_en}`,
        `${item.title_ja || item.title_en}の利用設定`,
      ));
      select.addEventListener("change", async () => {
        const previous = currentMode;
        const mode = select.value;
        select.disabled = true;
        status.textContent = teacherText("Saving item access…", "教材の利用設定を保存しています…");
        let saveResult;
        try {
          saveResult = await saveTeacherCurriculumAccess(profile.user_id, item.id, mode);
        } catch (error) {
          saveResult = { data: null, reason: "unexpected-error", error };
        }
        select.disabled = false;
        if (saveResult.error || saveResult.reason) {
          select.value = previous;
          status.textContent = readableError(
            saveResult.error,
            teacherText(
              "This curriculum access change could not be saved.",
              "教材の利用設定を保存できませんでした。",
            ),
          );
          return;
        }
        state.structuredHub.access = state.structuredHub.access.filter((entry) => !(
          entry.student_id === profile.user_id && entry.item_id === item.id
        ));
        if (mode !== "inherit") state.structuredHub.access.push(saveResult.data);
        currentMode = mode;
        status.textContent = teacherText(
          `Saved access for ${item.title_en}.`,
          `${item.title_ja || item.title_en}の利用設定を保存しました。`,
        );
      });

      const title = make("td");
      title.append(
        make("strong", { text: `${item.icon || "📘"} ${teacherLanguage === "ja" ? item.title_ja || item.title_en : item.title_en}` }),
        make("br"),
        make("small", { text: item.id }),
      );
      const accessCell = make("td");
      accessCell.append(select);
      const row = make("tr");
      row.append(
        title,
        make("td", { text: planFor(item.required_plan || "free").name }),
        make("td", { text: item.active ? teacherText("Yes", "はい") : teacherText("No", "いいえ") }),
        accessCell,
      );
      tbody.append(row);
    });
    const tableWrap = make("div", { className: "table-scroll" });
    tableWrap.append(table);
    result.replaceChildren(tableWrap);
  };
  category.addEventListener("change", renderItems);
  level.addEventListener("change", renderItems);
  details.addEventListener("toggle", () => {
    if (details.open && !result.childElementCount) renderItems();
  });
  return details;
}

function renderStructuredHubControls(profile, container, output) {
  let settings = hubSettingsFor(profile.user_id);
  const form = make("form", { className: "structured-hub-teacher-settings" });
  const accountLabel = make("label", { className: "structured-hub-teacher-account" });
  const accountEnabled = make("input");
  accountEnabled.type = "checkbox";
  accountEnabled.checked = settings.account_enabled;
  accountLabel.append(
    accountEnabled,
    make("span", { text: teacherText("Structured Hub account enabled", "学習ハブのアカウントを有効にする") }),
  );
  form.append(
    accountLabel,
    make("small", { text: teacherText(
      "Turning this off blocks the structured learning hub without changing membership history.",
      "オフにすると会員履歴を変更せず、学習ハブのみ利用停止になります。",
    ) }),
  );

  const features = make("fieldset", { className: "structured-hub-teacher-fieldset" });
  features.append(make("legend", { text: teacherText("Visible learner features", "生徒に表示する機能") }));
  const featureGrid = make("div", { className: "structured-hub-teacher-toggle-grid" });
  const featureInputs = {};
  STRUCTURED_HUB_FEATURES.forEach(([key, en, ja]) => {
    const label = make("label");
    const input = make("input");
    input.type = "checkbox";
    input.checked = settings[key] !== false;
    input.name = key;
    label.append(input, make("span", { text: teacherText(en, ja) }));
    featureInputs[key] = input;
    featureGrid.append(label);
  });
  features.append(featureGrid);

  const range = make("fieldset", { className: "structured-hub-teacher-fieldset" });
  range.append(make("legend", { text: teacherText("Level access", "レベル公開範囲") }));
  const rangeFields = make("div", { className: "structured-hub-teacher-level-range" });
  const minimum = make("select");
  const maximum = make("select");
  [minimum, maximum].forEach((select, index) => {
    select.setAttribute("aria-label", index === 0
      ? teacherText("Minimum allowed level", "公開する最小レベル")
      : teacherText("Maximum allowed level", "公開する最大レベル"));
    for (let value = 1; value <= 32; value += 1) {
      const option = make("option", { text: teacherText(`Level ${value}`, `レベル ${value}`) });
      option.value = String(value);
      select.append(option);
    }
  });
  minimum.value = String(settings.allowed_level_min);
  maximum.value = String(settings.allowed_level_max);
  const minimumLabel = make("label");
  minimumLabel.append(make("span", { text: teacherText("Minimum", "最小") }), minimum);
  const maximumLabel = make("label");
  maximumLabel.append(make("span", { text: teacherText("Maximum", "最大") }), maximum);
  rangeFields.append(minimumLabel, maximumLabel);
  range.append(
    rangeFields,
    make("p", { text: teacherText(
      "Leave every individual level unchecked to allow the full range. Check levels to use an exact allow-list inside the range.",
      "個別レベルをすべて未選択にすると範囲内をすべて許可します。特定レベルだけ許可する場合は選択してください。",
    ) }),
  );
  const levels = make("div", { className: "structured-hub-teacher-level-grid" });
  const levelInputs = [];
  for (let value = 1; value <= 32; value += 1) {
    const label = make("label");
    const input = make("input");
    input.type = "checkbox";
    input.value = String(value);
    input.checked = settings.allowed_levels.includes(value);
    input.setAttribute("aria-label", teacherText(
      `Include Level ${value} in the exact allow-list`,
      `レベル${value}を個別許可リストに含める`,
    ));
    label.append(input, document.createTextNode(String(value)));
    levelInputs.push(input);
    levels.append(label);
  }
  const syncLevelsToRange = () => {
    const low = Number(minimum.value);
    const high = Number(maximum.value);
    levelInputs.forEach((input) => {
      const outside = Number(input.value) < low || Number(input.value) > high;
      input.disabled = outside;
      if (outside) input.checked = false;
    });
  };
  minimum.addEventListener("change", syncLevelsToRange);
  maximum.addEventListener("change", syncLevelsToRange);
  syncLevelsToRange();
  const clearLevels = makeAction(teacherText("Use full range", "範囲内をすべて許可"), () => {
    levelInputs.forEach((input) => { input.checked = false; });
  });
  clearLevels.className = "secondary-btn";
  range.append(levels, clearLevels);

  const actions = make("div", { className: "structured-hub-teacher-actions" });
  const save = make("button", {
    className: "primary-btn",
    text: teacherText("Save Structured Hub settings", "学習ハブ設定を保存"),
    type: "submit",
  });
  actions.append(save);
  form.append(features, range, actions);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const low = Number(minimum.value);
    const high = Number(maximum.value);
    if (low > high) {
      output.textContent = teacherText(
        "The minimum level cannot be higher than the maximum level.",
        "最小レベルは最大レベル以下にしてください。",
      );
      minimum.focus();
      return;
    }
    if (settings.account_enabled && !accountEnabled.checked && !window.confirm(teacherText(
      "Disable this learner's Structured Hub account? Membership history will be kept.",
      "この生徒の学習ハブを利用停止にしますか？会員履歴は保持されます。",
    ))) {
      accountEnabled.checked = true;
      return;
    }
    const patch = {
      account_enabled: accountEnabled.checked,
      ...Object.fromEntries(STRUCTURED_HUB_FEATURES.map(([key]) => [key, featureInputs[key].checked])),
      allowed_level_min: low,
      allowed_level_max: high,
      allowed_levels: levelInputs.filter((input) => input.checked).map((input) => Number(input.value)),
    };
    save.disabled = true;
    accountEnabled.disabled = true;
    features.disabled = true;
    range.disabled = true;
    form.setAttribute("aria-busy", "true");
    output.textContent = teacherText("Saving Structured Hub settings…", "学習ハブ設定を保存しています…");
    let saveResult;
    try {
      saveResult = await saveTeacherHubSettings(profile.user_id, patch);
    } catch (error) {
      saveResult = { data: null, reason: "unexpected-error", error };
    }
    save.disabled = false;
    accountEnabled.disabled = false;
    features.disabled = false;
    range.disabled = false;
    form.removeAttribute("aria-busy");
    if (saveResult.error || saveResult.reason) {
      output.textContent = readableError(
        saveResult.error,
        teacherText(
          "Structured Hub settings could not be saved.",
          "学習ハブ設定を保存できませんでした。",
        ),
      );
      return;
    }
    settings = { ...settings, ...saveResult.data };
    replaceHubSettings(profile.user_id, settings);
    output.textContent = teacherText(
      "Structured Hub settings saved.",
      "学習ハブ設定を保存しました。",
    );
    showToast(teacherText("Structured Hub settings saved.", "学習ハブ設定を保存しました。"), "success");
  });

  container.replaceChildren(
    structuredHubProgressSummary(profile),
    form,
    structuredHubItemAccess(profile, settings),
  );
}

async function hydrateStructuredHubControls(profile, container, output, { force = false } = {}) {
  const hub = await ensureStructuredHubData({ force });
  if (!container.isConnected) return;
  container.removeAttribute("aria-busy");
  if (!hub.ready) {
    const retry = makeAction(teacherText("Retry Structured Hub", "学習ハブを再読み込み"), async () => {
      retry.disabled = true;
      container.setAttribute("aria-busy", "true");
      output.textContent = teacherText("Reloading Structured Hub controls…", "学習ハブ設定を再読み込みしています…");
      await hydrateStructuredHubControls(profile, container, output, { force: true });
      retry.disabled = false;
    });
    retry.className = "secondary-btn";
    container.replaceChildren(
      make("p", { className: "control-warning", text: structuredHubUnavailableMessage() }),
      retry,
    );
    return;
  }
  renderStructuredHubControls(profile, container, output);
  output.textContent = teacherText(
    "Structured Hub controls loaded.",
    "学習ハブ設定を読み込みました。",
  );
}

function learnerStructuredHubControls(profile) {
  const section = make("section", {
    className: "learner-control-section structured-hub-teacher",
  });
  const content = make("div");
  content.setAttribute("aria-busy", "true");
  const output = make("p", { className: "form-status" });
  output.setAttribute("role", "status");
  output.setAttribute("aria-live", "polite");
  section.append(
    make("h3", { text: teacherText("Structured Learning Hub", "学習ハブ設定") }),
    make("p", { text: teacherText(
      "Control this learner's account, navigation, curriculum levels and item exceptions. These settings are separate from billing membership.",
      "この生徒のアカウント、メニュー、教材レベル、個別教材の例外を設定します。料金プランの会員設定とは別です。",
    ) }),
    content,
    output,
  );
  output.textContent = teacherText(
    "Loading Structured Hub controls…",
    "学習ハブ設定を読み込んでいます…",
  );
  void hydrateStructuredHubControls(profile, content, output);
  return section;
}

function learnerDialogWorkspace(entries) {
  const workspace = make("div", { className: "learner-dialog-workspace" });
  const tabs = make("div", { className: "learner-dialog-tabs" });
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", teacherText("Learner management sections", "生徒管理セクション"));
  const panels = make("div", { className: "learner-dialog-panels" });
  const controls = [];

  const activate = (key, { focus = false } = {}) => {
    controls.forEach(({ button, panel, entry }) => {
      const active = entry.key === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
      if (active && focus) button.focus();
    });
  };

  entries.forEach((entry, index) => {
    const button = make("button", { text: teacherText(entry.en, entry.ja), type: "button" });
    const buttonId = `learner-section-tab-${entry.key}`;
    const panelId = `learner-section-panel-${entry.key}`;
    button.id = buttonId;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panelId);
    button.addEventListener("click", () => activate(entry.key));
    const panel = make("section", { className: "learner-dialog-panel" });
    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", buttonId);
    panel.hidden = index !== 0;
    panel.append(...entry.nodes);
    controls.push({ entry, button, panel });
    tabs.append(button);
    panels.append(panel);
  });

  tabs.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = Math.max(0, controls.findIndex(({ button }) => button === document.activeElement));
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? controls.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + controls.length) % controls.length;
    activate(controls[nextIndex].entry.key, { focus: true });
  });
  workspace.append(tabs, panels);
  activate(entries[0]?.key);
  return workspace;
}

function openLearnerDialog(profile) {
  if (!elements.learnerDialog || !elements.learnerDialogContent) return;
  const current = state.profiles.find((item) => item.user_id === profile.user_id) || profile;
  const membership = membershipFor(current.user_id);
  const attempts = state.attempts.filter((item) => item.user_id === current.user_id);
  const speaking = state.speaking.filter((item) => item.user_id === current.user_id);
  const premiumSubmissions = teacherVisibleSubmissions().filter((item) => item.user_id === current.user_id);
  const phraseCount = state.phrases
    .filter((item) => item.user_id === current.user_id)
    .reduce((sum, item) => sum + Number(item.practice_count || 0), 0);
  const assigned = state.assignments.filter(
    (item) => item.student_id === current.user_id && item.status !== "dismissed",
  ).length;
  elements.learnerDialogHeading.textContent = profileName(current.user_id);

  const profileCard = make("section", { className: "learner-profile-card" });
  const authStatus = make("p", { text: teacherText("Loading secure account status…", "安全なアカウント情報を読み込んでいます…") });
  profileCard.append(
    make("div", { text: current.contact_email || teacherText("No email recorded", "メール未登録") }),
    make("p", { text: [
      current.english_level || teacherText("Level not set", "レベル未設定"),
      current.age_group || teacherText("Age not shared", "年齢区分未設定"),
      current.native_language || teacherText("Language not set", "母語未設定"),
    ].join(" · ") }),
    make("p", { text: current.learning_goal
      ? teacherText(`Goal: ${current.learning_goal}`, `学習目標：${current.learning_goal}`)
      : teacherText("No learning goal recorded yet.", "学習目標はまだ登録されていません。") }),
    authStatus,
  );
  loadLearnerAuthStatus(current, authStatus);

  const metrics = make("section", { className: "learner-metrics" });
  [
    [teacherText("Practice sessions", "学習回数"), attempts.length],
    [teacherText("Speaking records", "発話記録"), speaking.length],
    [teacherText("Premium submissions", "Premium提出数"), premiumSubmissions.length],
    [teacherText("Phrase repetitions", "フレーズ練習回数"), phraseCount],
    [teacherText("Assigned lessons", "割り当てレッスン"), assigned],
  ].forEach(([label, value]) => {
    const card = make("article");
    card.append(make("span", { text: label }), make("strong", { text: value }));
    metrics.append(card);
  });

  const access = make("section", { className: "learner-control-section" });
  access.append(
    make("h3", { text: teacherText("Membership & account safety", "会員期間・アカウント安全管理") }),
    make("p", { text: teacherText(
      `Status: ${activeMembershipStatus(membership)} · Plan: ${planFor(membership?.plan_tier || "free").name} · Scope: ${audienceLabel(membership?.access_scope || "general")} · Expires: ${membership?.expires_at ? formatDate(membership.expires_at, true) : "—"}`,
      `状態：${activeMembershipStatus(membership)} · プラン：${planFor(membership?.plan_tier || "free").name} · 公開範囲：${audienceLabel(membership?.access_scope || "general")} · 期限：${membership?.expires_at ? formatDate(membership.expires_at, true) : "—"}`,
    ) }),
  );
  const duration = make("input");
  duration.type = "number";
  duration.min = "1";
  duration.max = "730";
  duration.value = "30";
  duration.setAttribute("aria-label", teacherText("Membership duration in days", "会員利用日数"));
  const scope = make("select");
  [["general", "General"], ["takiwaki", "Takiwaki"], ["both", "Both"]].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    if (membership?.access_scope === value) option.selected = true;
    scope.append(option);
  });
  const plan = make("select");
  [["standard", "Standard"], ["premium", "Premium"], ["premium_plus", "Premium+"]].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    if ((membership?.plan_tier || "standard") === value) option.selected = true;
    plan.append(option);
  });
  const approve = makeAction("Approve / extend", () => activateMembership(current, duration.value, scope.value, plan.value, approve));
  const pause = makeAction("Pause access", () => pauseMembership(current, pause));
  const reset = makeAction("Send password-reset email", () => sendPasswordReset(current, reset));
  const controls = make("div", { className: "learner-access-actions" });
  controls.append(duration, scope, plan, approve, pause, reset);
  access.append(
    controls,
    make("small", { text: teacherText(
      "For security, teachers can never see or retrieve learner passwords. A reset email lets the learner choose a new password privately.",
      "安全のため、先生が生徒のパスワードを見たり取得したりすることはできません。再設定メールから、生徒本人が新しいパスワードを設定します。",
    ) }),
  );

  const timeline = make("section", { className: "learner-control-section" });
  timeline.append(make("h3", { text: teacherText("Recent learning activity", "最近の学習状況") }));
  const events = learnerActivity(current);
  if (!events.length) {
    timeline.append(make("p", { text: teacherText("No learning activity has been recorded yet.", "学習記録はまだありません。") }));
  } else {
    const list = make("ol", { className: "learner-timeline" });
    events.forEach((event) => {
      const item = make("li");
      item.append(make("strong", { text: event.title }), make("span", { text: event.detail }), make("time", { text: formatDate(event.at, true) }));
      list.append(item);
    });
    timeline.append(list);
  }

  elements.learnerDialogContent.replaceChildren(learnerDialogWorkspace([
    { key: "profile", en: "Profile", ja: "プロフィール", nodes: [profileCard, metrics] },
    { key: "access", en: "Access", ja: "アカウント", nodes: [access] },
    { key: "lessons", en: "Lessons", ja: "レッスン", nodes: [learnerLessonControls(current)] },
    { key: "library", en: "Learning Library", ja: "教材ライブラリ", nodes: [learnerStructuredHubControls(current)] },
    { key: "progress", en: "Progress", ja: "進捗", nodes: [timeline] },
    { key: "commercial", en: "Plan features", ja: "プラン機能", nodes: [learnerFeatureControls(current)] },
    { key: "announcements", en: "Announcements", ja: "お知らせ", nodes: [teacherAnnouncementManager({ initialStudentId: current.user_id })] },
  ]));
  if (!elements.learnerDialog.open) elements.learnerDialog.showModal();
}

function announcementStateLabel(announcement) {
  if (!announcement.active) return teacherText("Archived", "アーカイブ済み");
  if (new Date(announcement.starts_at).getTime() > Date.now()) {
    return teacherText("Scheduled", "公開予定");
  }
  if (announcement.ends_at && new Date(announcement.ends_at).getTime() <= Date.now()) {
    return teacherText("Ended", "公開終了");
  }
  return teacherText("Active", "公開中");
}

function announcementAudienceLabel(announcement) {
  if (announcement.audience !== "targeted") return teacherText("All learners", "生徒全員");
  const targets = state.structuredHub.announcementTargets
    .filter((item) => item.announcement_id === announcement.id)
    .map((item) => profileName(item.student_id));
  return targets.length
    ? teacherText(`Targeted: ${targets.join(", ")}`, `対象：${targets.join("、")}`)
    : teacherText("Targeted: no learner selected", "対象：生徒未選択");
}

function teacherAnnouncementField(label, control, className = "") {
  const wrapper = make("label", { className });
  wrapper.append(make("span", { text: label }), control);
  return wrapper;
}

function renderTeacherAnnouncementManager(container, output, { initialStudentId = "" } = {}) {
  const form = make("form", { className: "structured-hub-teacher-announcement-form" });
  const titleEn = make("input");
  titleEn.required = true;
  titleEn.maxLength = 240;
  titleEn.autocomplete = "off";
  const titleJa = make("input");
  titleJa.maxLength = 240;
  titleJa.autocomplete = "off";
  const bodyEn = make("textarea");
  bodyEn.rows = 4;
  bodyEn.maxLength = 12000;
  const bodyJa = make("textarea");
  bodyJa.rows = 4;
  bodyJa.maxLength = 12000;
  const audience = make("select");
  [
    ["all", teacherText("All learners", "生徒全員")],
    ["targeted", teacherText("One learner", "生徒を1人選択")],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    audience.append(option);
  });
  const target = make("select");
  const placeholder = make("option", { text: teacherText("Choose a learner", "生徒を選択") });
  placeholder.value = "";
  target.append(placeholder);
  [...state.profiles]
    .sort((left, right) => profileName(left.user_id).localeCompare(profileName(right.user_id)))
    .forEach((profile) => {
      const option = make("option", { text: profileName(profile.user_id) });
      option.value = profile.user_id;
      target.append(option);
    });
  const targetField = teacherAnnouncementField(
    teacherText("Learner", "対象の生徒"),
    target,
    "structured-hub-teacher-target-field",
  );
  const starts = make("input");
  starts.type = "datetime-local";
  starts.value = localDateTimeValue(new Date().toISOString());
  const ends = make("input");
  ends.type = "datetime-local";
  if (initialStudentId && [...target.options].some((option) => option.value === initialStudentId)) {
    audience.value = "targeted";
    target.value = initialStudentId;
  }
  const syncAudience = () => {
    const targeted = audience.value === "targeted";
    targetField.hidden = !targeted;
    target.disabled = !targeted;
    target.required = targeted;
  };
  audience.addEventListener("change", syncAudience);
  syncAudience();

  form.append(
    teacherAnnouncementField(teacherText("English title", "英語タイトル"), titleEn),
    teacherAnnouncementField(teacherText("Japanese title (optional)", "日本語タイトル（任意）"), titleJa),
    teacherAnnouncementField(teacherText("English message", "英語本文"), bodyEn, "structured-hub-teacher-wide"),
    teacherAnnouncementField(teacherText("Japanese message", "日本語本文"), bodyJa, "structured-hub-teacher-wide"),
    teacherAnnouncementField(teacherText("Audience", "公開対象"), audience),
    targetField,
    teacherAnnouncementField(teacherText("Starts", "公開開始"), starts),
    teacherAnnouncementField(teacherText("Ends (optional)", "公開終了（任意）"), ends),
  );
  const submit = make("button", {
    className: "primary-btn structured-hub-teacher-wide",
    text: teacherText("Publish announcement", "お知らせを公開"),
    type: "submit",
  });
  form.append(submit);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const startIso = isoDateTimeValue(starts.value) || new Date().toISOString();
    const endIso = isoDateTimeValue(ends.value);
    if (!titleEn.value.trim()) {
      output.textContent = teacherText(
        "Enter an English announcement title.",
        "英語のお知らせタイトルを入力してください。",
      );
      titleEn.focus();
      return;
    }
    if (!bodyEn.value.trim() && !bodyJa.value.trim()) {
      output.textContent = teacherText(
        "Enter an English or Japanese announcement message.",
        "英語または日本語のお知らせ本文を入力してください。",
      );
      bodyEn.focus();
      return;
    }
    if (audience.value === "targeted" && !target.value) {
      output.textContent = teacherText("Choose a learner for this announcement.", "お知らせの対象となる生徒を選択してください。");
      target.focus();
      return;
    }
    if (endIso && new Date(endIso).getTime() <= new Date(startIso).getTime()) {
      output.textContent = teacherText(
        "The end time must be later than the start time.",
        "公開終了日時は公開開始日時より後にしてください。",
      );
      ends.focus();
      return;
    }

    const controls = [...form.elements];
    controls.forEach((control) => { control.disabled = true; });
    form.setAttribute("aria-busy", "true");
    output.textContent = teacherText("Publishing announcement…", "お知らせを公開しています…");
    const targeted = audience.value === "targeted";
    const payload = {
      teacher_id: state.session.user.id,
      audience: audience.value,
      title_en: titleEn.value.trim(),
      title_ja: titleJa.value.trim() || null,
      body_en: bodyEn.value.trim() || null,
      body_ja: bodyJa.value.trim() || null,
      active: !targeted,
      starts_at: startIso,
      ends_at: endIso,
    };
    let announcement = null;
    let error = null;
    let targetRow = null;
    try {
      const creation = await client
        .from("review_announcements")
        .insert(payload)
        .select("id,teacher_id,audience,title_en,title_ja,body_en,body_ja,active,starts_at,ends_at,created_at,updated_at")
        .single();
      announcement = creation.data;
      error = creation.error;
      if (!error && targeted) {
        const targetResult = await client
          .from("review_announcement_targets")
          .insert({ announcement_id: announcement.id, student_id: target.value })
          .select("announcement_id,student_id,created_at")
          .single();
        error = targetResult.error;
        targetRow = targetResult.data;
        if (!error) {
          const activation = await client
            .from("review_announcements")
            .update({ active: true })
            .eq("id", announcement.id)
            .eq("teacher_id", state.session.user.id)
            .select("id,teacher_id,audience,title_en,title_ja,body_en,body_ja,active,starts_at,ends_at,created_at,updated_at")
            .single();
          error = activation.error;
          announcement = activation.data || announcement;
        }
        if (error) {
          await client
            .from("review_announcements")
            .delete()
            .eq("id", announcement.id)
            .eq("teacher_id", state.session.user.id);
        }
      }
    } catch (unexpectedError) {
      error = unexpectedError;
    } finally {
      controls.forEach((control) => { control.disabled = false; });
      syncAudience();
      form.removeAttribute("aria-busy");
    }
    if (error || !announcement) {
      output.textContent = readableError(
        error,
        teacherText("The announcement could not be published.", "お知らせを公開できませんでした。"),
      );
      return;
    }
    state.structuredHub.announcements = [
      announcement,
      ...state.structuredHub.announcements.filter((item) => item.id !== announcement.id),
    ];
    if (targetRow) state.structuredHub.announcementTargets.push(targetRow);
    output.textContent = teacherText("Announcement published.", "お知らせを公開しました。");
    showToast(teacherText("Announcement published.", "お知らせを公開しました。"), "success");
    renderTeacherAnnouncementManager(container, output, { initialStudentId });
  });

  const list = make("div", { className: "structured-hub-teacher-announcement-list" });
  const announcements = [...state.structuredHub.announcements]
    .filter((item) => item.teacher_id === state.session.user.id)
    .sort((left, right) => new Date(right.starts_at).getTime() - new Date(left.starts_at).getTime());
  if (!announcements.length) {
    list.append(make("p", { text: teacherText(
      "No announcements have been created yet.",
      "お知らせはまだ作成されていません。",
    ) }));
  }
  announcements.forEach((announcement) => {
    const card = make("article", { className: "structured-hub-teacher-announcement" });
    const heading = make("div");
    heading.append(
      make("h4", { text: teacherLanguage === "ja"
        ? announcement.title_ja || announcement.title_en
        : announcement.title_en }),
      make("span", { text: announcementStateLabel(announcement) }),
    );
    const body = teacherLanguage === "ja"
      ? announcement.body_ja || announcement.body_en
      : announcement.body_en || announcement.body_ja;
    const meta = make("p", { text: teacherText(
      `${announcementAudienceLabel(announcement)} · Starts ${formatDate(announcement.starts_at, true)}${announcement.ends_at ? ` · Ends ${formatDate(announcement.ends_at, true)}` : ""}`,
      `${announcementAudienceLabel(announcement)} · 開始 ${formatDate(announcement.starts_at, true)}${announcement.ends_at ? ` · 終了 ${formatDate(announcement.ends_at, true)}` : ""}`,
    ) });
    const toggle = makeAction(
      announcement.active
        ? teacherText("Archive", "アーカイブ")
        : teacherText("Restore", "再公開"),
      async () => {
        toggle.disabled = true;
        output.textContent = announcement.active
          ? teacherText("Archiving announcement…", "お知らせをアーカイブしています…")
          : teacherText("Restoring announcement…", "お知らせを再公開しています…");
        let update;
        try {
          update = await client
            .from("review_announcements")
            .update({ active: !announcement.active })
            .eq("id", announcement.id)
            .eq("teacher_id", state.session.user.id)
            .select("id,teacher_id,audience,title_en,title_ja,body_en,body_ja,active,starts_at,ends_at,created_at,updated_at")
            .single();
        } catch (error) {
          update = { data: null, error };
        }
        toggle.disabled = false;
        if (update.error || !update.data) {
          output.textContent = readableError(
            update.error,
            teacherText("The announcement status could not be changed.", "お知らせの状態を変更できませんでした。"),
          );
          return;
        }
        state.structuredHub.announcements = state.structuredHub.announcements
          .map((item) => item.id === update.data.id ? update.data : item);
        output.textContent = update.data.active
          ? teacherText("Announcement restored.", "お知らせを再公開しました。")
          : teacherText("Announcement archived.", "お知らせをアーカイブしました。");
        renderTeacherAnnouncementManager(container, output, { initialStudentId });
      },
    );
    toggle.className = "secondary-btn";
    card.append(heading, make("p", { text: body || "—" }), meta, toggle);
    list.append(card);
  });

  const formWrap = make("details", { className: "structured-hub-teacher-announcement-create" });
  formWrap.open = !announcements.length;
  formWrap.append(
    make("summary", { text: teacherText("Create announcement", "お知らせを作成") }),
    form,
  );
  container.replaceChildren(formWrap, list);
}

async function hydrateTeacherAnnouncementManager(container, output, { force = false, initialStudentId = "" } = {}) {
  const hub = await ensureStructuredHubData({ force });
  if (!container.isConnected) return;
  container.removeAttribute("aria-busy");
  if (!hub.ready) {
    const retry = makeAction(teacherText("Retry announcements", "お知らせを再読み込み"), () => {
      retry.disabled = true;
      container.setAttribute("aria-busy", "true");
      output.textContent = teacherText("Reloading announcements…", "お知らせを再読み込みしています…");
      void hydrateTeacherAnnouncementManager(container, output, { force: true, initialStudentId });
    });
    retry.className = "secondary-btn";
    container.replaceChildren(
      make("p", { className: "control-warning", text: structuredHubUnavailableMessage() }),
      retry,
    );
    return;
  }
  renderTeacherAnnouncementManager(container, output, { initialStudentId });
  output.textContent = teacherText("Announcements loaded.", "お知らせを読み込みました。");
}

function teacherAnnouncementManager({ initialStudentId = "" } = {}) {
  const section = make("section", {
    className: "learner-control-section structured-hub-teacher-announcements",
  });
  const content = make("div");
  content.setAttribute("aria-busy", "true");
  const output = make("p", { className: "form-status" });
  output.setAttribute("role", "status");
  output.setAttribute("aria-live", "polite");
  output.textContent = teacherText("Loading announcements…", "お知らせを読み込んでいます…");
  section.append(
    make("h3", { text: teacherText("Learner announcements", "生徒向けお知らせ") }),
    make("p", { text: teacherText(
      "Publish a bilingual message to every learner or one selected learner. Archive it when it should no longer appear.",
      "全生徒または選択した生徒1人に、日英のお知らせを公開できます。表示を終了する場合はアーカイブしてください。",
    ) }),
    content,
    output,
  );
  void hydrateTeacherAnnouncementManager(content, output, { initialStudentId });
  return section;
}

function renderStudents() {
  const wrap = make("div", { className: "learner-admin" });
  const heading = make("div", { className: "teacher-panel-heading" });
  heading.append(
    make("div", { text: teacherText("Learners", "生徒") }),
    make("p", { text: teacherText(
      "Find a learner, then manage their plan, lesson visibility, password reset and activity.",
      "生徒を検索し、プラン・レッスン表示・パスワード再設定・学習状況を管理します。",
    ) }),
  );
  wrap.append(heading, teacherAnnouncementManager());

  if (!state.profiles.length) {
    wrap.append(make("p", { text: teacherText("No student profiles have been created yet.", "生徒プロフィールはまだありません。") }));
    elements.panel.replaceChildren(wrap);
    return;
  }

  const filters = make("div", { className: "lesson-list-filters" });
  const search = make("input");
  search.type = "search";
  search.value = state.learnerSearch;
  search.placeholder = teacherText("Search name or email", "名前・メールで検索");
  search.setAttribute("aria-label", teacherText("Search learners", "生徒を検索"));
  const plan = make("select");
  [
    ["all", teacherText("All plans", "すべてのプラン")],
    ["free", "Free"],
    ["standard", "Standard"],
    ["premium", "Premium"],
    ["premium_plus", "Premium+"],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    plan.append(option);
  });
  plan.value = state.learnerPlanFilter;
  const status = make("select");
  [
    ["all", teacherText("All access states", "すべての利用状態")],
    ["active", teacherText("Active", "利用中")],
    ["pending", teacherText("Pending", "承認待ち")],
    ["expired", teacherText("Expired", "期限切れ")],
    ["suspended", teacherText("Paused", "一時停止")],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    status.append(option);
  });
  status.value = state.learnerStatusFilter;
  filters.append(search, plan, status);
  const results = make("div");
  wrap.append(filters, results);

  const effectiveLearnerPlan = (profile) => {
    const override = planOverrideFor(profile.user_id);
    const activeOverride = override
      && new Date(override.starts_at || 0).getTime() <= Date.now()
      && (!override.expires_at || new Date(override.expires_at).getTime() > Date.now());
    const membership = membershipFor(profile.user_id);
    const activeMembership = membership?.status === "active"
      && new Date(membership.starts_at || 0).getTime() <= Date.now()
      && new Date(membership.expires_at || 0).getTime() > Date.now();
    return (activeOverride ? override.plan_tier : null)
      || (activeMembership ? membership.plan_tier : null)
      || "free";
  };
  const membershipState = (profile) => {
    const membership = membershipFor(profile.user_id);
    if (!membership) return "pending";
    if (membership.status === "active" && new Date(membership.expires_at || 0).getTime() <= Date.now()) return "expired";
    return membership.status;
  };
  const renderRows = () => {
    const needle = state.learnerSearch.trim().toLowerCase();
    const visible = state.profiles.filter((profile) => {
      const haystack = `${profileName(profile.user_id)} ${profile.contact_email || ""}`.toLowerCase();
      return (!needle || haystack.includes(needle))
        && (state.learnerPlanFilter === "all" || effectiveLearnerPlan(profile) === state.learnerPlanFilter)
        && (state.learnerStatusFilter === "all" || membershipState(profile) === state.learnerStatusFilter);
    });
    if (!visible.length) {
      results.replaceChildren(make("p", { text: teacherText(
        "No learners match these filters.",
        "この条件に一致する生徒はいません。",
      ) }));
      return;
    }
    const { table, tbody } = makeTable([
      teacherText("Learner", "生徒"),
      teacherText("Profile", "プロフィール"),
      teacherText("Plan and access", "プラン・利用状態"),
      teacherText("Account created", "アカウント作成日"),
      teacherText("Last sign-in", "最終ログイン"),
      teacherText("Learning status", "学習状況"),
      teacherText("Hub visibility", "表示設定"),
      teacherText("Assigned", "割り当て"),
      teacherText("Actions", "操作"),
    ]);
    for (const profile of visible) {
      const attempts = state.attempts.filter((attempt) => attempt.user_id === profile.user_id);
      const membership = membershipFor(profile.user_id);
      const assignments = state.assignments.filter(
        (assignment) => assignment.student_id === profile.user_id && assignment.status !== "dismissed",
      );
      const latest = attempts
        .map((attempt) => attempt.completed_at)
        .filter(Boolean)
        .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];
      const open = makeAction(
        teacherText("Open learner", "生徒を開く"),
        () => openLearnerDialog(profile),
      );
      open.className = "secondary-btn";
      const actionCell = make("td");
      actionCell.append(open);
      const learnerCell = make("td");
      learnerCell.append(
        make("strong", { text: profileName(profile.user_id) }),
        make("br"),
        make("small", { text: profile.contact_email || teacherText("No email recorded", "メール未登録") }),
      );
      const createdCell = make("td", { text: formatDate(profile.created_at, true) });
      const lastSignInCell = make("td", { text: teacherText("Loading securely…", "安全に確認中…") });
      void fetchLearnerAuthStatus(profile).then((account) => {
        if (!createdCell.isConnected || !lastSignInCell.isConnected) return;
        createdCell.textContent = account?.createdAt
          ? formatDate(account.createdAt, true)
          : teacherText(`Profile: ${formatDate(profile.created_at, true)}`, `プロフィール：${formatDate(profile.created_at, true)}`);
        lastSignInCell.textContent = account?.lastSignInAt
          ? formatDate(account.lastSignInAt, true)
          : account ? teacherText("Never", "なし") : teacherText("Unknown", "不明");
      });
      const curriculumProgress = state.structuredHub.progress.filter((item) => (
        item.student_id === profile.user_id && item.status !== "not_started"
      ));
      const dueCurriculum = curriculumProgress.filter((item) => (
        item.next_review_at && new Date(item.next_review_at).getTime() <= Date.now()
      )).length;
      const learningCell = make("td", { text: teacherText(
        `${latest ? `Review: ${formatDate(latest, true)}` : "No lesson practice"}\nCurriculum: ${curriculumProgress.length} started · ${dueCurriculum} due`,
        `${latest ? `レッスン：${formatDate(latest, true)}` : "レッスン学習なし"}\n教材：${curriculumProgress.length}件開始・${dueCurriculum}件復習期限`,
      ) });
      const hubSettings = hubSettingsFor(profile.user_id);
      const visibleFeatureCount = STRUCTURED_HUB_FEATURES.filter(([key]) => hubSettings[key] !== false).length;
      const exactLevels = hubSettings.allowed_levels.length;
      const visibilityCell = make("td", { text: state.structuredHub.ready === true
        ? teacherText(
          `${hubSettings.account_enabled ? "Enabled" : "Disabled"} · ${visibleFeatureCount}/${STRUCTURED_HUB_FEATURES.length} features\nLevels ${hubSettings.allowed_level_min}–${hubSettings.allowed_level_max}${exactLevels ? ` · ${exactLevels} selected` : ""}`,
          `${hubSettings.account_enabled ? "有効" : "無効"}・${visibleFeatureCount}/${STRUCTURED_HUB_FEATURES.length}機能\nレベル${hubSettings.allowed_level_min}〜${hubSettings.allowed_level_max}${exactLevels ? `・${exactLevels}件を個別選択` : ""}`,
        )
        : teacherText("Migration pending / legacy defaults", "Migration待ち・従来設定") });
      const row = make("tr");
      row.append(
        learnerCell,
        make("td", { text: [profile.english_level || teacherText("Level not set", "レベル未設定"), profile.age_group || teacherText("Age not shared", "年齢未共有"), profile.native_language || teacherText("Language not set", "言語未設定")].join(" · ") }),
        make("td", { text: `${planFor(effectiveLearnerPlan(profile)).name} · ${activeMembershipStatus(membership)}\n${membership?.expires_at ? `${teacherText("until", "期限")} ${formatDate(membership.expires_at)}` : ""}` }),
        createdCell,
        lastSignInCell,
        learningCell,
        visibilityCell,
        make("td", { text: assignments.length }),
        actionCell,
      );
      tbody.append(row);
    }
    const tableWrap = make("div", { className: "table-scroll" });
    tableWrap.append(table);
    results.replaceChildren(tableWrap);
  };
  search.addEventListener("input", () => {
    state.learnerSearch = search.value;
    renderRows();
  });
  plan.addEventListener("change", () => {
    state.learnerPlanFilter = plan.value;
    renderRows();
  });
  status.addEventListener("change", () => {
    state.learnerStatusFilter = status.value;
    renderRows();
  });
  renderRows();
  if (state.structuredHub.ready === null) {
    void ensureStructuredHubData().then(() => {
      if (results.isConnected) renderRows();
    });
  }
  elements.panel.replaceChildren(wrap);
}

function formatPercent(correct, total) {
  return total > 0 ? `${Math.round((Number(correct || 0) / total) * 100)}%` : "—";
}

function questionAnalyticsTitle(question) {
  if (!question) return { en: "Question unavailable", jp: "" };
  const payload =
    question.payload && typeof question.payload === "object" && !Array.isArray(question.payload)
      ? question.payload
      : {};
  const prompt = bilingualValue(payload.prompt, payload.promptJa || payload.promptJP || "");
  return {
    en: prompt.en || question.stable_key || "Untitled question",
    jp: prompt.jp,
  };
}

function summarizeAnswerValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    const text = JSON.stringify(value);
    return text.length > 110 ? `${text.slice(0, 107)}…` : text;
  } catch {
    return "Structured response";
  }
}

function retryOutcome(answer) {
  if (answer.first_is_correct === false && answer.latest_is_correct === true) return "Recovered";
  if (answer.first_is_correct === false && answer.latest_is_correct === false) {
    return "Still needs work";
  }
  if (answer.first_is_correct === true && answer.latest_is_correct === false) {
    return "Changed to incorrect";
  }
  if (answer.latest_is_correct === true) return "Stayed correct";
  return "Not scored";
}

function buildQuestionAnalytics() {
  const questionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const grouped = new Map();

  for (const answer of state.answers) {
    const question = questionMap.get(answer.question_id);
    const key = answer.question_id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        questionId: key,
        question,
        lessonId: answer.lesson_id || question?.lesson_id,
        format: question?.format || "unknown",
        responses: 0,
        firstScored: 0,
        firstCorrect: 0,
        firstWrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        latestWrong: 0,
        recovered: 0,
        retries: 0,
        students: new Set(),
        lastAnsweredAt: null,
      });
    }
    const item = grouped.get(key);
    item.responses += 1;
    item.students.add(answer.user_id);
    item.retries += Math.max(0, Number(answer.answer_count || 1) - 1);
    if (typeof answer.first_is_correct === "boolean") {
      item.firstScored += 1;
      if (answer.first_is_correct) item.firstCorrect += 1;
      else item.firstWrong += 1;
    }
    if (typeof answer.latest_is_correct === "boolean") {
      item.latestScored += 1;
      if (answer.latest_is_correct) item.latestCorrect += 1;
      else item.latestWrong += 1;
    }
    if (answer.first_is_correct === false && answer.latest_is_correct === true) {
      item.recovered += 1;
    }
    if (
      answer.last_answered_at &&
      (!item.lastAnsweredAt ||
        new Date(answer.last_answered_at).getTime() >
          new Date(item.lastAnsweredAt).getTime())
    ) {
      item.lastAnsweredAt = answer.last_answered_at;
    }
  }

  return [...grouped.values()].sort(
    (left, right) =>
      right.firstWrong - left.firstWrong ||
      left.firstCorrect / Math.max(1, left.firstScored) -
        right.firstCorrect / Math.max(1, right.firstScored) ||
      right.responses - left.responses,
  );
}

function buildFormatAnalytics(questionStats = buildQuestionAnalytics()) {
  const grouped = new Map();
  for (const question of questionStats) {
    if (!grouped.has(question.format)) {
      grouped.set(question.format, {
        format: question.format,
        questions: 0,
        responses: 0,
        firstScored: 0,
        firstCorrect: 0,
        firstWrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        latestWrong: 0,
        recovered: 0,
        retries: 0,
        students: new Set(),
      });
    }
    const item = grouped.get(question.format);
    item.questions += 1;
    item.responses += question.responses;
    item.firstScored += question.firstScored;
    item.firstCorrect += question.firstCorrect;
    item.firstWrong += question.firstWrong;
    item.latestScored += question.latestScored;
    item.latestCorrect += question.latestCorrect;
    item.latestWrong += question.latestWrong;
    item.recovered += question.recovered;
    item.retries += question.retries;
    question.students.forEach((student) => item.students.add(student));
  }
  return [...grouped.values()].sort(
    (left, right) =>
      left.firstCorrect / Math.max(1, left.firstScored) -
        right.firstCorrect / Math.max(1, right.firstScored) ||
      right.responses - left.responses,
  );
}

function buildLessonAnalytics() {
  const grouped = new Map();
  const ensure = (lessonId) => {
    if (!grouped.has(lessonId)) {
      grouped.set(lessonId, {
        lessonId,
        sessions: 0,
        students: new Set(),
        score: 0,
        maxScore: 0,
        sessionPercentTotal: 0,
        scoredSessions: 0,
        answered: 0,
        wrong: 0,
        latestScored: 0,
        latestCorrect: 0,
        recovered: 0,
        lastPracticedAt: null,
      });
    }
    return grouped.get(lessonId);
  };
  for (const attempt of state.attempts) {
    const item = ensure(attempt.lesson_id);
    item.sessions += 1;
    item.students.add(attempt.user_id);
    item.score += Number(attempt.first_score || 0);
    item.maxScore += Number(attempt.max_score || 0);
    item.answered += Number(attempt.answered_count || 0);
    item.wrong += Number(attempt.wrong_count || 0);
    if (Number(attempt.max_score) > 0) {
      item.sessionPercentTotal +=
        (Number(attempt.first_score || 0) / Number(attempt.max_score)) * 100;
      item.scoredSessions += 1;
    }
    if (
      attempt.completed_at &&
      (!item.lastPracticedAt ||
        new Date(attempt.completed_at).getTime() >
          new Date(item.lastPracticedAt).getTime())
    ) {
      item.lastPracticedAt = attempt.completed_at;
    }
  }
  for (const answer of state.answers) {
    const item = ensure(answer.lesson_id);
    item.students.add(answer.user_id);
    if (typeof answer.latest_is_correct === "boolean") {
      item.latestScored += 1;
      if (answer.latest_is_correct) item.latestCorrect += 1;
    }
    if (answer.first_is_correct === false && answer.latest_is_correct === true) {
      item.recovered += 1;
    }
  }
  return [...grouped.values()].sort(
    (left, right) =>
      new Date(right.lastPracticedAt || 0).getTime() -
        new Date(left.lastPracticedAt || 0).getTime() ||
      lessonTitle(left.lessonId).localeCompare(lessonTitle(right.lessonId)),
  );
}

function analyticsMetric(label, value, note) {
  const card = make("article", { className: "teacher-analytics-metric" });
  card.append(
    make("span", { text: label }),
    make("strong", { text: value }),
    make("small", { text: note }),
  );
  return card;
}

function analyticsSection(title, description = "") {
  const section = make("section", { className: "teacher-analytics-section" });
  section.append(make("h2", { text: title }));
  if (description) section.append(make("p", { text: description }));
  return section;
}

function analyticsEmpty(message) {
  return make("p", { className: "teacher-analytics-empty", text: message });
}

async function editAnalyticsQuestion(questionId) {
  const question = state.analyticsQuestions.find((item) => item.id === questionId);
  const lesson = state.lessons.find((item) => item.id === question?.lesson_id);
  if (!question || !lesson) {
    showToast("That question is no longer available.", "error");
    return;
  }
  const loaded = await loadLessonQuestions(lesson, { open: true });
  if (!loaded) return;
  const fullQuestion = state.questions.find((item) => item.id === questionId);
  if (fullQuestion) openQuestionEditor(fullQuestion);
}

function questionMistakesSection(questionStats, { limit } = {}) {
  const section = analyticsSection(
    "Question-level mistakes",
    "First-answer misses identify what needs reteaching; latest accuracy shows whether retries helped.",
  );
  const mistakes = questionStats
    .filter((item) => item.firstWrong > 0 || item.latestWrong > 0)
    .slice(0, limit || 300);
  if (!mistakes.length) {
    section.append(analyticsEmpty("No scored question mistakes have been recorded yet."));
    return section;
  }

  const { table, tbody } = makeTable([
    "Question",
    "Lesson",
    "Format",
    "First misses",
    "First accuracy",
    "Latest accuracy",
    "Recovered",
    "Extra tries",
    "Action",
  ]);
  for (const item of mistakes) {
    const title = questionAnalyticsTitle(item.question);
    const questionCell = make("td");
    questionCell.append(make("strong", { text: teacherLanguage === "ja" ? title.jp || title.en : title.en }));
    const action = make("td", { className: "table-actions" });
    if (item.question) {
      action.append(makeAction("Edit", () => editAnalyticsQuestion(item.questionId)));
    } else {
      action.textContent = teacherText("Unavailable", "利用不可");
    }
    const row = make("tr");
    row.append(
      questionCell,
      make("td", { text: lessonTitle(item.lessonId) }),
      make("td", { text: formatQuestionLabel(item.format) }),
      make("td", { text: `${item.firstWrong} / ${item.firstScored}` }),
      make("td", { text: formatPercent(item.firstCorrect, item.firstScored) }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.recovered }),
      make("td", { text: item.retries }),
      action,
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function formatsSection(formatStats, { listeningOnly = false } = {}) {
  const scoredFormats = formatStats.filter(
    (item) => item.firstScored > 0 || item.latestScored > 0,
  );
  const formats = listeningOnly
    ? scoredFormats.filter((item) => ["listenChoice", "listenType"].includes(item.format))
    : scoredFormats;
  const section = analyticsSection(
    listeningOnly ? "Listening and dictation breakdown" : "Weak activity formats",
    listeningOnly
      ? "Compare listening recognition with full-sentence dictation."
      : "Formats are ordered from the lowest first-answer accuracy upward.",
  );
  if (!formats.length) {
    section.append(
      analyticsEmpty(
        listeningOnly
          ? "No listening or dictation answers have been recorded yet."
          : "No scored activity-format data is available yet.",
      ),
    );
    return section;
  }
  const { table, tbody } = makeTable([
    "Format",
    "Questions",
    "Responses",
    "First accuracy",
    "Latest accuracy",
    "First misses",
    "Recovered",
    "Extra tries",
  ]);
  for (const item of formats) {
    const row = make("tr");
    row.append(
      make("td", { text: formatQuestionLabel(item.format) }),
      make("td", { text: item.questions }),
      make("td", { text: item.responses }),
      make("td", { text: formatPercent(item.firstCorrect, item.firstScored) }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.firstWrong }),
      make("td", { text: item.recovered }),
      make("td", { text: item.retries }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function retriesSection() {
  const section = analyticsSection(
    "Retry result detail",
    "The first response remains the official score; this view shows what changed during retries.",
  );
  const questionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const retried = state.answers
    .filter((answer) => Number(answer.answer_count || 1) > 1)
    .sort(
      (left, right) =>
        Number(right.answer_count || 1) - Number(left.answer_count || 1) ||
        new Date(right.last_answered_at).getTime() -
          new Date(left.last_answered_at).getTime(),
    )
    .slice(0, 300);
  if (!retried.length) {
    section.append(analyticsEmpty("No within-session retries have been recorded yet."));
    return section;
  }

  const { table, tbody } = makeTable([
    "Student",
    "Lesson",
    "Question",
    "Format",
    "First answer",
    "Latest answer",
    "Result",
    "Points",
    "Tries",
    "Last answered",
  ]);
  for (const answer of retried) {
    const question = questionMap.get(answer.question_id);
    const title = questionAnalyticsTitle(question);
    const stored =
      answer.answer && typeof answer.answer === "object" && !Array.isArray(answer.answer)
        ? answer.answer
        : {};
    const row = make("tr");
    row.append(
      make("td", { text: profileName(answer.user_id) }),
      make("td", { text: lessonTitle(answer.lesson_id) }),
      make("td", { text: teacherLanguage === "ja" ? title.jp || title.en : title.en }),
      make("td", { text: formatQuestionLabel(question?.format || "unknown") }),
      make("td", { text: summarizeAnswerValue(stored.first) }),
      make("td", { text: summarizeAnswerValue(stored.latest) }),
      make("td", { text: retryOutcome(answer) }),
      make("td", {
        text: `${Number(answer.first_points || 0)} → ${Number(answer.latest_points || 0)}`,
      }),
      make("td", { text: answer.answer_count }),
      make("td", { text: formatDate(answer.last_answered_at, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function lessonsSection(lessonStats, { limit } = {}) {
  const section = analyticsSection(
    "Lesson-by-lesson scores",
    "Weighted score keeps multi-point activities accurate; session average treats every session equally.",
  );
  const rows = lessonStats.slice(0, limit || 300);
  if (!rows.length) {
    section.append(analyticsEmpty("No lesson score data has been recorded yet."));
    return section;
  }
  const { table, tbody } = makeTable([
    "Lesson",
    "Sessions",
    "Learners",
    "Weighted first score",
    "Average session",
    "Latest answer accuracy",
    "Recovered",
    "Wrong answers",
    "Last practice",
  ]);
  for (const item of rows) {
    const row = make("tr");
    row.append(
      make("td", { text: lessonTitle(item.lessonId) }),
      make("td", { text: item.sessions }),
      make("td", { text: item.students.size }),
      make("td", { text: formatPercent(item.score, item.maxScore) }),
      make("td", {
        text:
          item.scoredSessions > 0
            ? `${Math.round(item.sessionPercentTotal / item.scoredSessions)}%`
            : "—",
      }),
      make("td", { text: formatPercent(item.latestCorrect, item.latestScored) }),
      make("td", { text: item.recovered }),
      make("td", { text: item.wrong }),
      make("td", { text: formatDate(item.lastPracticedAt, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function speakingSection() {
  const section = analyticsSection(
    "Speaking practice",
    "Speaking records are separate from listening and dictation scores.",
  );
  if (!state.speaking.length) {
    section.append(analyticsEmpty("No speaking practice has been recorded yet."));
    return section;
  }
  const recognised = state.speaking.filter((item) => item.recognition_available).length;
  const strong = state.speaking.filter((item) =>
    ["great", "good"].includes(item.feedback_band),
  ).length;
  const grid = make("div", { className: "teacher-analytics-mini-grid" });
  grid.append(
    analyticsMetric("Speaking records", state.speaking.length, "All recorded practice"),
    analyticsMetric(
      "Recognition available",
      formatPercent(recognised, state.speaking.length),
      teacherText(`${recognised} recognised sessions`, `音声認識あり ${recognised}回`),
    ),
    analyticsMetric(
      "Great / good",
      formatPercent(strong, state.speaking.length),
      teacherText(`${strong} strong results`, `良好な結果 ${strong}回`),
    ),
  );
  section.append(grid);
  return section;
}

function sessionsSection({ limit } = {}) {
  const section = analyticsSection(
    "Practice sessions",
    "Official first scores remain separate from later retry improvements.",
  );
  const attempts = state.attempts.slice(0, limit || 300);
  if (!attempts.length) {
    section.append(analyticsEmpty("No practice sessions have been saved yet."));
    return section;
  }
  const { table, tbody } = makeTable([
    "Student",
    "Lesson",
    "First score",
    "Accuracy",
    "Answered",
    "Wrong",
    "Mode",
    "Duration",
    "Completed",
  ]);
  for (const attempt of attempts) {
    const score =
      attempt.max_score > 0
        ? `${attempt.first_score} / ${attempt.max_score}`
        : "Practice recorded";
    const minutes = Math.floor((attempt.duration_seconds || 0) / 60);
    const seconds = (attempt.duration_seconds || 0) % 60;
    const row = make("tr");
    row.append(
      make("td", { text: profileName(attempt.user_id) }),
      make("td", { text: lessonTitle(attempt.lesson_id) }),
      make("td", { text: score }),
      make("td", { text: formatPercent(attempt.first_score, attempt.max_score) }),
      make("td", { text: `${attempt.answered_count} / ${attempt.question_count}` }),
      make("td", { text: attempt.wrong_count }),
      make("td", { text: attempt.practice_mode === "instant" ? "Instant" : "Manual" }),
      make("td", { text: `${minutes}:${String(seconds).padStart(2, "0")}` }),
      make("td", { text: formatDate(attempt.completed_at, true) }),
    );
    tbody.append(row);
  }
  section.append(table);
  return section;
}

function renderActivity() {
  const questionStats = buildQuestionAnalytics();
  const formatStats = buildFormatAnalytics(questionStats);
  const lessonStats = buildLessonAnalytics();
  const firstScored = state.answers.filter(
    (answer) => typeof answer.first_is_correct === "boolean",
  );
  const latestScored = state.answers.filter(
    (answer) => typeof answer.latest_is_correct === "boolean",
  );
  const firstCorrect = firstScored.filter((answer) => answer.first_is_correct).length;
  const latestCorrect = latestScored.filter((answer) => answer.latest_is_correct).length;
  const initiallyWrong = firstScored.filter(
    (answer) => answer.first_is_correct === false,
  );
  const recovered = initiallyWrong.filter(
    (answer) => answer.latest_is_correct === true,
  ).length;
  const analyticsQuestionMap = new Map(
    state.analyticsQuestions.map((question) => [question.id, question]),
  );
  const listeningAnswers = state.answers.filter((answer) => {
    const question = analyticsQuestionMap.get(answer.question_id);
    return (
      ["listenChoice", "listenType"].includes(question?.format) &&
      typeof answer.first_is_correct === "boolean"
    );
  });
  const listeningCorrect = listeningAnswers.filter(
    (answer) => answer.first_is_correct === true,
  ).length;

  const wrap = make("div", { className: "teacher-analytics" });
  const heading = make("div", { className: "teacher-analytics-heading" });
  heading.append(
    make("div", { text: "Learning insights" }),
    make("p", {
      text: "RLS-protected answer records, attempts, speaking, and phrase activity.",
    }),
  );
  wrap.append(heading);

  const metrics = make("section", { className: "teacher-analytics-metrics" });
  metrics.append(
    analyticsMetric(
      "First-answer accuracy",
      formatPercent(firstCorrect, firstScored.length),
      teacherText(`${firstScored.length} scored answers`, `採点済み ${firstScored.length}回答`),
    ),
    analyticsMetric(
      "Latest accuracy",
      formatPercent(latestCorrect, latestScored.length),
      "After any retries",
    ),
    analyticsMetric(
      "Recovered on retry",
      formatPercent(recovered, initiallyWrong.length),
      teacherText(`${recovered} corrected after a miss`, `誤答後に正解 ${recovered}件`),
    ),
    analyticsMetric(
      "Listening first accuracy",
      formatPercent(listeningCorrect, listeningAnswers.length),
      teacherText(`${listeningAnswers.length} listening answers`, `リスニング回答 ${listeningAnswers.length}件`),
    ),
    analyticsMetric(
      "Speaking records",
      state.speaking.length,
      "Pronunciation practice",
    ),
    analyticsMetric(
      "Phrase repetitions",
      state.phrases.reduce((sum, item) => sum + Number(item.practice_count || 0), 0),
      teacherText(
        `${state.phrases.filter((item) => item.is_favorite).length} favourites`,
        `お気に入り ${state.phrases.filter((item) => item.is_favorite).length}件`,
      ),
    ),
  );
  wrap.append(metrics);

  const views = [
    ["overview", "Overview"],
    ["questions", "Question mistakes"],
    ["formats", "Weak formats"],
    ["listening", "Listening & dictation"],
    ["retries", "Retry detail"],
    ["lessons", "Lesson scores"],
    ["sessions", "Sessions"],
  ];
  const tabs = make("div", { className: "teacher-tabs teacher-analytics-tabs" });
  tabs.setAttribute("role", "tablist");
  for (const [value, label] of views) {
    const button = make("button", { type: "button", text: label });
    button.classList.toggle("active", state.analyticsView === value);
    button.setAttribute("aria-pressed", String(state.analyticsView === value));
    button.addEventListener("click", () => {
      state.analyticsView = value;
      renderActivity();
    });
    tabs.append(button);
  }
  wrap.append(tabs);

  const content = make("div", { className: "teacher-analytics-content" });
  if (state.analyticsView === "overview") {
    content.append(
      questionMistakesSection(questionStats, { limit: 8 }),
      formatsSection(formatStats),
      lessonsSection(lessonStats, { limit: 8 }),
      sessionsSection({ limit: 12 }),
    );
  }
  if (state.analyticsView === "questions") {
    content.append(questionMistakesSection(questionStats));
  }
  if (state.analyticsView === "formats") {
    content.append(formatsSection(formatStats));
  }
  if (state.analyticsView === "listening") {
    const listeningQuestionStats = questionStats.filter((item) =>
      ["listenChoice", "listenType"].includes(item.format),
    );
    content.append(
      formatsSection(formatStats, { listeningOnly: true }),
      questionMistakesSection(listeningQuestionStats),
      speakingSection(),
    );
  }
  if (state.analyticsView === "retries") content.append(retriesSection());
  if (state.analyticsView === "lessons") content.append(lessonsSection(lessonStats));
  if (state.analyticsView === "sessions") content.append(sessionsSection());
  wrap.append(content);
  elements.panel.replaceChildren(wrap);
}

function csvValues(value) {
  return String(value || "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
}

async function createPremiumTask(fields, button) {
  const lesson = state.lessons.find((item) => item.id === fields.lessonId);
  if (!lesson || !fields.titleEn.trim() || !fields.promptEn.trim()) {
    showToast("Choose a lesson and add an English title and prompt.", "error");
    return;
  }
  button.disabled = true;
  const isSpeaking = fields.taskType === "speaking";
  const payload = {
    lesson_id: lesson.id,
    stable_key: `${lesson.slug}-premium-${fields.taskType}-${Date.now().toString(36)}`,
    task_type: fields.taskType,
    title_en: fields.titleEn.trim(),
    title_ja: fields.titleJa.trim() || null,
    prompt_en: fields.promptEn.trim(),
    prompt_ja: fields.promptJa.trim() || null,
    instructions_en: fields.instructionsEn.trim() || null,
    instructions_ja: fields.instructionsJa.trim() || null,
    required_phrases: csvValues(fields.phrases),
    required_vocabulary: csvValues(fields.vocabulary),
    target_seconds: isSpeaking ? Math.max(30, Math.min(600, Number(fields.targetSeconds || 120))) : null,
    min_word_count: isSpeaking ? null : Math.max(10, Math.min(1000, Number(fields.minWords || 80))),
    max_word_count: isSpeaking ? null : Math.max(Number(fields.minWords || 80), Math.min(2000, Number(fields.maxWords || 180))),
    max_attempts: Math.max(1, Math.min(20, Number(fields.maxAttempts || 3))),
    active: true,
    created_by: state.session.user.id,
  };
  const { error } = await client.from("review_premium_tasks").insert(payload);
  if (error) {
    showToast(readableError(error, "The Premium task could not be created."), "error");
    button.disabled = false;
    return;
  }
  showToast("Premium review task created.", "success");
  await refreshDashboard();
}

async function setPremiumTaskActive(task, active, button) {
  button.disabled = true;
  const { error } = await client.from("review_premium_tasks").update({ active }).eq("id", task.id);
  if (error) {
    showToast(readableError(error, "The Premium task could not be updated."), "error");
    button.disabled = false;
    return;
  }
  showToast(active ? "Premium task reopened." : "Premium task hidden from learners.", "success");
  await refreshDashboard();
}

async function deletePremiumTask(task, button) {
  const submissions = state.taskSubmissions.filter((item) => item.task_id === task.id);
  if (submissions.length) {
    if (!window.confirm(teacherText(
      "This task has learner submissions and cannot be erased safely. Hide it from new submissions instead?",
      "この課題には提出履歴があるため、安全に削除できません。新しい提出から非表示にしますか？",
    ))) return;
    await setPremiumTaskActive(task, false, button);
    return;
  }
  if (!window.confirm(teacherText(
    `Permanently delete the unused task “${task.title_en}”?`,
    `未使用の課題「${task.title_ja || task.title_en}」を完全に削除しますか？`,
  ))) return;
  button.disabled = true;
  const { error } = await client.from("review_premium_tasks").delete().eq("id", task.id);
  if (error) {
    showToast(readableError(error, "The unused Premium task could not be deleted."), "error");
    button.disabled = false;
    return;
  }
  showToast("Unused Premium task deleted.", "success");
  await refreshDashboard();
}

async function openTeacherRecording(path, button) {
  button.disabled = true;
  const { data, error } = await client.storage
    .from("review-premium-recordings")
    .createSignedUrl(path, 900);
  button.disabled = false;
  if (error || !data?.signedUrl) {
    showToast(readableError(error, "The private recording could not be opened."), "error");
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

async function saveSubmissionFeedback(submission, values, action, button) {
  if (!values.feedbackEn.trim() && !values.feedbackJa.trim()) {
    showToast("Add English or Japanese feedback before saving.", "error");
    return;
  }
  button.disabled = true;
  const { error } = await saveTeacherSubmissionReview({
    submissionId: submission.id,
    action,
    score: values.score === "" ? null : Math.max(0, Math.min(100, Number(values.score))),
    feedbackEn: values.feedbackEn,
    feedbackJa: values.feedbackJa,
  });
  if (error) {
    showToast(readableError(error, "The review could not be saved."), "error");
    button.disabled = false;
    return;
  }
  showToast(
    action === "publish" ? "Feedback published to the learner." : action === "return" ? "Submission returned with feedback." : "Private feedback draft saved; learner cannot see it yet.",
    "success",
  );
  await refreshDashboard();
}

function premiumTaskBuilder() {
  const section = make("section", { className: "premium-admin-section" });
  section.append(
    make("h2", { text: teacherText("Create a Premium review task", "Premium添削課題を作成") }),
    make("p", { text: teacherText(
      "Speaking and essay tasks are visible only to Premium learners who can open the selected lesson.",
      "スピーキング・英作文課題は、選択したレッスンを利用できるPremium生徒だけに表示されます。",
    ) }),
  );
  const form = make("form", { className: "premium-task-builder" });
  const lesson = make("select");
  state.lessons.filter((item) => item.status === "published").forEach((item) => {
    const option = make("option", { text: `${item.title_en} · ${formatDate(item.lesson_date)}` });
    option.value = item.id;
    lesson.append(option);
  });
  const type = make("select");
  [["speaking", "Speaking recording"], ["essay", "Essay"]].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    type.append(option);
  });
  const titleEn = make("input"); titleEn.placeholder = teacherText("English task title", "英語の課題タイトル");
  const titleJa = make("input"); titleJa.placeholder = teacherText("Japanese title", "日本語タイトル");
  const promptEn = make("textarea"); promptEn.placeholder = teacherText("English prompt", "英語の課題文"); promptEn.rows = 3;
  const promptJa = make("textarea"); promptJa.placeholder = teacherText("Japanese prompt", "日本語の課題文"); promptJa.rows = 3;
  const instructionsEn = make("input"); instructionsEn.placeholder = teacherText("Extra instructions (English)", "追加指示（英語）");
  const instructionsJa = make("input"); instructionsJa.placeholder = teacherText("Extra instructions (Japanese)", "追加指示（日本語）");
  const phrases = make("input"); phrases.placeholder = teacherText("Required phrases, comma separated", "推奨フレーズ（カンマ区切り）");
  const vocabulary = make("input"); vocabulary.placeholder = teacherText("Required vocabulary, comma separated", "推奨単語（カンマ区切り）");
  const targetSeconds = make("input"); targetSeconds.type = "number"; targetSeconds.min = "30"; targetSeconds.max = "600"; targetSeconds.value = "120"; targetSeconds.placeholder = teacherText("Target seconds", "目標秒数");
  const minWords = make("input"); minWords.type = "number"; minWords.min = "10"; minWords.max = "1000"; minWords.value = "80"; minWords.placeholder = teacherText("Minimum words", "最小語数");
  const maxWords = make("input"); maxWords.type = "number"; maxWords.min = "10"; maxWords.max = "2000"; maxWords.value = "180"; maxWords.placeholder = teacherText("Maximum words", "最大語数");
  const maxAttempts = make("input"); maxAttempts.type = "number"; maxAttempts.min = "1"; maxAttempts.max = "20"; maxAttempts.value = "3"; maxAttempts.placeholder = teacherText("Attempts", "提出回数");
  const create = makeAction("Create task", () => createPremiumTask({
    lessonId: lesson.value,
    taskType: type.value,
    titleEn: titleEn.value,
    titleJa: titleJa.value,
    promptEn: promptEn.value,
    promptJa: promptJa.value,
    instructionsEn: instructionsEn.value,
    instructionsJa: instructionsJa.value,
    phrases: phrases.value,
    vocabulary: vocabulary.value,
    targetSeconds: targetSeconds.value,
    minWords: minWords.value,
    maxWords: maxWords.value,
    maxAttempts: maxAttempts.value,
  }, create));
  create.className = "primary-btn";
  const syncTypeFields = () => {
    targetSeconds.hidden = type.value !== "speaking";
    minWords.hidden = type.value !== "essay";
    maxWords.hidden = type.value !== "essay";
  };
  type.addEventListener("change", syncTypeFields);
  syncTypeFields();
  form.addEventListener("submit", (event) => event.preventDefault());
  form.append(lesson, type, titleEn, titleJa, promptEn, promptJa, instructionsEn, instructionsJa, phrases, vocabulary, targetSeconds, minWords, maxWords, maxAttempts, create);
  section.append(form);
  return section;
}

function premiumTaskList() {
  const section = make("section", { className: "premium-admin-section" });
  section.append(make("h2", { text: teacherText("Premium tasks", "Premium課題") }));
  if (!state.premiumTasks.length) {
    section.append(make("p", { text: teacherText("No Premium tasks have been created yet.", "Premium課題はまだありません。") }));
    return section;
  }
  const { table, tbody } = makeTable([
    teacherText("Task", "課題"),
    teacherText("Lesson", "レッスン"),
    teacherText("Type", "種類"),
    teacherText("Topics", "トピック"),
    teacherText("Status", "状態"),
    teacherText("Submissions", "提出数"),
    teacherText("Actions", "操作"),
  ]);
  state.premiumTasks.forEach((task) => {
    const submissions = teacherVisibleSubmissions().filter((item) => item.task_id === task.id);
    const hasStoredSubmission = state.taskSubmissions.some((item) => item.task_id === task.id);
    const actions = make("div", { className: "table-actions" });
    const toggle = makeAction(task.active ? "Hide" : "Reopen", () => setPremiumTaskActive(task, !task.active, toggle));
    const remove = makeAction(hasStoredSubmission ? "Hide (history kept)" : "Delete", () => deletePremiumTask(task, remove));
    remove.classList.add("danger-action");
    actions.append(toggle, remove);
    const row = make("tr");
    row.append(
      make("td", { text: teacherLanguage === "ja" ? task.title_ja || task.title_en : task.title_en }),
      make("td", { text: lessonTitle(task.lesson_id) }),
      make("td", { text: task.task_type === "speaking" ? teacherText("Speaking", "スピーキング") : teacherText("Essay", "英作文") }),
      make("td", { text: teacherText(`${task.topics?.length || 0} choices`, `${task.topics?.length || 0}件`) }),
      make("td", { text: task.active ? teacherText("Active", "有効") : teacherText("Hidden", "非表示") }),
      make("td", { text: submissions.length }),
      make("td"),
    );
    row.lastElementChild.append(actions);
    tbody.append(row);
  });
  const wrap = make("div", { className: "table-scroll" });
  wrap.append(table);
  section.append(wrap);
  return section;
}

function premiumSubmissionQueue() {
  const section = make("section", { className: "premium-admin-section" });
  const visibleSubmissions = teacherVisibleSubmissions();
  const waitingStatuses = new Set(["submitted", "in_review"]);
  const submissions = state.submissionStatusFilter === "all"
    ? visibleSubmissions
    : state.submissionStatusFilter === "waiting"
      ? visibleSubmissions.filter((item) => waitingStatuses.has(item.status))
      : visibleSubmissions.filter((item) => item.status === state.submissionStatusFilter);
  section.append(
    make("h2", { text: teacherText("Submission queue", "提出・添削") }),
    make("p", { text: teacherText(
      "Feedback drafts stay private until Publish or Return is selected. The teacher writes and remains responsible for every published review.",
      "添削の下書きは「公開」または「修正を依頼」を選ぶまで生徒には表示されません。公開する内容は先生が作成し、責任を持って確認します。",
    ) }),
  );
  const filter = make("select");
  [
    ["waiting", teacherText("Waiting for review", "添削待ち")],
    ["all", teacherText("All submissions", "すべての提出")],
    ["submitted", teacherText("Newly submitted", "新規提出")],
    ["in_review", teacherText("Review in progress", "添削中")],
    ["reviewed", teacherText("Feedback published", "添削公開済み")],
    ["returned", teacherText("Returned for revision", "修正依頼済み")],
  ].forEach(([value, label]) => {
    const option = make("option", { text: label });
    option.value = value;
    filter.append(option);
  });
  filter.value = state.submissionStatusFilter;
  filter.setAttribute("aria-label", teacherText("Filter submissions", "提出を絞り込む"));
  filter.addEventListener("change", () => {
    state.submissionStatusFilter = filter.value;
    renderPremium();
  });
  section.append(filter);
  if (!submissions.length) {
    section.append(make("p", { text: visibleSubmissions.length
      ? teacherText("No submissions match this filter.", "この条件に一致する提出はありません。")
      : teacherText("No learner submissions yet.", "生徒からの提出はまだありません。") }));
    return section;
  }
  const list = make("div", { className: "premium-review-list" });
  submissions.forEach((submission) => {
    const task = state.premiumTasks.find((item) => item.id === submission.task_id);
    const topic = Array.isArray(task?.topics)
      ? task.topics.find((item) => item.key === submission.selected_topic_key)
      : null;
    const feedback = state.submissionFeedback.find((item) => item.submission_id === submission.id);
    const card = make("article", { className: "premium-review-card" });
    card.append(
      make("span", { text: `${submissionStatusLabel(submission.status)} · ${formatDate(submission.submitted_at || submission.created_at, true)}` }),
      make("h3", { text: `${profileName(submission.user_id)} · ${teacherLanguage === "ja" ? task?.title_ja || task?.title_en || "Premium課題" : task?.title_en || "Premium task"}` }),
      make("p", { text: teacherText(
        `${task?.task_type || "task"} · attempt ${submission.attempt_number}`,
        `${task?.task_type === "speaking" ? "スピーキング" : task?.task_type === "essay" ? "英作文" : "課題"} · ${submission.attempt_number}回目`,
      ) }),
    );
    if (topic) {
      card.append(make("p", {
        className: "premium-submission-topic",
        text: teacherText(`Chosen topic: ${topic.title_en}`, `選択トピック：${topic.title_ja || topic.title_en}`),
      }));
    }
    if (submission.text_response) {
      const response = make("details");
      response.append(make("summary", { text: "Read submitted essay" }), make("p", { className: "premium-response-text", text: submission.text_response }));
      card.append(response);
    }
    if (submission.audio_object_path) {
      const play = makeAction("Open private recording", () => openTeacherRecording(submission.audio_object_path, play));
      card.append(play);
    }
    const review = make("div", { className: "premium-feedback-editor" });
    const score = make("input"); score.type = "number"; score.min = "0"; score.max = "100"; score.value = feedback?.score ?? ""; score.placeholder = teacherText("Score / 100", "スコア／100");
    const feedbackEn = make("textarea"); feedbackEn.rows = 4; feedbackEn.value = feedback?.feedback_en || ""; feedbackEn.placeholder = teacherText("Feedback in English", "英語フィードバック");
    const feedbackJa = make("textarea"); feedbackJa.rows = 4; feedbackJa.value = feedback?.feedback_ja || ""; feedbackJa.placeholder = teacherText("Feedback in Japanese", "日本語フィードバック");
    const values = () => ({ score: score.value, feedbackEn: feedbackEn.value, feedbackJa: feedbackJa.value });
    const actions = make("div", { className: "premium-task-actions" });
    const save = makeAction("Save private draft", () => saveSubmissionFeedback(submission, values(), "draft", save));
    const publish = makeAction("Publish feedback", () => {
      if (window.confirm(teacherText("Publish this score and feedback to the learner now?", "このスコアとフィードバックを生徒へ公開しますか？"))) saveSubmissionFeedback(submission, values(), "publish", publish);
    });
    publish.className = "primary-btn";
    const returnWork = makeAction("Return for revision", () => {
      if (window.confirm(teacherText("Return this work so the learner can revise and resubmit it?", "生徒が修正して再提出できるよう、この課題を差し戻しますか？"))) saveSubmissionFeedback(submission, values(), "return", returnWork);
    });
    actions.append(save, publish, returnWork);
    review.append(score, feedbackEn, feedbackJa, actions);
    card.append(review);
    list.append(card);
  });
  section.append(list);
  return section;
}

function renderPremium() {
  const wrap = make("div", { className: "premium-admin" });
  if (!state.premiumSchemaReady) {
    wrap.append(make("p", { className: "control-warning", text: "Apply the Premium database migration before using review tasks." }));
    elements.panel.replaceChildren(wrap);
    return;
  }
  wrap.append(premiumTaskBuilder(), premiumTaskList(), premiumSubmissionQueue());
  elements.panel.replaceChildren(wrap);
}

function renderAccessCodes() {
  elements.panel.replaceChildren(renderAccessCodeManager());
}

function renderSources() {
  const wrap = make("div", { className: "teacher-list-view" });
  const heading = make("div", { className: "teacher-panel-heading" });
  heading.append(
    make("div", { text: teacherText("Lesson sources", "教材ソース") }),
    make("p", { text: teacherText(
      "Check where each lesson came from and whether its source link is available.",
      "各レッスンの出典と、参照リンクの有無を確認できます。",
    ) }),
  );
  wrap.append(heading);
  const { table, tbody } = makeTable([
    teacherText("Lesson", "レッスン"),
    teacherText("Source", "出典"),
    teacherText("Link", "リンク"),
    teacherText("Content version", "教材バージョン"),
    teacherText("Updated", "更新日"),
  ]);
  state.lessons.forEach((lesson) => {
    const linkCell = make("td");
    const notionUrl = safeNotionLink(lesson.source_notion_url);
    if (notionUrl) {
      const link = make("a", { text: teacherText("Open source ↗", "ソースを開く ↗") });
      link.href = notionUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      linkCell.append(link);
    } else {
      linkCell.textContent = teacherText("Source link missing", "元資料リンク未登録");
    }
    const row = make("tr");
    row.append(
      make("td", { text: teacherLanguage === "ja" ? lesson.title_ja || lesson.title_en : lesson.title_en }),
      make("td", { text: lesson.source_type === "legacy_zip"
        ? teacherText("Bundled original", "同梱された初期教材")
        : lesson.source_type === "notion"
          ? "Notion"
          : teacherText("Teacher-created", "先生が作成") }),
      linkCell,
      make("td", { text: lesson.content_version || 1 }),
      make("td", { text: formatDate(lesson.updated_at || lesson.lesson_date, true) }),
    );
    tbody.append(row);
  });
  const scroll = make("div", { className: "table-scroll" });
  scroll.append(table);
  wrap.append(scroll);
  elements.panel.replaceChildren(wrap);
}

function renderDashboard() {
  const wrap = make("div", { className: "teacher-list-view" });
  const now = Date.now();
  const recentCutoff = now - 30 * 86400000;
  const recentLearners = state.profiles.filter((profile) => {
    const createdAt = new Date(profile.created_at || 0).getTime();
    return Number.isFinite(createdAt) && createdAt >= recentCutoff && createdAt <= now;
  }).length;
  const planTiers = [
    ["free", "Free", "無料"],
    ["standard", "Standard", "スタンダード"],
    ["premium", "Premium", "プレミアム"],
    ["premium_plus", "Premium+", "プレミアムプラス"],
  ];
  const planCounts = Object.fromEntries(planTiers.map(([key]) => [key, 0]));
  state.profiles.forEach((profile) => {
    const membership = membershipFor(profile.user_id);
    const startsAt = new Date(membership?.starts_at || 0).getTime();
    const expiresAt = new Date(membership?.expires_at || 0).getTime();
    const planKey = membership?.status === "active" && startsAt <= now && expiresAt > now
      ? planFor(membership.plan_tier).key
      : "free";
    planCounts[planKey] += 1;
  });
  const waiting = teacherVisibleSubmissions().filter((item) => ["submitted", "in_review"].includes(item.status)).length;
  const expiringSoon = state.memberships.filter((membership) => {
    const expiry = new Date(membership.expires_at || 0).getTime();
    return membership.status === "active" && expiry > now && expiry < now + 14 * 86400000;
  }).length;
  const draftCount = state.lessons.filter((lesson) => ["draft", "review"].includes(lesson.status)).length;
  const overviewHeading = make("div", { className: "teacher-panel-heading" });
  overviewHeading.append(
    make("div", { text: teacherText("Learner overview", "生徒の概要") }),
    make("p", { text: teacherText(
      "Active memberships by plan; learners without active access count as Free. New learners joined in the last 30 days.",
      "有効な会員プラン別の人数です。利用中でない生徒は無料に含み、新規生徒は直近30日間の登録数です。",
    ) }),
  );
  const learnerOverview = make("section", { className: "dashboard-shell" });
  const recentCard = make("article", { className: "dashboard-card" });
  recentCard.append(
    make("span", { text: teacherText("New learners (30 days)", "新規生徒（30日間）") }),
    make("strong", { text: recentLearners }),
  );
  learnerOverview.append(recentCard);
  planTiers.forEach(([key, english, japanese]) => {
    const card = make("article", { className: "dashboard-card" });
    card.append(
      make("span", { text: teacherText(english, japanese) }),
      make("strong", { text: planCounts[key] }),
    );
    learnerOverview.append(card);
  });
  const heading = make("div", { className: "teacher-panel-heading" });
  heading.append(
    make("div", { text: teacherText("What needs attention", "今必要な作業") }),
    make("p", { text: teacherText(
      "Open a card to continue the most common teacher jobs.",
      "カードを開いて、よく使う先生の作業を続けられます。",
    ) }),
  );
  wrap.append(overviewHeading, learnerOverview, heading);
  const jobs = make("section", { className: "dashboard-shell" });
  [
    ["submissions", waiting, teacherText("Submissions waiting", "添削待ちの提出")],
    ["lessons", draftCount, teacherText("Drafts to finish", "未完成の下書き")],
    ["learners", expiringSoon, teacherText("Access ending in 14 days", "14日以内に期限終了")],
    ["codes", state.accessCodes.filter((code) => accessCodeStatus(code).key === "unused").length, teacherText("Unused access codes", "未使用アクセスコード")],
  ].forEach(([tab, value, label]) => {
    const card = make("button", { className: "dashboard-card", type: "button" });
    card.append(make("span", { text: label }), make("strong", { text: value }));
    card.addEventListener("click", () => {
      state.tab = tab;
      renderActiveTab();
    });
    jobs.append(card);
  });
  wrap.append(jobs);
  elements.panel.replaceChildren(wrap);
}

function renderActiveTab() {
  for (const button of elements.tabs) {
    button.classList.toggle("active", button.dataset.teacherTab === state.tab);
  }
  if (elements.dashboardMetrics) elements.dashboardMetrics.hidden = state.tab !== "dashboard";
  if (state.tab === "dashboard") renderDashboard();
  if (state.tab === "lessons") renderLessons("lessons");
  if (state.tab === "learners") renderStudents();
  if (state.tab === "codes") renderAccessCodes();
  if (state.tab === "submissions") renderPremium();
  if (state.tab === "sources") renderSources();
  if (state.tab === "insights") renderActivity();
  applyTeacherLanguage(elements.panel);
}

function orderedQuestions() {
  return [...state.questions].sort(
    (left, right) =>
      Number(left.position || 0) - Number(right.position || 0) ||
      left.stable_key.localeCompare(right.stable_key),
  );
}

function activeQuestionCount() {
  return state.questions.filter((question) => question.active).length;
}

function syncQuestionCountToLesson() {
  const lesson = state.lessons.find((item) => item.id === state.questionLesson?.id);
  if (lesson) lesson.review_questions = [{ count: state.questions.length }];
}

function questionPrompt(question) {
  const payload = question.payload && typeof question.payload === "object" ? question.payload : {};
  return bilingualValue(payload.prompt, payload.promptJa || payload.promptJP || "");
}

function questionAccessLabel(question) {
  const key = question.required_plan || "free";
  const plan = planFor(key).name;
  if (key === "free") return plan;
  return teacherText(
    `${plan} or above · ${question.locked_display === "hidden" ? "hidden below plan" : "safe teaser below plan"}`,
    `${plan}以上 · ${question.locked_display === "hidden" ? "対象外には非表示" : "対象外には内容を隠した案内"}`,
  );
}

function renderQuestionManager() {
  const lesson = state.questionLesson;
  if (!lesson) return;
  const questions = orderedQuestions();
  const active = activeQuestionCount();
  elements.questionManagerHeading.textContent = teacherLanguage === "ja"
    ? lesson.title_ja || lesson.title_en
    : lesson.title_en;
  elements.questionManagerMeta.textContent = teacherText(
    `${formatDate(lesson.lesson_date)} · ${statusLabel(lesson.status)} · ${active} active · ${questions.length - active} inactive`,
    `${formatDate(lesson.lesson_date)} · ${statusLabel(lesson.status)} · 有効 ${active}問 · 無効 ${questions.length - active}問`,
  );

  if (!questions.length) {
    elements.questionManagerPanel.replaceChildren(
      make("p", {
        text: "No questions yet. Add the first question, then preview and publish the lesson.",
      }),
    );
    return;
  }

  const { table, tbody } = makeTable([
    "Order",
    "Question",
    "Section",
    "Format",
    "Access",
    "State",
    "Actions",
  ]);
  questions.forEach((question, index) => {
    const prompt = questionPrompt(question);
    const questionCell = make("td");
    questionCell.append(make("strong", { text: teacherLanguage === "ja"
      ? prompt.jp || prompt.en || teacherText("Untitled question", "タイトル未設定の問題")
      : prompt.en || teacherText("Untitled question", "タイトル未設定の問題") }));
    if (prompt.jp) questionCell.append(make("br"), make("small", { text: prompt.jp }));
    questionCell.append(make("br"), make("small", { text: question.stable_key }));

    const actions = make("td", { className: "table-actions" });
    const up = makeAction("↑", () => moveQuestion(question, -1, up), "Move up");
    const down = makeAction("↓", () => moveQuestion(question, 1, down), "Move down");
    up.disabled = index === 0 || state.questionLoading;
    down.disabled = index === questions.length - 1 || state.questionLoading;
    const edit = makeAction("Edit", () => openQuestionEditor(question));
    const toggle = makeAction(
      question.active ? teacherText("Mark inactive", "無効にする") : teacherText("Restore", "復元"),
      () => setQuestionActive(question, !question.active, toggle),
      question.active
        ? "Keep the question for records but remove it from learner practice"
        : "Return this question to learner practice",
    );
    actions.append(up, down, edit, toggle);

    const status = make("span", {
      className: `status-dot${question.active ? " published" : ""}`,
      text: question.active ? teacherText("Active", "有効") : teacherText("Inactive", "無効"),
    });
    const row = make("tr");
    row.append(
      make("td", { text: index + 1 }),
      questionCell,
      make("td", { text: question.section || "—" }),
      make("td", { text: formatQuestionLabel(question.format) }),
      make("td", { text: questionAccessLabel(question) }),
      make("td"),
      actions,
    );
    row.children[5].append(status);
    tbody.append(row);
  });
  elements.questionManagerPanel.replaceChildren(table);
}

async function loadLessonQuestions(lesson, { open = false } = {}) {
  state.questionLesson = lesson;
  state.questions = [];
  state.questionLoading = true;
  elements.questionManagerHeading.textContent = teacherLanguage === "ja"
    ? lesson.title_ja || lesson.title_en
    : lesson.title_en;
  elements.questionManagerMeta.textContent =
    `${formatDate(lesson.lesson_date)} · ${statusLabel(lesson.status)}`;
  elements.questionManagerStatus.textContent = teacherText("Loading questions…", "問題を読み込んでいます…");
  elements.questionManagerPanel.replaceChildren(make("p", { text: teacherText("Loading secure question data…", "安全な問題データを読み込んでいます…") }));
  if (open && !elements.questionManager.open) elements.questionManager.showModal();

  let data;
  let error;
  try {
    ({ data, error } = await client
      .from("review_questions")
      .select(
        "id,lesson_id,stable_key,position,section,format,payload,is_original,points,active,required_plan,locked_display",
      )
      .eq("lesson_id", lesson.id)
      .order("position", { ascending: true })
      .order("stable_key", { ascending: true }));
  } catch (caught) {
    error = caught;
  }

  state.questionLoading = false;
  if (error) {
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The questions could not be loaded.",
    );
    elements.questionManagerPanel.replaceChildren(make("p", {
      text: teacherText("Question data is unavailable right now.", "現在、問題データを利用できません。"),
    }));
    return false;
  }
  state.questions = Array.isArray(data) ? data : [];
  syncQuestionCountToLesson();
  elements.questionManagerStatus.textContent = teacherText(
    "Changes are saved securely. Questions are never permanently deleted here.",
    "変更は安全に保存されます。この画面で問題が完全に削除されることはありません。",
  );
  renderQuestionManager();
  return true;
}

function openQuestionManager(lesson) {
  loadLessonQuestions(lesson, { open: true });
}

async function moveQuestion(question, direction, button) {
  if (state.questionLoading) return;
  const current = orderedQuestions();
  const from = current.findIndex((item) => item.id === question.id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= current.length) return;

  const moved = [...current];
  [moved[from], moved[to]] = [moved[to], moved[from]];
  state.questionLoading = true;
  button.disabled = true;
  elements.questionManagerStatus.textContent = teacherText("Saving the new order…", "新しい順番を保存しています…");

  const updates = moved
    .map((item, position) => ({ item, position }))
    .filter(({ item, position }) => Number(item.position) !== position);
  let results;
  try {
    results = await Promise.all(
      updates.map(({ item, position }) =>
        client.from("review_questions").update({ position }).eq("id", item.id),
      ),
    );
  } catch (error) {
    state.questionLoading = false;
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The order could not be saved. Reload the question manager and try again.",
    );
    await loadLessonQuestions(state.questionLesson);
    return;
  }
  const failed = results.find((result) => result.error);
  if (failed) {
    elements.questionManagerStatus.textContent = readableError(
      failed.error,
      "The order could not be saved. The list has been reloaded.",
    );
    await loadLessonQuestions(state.questionLesson);
    return;
  }

  state.questions = moved.map((item, position) => ({ ...item, position }));
  state.questionLoading = false;
  elements.questionManagerStatus.textContent = teacherText("Question order saved.", "問題の順番を保存しました。");
  renderQuestionManager();
}

async function setQuestionActive(question, active, button) {
  if (
    !active &&
    question.active &&
    state.questionLesson?.status === "published" &&
    activeQuestionCount() === 1
  ) {
    elements.questionManagerStatus.textContent = teacherText(
      "A published lesson must keep at least one active question. Move the lesson back to Draft first.",
      "公開中のレッスンには有効な問題が最低1問必要です。先にレッスンを下書きへ戻してください。",
    );
    return;
  }

  button.disabled = true;
  const label = button.textContent;
  button.textContent = active
    ? teacherText("Restoring…", "復元しています…")
    : teacherText("Updating…", "更新しています…");
  let error;
  try {
    ({ error } = await client
      .from("review_questions")
      .update({ active })
      .eq("id", question.id)
      .eq("lesson_id", state.questionLesson.id));
  } catch (caught) {
    error = caught;
  }
  button.disabled = false;
  button.textContent = label;
  if (error) {
    elements.questionManagerStatus.textContent = readableError(
      error,
      "The question state could not be changed.",
    );
    return;
  }

  state.questions = state.questions.map((item) =>
    item.id === question.id ? { ...item, active } : item,
  );
  elements.questionManagerStatus.textContent = active
    ? teacherText("Question restored to learner practice.", "問題を生徒の練習へ復元しました。")
    : teacherText("Question marked inactive. Its records were kept.", "問題を無効にしました。これまでの記録は保持されています。");
  renderQuestionManager();
}

function questionAnswerExample(format) {
  return JSON.stringify(QUESTION_FORMATS[format]?.example || {}, null, 2);
}

function updateQuestionAnswerHelp({ replaceDefault = false } = {}) {
  const format = elements.questionFormat.value;
  const example = questionAnswerExample(format);
  const oldExample = elements.questionEditor.dataset.answerExample || "";
  const current = elements.questionAnswerPayload.value.trim();
  if (replaceDefault || (!elements.questionRecordId.value && (!current || current === oldExample))) {
    elements.questionAnswerPayload.value = example;
  }
  elements.questionEditor.dataset.answerExample = example;

  const extra = format === "speaking"
    ? teacherText(
      " Use the dedicated speaking target fields; an empty JSON object is valid.",
      " 発話目標の専用欄を使用してください。詳細JSONは空のオブジェクトで構いません。",
    )
    : ["listenChoice", "listenType"].includes(format)
      ? teacherText(
        " Add the sentence to the Listening audio text field.",
        " リスニング音声文の欄に、読み上げる英文を入力してください。",
      )
      : "";
  elements.questionAnswerHelp.textContent = teacherText(
    `${formatQuestionLabel(format)}: use Easy Answer Builder above. Advanced JSON normally needs no changes.${extra}`,
    `${formatQuestionLabel(format)}：上の「かんたん回答設定」を使えます。詳細JSONは通常変更不要です。${extra}`,
  );
  const choiceFormat = ["mcq", "situation", "dialogue", "listenChoice"].includes(format);
  const acceptedFormat = ["typing", "translation", "listenType", "mistake"].includes(format);
  elements.easyChoiceFields.hidden = !choiceFormat;
  elements.easyAcceptedField.hidden = !acceptedFormat;
  elements.questionAudioText.closest("label").hidden = !["listenChoice", "listenType"].includes(format);
  elements.questionSpeakText.closest("label").hidden = format !== "speaking";
  elements.questionSpeakJa.closest("label").hidden = format !== "speaking";
}

function openQuestionEditor(question = null) {
  const lesson = state.questionLesson;
  if (!lesson) return;
  elements.questionEditorForm.reset();
  elements.questionEditorStatus.textContent = "";
  elements.questionRecordId.value = question?.id || "";
  elements.questionEditorHeading.textContent = question
    ? teacherText("Edit question", "問題を編集")
    : teacherText("Add question", "問題を追加");

  if (!question) {
    elements.questionStableKey.value =
      `${lesson.slug}-custom-${Date.now().toString(36)}`;
    elements.questionSection.value = "Extra Practice";
    elements.questionFormat.value = "mcq";
    elements.questionRequiredPlan.value = "free";
    elements.questionLockedDisplay.value = "blur";
    elements.questionPromptEn.value = "";
    elements.questionPromptJa.value = "";
    elements.easyChoiceAEn.value = "";
    elements.easyChoiceAJa.value = "";
    elements.easyChoiceBEn.value = "";
    elements.easyChoiceBJa.value = "";
    elements.easyCorrectChoice.value = "a";
    elements.easyAcceptedAnswers.value = "";
    elements.questionEditor.dataset.answerExample = "";
    updateQuestionAnswerHelp({ replaceDefault: true });
    elements.questionEditor.showModal();
    return;
  }

  const payload =
    question.payload && typeof question.payload === "object" && !Array.isArray(question.payload)
      ? question.payload
      : {};
  const format = question.format || payload.format || payload.type || "mcq";
  const prompt = bilingualValue(
    payload.prompt || (format === "typing" ? "Type this sentence in English." : ""),
    payload.promptJa || payload.promptJP || "",
  );
  const hint = bilingualValue(payload.hint, payload.hintJa || "");
  const explanation = bilingualValue(payload.explanation, payload.explanationJa || "");
  elements.questionStableKey.value = question.stable_key;
  elements.questionSection.value = question.section || payload.section || "";
  elements.questionFormat.value = format;
  elements.questionRequiredPlan.value = question.required_plan || "free";
  elements.questionLockedDisplay.value = question.locked_display || "blur";
  elements.questionPromptEn.value = prompt.en;
  elements.questionPromptJa.value = prompt.jp;
  elements.questionHintEn.value = hint.en;
  elements.questionHintJa.value = hint.jp;
  elements.questionExplanationEn.value = explanation.en;
  elements.questionExplanationJa.value = explanation.jp;
  elements.questionAudioText.value = readHumanText(payload.audioText, "en");
  elements.questionSpeakText.value = readHumanText(payload.speakText, "en");
  elements.questionSpeakJa.value = readHumanText(payload.speakJa, "jp");
  const firstChoice = bilingualValue(payload.choices?.[0]?.en ?? payload.choices?.[0]?.text ?? "", payload.choices?.[0]?.jp || "");
  const secondChoice = bilingualValue(payload.choices?.[1]?.en ?? payload.choices?.[1]?.text ?? "", payload.choices?.[1]?.jp || "");
  elements.easyChoiceAEn.value = firstChoice.en;
  elements.easyChoiceAJa.value = firstChoice.jp;
  elements.easyChoiceBEn.value = secondChoice.en;
  elements.easyChoiceBJa.value = secondChoice.jp;
  elements.easyCorrectChoice.value = ["a", "b"].includes(String(payload.correct))
    ? String(payload.correct)
    : "a";
  elements.easyAcceptedAnswers.value = Array.isArray(payload.accepted)
    ? payload.accepted.join("\n")
    : "";
  elements.questionAnswerPayload.value = JSON.stringify(questionPayloadDetails(payload), null, 2);
  elements.questionEditor.dataset.answerExample = "";
  updateQuestionAnswerHelp();
  elements.questionEditor.showModal();
}

function parseQuestionDetails() {
  let details;
  try {
    details = JSON.parse(elements.questionAnswerPayload.value || "{}");
  } catch {
    throw new Error("Answer & format details must be valid JSON.");
  }
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    throw new Error("Answer & format details must be one JSON object.");
  }
  const managed = Object.keys(details).filter((key) => MANAGED_QUESTION_PAYLOAD_KEYS.has(key));
  if (managed.length) {
    throw new Error(
      `Use the dedicated fields for ${managed.join(", ")} instead of adding them to the JSON.`,
    );
  }
  return details;
}

function applyEasyAnswerFields(details, format) {
  const next = { ...details };
  if (["mcq", "situation", "dialogue", "listenChoice"].includes(format)) {
    const first = elements.easyChoiceAEn.value.trim();
    const second = elements.easyChoiceBEn.value.trim();
    if (first || second) {
      next.choices = [
        { id: "a", en: first, jp: elements.easyChoiceAJa.value.trim() },
        { id: "b", en: second, jp: elements.easyChoiceBJa.value.trim() },
      ];
      next.correct = elements.easyCorrectChoice.value === "b" ? "b" : "a";
    }
  }
  if (["typing", "translation", "listenType", "mistake"].includes(format)) {
    const accepted = elements.easyAcceptedAnswers.value
      .split(/\n+/)
      .map((answer) => answer.trim())
      .filter(Boolean);
    if (accepted.length) next.accepted = accepted;
  }
  return next;
}

function validateQuestionDetails(format, details, fields) {
  const choiceFormats = ["mcq", "situation", "dialogue", "listenChoice"];
  if (choiceFormats.includes(format)) {
    if (!Array.isArray(details.choices) || details.choices.length < 2) {
      throw new Error("Add at least two choices to the answer JSON.");
    }
    const ids = details.choices.map((choice) => String(choice?.id ?? ""));
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
      throw new Error("Every choice needs a unique, non-empty id.");
    }
    if (!ids.includes(String(details.correct ?? ""))) {
      throw new Error("The correct value must match one of the choice ids.");
    }
  }
  if (format === "truefalse" && typeof details.correct !== "boolean") {
    throw new Error("True / false JSON needs a boolean correct value.");
  }
  if (["typing", "translation", "listenType", "mistake"].includes(format)) {
    if (
      !Array.isArray(details.accepted) ||
      !details.accepted.some((answer) => String(answer || "").trim())
    ) {
      throw new Error("Add at least one accepted answer.");
    }
  }
  if (format === "mistake" && !String(details.wrongSentence || "").trim()) {
    throw new Error("Correct-the-mistake questions need a wrongSentence value.");
  }
  if (format === "order") {
    if (!Array.isArray(details.words) || !details.words.length) {
      throw new Error("Word-order JSON needs a non-empty words array.");
    }
    const hasCorrectWords = Array.isArray(details.correctWords) && details.correctWords.length;
    const hasCorrectOrder = Array.isArray(details.correctOrder) && details.correctOrder.length;
    if (!hasCorrectWords && !hasCorrectOrder) {
      throw new Error("Word-order JSON needs correctWords or a legacy correctOrder array.");
    }
  }
  if (
    format === "matching" &&
    (!Array.isArray(details.pairs) ||
      !details.pairs.length ||
      details.pairs.some(
        (pair) => !readHumanText(pair?.en ?? pair?.left, "en") || !readHumanText(pair?.jp ?? pair?.right, "jp"),
      ))
  ) {
    throw new Error("Matching JSON needs one or more English/Japanese pairs.");
  }
  if (format === "sorting") {
    if (!Array.isArray(details.categories) || !details.categories.length) {
      throw new Error("Sorting JSON needs at least one category.");
    }
    if (!Array.isArray(details.items) || !details.items.length) {
      throw new Error("Sorting JSON needs at least one item.");
    }
    const categories = new Set(details.categories.map((category) => readHumanText(category, "en")));
    const invalidItem = details.items.find((item) => {
      const text = Array.isArray(item) ? item[0] : item?.text ?? item?.en;
      const category = Array.isArray(item) ? item[1] : item?.category ?? item?.correct;
      return !readHumanText(text, "en") || !categories.has(readHumanText(category, "en"));
    });
    if (invalidItem) {
      throw new Error("Every sorting item needs text and one of the listed categories.");
    }
  }
  if (
    format === "grid" &&
    ![
      "top-left",
      "top-center",
      "top-right",
      "middle-left",
      "center",
      "middle-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ].includes(details.correctCell)
  ) {
    throw new Error("Choose a valid position-grid correctCell value.");
  }
  if (["listenChoice", "listenType"].includes(format) && !fields.audioText) {
    throw new Error("Listening questions need Listening audio text.");
  }
  if (format === "speaking" && !fields.speakText) {
    throw new Error("Speaking questions need an English speaking target.");
  }
}

function buildQuestionPayload(question, stableKey, section, format, details, fields) {
  const payload = {
    ...details,
    id: stableKey,
    format,
    type: format,
    section,
    prompt: { en: fields.promptEn, jp: fields.promptJa },
    hint: { en: fields.hintEn, jp: fields.hintJa },
    explanation: { en: fields.explanationEn, jp: fields.explanationJa },
    isOriginal: question ? question.is_original !== false : false,
  };
  if (fields.audioText) payload.audioText = fields.audioText;
  if (fields.speakText) payload.speakText = fields.speakText;
  if (fields.speakJa) payload.speakJa = fields.speakJa;
  return payload;
}

async function saveQuestion(event) {
  event.preventDefault();
  if (state.questionSaving || !state.questionLesson) return;
  const recordId = elements.questionRecordId.value;
  const existing = state.questions.find((question) => question.id === recordId) || null;
  const stableKey = elements.questionStableKey.value.trim();
  const section = elements.questionSection.value.trim();
  const format = elements.questionFormat.value;
  const requiredPlan = elements.questionRequiredPlan.value;
  const lockedDisplay = elements.questionLockedDisplay.value;
  const fields = {
    promptEn: elements.questionPromptEn.value.trim(),
    promptJa: elements.questionPromptJa.value.trim(),
    hintEn: elements.questionHintEn.value.trim(),
    hintJa: elements.questionHintJa.value.trim(),
    explanationEn: elements.questionExplanationEn.value.trim(),
    explanationJa: elements.questionExplanationJa.value.trim(),
    audioText: elements.questionAudioText.value.trim(),
    speakText: elements.questionSpeakText.value.trim(),
    speakJa: elements.questionSpeakJa.value.trim(),
  };

  try {
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(stableKey)) {
      throw new Error(
        "Use letters, numbers, dots, underscores, colons, or hyphens in the stable key.",
      );
    }
    if (stableKey.length > 180) throw new Error("Keep the stable key under 181 characters.");
    if (
      state.questions.some(
        (question) => question.id !== recordId && question.stable_key === stableKey,
      )
    ) {
      throw new Error("That stable key is already used in this lesson.");
    }
    if (!fields.promptEn) throw new Error("Add the English prompt.");
    const details = applyEasyAnswerFields(parseQuestionDetails(), format);
    validateQuestionDetails(format, details, fields);
    const payload = buildQuestionPayload(
      existing,
      stableKey,
      section,
      format,
      details,
      fields,
    );
    if (
      state.questionLesson.status === "published" &&
      !window.confirm(teacherText(
        "This lesson is published. Saving this question will update live learner practice now. Continue?",
        "このレッスンは公開中です。保存すると生徒の練習内容がすぐに更新されます。続けますか？",
      ))
    ) {
      return;
    }
    const row = {
      stable_key: stableKey,
      section: section || null,
      format,
      payload,
      points: questionPoints(payload),
      required_plan: requiredPlan,
      locked_display: lockedDisplay,
    };

    state.questionSaving = true;
    const submit = elements.questionEditorForm.querySelector("button[type='submit']");
    submit.disabled = true;
    elements.questionEditorStatus.textContent = teacherText("Saving question…", "問題を保存しています…");
    let result;
    if (existing) {
      result = await client
        .from("review_questions")
        .update(row)
        .eq("id", existing.id)
        .eq("lesson_id", state.questionLesson.id);
    } else {
      result = await client.from("review_questions").insert({
        ...row,
        lesson_id: state.questionLesson.id,
        position:
          state.questions.reduce(
            (maximum, question) => Math.max(maximum, Number(question.position)),
            -1,
          ) + 1,
        is_original: false,
        active: true,
      });
    }
    if (result.error) throw result.error;

    elements.questionEditor.close();
    showToast(existing ? "Question updated." : "Question added.");
    await loadLessonQuestions(state.questionLesson);
  } catch (error) {
    elements.questionEditorStatus.textContent = readableError(
      error,
      error?.message || "The question could not be saved.",
    );
  } finally {
    state.questionSaving = false;
    const submit = elements.questionEditorForm.querySelector("button[type='submit']");
    if (submit) submit.disabled = false;
  }
}

async function countActiveQuestionsForLesson(lessonId) {
  const { count, error } = await client
    .from("review_questions")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("active", true);
  if (error) throw error;
  return Number(count || 0);
}

function updateLessonEditorControls(lesson = null) {
  const saved = Boolean(lesson?.id || elements.editorId.value);
  const status = elements.editorStatus.value;
  const count = lesson ? questionCount(lesson) : 0;
  elements.manageLessonQuestions.disabled = !saved;
  elements.preview.disabled = !saved;
  elements.editorQuestionSummary.textContent = saved
    ? teacherText(
      `${count} questions are attached. Open the question manager to add, edit, reorder or activate them.`,
      `${count}問あります。追加・編集・並べ替え・有効化ができます。`,
    )
    : teacherText(
      "Save the lesson details first. The question builder will open automatically next.",
      "先に基本情報を保存すると、続けて問題作成画面が開きます。",
    );
  elements.saveLesson.textContent = !saved
    ? teacherText("Save draft & add questions", "保存して問題作成へ")
    : status === "published"
      ? teacherText("Publish changes", "変更を公開")
      : teacherText("Save changes", "変更を保存");
}

function openEditor(lesson = null) {
  elements.editorForm.reset();
  elements.editorMessage.textContent = "";
  elements.editorId.value = lesson?.id || "";
  elements.editorHeading.textContent = lesson
    ? teacherText("Edit lesson", "レッスンを編集")
    : teacherText("New draft lesson", "新しい下書きレッスン");
  elements.editorTitle.value = lesson?.title_en || "";
  elements.editorDate.value = lesson?.lesson_date || new Date().toISOString().slice(0, 10);
  elements.editorStatus.value = lesson?.status || "draft";
  elements.editorAudience.value = lesson?.audience || "both";
  elements.editorIsPreview.checked = Boolean(lesson?.is_preview);
  elements.editorSummary.value = lesson?.summary_en || "";
  updateLessonEditorControls(lesson);
  elements.editor.showModal();
}

function previewLesson(lesson) {
  const url = new URL("/lesson.html", window.location.origin);
  url.searchParams.set("id", lesson.slug);
  url.searchParams.set("preview", "1");
  url.searchParams.set("previewPlan", elements.previewPlan?.value || "premium_plus");
  window.open(url.href, "_blank", "noopener,noreferrer");
}

async function archiveLesson(lesson) {
  const confirmed = window.confirm(
    teacherText(
      `Archive “${lesson.title_en}”? It will be hidden, but its content and learner records will be kept.`,
      `「${lesson.title_ja || lesson.title_en}」をアーカイブしますか？非表示になりますが、教材と学習記録は保持されます。`,
    ),
  );
  if (!confirmed) return;
  const { error } = await client
    .from("review_lessons")
    .update({ status: "archived" })
    .eq("id", lesson.id);
  if (error) {
    showToast(readableError(error, "The lesson could not be archived."), "error");
    return;
  }
  showToast("Lesson archived. Nothing was deleted.");
  await refreshDashboard();
}

async function restoreLesson(lesson) {
  const confirmed = window.confirm(
    teacherText(
      `Restore “${lesson.title_en}” to Published? It will become visible to its selected audience again.`,
      `「${lesson.title_ja || lesson.title_en}」を公開状態へ復元しますか？選択した公開先に再表示されます。`,
    ),
  );
  if (!confirmed) return;
  try {
    const active = await countActiveQuestionsForLesson(lesson.id);
    if (!active) {
      showToast("This lesson has no active questions. Restore questions first, then publish it.", "error");
      return;
    }
    const { error } = await client
      .from("review_lessons")
      .update({ status: "published" })
      .eq("id", lesson.id);
    if (error) throw error;
    showToast("Lesson restored and published.", "success");
    await refreshDashboard();
  } catch (error) {
    showToast(readableError(error, "The lesson could not be restored."), "error");
  }
}

async function permanentlyDeleteLesson(lesson) {
  const expected = `DELETE ${lesson.slug}`;
  const typed = window.prompt(
    teacherText(
      `Permanent deletion cannot be undone. It is allowed only for archived lessons with no learner history.\n\nType exactly: ${expected}`,
      `完全削除は元に戻せません。学習履歴がないアーカイブ済みレッスンだけが対象です。\n\n次の文字を正確に入力してください：${expected}`,
    ),
  );
  if (typed === null) return;
  if (typed !== expected) {
    showToast("The confirmation did not match. Nothing was deleted.", "error");
    return;
  }
  try {
    const { data, error } = await client.rpc("review_permanently_delete_lesson", {
      lesson_to_delete: lesson.id,
      confirmation_text: typed,
    });
    if (error) throw error;
    if (data !== true) throw new Error("The deletion was not confirmed by the server.");
    showToast("The unused lesson was permanently deleted.", "success");
    await refreshDashboard();
  } catch (error) {
    showToast(
      readableError(
        error,
        error?.message || "The lesson could not be deleted. Keep it archived if learner history exists.",
      ),
      "error",
    );
  }
}

async function saveLesson(event) {
  event.preventDefault();
  const id = elements.editorId.value;
  const wasNew = !id;
  const status = elements.editorStatus.value;
  if (status === "published") {
    if (!id) {
      elements.editorMessage.textContent = teacherText(
        "Save this as a draft first, add at least one question, then publish it.",
        "先に下書きで保存し、問題を1問以上追加してから公開してください。",
      );
      return;
    }
    elements.editorMessage.textContent = teacherText("Checking active questions…", "有効な問題を確認しています…");
    try {
      const active = await countActiveQuestionsForLesson(id);
      if (!active) {
        elements.editorMessage.textContent = teacherText(
          "Add and activate at least one question before publishing this lesson.",
          "公開前に、少なくとも1問を作成して有効にしてください。",
        );
        return;
      }
    } catch (error) {
      elements.editorMessage.textContent = readableError(
        error,
        "Active questions could not be verified, so the lesson was not published.",
      );
      return;
    }
    if (!window.confirm(teacherText(
      "Publish this lesson to its selected audience now?",
      "このレッスンを選択した公開先へ今すぐ公開しますか？",
    ))) return;
  }

  const title = elements.editorTitle.value.trim();
  const lessonDate = elements.editorDate.value;
  const payload = {
    title_en: title,
    lesson_date: lessonDate,
    status,
    audience: elements.editorAudience.value,
    is_preview: elements.editorIsPreview.checked,
    summary_en: elements.editorSummary.value.trim() || null,
  };

  if (!title || !lessonDate) {
    elements.editorMessage.textContent = teacherText("Add a title and lesson date.", "レッスン名と日付を入力してください。");
    return;
  }

  elements.editorMessage.textContent = teacherText("Saving…", "保存しています…");
  let result;
  if (id) {
    result = await client.from("review_lessons").update(payload).eq("id", id);
  } else {
    payload.slug = `custom-${lessonDate}-${Date.now().toString(36)}`;
    payload.source_type = "manual";
    payload.created_by = state.session.user.id;
    result = await client.from("review_lessons")
      .insert(payload)
      .select("id,slug,lesson_date,title_en,title_ja,summary_en,summary_ja,status,audience,source_type,source_notion_url,source_segment,content_version,content,is_preview")
      .single();
  }

  if (result.error) {
    elements.editorMessage.textContent = readableError(
      result.error,
      "The lesson could not be saved.",
    );
    return;
  }
  elements.editor.close();
  showToast(wasNew
    ? "Draft saved. Add the first practice question now."
    : status === "published" ? "Lesson published." : "Lesson saved privately.");
  await refreshDashboard();
  if (wasNew && result.data?.id) {
    const created = state.lessons.find((lesson) => lesson.id === result.data.id) || result.data;
    openQuestionManager(created);
  }
}

async function assignLesson(studentId, lessonId, button) {
  button.disabled = true;
  button.textContent = teacherText("Assigning…", "割り当てています…");
  const { error } = await client.from("review_assignments").upsert(
    {
      lesson_id: lessonId,
      student_id: studentId,
      assigned_by: state.session.user.id,
      status: "assigned",
    },
    { onConflict: "lesson_id,student_id" },
  );
  button.disabled = false;
  button.textContent = teacherText("Assign", "割り当て");
  if (error) {
    showToast(readableError(error, "The lesson could not be assigned."), "error");
    return;
  }
  showToast("Assignment saved.");
  await refreshDashboard();
}

function bundledLessonRow(lesson, status, audience, sourceType) {
  const isLegacy = sourceType === "legacy_zip";
  const rawSourceSegment = lesson.sourceSegment ?? lesson.source_segment ?? "full";
  if (!sourceSegmentIsValid(rawSourceSegment)) {
    throw new Error(`${lesson.id || "Lesson"}: source segment must use letters, numbers and hyphens (80 characters maximum).`);
  }
  if (sourceType === "notion" && !String(lesson.sourceNotionPageId || "").trim()) {
    throw new Error(`${lesson.id || "Lesson"}: a Notion source page ID is required.`);
  }
  const sourceSegment = sourceSegmentFromLesson(lesson);
  return {
    slug: lesson.id,
    lesson_date: lesson.lessonDate,
    title_en: lesson.title,
    title_ja: lesson.takiTitle || lesson.titleJa || null,
    summary_en: lesson.summary || null,
    summary_ja: lesson.summaryJa || null,
    status,
    audience,
    source_type: sourceType,
    source_notion_page_id: lesson.sourceNotionPageId || null,
    source_notion_url: lesson.sourceNotionUrl || null,
    source_segment: sourceSegment,
    content_version: lesson.contentVersion || 1,
    content: {
      bundled: true,
      sourceSegment,
      partIndex: sourceSegmentPartIndex(sourceSegment),
      themes: lesson.themes || [],
      phrases: lesson.phrases || [],
      categoryLabels: lesson.categoryLabels || {},
      originalQuestionCount: isLegacy ? lesson.originalQuestionCount : 0,
    },
  };
}

function questionPoints(question) {
  if (question.type === "matching" || question.format === "matching") {
    return Math.max(1, question.pairs?.length || 1);
  }
  if (question.type === "sorting" || question.format === "sorting") {
    return Math.max(1, question.items?.length || 1);
  }
  return 1;
}

async function upsertLessonBundle(lesson, questions, defaults) {
  const row = bundledLessonRow(lesson, defaults.status, defaults.audience, defaults.sourceType);
  let existing = null;
  if (row.source_type === "notion") {
    const lookup = await client
      .from("review_lessons")
      .select("id, status, audience")
      .eq("source_type", "notion")
      .eq("source_notion_page_id", row.source_notion_page_id)
      .eq("source_segment", row.source_segment)
      .maybeSingle();
    if (lookup.error) throw lookup.error;
    existing = lookup.data;
  } else {
    const lookup = await client
      .from("review_lessons")
      .select("id, status, audience")
      .eq("slug", row.slug)
      .maybeSingle();
    if (lookup.error) throw lookup.error;
    existing = lookup.data;
  }

  let lessonRecord;
  if (existing) {
    // A reviewed Notion lesson keeps the teacher's current status and audience.
    delete row.status;
    delete row.audience;
    const update = await client
      .from("review_lessons")
      .update(row)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (update.error) throw update.error;
    lessonRecord = update.data;
  } else {
    const onConflict = row.source_type === "notion"
      ? "source_type,source_notion_page_id,source_segment"
      : "slug";
    const insert = await client
      .from("review_lessons")
      .upsert(row, { onConflict })
      .select("id")
      .single();
    if (insert.error) throw insert.error;
    lessonRecord = insert.data;
  }

  const records = questions.map((question, index) => ({
    lesson_id: lessonRecord.id,
    stable_key: question.id,
    position: index,
    section: question.section || null,
    format: question.format || question.type,
    payload: question,
    is_original: Boolean(question.isOriginal),
    points: questionPoints(question),
    active: true,
  }));

  for (let start = 0; start < records.length; start += 100) {
    const batch = records.slice(start, start + 100);
    const { error } = await client
      .from("review_questions")
      .upsert(batch, { onConflict: "lesson_id,stable_key" });
    if (error) throw error;
  }
}

async function syncBundledContent(button) {
  if (state.syncing) return;
  const confirmed = window.confirm(teacherText(
    "Refresh the six published bundled lessons and their activities? Private Notion drafts remain outside the public website bundle.",
    "公開済みの同梱6レッスンとアクティビティを再同期しますか？非公開のNotion下書きは公開サイトへ含まれません。",
  ));
  if (!confirmed) return;

  state.syncing = true;
  button.disabled = true;
  const originalText = button.textContent;
  try {
    const [legacyResponse, additionsResponse] = await Promise.all([
      fetch("/src/data/legacy-lessons.json"),
      fetch("/src/data/legacy-additions.json"),
    ]);
    if (![legacyResponse, additionsResponse].every((response) => response.ok)) {
      throw new Error("Bundled content files could not be loaded.");
    }
    const [legacy, additions] = await Promise.all([
      legacyResponse.json(),
      additionsResponse.json(),
    ]);

    let completed = 0;
    const total = legacy.length;
    for (const lesson of legacy) {
      button.textContent = teacherText(
        `Syncing ${completed + 1} / ${total}`,
        `同期中 ${completed + 1} / ${total}`,
      );
      await upsertLessonBundle(lesson, [...lesson.questions, ...(additions[lesson.id] || [])], {
        status: "published",
        audience: "both",
        sourceType: "legacy_zip",
      });
      completed += 1;
    }
    showToast("The six published lessons and activities are now in sync.");
    await refreshDashboard();
  } catch (error) {
    showToast(readableError(error, "Bundled content could not be synced."), "error");
  } finally {
    state.syncing = false;
    button.disabled = false;
    button.textContent = originalText;
  }
}

function addSyncButton() {
  if (!elements.newLesson || document.querySelector("#syncBundledContent")) return;
  const button = make("button", {
    className: "secondary-btn",
    text: "Sync bundled content / 初期データ再同期",
    type: "button",
    title: "保守用：コードに同梱された6件の初期レッスンを再同期します",
  });
  button.id = "syncBundledContent";
  button.addEventListener("click", () => syncBundledContent(button));
  elements.newLesson.before(button);
}

async function initialise() {
  applyTeacherLanguage();
  setupTeacherHeaderSettings();
  const signOutState = new URLSearchParams(window.location.search).get("signedOut");
  const signOutMessage = !signOutState
    ? ""
    : signOutState === "local"
      ? teacherText(
        "The local session was cleared. Remote sign-out could not be confirmed.",
        "ローカルセッションを消去しました。サーバー側のログアウト確認は完了していません。",
      )
      : teacherText("Signed out safely.", "安全にログアウトしました。");
  if (elements.language) {
    elements.language.value = teacherLanguage;
    elements.language.addEventListener("change", () => setTeacherLanguage(elements.language.value));
  }
  if (!client) {
    showLogin("The secure connection library could not be loaded.");
    return;
  }
  if (elements.previewPlan) {
    try {
      const savedPreviewPlan = window.localStorage.getItem(TEACHER_PREVIEW_PLAN_STORAGE_KEY);
      if (["free", "standard", "premium", "premium_plus"].includes(savedPreviewPlan)) {
        elements.previewPlan.value = savedPreviewPlan;
      }
    } catch {
      // Free remains the safe default when storage is unavailable.
    }
    elements.previewPlan.addEventListener("change", () => {
      try {
        window.localStorage.setItem(TEACHER_PREVIEW_PLAN_STORAGE_KEY, elements.previewPlan.value);
      } catch {
        // The current selection still works for this page visit.
      }
    });
  }
  addSyncButton();
  if (elements.googleSignIn) {
    void googleStudentAuthAvailable().then((available) => {
      elements.googleSignIn.disabled = !available;
    });
    elements.googleSignIn.addEventListener("click", async () => {
      elements.loginStatus.textContent = teacherText("Opening Google sign-in…", "Googleログインを開いています…");
      const { data, error } = await signInTeacherWithGoogle();
      if (error) {
        elements.loginStatus.textContent = readableError(error, "Google sign-in is not available right now.");
        return;
      }
      if (data?.url) window.location.assign(data.url);
      else elements.loginStatus.textContent = teacherText("Google sign-in is not available right now.", "現在Googleログインを利用できません。");
    });
  }
  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.loginStatus.textContent = teacherText("Signing in…", "ログインしています…");
    const { data, error } = await signInTeacher(
      elements.email.value.trim(),
      elements.password.value,
    );
    if (error) {
      showLogin(readableError(error, "Sign-in failed."));
      return;
    }
    await enterStudio(data.session);
  });

  elements.logout.addEventListener("click", async () => {
    elements.logout.disabled = true;
    const { error } = await signOutTeacher();
    // Always rebuild the page/client from cleared local storage. This is
    // important when the SDK sign-out request times out: merely showing the
    // login panel could leave the old client session alive in memory.
    const result = error ? "local" : "complete";
    window.location.replace(`/teacher.html?signedOut=${result}`);
  });

  for (const button of elements.tabs) {
    button.addEventListener("click", () => {
      state.tab = button.dataset.teacherTab;
      renderActiveTab();
    });
  }

  elements.newLesson.addEventListener("click", () => openEditor());
  elements.editorForm.addEventListener("submit", saveLesson);
  elements.editorStatus.addEventListener("change", () => {
    const lesson = state.lessons.find((item) => item.id === elements.editorId.value) || null;
    updateLessonEditorControls(lesson);
  });
  elements.manageLessonQuestions.addEventListener("click", () => {
    const lesson = state.lessons.find((item) => item.id === elements.editorId.value);
    if (!lesson) {
      elements.editorMessage.textContent = teacherText(
        "Save the lesson first; the question builder will open automatically.",
        "先にレッスンを保存してください。続けて問題作成画面が自動で開きます。",
      );
      return;
    }
    elements.editor.close();
    openQuestionManager(lesson);
  });
  elements.preview.addEventListener("click", () => {
    const lesson = state.lessons.find((item) => item.id === elements.editorId.value);
    if (lesson) previewLesson(lesson);
    else elements.editorMessage.textContent = teacherText("Save the draft before previewing it.", "プレビュー前に下書きを保存してください。");
  });
  elements.newQuestion.addEventListener("click", () => openQuestionEditor());
  elements.previewQuestions.addEventListener("click", () => {
    if (!state.questionLesson) return;
    if (!activeQuestionCount()) {
      elements.questionManagerStatus.textContent = teacherText(
        "Activate at least one question before opening the learner preview.",
        "生徒プレビューを開く前に、問題を1問以上有効にしてください。",
      );
      return;
    }
    previewLesson(state.questionLesson);
  });
  elements.questionFormat.addEventListener("change", () => updateQuestionAnswerHelp());
  elements.questionTemplate.addEventListener("click", () => {
    updateQuestionAnswerHelp({ replaceDefault: true });
    const format = elements.questionFormat.value;
    if (["mcq", "situation", "dialogue", "listenChoice"].includes(format)) {
      elements.easyChoiceAEn.value ||= "Natural answer";
      elements.easyChoiceAJa.value ||= "自然な答え";
      elements.easyChoiceBEn.value ||= "Other answer";
      elements.easyChoiceBJa.value ||= "別の答え";
      elements.easyChoiceAEn.focus();
    } else if (["typing", "translation", "listenType", "mistake"].includes(format)) {
      elements.easyAcceptedAnswers.value ||= "Natural English answer";
      elements.easyAcceptedAnswers.focus();
    } else if (format === "speaking") {
      elements.questionSpeakText.focus();
    }
    elements.questionEditorStatus.textContent = teacherText(
      "Starter content added. Replace the sample English with the real question content.",
      "ひな形を入れました。サンプル英文を実際の問題内容に書き換えてください。",
    );
  });
  elements.questionEditorForm.addEventListener("submit", saveQuestion);
  elements.cancelQuestion.addEventListener("click", () => elements.questionEditor.close());
  elements.questionManager.addEventListener("close", () => {
    renderActiveTab();
  });

  const session = await getTeacherSession();
  if (!session) {
    showLogin(signOutMessage);
  } else {
    await enterStudio(session);
  }

  onTeacherAuthChange((session, event) => {
    if (event === "SIGNED_OUT") showLogin();
    if (event === "TOKEN_REFRESHED" && session) state.session = session;
  });
}

initialise();
