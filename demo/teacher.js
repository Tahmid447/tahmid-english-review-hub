import {
  DEMO_BOOLEAN_SETTING_KEYS,
  DEMO_PERSONAS,
  getDemoPersona,
  getDemoPersonaKey,
  resetDemoPersonaSettings,
  saveDemoPersonaSettings,
  setDemoPersonaKey,
} from "./personas.js";

const LEARNING_FIELDS = Object.freeze([
  ["show_dashboard", "Dashboard", "Learning home and personal summary"],
  ["show_words", "Words", "Vocabulary library"],
  ["show_phrases", "Phrases", "Useful conversation library"],
  ["show_phonics", "Phonics", "Sounds, mouth shape and rhythm"],
  ["show_review_lessons", "Review lessons", "Past lesson review catalogue"],
  ["show_homework", "Homework", "Teacher-assigned practice"],
  ["show_progress", "Progress & favorites", "Ratings, due items and saved cards"],
  ["show_announcements", "Teacher announcements", "Notes shared by Tahmid"],
]);
const COMMERCIAL_FIELDS = Object.freeze([
  ["show_pricing", "Price plan", "Pricing page and navigation"],
  ["show_contact_teacher", "Contact Tahmid", "Teacher contact pathway"],
  ["show_trial_cta", "Trial lesson CTA", "Trial booking invitation"],
  ["show_payment_plan", "Payment guidance", "Plan and payment instructions"],
]);

const refs = {
  list: document.querySelector("#demoStudentList"),
  form: document.querySelector("#demoSettingsForm"),
  learning: document.querySelector("#demoLearningSettings"),
  commercial: document.querySelector("#demoCommercialSettings"),
  description: document.querySelector("#demoStudentDescription"),
  status: document.querySelector("#demoFormStatus"),
  unsaved: document.querySelector("#demoUnsavedBadge"),
  reset: document.querySelector("#resetPersona"),
  openLinks: [document.querySelector("#openStudent"), document.querySelector("#openStudentTop")],
};

function switchControl([key, label, detail]) {
  const control = document.createElement("label");
  control.className = "demo-switch";
  const copy = document.createElement("span");
  const strong = document.createElement("strong");
  strong.textContent = label;
  const small = document.createElement("small");
  small.textContent = detail;
  copy.append(strong, small);
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = key;
  const track = document.createElement("i");
  track.setAttribute("aria-hidden", "true");
  control.append(copy, input, track);
  return control;
}

LEARNING_FIELDS.forEach((field) => refs.learning.append(switchControl(field)));
COMMERCIAL_FIELDS.forEach((field) => refs.commercial.append(switchControl(field)));

function learnerUrl(key) {
  const persona = key === getDemoPersonaKey() ? getDemoPersona() : DEMO_PERSONAS[key];
  const category = persona.settings.show_words !== false ? "words"
    : persona.settings.show_phrases !== false ? "phrases" : "phonics";
  const level = persona.settings.allowed_levels[0] || persona.settings.allowed_level_min || 1;
  return `/learn?category=${category}&level=${level}&persona=${key}`;
}

function renderStudentList(activeKey) {
  refs.list.replaceChildren();
  Object.values(DEMO_PERSONAS).forEach((persona, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "demo-student-button";
    button.dataset.active = String(persona.key === activeKey);
    button.setAttribute("aria-pressed", String(persona.key === activeKey));
    const avatar = document.createElement("span");
    avatar.className = "demo-student-avatar";
    avatar.textContent = ["MI", "RE", "HA", "YU", "SO", "PA"][index] || "ST";
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = persona.label;
    const meta = document.createElement("small");
    meta.textContent = persona.settings.account_enabled === false ? "Paused" : "Active learner";
    copy.append(name, meta);
    button.append(avatar, copy);
    button.addEventListener("click", () => selectPersona(persona.key));
    refs.list.append(button);
  });
}

function populateForm() {
  const persona = getDemoPersona();
  DEMO_BOOLEAN_SETTING_KEYS.forEach((key) => {
    const input = refs.form.elements.namedItem(key);
    if (input) input.checked = persona.settings[key] !== false;
  });
  refs.form.elements.allowed_level_min.value = persona.settings.allowed_level_min;
  refs.form.elements.allowed_level_max.value = persona.settings.allowed_level_max;
  refs.form.elements.allowed_levels.value = persona.settings.allowed_levels.join(", ");
  refs.description.textContent = `${persona.description} ${persona.descriptionJa}`;
  refs.openLinks.forEach((link) => { link.href = learnerUrl(persona.key); });
  refs.status.textContent = "";
  refs.unsaved.hidden = true;
}

function selectPersona(key) {
  setDemoPersonaKey(key);
  const url = new URL(window.location.href);
  url.searchParams.set("persona", key);
  window.history.replaceState({ persona: key }, "", `${url.pathname}${url.search}`);
  renderStudentList(key);
  populateForm();
}

function formSettings() {
  const settings = {};
  DEMO_BOOLEAN_SETTING_KEYS.forEach((key) => {
    const input = refs.form.elements.namedItem(key);
    settings[key] = Boolean(input?.checked);
  });
  settings.allowed_level_min = Number(refs.form.elements.allowed_level_min.value);
  settings.allowed_level_max = Number(refs.form.elements.allowed_level_max.value);
  settings.allowed_levels = String(refs.form.elements.allowed_levels.value || "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  return settings;
}

refs.form.addEventListener("input", () => {
  refs.unsaved.hidden = false;
  refs.status.textContent = "";
});

refs.form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const key = getDemoPersonaKey();
    saveDemoPersonaSettings(key, formSettings());
    refs.unsaved.hidden = true;
    refs.status.textContent = "Saved locally. Open the learner view to see this exact visibility. / このブラウザ内に保存しました。";
    refs.status.dataset.phase = "success";
    refs.openLinks.forEach((link) => { link.href = learnerUrl(key); });
    renderStudentList(key);
  } catch (error) {
    refs.status.textContent = error?.message || "Could not save these demo settings.";
    refs.status.dataset.phase = "error";
  }
});

refs.reset.addEventListener("click", () => {
  const key = getDemoPersonaKey();
  resetDemoPersonaSettings(key);
  populateForm();
  renderStudentList(key);
  refs.status.textContent = "Persona defaults restored. / 初期設定に戻しました。";
  refs.status.dataset.phase = "success";
});

selectPersona(getDemoPersonaKey());
