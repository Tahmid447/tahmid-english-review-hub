export const LANGUAGE_MODES = Object.freeze(["en", "bilingual", "ja"]);

export function languageModeFromSettings(settings = {}) {
  if (LANGUAGE_MODES.includes(settings.languageMode)) return settings.languageMode;
  return settings.showJapanese === false ? "en" : "bilingual";
}

export function uiText(en, ja, mode = "bilingual") {
  const english = String(en ?? "").trim();
  const japanese = String(ja ?? "").trim();
  if (mode === "ja") return japanese || english;
  if (mode === "en") return english || japanese;
  if (!english) return japanese;
  if (!japanese) return english;
  return `${english} / ${japanese}`;
}

export function learningText(en, ja, mode = "bilingual") {
  const english = String(en ?? "").trim();
  const japanese = String(ja ?? "").trim();
  if (mode === "en") return { primary: english, secondary: "" };
  if (mode === "ja") return { primary: english, secondary: japanese };
  return { primary: english, secondary: japanese };
}

export function applyLanguageMode(mode = "bilingual", root = document) {
  const safeMode = LANGUAGE_MODES.includes(mode) ? mode : "bilingual";
  document.documentElement.lang = safeMode === "ja" ? "ja" : "en";
  document.body.dataset.language = safeMode;

  root.querySelectorAll("[data-ui-en]").forEach((element) => {
    if (element.hasAttribute("data-ui-lines")) {
      const english = String(element.dataset.uiEn || "").trim();
      const japanese = String(element.dataset.uiJa || "").trim();
      element.replaceChildren();
      if (safeMode !== "ja" && english) {
        const line = document.createElement("span");
        line.className = "ui-line ui-line-en";
        line.lang = "en";
        line.textContent = english;
        element.append(line);
      }
      if (safeMode !== "en" && japanese) {
        const line = document.createElement("span");
        line.className = "ui-line ui-line-ja";
        line.lang = "ja";
        line.textContent = japanese;
        element.append(line);
      }
      return;
    }
    element.textContent = uiText(
      element.dataset.uiEn,
      element.dataset.uiJa,
      safeMode,
    );
  });
  root.querySelectorAll("[data-placeholder-en]").forEach((element) => {
    element.setAttribute(
      "placeholder",
      uiText(element.dataset.placeholderEn, element.dataset.placeholderJa, safeMode),
    );
  });

  const control = root.querySelector("#languageToggle");
  if (control instanceof HTMLSelectElement) control.value = safeMode;
  return safeMode;
}

export function languageOptionMarkup() {
  return `
    <option value="en">English</option>
    <option value="bilingual">English + 日本語</option>
    <option value="ja">日本語UI</option>
  `;
}
