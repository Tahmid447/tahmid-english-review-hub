import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "src", "config.js");

const firstEnvironmentValue = (...names) => {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
};

const readCommittedValue = (source, name) => {
  const match = source.match(
    new RegExp(`export\\s+const\\s+${name}\\s*=\\s*([\"'])([^\"']+)\\1\\s*;`),
  );
  return match?.[2]?.trim() || "";
};

const validatePublicConfig = (url, anonKey, sourceLabel) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`${sourceLabel} SUPABASE_URL is not a valid URL.`);
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`${sourceLabel} SUPABASE_URL must use http or https.`);
  }

  if (anonKey.startsWith("sb_secret_")) {
    throw new Error(`${sourceLabel} contains a secret Supabase key. Use the public anon key.`);
  }
  if (anonKey.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(
        Buffer.from(anonKey.split(".")[1] || "", "base64url").toString("utf8"),
      );
      if (payload.role !== "anon") {
        throw new Error(`${sourceLabel} JWT is not a public anon key.`);
      }
    } catch (error) {
      if (/not a public anon key/.test(error.message)) throw error;
      throw new Error(`${sourceLabel} SUPABASE_ANON_KEY is not a valid public anon JWT.`);
    }
  } else if (!anonKey.startsWith("sb_publishable_")) {
    throw new Error(
      `${sourceLabel} SUPABASE_ANON_KEY must be a public anon JWT or publishable key.`,
    );
  }
};

const environmentUrl = firstEnvironmentValue("VITE_SUPABASE_URL", "SUPABASE_URL");
const environmentAnonKey = firstEnvironmentValue(
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_ANON_KEY",
);
const hasEnvironmentOverride = Boolean(environmentUrl || environmentAnonKey);

if (hasEnvironmentOverride && (!environmentUrl || !environmentAnonKey)) {
  throw new Error(
    "Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or both unprefixed equivalents).",
  );
}

if (!hasEnvironmentOverride) {
  if (!fs.existsSync(outputPath)) {
    throw new Error(
      "No public Supabase configuration is available. Commit src/config.js or set the Netlify environment variables.",
    );
  }
  const committedSource = fs.readFileSync(outputPath, "utf8");
  const committedUrl = readCommittedValue(committedSource, "SUPABASE_URL");
  const committedAnonKey = readCommittedValue(committedSource, "SUPABASE_ANON_KEY");
  if (!committedUrl || !committedAnonKey) {
    throw new Error(
      "The committed src/config.js does not contain a complete public Supabase configuration.",
    );
  }
  validatePublicConfig(committedUrl, committedAnonKey, "The committed configuration");
  console.log("Using the committed public Supabase configuration.");
  process.exit(0);
}

validatePublicConfig(environmentUrl, environmentAnonKey, "The environment configuration");

const output = `export const SUPABASE_URL = ${JSON.stringify(environmentUrl)};\n` +
  `export const SUPABASE_ANON_KEY = ${JSON.stringify(environmentAnonKey)};\n` +
  `export const NATURAL_SPEECH_URL = \`\${SUPABASE_URL}/functions/v1/natural-speech\`;\n`;

fs.mkdirSync(path.join(root, "src"), { recursive: true });
fs.writeFileSync(outputPath, output);
console.log("Generated the public Supabase configuration from environment variables.");
