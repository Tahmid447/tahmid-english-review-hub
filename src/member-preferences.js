import { getStudentSession, loadUserSettings, saveUserSettings, rememberPendingUserSettings, onStudentAuthChange } from './supabase.js?v=20260910-member1';
import { getSettings, setStorageUser, updateSettings, onSettingsChange, applyThemePreference } from './store.js?v=20260910-member1';
import { applyLanguageMode } from './i18n.js?v=20260910-member1';
let initialising;
export function initialiseMemberPreferences() {
  return initialising ||= (async () => {
    let session = await getStudentSession();
    let userId = session?.user?.id || null;
    setStorageUser(userId);
    const before = getSettings();
    const remote = userId ? await loadUserSettings(userId) : null;
    // Retain changes made by a learner while the first request was pending.
    const now = getSettings();
    const changed = Object.fromEntries(Object.entries(now).filter(([key,value]) => value !== before[key]));
    if (remote?.loaded) updateSettings({ ...remote.settings, ...changed });
    const apply = (settings) => { applyThemePreference(settings.theme); applyLanguageMode(settings.languageMode); };
    apply(getSettings());
    let timer;
    onSettingsChange(settings => {
      apply(settings);
      if (!userId) return;
      clearTimeout(timer);
      const expectedUserId = userId;
      rememberPendingUserSettings(expectedUserId, settings);
      timer = setTimeout(() => { void saveUserSettings(settings, { expectedUserId }); }, 250);
    });
    onStudentAuthChange((next, event) => {
      if (event === 'INITIAL_SESSION' || (next?.user?.id || null) === userId) return;
      // Clear private page content before a different account is loaded.
      clearTimeout(timer); userId = null; setStorageUser(null); location.reload();
    });
    if (userId && Object.keys(changed).length) void saveUserSettings(getSettings(), { expectedUserId: userId });
    return session;
  })();
}
