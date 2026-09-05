import { readFrozenSeed } from "./curriculum-release.mjs";

// Migration 025 is release-frozen. Its hash verifies the exact original seed,
// while migration 027 separately verifies the current editable curriculum.
// Never rebuild 025 from later JSON; create migration 026 or later instead.
readFrozenSeed();
console.log("Verified immutable migration 025: 96 levels and 480 original items.");
await import("./generate-curriculum-quality-migration.mjs");
