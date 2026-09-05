import { playInterfaceSound } from "./audio.js?v=20260906-studio1";

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const installedRoots = new WeakSet();

const feedbackOrigin = (anchor) => {
  const rect = anchor.getBoundingClientRect();
  return {
    left: rect.left + rect.width / 2,
    top: Math.max(24, rect.top + Math.min(rect.height / 2, 90)),
  };
};

const renderCorrectBurst = (anchor, speaking) => {
  const burst = document.createElement("div");
  burst.className = `celebration-burst${speaking ? " speaking-burst" : ""}`;
  burst.setAttribute("aria-hidden", "true");
  const origin = feedbackOrigin(anchor);
  burst.style.left = `${origin.left}px`;
  burst.style.top = `${origin.top}px`;
  const symbols = speaking ? ["✨", "🎙️", "⭐", "💫", "👏"] : ["✨", "★", "✦", "●", "◆"];
  for (let index = 0; index < 12; index += 1) {
    const spark = document.createElement("span");
    spark.textContent = symbols[index % symbols.length];
    spark.style.setProperty("--angle", `${(360 / 12) * index}deg`);
    spark.style.setProperty("--distance", `${54 + (index % 4) * 15}px`);
    spark.style.setProperty("--delay", `${(index % 3) * 35}ms`);
    burst.append(spark);
  }
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 1100);
};

const renderRetryCue = (anchor) => {
  const cue = document.createElement("div");
  cue.className = "retry-cue";
  cue.setAttribute("aria-hidden", "true");
  const origin = feedbackOrigin(anchor);
  cue.style.left = `${origin.left}px`;
  cue.style.top = `${origin.top}px`;
  for (let index = 0; index < 6; index += 1) {
    const dot = document.createElement("span");
    dot.style.setProperty("--angle", `${(360 / 6) * index}deg`);
    dot.style.setProperty("--distance", `${32 + (index % 2) * 10}px`);
    dot.style.setProperty("--delay", `${index * 24}ms`);
    cue.append(dot);
  }
  document.body.append(cue);
  window.setTimeout(() => cue.remove(), 850);
};

export function animateAnswerFeedback(anchor, { correct = true, speaking = false } = {}) {
  if (!anchor || reduceMotion()) return;
  anchor.classList.remove("success-pop", "retry-nudge");
  void anchor.offsetWidth;
  if (correct) {
    anchor.classList.add("success-pop");
    renderCorrectBurst(anchor, speaking);
  } else {
    anchor.classList.add("retry-nudge");
    renderRetryCue(anchor);
  }
}

export function celebrate(anchor, { speaking = false } = {}) {
  animateAnswerFeedback(anchor, { correct: true, speaking });
}

export function installPlayfulInteractions(root = document) {
  if (!root || installedRoots.has(root)) return;
  installedRoots.add(root);

  const revealItems = [...root.querySelectorAll?.("[data-reveal]") || []];
  if (revealItems.length && !reduceMotion() && typeof IntersectionObserver === "function") {
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-index", String(index % 4));
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("revealed"));
  }

  root.addEventListener("pointerdown", (event) => {
    const target = event.target.closest("button:not(:disabled), a[href], select, summary, [role='button'], .lesson-card");
    if (!target) return;
    if (target.closest("[data-sfx='off']")) return;
    void playInterfaceSound("click");
    if (reduceMotion() || event.pointerType === "touch") return;
    for (let index = 0; index < 3; index += 1) {
      const sparkle = document.createElement("i");
      sparkle.className = "click-sparkle";
      sparkle.style.left = `${event.clientX + (index - 1) * 9}px`;
      sparkle.style.top = `${event.clientY - index * 5}px`;
      sparkle.style.setProperty("--spark-delay", `${index * 45}ms`);
      document.body.append(sparkle);
      window.setTimeout(() => sparkle.remove(), 700);
    }
  });

  root.addEventListener("click", (event) => {
    if (event.detail !== 0) return;
    const target = event.target.closest("button:not(:disabled), a[href], summary, [role='button']");
    if (!target || target.closest("[data-sfx='off']")) return;
    void playInterfaceSound("click");
  });
}
