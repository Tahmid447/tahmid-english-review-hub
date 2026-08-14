import {
  fetchPremiumLessonTasks,
  getPremiumRecordingUrl,
  savePremiumTextSubmission,
  submitPremiumRecording,
} from "./supabase.js";
import { planMeetsRequirement } from "./plans.js";

const make = (tag, options = {}) => {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = String(options.text);
  return node;
};

const wordsIn = (value) => String(value || "").trim().split(/\s+/).filter(Boolean).length;

const taskStatus = (submission) => ({
  draft: "Draft saved / 下書き保存済み",
  submitted: "Submitted / 提出済み",
  in_review: "Teacher reviewing / 先生確認中",
  reviewed: "Feedback returned / 添削返却済み",
  returned: "Returned for revision / 再提出待ち",
}[submission?.status] || "Not submitted / 未提出");

const taskSubmission = (submissions, taskId) => (
  submissions.find((item) => item.task_id === taskId) || null
);

const appendRequirements = (card, task) => {
  const items = [];
  if (Array.isArray(task.required_phrases) && task.required_phrases.length) {
    items.push({ kind: "phrase", text: `Use: ${task.required_phrases.join(" · ")}` });
  }
  if (Array.isArray(task.required_vocabulary) && task.required_vocabulary.length) {
    items.push({ kind: "vocabulary", text: `Vocabulary: ${task.required_vocabulary.join(" · ")}` });
  }
  if (task.task_type === "speaking") items.push({ kind: "length", text: `Target: about ${task.target_seconds} seconds` });
  if (task.task_type === "essay") items.push({ kind: "length", text: `Length: ${task.min_word_count}–${task.max_word_count} words` });
  items.push({ kind: "attempts", text: `Up to ${task.max_attempts} attempts` });
  const list = make("ul", { className: "premium-requirements" });
  items.forEach((item) => {
    const row = make("li", { text: item.text });
    row.dataset.requirement = item.kind;
    list.append(row);
  });
  const block = make("section", { className: "premium-task-checklist" });
  block.append(make("strong", { text: "Before you submit / 提出前のチェック" }), list);
  card.append(block);
};

const appendFeedback = (card, submission, feedbackRows, showJapanese) => {
  const feedback = feedbackRows.find((item) => item.submission_id === submission?.id && item.published_at);
  if (!feedback) return;
  const box = make("section", { className: "premium-feedback" });
  box.setAttribute("aria-label", "Teacher feedback");
  const heading = make("header", { className: "premium-feedback-heading" });
  heading.append(
    make("span", { text: "TAHMID'S FEEDBACK / 先生からの添削" }),
    make("strong", { text: feedback.score == null ? "Reviewed" : `${feedback.score}/100` }),
  );
  box.append(heading);
  if (feedback.feedback_en) box.append(make("p", { text: feedback.feedback_en }));
  if (showJapanese && feedback.feedback_ja) box.append(make("p", { className: "jp", text: feedback.feedback_ja }));
  box.append(make("small", { text: "Personally reviewed and published by Tahmid. / Tahmidが確認して返却しました。" }));
  card.append(box);
};

const appendEssayTask = (card, task, data, context) => {
  const submission = taskSubmission(data.submissions, task.id);
  const editable = !submission || ["draft", "returned"].includes(submission.status);
  const response = make("textarea");
  response.rows = 9;
  response.maxLength = 20000;
  response.value = submission?.text_response || "";
  response.placeholder = "Write your essay here… / ここに英作文を書いてください";
  response.disabled = !editable;
  response.setAttribute("aria-label", "Your essay / 英作文の回答");
  const count = make("span", { className: "premium-word-count" });
  const updateCount = () => {
    const words = wordsIn(response.value);
    count.textContent = `${words} words · required ${task.min_word_count}–${task.max_word_count}`;
    count.dataset.valid = String(words >= task.min_word_count && words <= task.max_word_count);
  };
  response.addEventListener("input", updateCount);
  updateCount();
  const actions = make("div", { className: "premium-task-actions" });
  const save = make("button", { text: "Save draft / 下書き保存" });
  save.type = "button";
  const submit = make("button", { text: "Submit to teacher / 先生に提出" });
  submit.type = "button";
  submit.className = "primary-btn";
  save.disabled = !editable;
  submit.disabled = !editable;
  const perform = async (finalise, button) => {
    if (finalise) {
      const words = wordsIn(response.value);
      if (words < task.min_word_count || words > task.max_word_count) {
        context.showMessage(`Write between ${task.min_word_count} and ${task.max_word_count} words before submitting.`, "error");
        return;
      }
      if (!window.confirm("Submit this essay to the teacher? You cannot edit it while it is under review.")) return;
    }
    button.disabled = true;
    const { error } = await savePremiumTextSubmission({
      taskId: task.id,
      textResponse: response.value,
      submit: finalise,
      knownSubmissions: data.submissions,
    });
    if (error) {
      context.showMessage(error.message || "The essay could not be saved.", "error");
      button.disabled = false;
      return;
    }
    context.showMessage(finalise ? "Essay submitted to the teacher." : "Essay draft saved.", "success");
    await context.reload();
  };
  save.addEventListener("click", () => perform(false, save));
  submit.addEventListener("click", () => perform(true, submit));
  actions.append(save, submit);
  const responseField = make("label", { className: "premium-response-field" });
  responseField.append(make("span", { text: "Your essay / 英作文の回答" }), response);
  card.append(responseField, count, actions);
  appendFeedback(card, submission, data.feedback, context.showJapanese);
};

