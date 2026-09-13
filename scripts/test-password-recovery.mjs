import assert from "node:assert/strict";
import { createPasswordRecovery } from "../src/password-recovery.js";

function fixture({ event = null, user = { id: "test-user", email: "learner@example.test" }, updateError = null, cleanupError = false } = {}) {
  let callback;
  const states = [], requests = [], updates = [], signouts = [];
  let options;
  const auth = {
    onAuthStateChange(fn) { callback = fn; return { data: { subscription: { unsubscribe() {} } } }; },
    async initialize() {
      // Match the actual bundled SDK: recovery event arrives one tick later.
      if (event) setTimeout(() => callback(event, { user }), 0);
      return { error: null };
    },
    async getUser() { return { data: { user }, error: null }; },
    async resetPasswordForEmail(email, settings) { requests.push({ email, ...settings }); return { error: null }; },
    async updateUser(data) { updates.push(data); return { error: updateError }; },
    async signOut(settings) { signouts.push(settings); if (cleanupError) throw new Error("offline"); return { error: null }; },
  };
  const recovery = createPasswordRecovery({
    createClient(_url, _key, opts) { options = opts; return { auth }; },
    url: "https://example.supabase.co", anonKey: "public-test-key", origin: "https://example.test", onState: state => states.push(state),
  });
  return { recovery, auth, states, requests, updates, signouts, options, changeUser(next) { user = next; } };
}

const empty = fixture();
assert.equal(await empty.recovery.initialize(), false);
await assert.rejects(empty.recovery.update("Password123", "Password123"), /Open a new reset/);
assert.equal(empty.updates.length, 0);
await empty.recovery.request(" learner@example.test ");
assert.deepEqual(empty.requests, [{ email: "learner@example.test", redirectTo: "https://example.test/reset-password" }]);
assert.equal(empty.options.auth.persistSession, false, "Recovery must not persist or overwrite a signed-in student or teacher.");
assert.equal(empty.options.auth.flowType, "implicit", "Email links must work in another browser, without a local PKCE verifier.");

const ordinary = fixture({ event: "SIGNED_IN" });
assert.equal(await ordinary.recovery.initialize(), false);
await assert.rejects(ordinary.recovery.update("Password123", "Password123"));
assert.equal(ordinary.updates.length, 0, "Ordinary sign-in must not unlock password recovery.");

const valid = fixture({ event: "PASSWORD_RECOVERY" });
assert.equal(await valid.recovery.initialize(), true, "Delayed SDK recovery event must unlock the form.");
assert.deepEqual(valid.states[0], { kind: "ready", email: "learner@example.test" });
await assert.rejects(valid.recovery.update("Password123", "different"), /do not match/);
await assert.rejects(valid.recovery.update("short1", "short1"), /8 or more/);
assert.equal(valid.updates.length, 0);
await valid.recovery.update("Password123", "Password123");
assert.deepEqual(valid.signouts, [{ scope: "local" }]);
assert.equal(valid.states.at(-1).kind, "complete");
await assert.rejects(valid.recovery.update("Password456", "Password456"));
assert.equal(valid.updates.length, 1, "A consumed form cannot submit another password change.");

const changed = fixture({ event: "PASSWORD_RECOVERY" });
await changed.recovery.initialize();
changed.changeUser({ id: "someone-else" });
await assert.rejects(changed.recovery.update("Password123", "Password123"), /no longer valid/);
assert.equal(changed.updates.length, 0, "An identity change cannot reset another person's password.");

const expired = fixture({ event: "PASSWORD_RECOVERY", updateError: new Error("expired session") });
await expired.recovery.initialize();
await assert.rejects(expired.recovery.update("Password123", "Password123"), /expired session/);
assert.notEqual(expired.states.at(-1).kind, "complete", "Failed server update must never display success.");

const cleanup = fixture({ event: "PASSWORD_RECOVERY", cleanupError: true });
await cleanup.recovery.initialize();
await cleanup.recovery.update("Password123", "Password123");
assert.equal(cleanup.states.at(-1).kind, "complete", "Cleanup network failure cannot misreport an already saved password.");
console.log("Password recovery passed: delayed SDK event, isolated sessions, credential validation, identity changes, expired links and cleanup.");
