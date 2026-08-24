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
  const header = fs.readFileSync(localPath).subarray(0, 3);
  const looksLikeMp3 = header.toString("ascii") === "ID3" || (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
  assert.equal(looksLikeMp3, true, `${track.name} must have a valid MP3 header.`);
  assert(licenseText.includes(path.basename(localPath)), `${track.name} is missing from the repository attribution.`);
  assert(licenseText.includes(track.isrc), `${track.name} is missing its ISRC attribution.`);
}

console.log("Ambient audio verification passed.");
console.log("  ✓ 5 complete local MP3 recordings");
console.log("  ✓ unique assets, official source IDs and CC BY 4.0 attribution");
