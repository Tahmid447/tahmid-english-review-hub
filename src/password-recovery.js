// Recovery uses an in-memory session so an email link never replaces an
// existing learner/teacher session in this browser's persistent auth stores.
export function createPasswordRecovery({ createClient, url, anonKey, origin, teacher = false, onState }) {
  const client = createClient(url, anonKey, {
    auth: { storageKey: "te-review-hub-password-recovery", persistSession: false,
      autoRefreshToken: false, detectSessionInUrl: true, flowType: "implicit" },
  });
  let recoveryUser = null;
  let consumed = false;
  let checking = Promise.resolve();
  const { data: subscription } = client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") recoveryUser = null;
    if (event !== "PASSWORD_RECOVERY" || !session?.user?.id || consumed) return;
    // Do not call the auth API while Supabase still holds its callback lock.
    checking = new Promise(resolve => setTimeout(resolve, 0)).then(async () => {
      const { data, error } = await client.auth.getUser();
      if (error || data.user?.id !== session.user.id || consumed) {
        onState({ kind: "invalid" });
        return;
      }
      recoveryUser = data.user.id;
      onState({ kind: "ready", email: data.user.email || "" });
    }).catch(() => onState({ kind: "invalid" }));
  });
  return {
    async initialize() {
      const { error } = await client.auth.initialize();
      // The pinned SDK schedules PASSWORD_RECOVERY after initialization.
      await new Promise(resolve => setTimeout(resolve, 0));
      await checking;
      if (error) onState({ kind: "invalid" });
      return Boolean(recoveryUser);
    },
    async request(email) {
      return client.auth.resetPasswordForEmail(String(email).trim(), {
        redirectTo: `${origin}/reset-password${teacher ? "?from=teacher" : ""}`,
      });
    },
    async update(password, confirmation) {
      if (!recoveryUser || consumed) throw new Error("Open a new reset link from your email. · メールから新しい再設定リンクを開いてください。");
      if (password !== confirmation) throw new Error("The passwords do not match. · パスワードが一致しません。");
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error("Use 8 or more characters with a letter and a number. · 英字と数字を含む8文字以上にしてください。");
      }
      // Revalidate the identity immediately before changing its credentials.
      const { data, error } = await client.auth.getUser();
      if (error || data.user?.id !== recoveryUser) {
        recoveryUser = null;
        throw new Error("This reset link is no longer valid. Request a new one. · 新しい再設定リンクを申請してください。");
      }
      const result = await client.auth.updateUser({ password });
      if (result.error) throw result.error;
      consumed = true;
      recoveryUser = null;
      // A successful password change must stay successful even if cleanup
      // loses its connection. The recovery session is never persisted.
      try { await client.auth.signOut({ scope: "local" }); } catch {}
      onState({ kind: "complete" });
    },
    dispose() { subscription.subscription.unsubscribe(); },
  };
}
