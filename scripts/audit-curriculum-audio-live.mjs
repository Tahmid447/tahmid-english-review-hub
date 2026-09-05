// Backward-compatible command: audit the exact UI payloads and require full
// voice/prosody headers. MP3 delivery does not claim perceptual listening QA.
if (!process.argv.includes("--live")) process.argv.push("--live");
await import("./verify-voices.mjs");
