import { getDemoPersona } from "./personas.js";

export async function loadStudentAccess() {
  const persona = getDemoPersona();
  return {
    authenticated: true,
    session: { user: { id: `local-demo-${persona.key}`, email: `${persona.key}@local.demo` } },
    settings: { ...persona.settings, allowed_levels: [...persona.settings.allowed_levels] },
    reason: "local-demo",
    error: null,
    demo: true,
  };
}

export const featureAllowed = (access, feature) => (
  access?.settings?.account_enabled !== false && access?.settings?.[feature] !== false
);

export function applyStudentFeatureVisibility(access, root = document) {
  const settings = access?.settings || {};
  root.querySelectorAll?.("[data-student-feature]").forEach((node) => {
    const hidden = settings.account_enabled === false || settings[node.dataset.studentFeature] === false;
    node.dataset.studentHidden = String(hidden);
    node.setAttribute("aria-hidden", String(hidden));
  });
  root.querySelectorAll?.("[data-student-feature-any]").forEach((node) => {
    const keys = String(node.dataset.studentFeatureAny || "").split(",").map((key) => key.trim()).filter(Boolean);
    const hidden = settings.account_enabled === false || !keys.some((key) => settings[key] !== false);
    node.dataset.studentHidden = String(hidden);
    node.setAttribute("aria-hidden", String(hidden));
  });
  document.documentElement.dataset.studentAccess = settings.account_enabled === false ? "disabled" : "ready";
  document.documentElement.dataset.localDemo = "true";
  return access;
}

export function renderStudentAccessBoundary(container, { title, titleJa, detail, detailJa } = {}) {
  if (!container) return;
  const section = document.createElement("section");
  section.className = "access-boundary shell";
  const heading = document.createElement("h1");
  heading.textContent = title || titleJa || "This feature is hidden in the selected teacher preview.";
  const explanation = document.createElement("p");
  explanation.textContent = detail || detailJa || "Choose another learner persona from the Local Demo bar.";
  section.append(heading, explanation);
  container.replaceChildren(section);
}
