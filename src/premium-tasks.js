import {
  fetchPremiumLessonTasks,
  getPremiumRecordingUrl,
  savePremiumTextSubmission,
  submitPremiumRecording,
} from "./supabase.js";

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
    items.push(`Phrases: ${task.required_phrases.join(" · ")}`);
  }
  if (Array.isArray(task.required_vocabulary) && task.required_vocabulary.length) {
    items.push(`Vocabulary: ${task.required_vocabulary.join(" · ")}`);
  }
  if (task.task_type === "speaking") items.push(`Target: about ${task.target_seconds} seconds`);
  if (task.task_type === "essay") items.push(`Length: ${task.min_word_count}–${task.max_word_count} words`);
  items.push(`Maximum attempts: ${task.max_attempts}`);
  const list = make("ul", { className: "premium-requirements" });
  items.forEach((item) => list.append(make("li", { text: item })));
  card.append(list);
};

const appendFeedback = (card, submission, feedbackRows, showJapanese) => {
  const feedback = feedbackRows.find((item) => item.submission_id === submission?.id && item.published_at);
  if (!feedback) return;
  const box = make("section", { className: "premium-feedback" });
  box.append(make("strong", { text: `Teacher feedback${feedback.score == null ? "" : ` · ${feedback.score}/100`}` }));
  if (feedback.feedback_en) box.append(make("p", { text: feedback.feedback_en }));
  if (showJapanese && feedback.feedback_ja) box.append(make("p", { className: "jp", text: feedback.feedback_ja }));
  if (feedback.ai_assisted) box.append(make("small", { text: "AI helped draft this feedback; the teacher reviewed and published it." }));
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
  card.append(response, count, actions);
  appendFeedback(card, submission, data.feedback, context.showJapanese);
};

const appendSpeakingTask = async (card, task, data, context) => {
  const submission = taskSubmission(data.submissions, task.id);
  const editable = !submission || ["draft", "returned"].includes(submission.status);
  const recorderPanel = make("div", { className: "premium-recorder" });
  const timer = make("strong", { text: "0:00" });
  const status = make("p", { text: editable ? "Ready to record. Your microphone stays on this device until you submit." : taskStatus(submission) });
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
  recorderPanel.append(timer, status, audio, actions);
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
  if (data.plan !== "premium") {
    const lock = make("article", { className: "premium-task-lock" });
    lock.append(
      make("span", { text: "PREMIUM" }),
      make("h2", { text: "Teacher-reviewed speaking & essay challenges" }),
      make("p", { text: "Premium members can record a speaking answer or submit an essay and receive personal teacher feedback." }),
      make("p", { className: "jp", text: "プレミアム会員は、スピーキング録音・英作文を提出し、先生から個別添削を受けられます。" }),
      make("a", { text: "See membership options / プランを見る" }),
    );
    lock.lastElementChild.href = "/#membership";
    lock.lastElementChild.className = "primary-btn";
    container.replaceChildren(lock);
    return;
  }
  if (!data.tasks.length) {
    container.hidden = true;
    return;
  }
  const heading = make("div", { className: "premium-task-heading" });
  heading.append(
    make("span", { text: "PREMIUM REVIEW" }),
    make("h2", { text: "Submit work for teacher feedback" }),
    make("p", { text: "Your submission is private. It is visible only to you and authorised teachers." }),
  );
  const list = make("div", { className: "premium-task-list" });
  const context = {
    showJapanese,
    showMessage,
    reload: () => renderPremiumLessonTasks({ lesson, container, showJapanese, showMessage }),
  };
  for (const task of data.tasks) {
    const card = make("article", { className: "premium-task-card" });
    const submission = taskSubmission(data.submissions, task.id);
    card.append(
      make("span", { className: "premium-task-type", text: task.task_type === "speaking" ? "Speaking / スピーキング" : "Essay / 英作文" }),
      make("h3", { text: task.title_en }),
    );
    if (showJapanese && task.title_ja) card.append(make("p", { className: "jp", text: task.title_ja }));
    card.append(make("p", { text: task.prompt_en }));
    if (showJapanese && task.prompt_ja) card.append(make("p", { className: "jp", text: task.prompt_ja }));
    if (task.instructions_en) card.append(make("small", { text: task.instructions_en }));
    appendRequirements(card, task);
    card.append(make("b", { className: "premium-submission-status", text: taskStatus(submission) }));
    if (task.task_type === "essay") appendEssayTask(card, task, data, context);
    else await appendSpeakingTask(card, task, data, context);
    list.append(card);
  }
  container.replaceChildren(heading, list);
}
