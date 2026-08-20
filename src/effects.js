import { playInterfaceSound } from "./audio.js?v=20260820-ambient2";

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

export function celebrate(anchor, { speaking = false } = {}) {
  if (!anchor || reduceMotion()) return;
  anchor.classList.remove("success-pop");
  void anchor.offsetWidth;
  anchor.classList.add("success-pop");

  const burst = document.createElement("div");
  burst.className = `celebration-burst${speaking ? " speaking-burst" : ""}`;
  burst.setAttribute("aria-hidden", "true");
  const rect = anchor.getBoundingClientRect();
  burst.style.left = `${rect.left + rect.width / 2}px`;
  burst.style.top = `${Math.max(24, rect.top + Math.min(rect.height / 2, 90))}px`;
  const symbols = speaking ? ["✨", "🎙️", "⭐", "💫", "👏"] : ["✨", "★", "●", "✦", "◆"];
  for (let index = 0; index < 14; index += 1) {
    const spark = document.createElement("span");
    spark.textContent = symbols[index % symbols.length];
    spark.style.setProperty("--angle", `${(360 / 14) * index}deg`);
    spark.style.setProperty("--distance", `${58 + (index % 4) * 17}px`);
    spark.style.setProperty("--delay", `${(index % 3) * 35}ms`);
    burst.append(spark);
  }
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 1100);
}

export function installPlayfulInteractions(root = document) {
  root.addEventListener("pointerdown", (event) => {
    const target = event.target.closest("button:not(:disabled), a.primary-btn, a.secondary-btn, .lesson-card, summary");
    if (!target) return;
    playInterfaceSound("click");
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
}
