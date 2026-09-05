// Shared UI validation and summaries. Database RLS remains authoritative.
export const CURRICULUM_CATEGORIES = Object.freeze(["words", "phrases", "phonics"]);
const validLevel = (level) => Number.isInteger(level) && level >= 1 && level <= 32;

export function normalizeCategoryAccess(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Category access must be an object.");
  }
  const normalized = {};
  for (const [category, rule] of Object.entries(value)) {
    if (!CURRICULUM_CATEGORIES.includes(category)) throw new TypeError("Unknown curriculum category.");
    if (!rule || typeof rule !== "object" || Array.isArray(rule)
      || Object.keys(rule).some((key) => !["min", "max", "unlock", "lock"].includes(key))) {
      throw new TypeError("Use a level range and explicit unlock/lock lists.");
    }
    if (!validLevel(rule.min) || !validLevel(rule.max) || rule.min > rule.max) {
      throw new RangeError("Category levels must be a valid range from 1 to 32.");
    }
    normalized[category] = { min: rule.min, max: rule.max };
    for (const mode of ["unlock", "lock"]) {
      if (!Array.isArray(rule[mode]) || rule[mode].length > 32 || rule[mode].some((level) => !validLevel(level))) {
        throw new RangeError("Individual levels must be numbers from 1 to 32.");
      }
      normalized[category][mode] = [...new Set(rule[mode])].sort((left, right) => left - right);
    }
  }
  return normalized;
}

export function categoryLevelAllowed(settings, category, level) {
  if (!settings || !validLevel(level) || !CURRICULUM_CATEGORIES.includes(category)
    || settings.account_enabled !== true || settings[`show_${category}`] !== true) return false;
  const rule = settings.category_access?.[category];
  if (rule) {
    try { normalizeCategoryAccess({ [category]: rule }); } catch { return false; }
    return !rule.lock.includes(level)
      && ((level >= rule.min && level <= rule.max) || rule.unlock.includes(level));
  }
  return level >= settings.allowed_level_min && level <= settings.allowed_level_max
    && (!settings.allowed_levels?.length || settings.allowed_levels.includes(level));
}

export function categoryVisibleLevels(settings, category) {
  return Array.from({ length: 32 }, (_, index) => index + 1)
    .filter((level) => categoryLevelAllowed(settings, category, level));
}
