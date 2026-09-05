import {
  DEMO_PERSONAS,
  getDemoPersona,
  resetDemoLearningData,
  setDemoPersonaKey,
} from "./personas.js";

const BOOLEAN_LABELS = Object.freeze({
  show_words: "Words",
  show_phrases: "Phrases",
  show_phonics: "Phonics",
  show_review_lessons: "Review lessons",
  show_homework: "Homework",
  show_progress: "Progress",
  show_pricing: "Price plan",
  show_contact_teacher: "Contact",
  show_trial_cta: "Trial CTA",
  show_payment_plan: "Payment guide",
});

const textNode = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
};

function renderDemoBar() {
  const persona = getDemoPersona();
  const bar = document.createElement("aside");
  bar.className = "local-demo-bar";
  bar.setAttribute("aria-label", "Local curriculum demo controls");
  bar.innerHTML = `
    <div class="local-demo-identity">
      <strong><span aria-hidden="true">◆</span> LOCAL DEMO</strong>
      <span>Local data only · Supabase access is unchanged</span>
    </div>
  `;

  const picker = document.createElement("label");
  picker.className = "local-demo-picker";
  picker.append(textNode("span", "", "Teacher view / 生徒設定"));
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Choose a teacher visibility persona");
  Object.values(DEMO_PERSONAS).forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.key;
    option.textContent = entry.label;
    option.selected = entry.key === persona.key;
    select.append(option);
  });
  select.addEventListener("change", () => {
    setDemoPersonaKey(select.value);
    const nextPersona = DEMO_PERSONAS[select.value];
    const nextCategory = nextPersona.settings.show_words !== false ? "words"
      : nextPersona.settings.show_phrases !== false ? "phrases" : "phonics";
    const nextLevel = nextPersona.settings.allowed_levels[0] || nextPersona.settings.allowed_level_min || 1;
    const url = new URL(window.location.href);
    url.pathname = "/learn";
    url.search = "";
    url.searchParams.set("category", nextCategory);
    url.searchParams.set("level", String(nextLevel));
    url.searchParams.set("persona", select.value);
    window.location.assign(`${url.pathname}${url.search}`);
  });
  picker.append(select);

  const details = document.createElement("details");
  details.className = "local-demo-details";
  const summary = document.createElement("summary");
  summary.textContent = "Teacher settings";
  const copy = textNode("p", "", `${persona.description} ${persona.descriptionJa}`);
  const flags = document.createElement("ul");
  Object.entries(BOOLEAN_LABELS).forEach(([key, label]) => {
    const enabled = persona.settings[key] !== false;
    const item = textNode("li", enabled ? "is-on" : "is-off", `${label} ${enabled ? "ON" : "OFF"}`);
    flags.append(item);
  });
  const exactLevels = persona.settings.allowed_levels;
  const levelCopy = exactLevels.length
    ? `Open levels: ${exactLevels.join(", ")}${persona.allowedItemIds.length ? " + one individually allowed item" : ""}`
    : `Open levels: ${persona.settings.allowed_level_min}–${persona.settings.allowed_level_max}`;
  flags.prepend(textNode("li", "is-level", levelCopy));
  if (persona.blockedItemIds.length) {
    flags.prepend(textNode("li", "is-level", `${persona.blockedItemIds.length} item blocked individually`));
  }
  details.append(summary, copy, flags);

  const reset = textNode("button", "local-demo-reset", "Reset demo progress");
  reset.type = "button";
  reset.addEventListener("click", () => {
    resetDemoLearningData();
    window.location.reload();
  });

  const teacher = textNode("a", "local-demo-teacher", "Teacher Studio ↗");
  teacher.href = `/teacher?persona=${persona.key}`;

  bar.append(picker, details, reset, teacher);
  document.body.prepend(bar);
  document.documentElement.dataset.localDemo = "true";
}

// The demo intentionally has no PWA worker. Unregister a stale worker left by
// an earlier localhost preview so fresh CSS and demo modules are always used.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .catch(() => {});
}

renderDemoBar();
