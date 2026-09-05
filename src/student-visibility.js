import {
  DEFAULT_HUB_SETTINGS,
  fetchStudentAnnouncements,
  fetchStudentHubContext,
} from "./curriculum-api.js?v=20260906-studio1";
import { getStudentSession } from "./supabase.js?v=20260906-studio1";

let accessPromise;
let accessIdentity;
let accessLoadedAt = 0;

const recordFrom = (result, key) => (
  result?.[key]
  ?? result?.data?.[key]
  ?? (key === "settings" && result?.data && !Array.isArray(result.data) ? result.data : null)
);

const normalizedSettings = (value) => ({
  ...DEFAULT_HUB_SETTINGS,
  ...(value && typeof value === "object" && !Array.isArray(value) ? value : {}),
});

export async function loadStudentAccess({ refresh = false } = {}) {
  let currentSession;
  try { currentSession = await getStudentSession(); } catch (error) {
    accessPromise = undefined;
    return {
      authenticated: true, session: null,
      settings: normalizedSettings({ account_enabled: false }),
      reason: "access-check-failed", error,
    };
  }
  const identity = currentSession?.user?.id || "anonymous";
  if (refresh || identity !== accessIdentity || Date.now() - accessLoadedAt > 30000) accessPromise = undefined;
  accessIdentity = identity;
  if (!accessPromise) {
    accessPromise = (async () => {
      const session = currentSession;
      accessLoadedAt = Date.now();
      if (!session?.user) {
        return {
          authenticated: false,
          session: null,
          settings: normalizedSettings(),
          reason: "anonymous",
        };
      }
      try {
        const result = await fetchStudentHubContext();
        if (result?.error || result?.reason || !recordFrom(result, "settings") || result?.data?.migrationReady !== true) {
          throw result.error || new Error(`Student access check failed: ${result.reason}`);
        }
        return {
          authenticated: true,
          session,
          settings: normalizedSettings(recordFrom(result, "settings")),
          reason: result?.reason || null,
          error: null,
        };
      } catch (error) {
        return {
          authenticated: true,
          session,
          settings: normalizedSettings({ account_enabled: false }),
          reason: "access-check-failed",
          error,
        };
      }
    })().catch((error) => ({
      authenticated: true,
      session: null,
      settings: normalizedSettings({ account_enabled: false }),
      reason: "access-check-failed",
      error,
    }));
  }
  return accessPromise;
}

export const featureAllowed = (access, feature) => (
  !access?.authenticated || access.settings?.account_enabled !== false
) && access?.settings?.[feature] !== false;

export function applyStudentFeatureVisibility(access, root = document) {
  const settings = access?.settings || normalizedSettings();
  root.querySelectorAll?.("[data-student-feature]").forEach((node) => {
    const key = node.dataset.studentFeature;
    const hidden = Boolean(access?.authenticated) && (
      settings.account_enabled === false || settings[key] === false
    );
    node.dataset.studentHidden = String(hidden);
    node.setAttribute("aria-hidden", String(hidden));
    if (hidden && node.contains(document.activeElement)) document.activeElement?.blur?.();
  });
  root.querySelectorAll?.("[data-student-feature-any]").forEach((node) => {
    const keys = String(node.dataset.studentFeatureAny || "").split(",").map((key) => key.trim()).filter(Boolean);
    const hidden = Boolean(access?.authenticated) && (
      settings.account_enabled === false || !keys.some((key) => settings[key] !== false)
    );
    node.dataset.studentHidden = String(hidden);
    node.setAttribute("aria-hidden", String(hidden));
  });
  document.documentElement.dataset.studentAccess = !access?.authenticated
    ? "anonymous"
    : settings.account_enabled === false ? "disabled" : "ready";
  return access;
}

export function renderStudentAccessBoundary(container, {
  title = "This page is not in your learning plan.",
  titleJa = "このページは、現在の学習プランには含まれていません。",
  detail = "Your teacher can change what appears in your Review Hub.",
  detailJa = "表示内容については、担当の先生にご確認ください。",
} = {}) {
  if (!container) return;
  const section = document.createElement("section");
  section.className = "access-boundary shell";
  const mark = document.createElement("span");
  mark.className = "access-boundary-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "🔒";
  const copy = document.createElement("div");
  const heading = document.createElement("h1");
  heading.textContent = title;
  const japaneseHeading = document.createElement("p");
  japaneseHeading.className = "jp";
  japaneseHeading.lang = "ja";
  japaneseHeading.textContent = titleJa;
  const explanation = document.createElement("p");
  explanation.textContent = detail;
  const japaneseExplanation = document.createElement("p");
  japaneseExplanation.className = "jp";
  japaneseExplanation.lang = "ja";
  japaneseExplanation.textContent = detailJa;
  const home = document.createElement("a");
  home.className = "primary-btn";
  home.href = "/";
  home.textContent = "Back to your Review Hub / Review Hubへ戻る";
  copy.append(heading, japaneseHeading, explanation, japaneseExplanation, home);
  section.append(mark, copy);
  container.replaceChildren(section);
}

export async function enforceStudentFeature(feature, container, copy) {
  const access = await loadStudentAccess();
  applyStudentFeatureVisibility(access);
  if (access.authenticated && !featureAllowed(access, feature)) {
    renderStudentAccessBoundary(container, access.settings.account_enabled === false ? {
      title: "Your Review Hub access is paused.",
      titleJa: "Review Hubの利用は一時停止中です。",
      detail: "No learning content is being shared with this account right now.",
      detailJa: "現在、このアカウントには学習内容が公開されていません。",
      ...copy,
    } : copy);
    return { ...access, allowed: false };
  }
  return { ...access, allowed: true };
}

export async function renderStudentAnnouncements(access, container) {
  if (!container || !featureAllowed(access, "show_announcements")) return [];
  const result = await fetchStudentAnnouncements();
  const announcements = result?.announcements || result?.data || [];
  const visible = Array.isArray(announcements) ? announcements.filter(Boolean) : [];
  if (!visible.length) {
    container.hidden = true;
    return [];
  }
  const latest = visible[0];
  const mark = document.createElement("span");
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "📣";
  const copy = document.createElement("div");
  const title = document.createElement("h2");
  title.textContent = latest.title_en || latest.title_ja || "A note from Tahmid";
  const body = document.createElement("p");
  body.textContent = latest.body_en || latest.body_ja || "";
  const japanese = document.createElement("p");
  japanese.className = "jp";
  japanese.lang = "ja";
  japanese.textContent = latest.body_ja || "";
  copy.append(title, body);
  if (japanese.textContent && japanese.textContent !== body.textContent) copy.append(japanese);
  container.replaceChildren(mark, copy);
  container.hidden = false;
  return visible;
}
