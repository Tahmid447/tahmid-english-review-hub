import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js?v=20260913-email1";
import { createPasswordRecovery } from "./password-recovery.js?v=20260913-email1";

const requestForm = document.querySelector("#resetRequestForm");
const updateForm = document.querySelector("#newPasswordForm");
const status = document.querySelector("#resetStatus");
const signin = document.querySelector("#returnToSignin");
const teacher = new URLSearchParams(window.location.search).get("from") === "teacher";
signin.href = teacher ? "/teacher" : "/#account";
const incoming = Boolean(window.location.hash || new URLSearchParams(window.location.search).has("error"));
let available = false;
const showStatus = message => { status.textContent = message; };

const recovery = window.supabase?.createClient && createPasswordRecovery({
  createClient: window.supabase.createClient, url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY,
  origin: window.location.origin, teacher,
  onState(state) {
    if (state.kind === "ready") {
      available = true;
      requestForm.hidden = true;
      updateForm.hidden = false;
      document.querySelector("#resetAccount").textContent = state.email;
      showStatus("Choose your new password below. · 新しいパスワードを入力してください。");
    } else if (state.kind === "complete") {
      available = false;
      updateForm.reset();
      updateForm.hidden = true;
      showStatus("Your password has been changed. Sign in with your new password. · パスワードを変更しました。新しいパスワードでログインしてください。");
      signin.focus();
    } else {
      available = false;
      updateForm.hidden = true;
      requestForm.hidden = false;
      showStatus("This link has expired or cannot be used. Request a new reset email below. · リンクの有効期限が切れたか、利用できません。新しいメールを申請してください。");
    }
  },
});

requestForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = requestForm.querySelector("button");
  button.disabled = true;
  showStatus("Sending your reset link… · 再設定リンクを送信中…");
  try {
    const { error } = await recovery.request(document.querySelector("#resetEmail").value);
    if (error) throw error;
    showStatus("Request accepted. If an account uses this email, check your inbox and spam folder for the reset link. Delivery may take a few minutes. · 申請を受け付けました。登録済みの場合は、受信箱と迷惑メールで再設定リンクをご確認ください。到着まで数分かかる場合があります。");
  } catch {
    showStatus("We could not send the email. Please wait a minute and try again. · 送信できませんでした。1分ほど待ってから再度お試しください。");
  } finally { button.disabled = false; }
});

updateForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!available) return;
  const button = updateForm.querySelector("button");
  button.disabled = true;
  showStatus("Saving your new password… · 新しいパスワードを保存中…");
  try {
    await recovery.update(document.querySelector("#newPassword").value, document.querySelector("#confirmPassword").value);
  } catch (error) {
    showStatus(error?.message || "Could not change your password. Please request a new reset link. · 新しい再設定リンクを申請してください。");
  } finally { button.disabled = false; }
});

try {
  if (!recovery) throw new Error("unavailable");
  showStatus(incoming ? "Checking your reset link… · リンクを確認中…" : "");
  const ready = await recovery.initialize();
  if (incoming && !ready) showStatus("This link has expired or cannot be used. Request a new reset email below. · リンクを利用できません。新しいメールを申請してください。");
  requestForm.querySelector("button").disabled = false;
} catch {
  showStatus("Account recovery is temporarily unavailable. Please reload and try again. · 再読み込みして、もう一度お試しください。");
} finally {
  // Remove credentials/errors from the address bar after the SDK consumes them.
  window.history.replaceState({}, "", `/reset-password${teacher ? "?from=teacher" : ""}`);
}
window.addEventListener("pagehide", () => recovery?.dispose(), { once: true });