const appendSpeakingTask = async (card, task, data, context) => {
  const submission = taskSubmission(data.submissions, task.id);
  const editable = !submission || ["draft", "returned"].includes(submission.status);
  const recorderPanel = make("div", { className: "premium-recorder" });
  const timer = make("strong", { text: "0:00" });
  const status = make("p", { text: editable ? "Ready to record. Your microphone stays on this device until you submit." : taskStatus(submission) });
  timer.setAttribute("aria-label", "Recording time");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.hidden = true;
  let recorder = null;
  let stream = null;
  let chunks = [];
  let recording = null;
  let startedAt = 0;
  let durationSeconds = 0;
  let ticker = null;
  let previewUrl = "";

  if (submission?.audio_object_path) {
    const { data: signed } = await getPremiumRecordingUrl(submission.audio_object_path);
    if (signed?.signedUrl) {
      audio.src = signed.signedUrl;
      audio.hidden = false;
    }
  }

  const record = make("button", { text: "Record / 録音" });
  record.type = "button";
  const stop = make("button", { text: "Stop / 停止" });
  stop.type = "button";
  stop.disabled = true;
  const rerecord = make("button", { text: "Re-record / 録り直す" });
  rerecord.type = "button";
  rerecord.disabled = true;
  const submit = make("button", { text: "Submit recording / 録音を提出" });
  submit.type = "button";
  submit.className = "primary-btn";
  submit.disabled = true;
  record.disabled = !editable || !globalThis.MediaRecorder || !navigator.mediaDevices?.getUserMedia;

  const stopStream = () => {
    stream?.getTracks?.().forEach((track) => track.stop());
    stream = null;
  };
  const resetRecording = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
    recording = null;
    durationSeconds = 0;
    audio.removeAttribute("src");
    audio.hidden = true;
    timer.textContent = "0:00";
    status.textContent = "Ready to record again.";
    record.disabled = false;
    rerecord.disabled = true;
    submit.disabled = true;
  };
  record.addEventListener("click", async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data?.size) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        clearInterval(ticker);
        durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        recording = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(recording);
        audio.src = previewUrl;
        audio.hidden = false;
        status.textContent = "Listen to your recording, then submit or re-record.";
        record.disabled = true;
        stop.disabled = true;
        rerecord.disabled = false;
        submit.disabled = false;
        stopStream();
      });
      recorder.start();
      startedAt = Date.now();
      record.disabled = true;
      stop.disabled = false;
      status.textContent = "Recording…";
      ticker = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        timer.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
        if (elapsed >= Math.min(Number(task.target_seconds || 120) + 60, 900)) recorder?.stop();
      }, 250);
    } catch (error) {
      stopStream();
      record.disabled = false;
      context.showMessage(error?.message || "Microphone permission was not granted.", "error");
    }
  });
  stop.addEventListener("click", () => {
    if (recorder?.state === "recording") recorder.stop();
  });
  rerecord.addEventListener("click", resetRecording);
  submit.addEventListener("click", async () => {
    if (!recording) return;
    if (!window.confirm("Submit this recording to the teacher? You cannot replace it while it is under review.")) return;
    submit.disabled = true;
    const { error } = await submitPremiumRecording({
      taskId: task.id,
      recording,
      durationSeconds,
      knownSubmissions: data.submissions,
    });
    if (error) {
      context.showMessage(error.message || "The recording could not be submitted.", "error");
      submit.disabled = false;
      return;
    }
    context.showMessage("Recording submitted to the teacher.", "success");
    await context.reload();
  });
  const actions = make("div", { className: "premium-task-actions" });
  actions.append(record, stop, rerecord, submit);
  const steps = make("ol", { className: "premium-recorder-steps" });
  [
    "Record your answer / 回答を録音",
    "Listen before sending / 送信前に確認",
    "Submit to Tahmid / Tahmidへ提出",
  ].forEach((text) => steps.append(make("li", { text })));
  recorderPanel.append(steps, timer, status, audio, actions);
  if (!globalThis.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
    recorderPanel.append(make("small", { text: "Recording is not supported in this browser. Use a current Safari, Chrome or Edge browser." }));
  }
  card.append(recorderPanel);
  appendFeedback(card, submission, data.feedback, context.showJapanese);
};

