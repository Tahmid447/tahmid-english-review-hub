import assert from "node:assert/strict";
import worker from "../workers/email-alerts/index.js";

const token = "private-test-token-".repeat(4);
const sent = [];
const env = {
  ADMIN_TOKEN: token, OWNER_EMAIL: "owner@example.test", SENDER_EMAIL: "support@example.test",
  SEND_ENABLED: "true", NOTIFY_OWNER: { async send(message) { sent.push(message); return { messageId: "test-id" }; } },
};
const request = (authorization, body) => new Request("https://example.test/test", {
  method: "POST", headers: authorization ? { Authorization: authorization } : {},
  ...(body ? { body: JSON.stringify(body) } : {}),
});
assert.equal((await worker.fetch(request(), env)).status, 401);
assert.equal((await worker.fetch(request("Bearer wrong"), env)).status, 401);
assert.equal((await worker.fetch(request(`Bearer ${token}`), { ...env, ADMIN_TOKEN: "" })).status, 401);
assert.equal((await worker.fetch(request(`Bearer ${token}`), { ...env, SEND_ENABLED: "false" })).status, 409);
assert.equal(sent.length, 0, "Unauthorized or disabled requests must never send email.");
const success = await worker.fetch(request(`Bearer ${token}`, {
  to: "attacker@example.test", from: "forged@example.test", text: "private-reset-link", subject: "forged",
}), env);
assert.equal(success.status, 200);
assert.equal(sent[0].to, env.OWNER_EMAIL, "Request bodies cannot change the fixed verified destination.");
assert.equal(sent[0].from.email, env.SENDER_EMAIL);
assert.ok(!sent[0].text.includes("private-reset-link"), "Caller-controlled content cannot be relayed.");
const failed = await worker.fetch(request(`Bearer ${token}`), {
  ...env, NOTIFY_OWNER: { async send() { throw Object.assign(new Error("permanent delivery failure"), { code: "E_DELIVERY_FAILED" }); } },
});
assert.equal(failed.status, 502);
assert.equal((await failed.json()).code, "E_DELIVERY_FAILED");
assert.equal((await worker.fetch(new Request("https://example.test/health"), env)).status, 200);
assert.equal((await worker.fetch(new Request("https://example.test/test"), env)).status, 404);
console.log("Email diagnostic passed: authenticated owner-only sending, disabled state, no content relay, and honest delivery errors.");
