import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AMBIENT_MUSIC_LICENSE, AMBIENT_TRACKS } from "../src/audio.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tracks = Object.values(AMBIENT_TRACKS);
const licenseText = fs.readFileSync(path.join(root, "assets", "audio", "ambient", "LICENSE.md"), "utf8");

assert.equal(tracks.length, 5, "Exactly five study-music choices are required.");
assert.equal(new Set(tracks.map(({ asset }) => asset)).size, 5, "Every choice must use a different recording.");
assert.match(AMBIENT_MUSIC_LICENSE.url, /creativecommons\.org\/licenses\/by\/4\.0/);

for (const track of tracks) {
  assert.equal(track.artist, "Kevin MacLeod");
  assert.match(track.sourceUrl, new RegExp(track.isrc));
  assert.match(track.licenseUrl, /creativecommons\.org\/licenses\/by\/4\.0/);
  const localPath = path.join(root, track.asset.replace(/^\//, ""));
  const stats = fs.statSync(localPath);
  assert(stats.size > 1_000_000, `${track.name} must be a complete recording, not a placeholder.`);
  assert(stats.size < 15_000_000, `${track.name} should remain practical for web delivery.`);
  const header = fs.readFileSync(localPath).subarray(0, 12);
  const looksLikeM4a = header.subarray(4, 8).toString("ascii") === "ftyp";
  assert.equal(path.extname(localPath), ".m4a", `${track.name} must use the web-optimised M4A format.`);
  assert.equal(looksLikeM4a, true, `${track.name} must have a valid MPEG-4 audio header.`);
  assert(licenseText.includes(path.basename(localPath)), `${track.name} is missing from the repository attribution.`);
  assert(licenseText.includes(track.isrc), `${track.name} is missing its ISRC attribution.`);
}

console.log("Ambient audio verification passed.");
console.log("  ✓ 5 complete, web-optimised local M4A recordings");
console.log("  ✓ unique assets, official source IDs and CC BY 4.0 attribution");