export async function renderPremiumLessonTasks({ lesson, container, showJapanese = true, showMessage = () => {} }) {
  if (!container || !lesson?.databaseLessonId || lesson.locked) {
    if (container) container.hidden = true;
    return;
  }
  container.hidden = false;
  container.replaceChildren(make("p", { text: "Loading Premium review tasks…" }));
  const data = await fetchPremiumLessonTasks(lesson.databaseLessonId);
  if (data.error) {
    container.replaceChildren(make("p", { text: "Premium review tasks are temporarily unavailable." }));
    return;
  }
  if (!planMeetsRequirement(data.plan, "premium")) {
    const lock = make("article", { className: "premium-task-lock" });
    const preview = make("div", { className: "premium-lock-preview", text: "Speaking prompt · Essay brief · Personal corrections" });
    lock.append(
      make("span", { text: "PREMIUM" }),
      make("h2", { text: "Turn practice into personal feedback" }),
      make("p", { text: "Premium adds one teacher-reviewed speaking task and one essay task to every lesson, with feedback from Tahmid within three business days." }),
      make("p", { className: "jp", text: "Premiumでは、各レッスンのスピーキング課題1件・英作文課題1件を提出でき、Tahmidが3営業日以内に個別添削します。" }),
      preview,
      make("a", { text: "See membership options / プランを見る" }),
    );
    lock.lastElementChild.href = "/plans";
    lock.lastElementChild.className = "primary-btn";
    lock.lastElementChild.target = "_blank";
    lock.lastElementChild.rel = "noopener noreferrer";
    container.replaceChildren(lock);
    return;
  }
  if (!data.tasks.length) {
    container.hidden = true;
    return;
  }
  const heading = make("div", { className: "premium-task-heading" });
  const promise = make("ul", { className: "premium-review-promise" });
  [
    "Private until you submit / 提出までは非公開",
    "Reviewed by Tahmid / Tahmidが添削",
    "Returned within 3 business days / 3営業日以内に返却",
  ].forEach((text) => promise.append(make("li", { text })));
  heading.append(
    make("span", { text: "PREMIUM REVIEW" }),
    make("h2", { text: "Practise. Submit. Learn from personal corrections." }),
    make("p", { text: "Complete the lesson first, then use these challenges to turn today's English into your own words." }),
    promise,
  );
  const list = make("div", { className: "premium-task-list" });
  const context = {
    showJapanese,
    showMessage,
    reload: () => renderPremiumLessonTasks({ lesson, container, showJapanese, showMessage }),
  };
  for (const [taskIndex, task] of data.tasks.entries()) {
    const card = make("article", { className: "premium-task-card" });
    card.dataset.taskType = task.task_type;
    const submission = taskSubmission(data.submissions, task.id);
    const taskTop = make("div", { className: "premium-task-topline" });
    taskTop.append(
      make("span", { className: "premium-task-number", text: String(taskIndex + 1).padStart(2, "0") }),
      make("span", { className: "premium-task-type", text: task.task_type === "speaking" ? "Speaking / スピーキング" : "Essay / 英作文" }),
      make("b", { className: "premium-submission-status", text: taskStatus(submission) }),
    );
    card.append(
      taskTop,
      make("h3", { text: task.title_en }),
    );
    if (showJapanese && task.title_ja) card.append(make("p", { className: "jp", text: task.title_ja }));
    card.append(make("p", { text: task.prompt_en }));
    if (showJapanese && task.prompt_ja) card.append(make("p", { className: "jp", text: task.prompt_ja }));
    if (task.instructions_en) card.append(make("small", { text: task.instructions_en }));
    appendRequirements(card, task);
    if (task.task_type === "essay") appendEssayTask(card, task, data, context);
    else await appendSpeakingTask(card, task, data, context);
    list.append(card);
  }
  container.replaceChildren(heading, list);
}
