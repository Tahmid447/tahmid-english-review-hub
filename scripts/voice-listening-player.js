// Copied into the optional local listening report by verify-voices.mjs.
// Playback is started by a real button action and advances only after ended.
const articles = [...document.querySelectorAll("article")];
let queue = [];
let queueRunning = false;
const makeButton = (label) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.style.cssText = "font:inherit;padding:12px 18px;border-radius:10px;background:#167f78;color:white;border:0;cursor:pointer";
  return button;
};
const queueButton = makeButton("Play remaining samples sequentially");
const stopButton = makeButton("Stop playback");
const queueStatus = document.createElement("p");
queueStatus.id = "queue-status";
queueStatus.setAttribute("role", "status");
queueStatus.textContent = `Ready: ${articles.length} samples. Playback results and subjective listening checks are separate.`;
document.body.insertBefore(queueButton, articles[0]);
document.body.insertBefore(stopButton, articles[0]);
document.body.insertBefore(queueStatus, articles[0]);

function stopAll() {
  articles.forEach((article) => article.querySelector("audio").pause());
}
function fail(article, message) {
  article.querySelector('[role="status"]').textContent = `Error ${article.querySelector("h2").textContent}: ${message}`;
  article.dataset.playback = "error";
  queueRunning = false;
  queue = [];
  queueButton.disabled = false;
  queueStatus.textContent = "Playback stopped after an error. Retry the sample before continuing.";
}
function play(article) {
  stopAll();
  const audio = article.querySelector("audio");
  audio.currentTime = 0;
  audio.playbackRate = 1;
  audio.preservesPitch = true;
  article.dataset.playback = "loading";
  article.querySelector('[role="status"]').textContent = `Loading ${article.querySelector("h2").textContent}`;
  audio.play().catch((error) => fail(article, error.message));
}
function next() {
  if (!queueRunning) return;
  const article = queue.shift();
  if (!article) {
    queueRunning = false;
    queueButton.disabled = false;
    queueStatus.textContent = `Queue complete: ${articles.filter((item) => item.dataset.playback === "ended").length} samples ended.`;
    return;
  }
  queueStatus.textContent = `Playing ${article.querySelector("h2").textContent}. ${queue.length} remaining.`;
  play(article);
}
articles.forEach((article, index) => {
  const audio = article.querySelector("audio");
  const title = article.querySelector("h2").textContent;
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.textContent = `Ready ${title}`;
  const button = makeButton(`Play ${title}`);
  button.addEventListener("click", () => {
    queueRunning = false;
    queue = [];
    queueButton.disabled = false;
    play(article);
  });
  audio.addEventListener("playing", () => {
    article.dataset.playback = "playing";
    status.textContent = `Playing ${title}`;
  });
  audio.addEventListener("ended", () => {
    article.dataset.playback = "ended";
    article.dataset.endedAt = new Date().toISOString();
    status.textContent = `Ended ${title}`;
    next();
  });
  audio.addEventListener("error", () => fail(article, `media code ${audio.error?.code || "unknown"}`));
  article.dataset.qaIndex = String(index);
  article.dataset.playback = "ready";
  article.append(button, status);
});
queueButton.addEventListener("click", () => {
  queue = articles.filter((article) => article.dataset.playback !== "ended");
  queueRunning = true;
  queueButton.disabled = true;
  next();
});
stopButton.addEventListener("click", () => {
  stopAll();
  queueRunning = false;
  queue = [];
  queueButton.disabled = false;
  queueStatus.textContent = "Playback stopped. The next queue run retries unfinished samples.";
});
