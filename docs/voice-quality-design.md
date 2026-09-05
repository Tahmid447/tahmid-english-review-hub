# Natural voice delivery and phonics practice

## What the September 2026 audit found

The original client sent `{ text, accent }` to the correct `natural-speech` Edge Function. English used Ava (`en-US-AvaMultilingualNeural`) or Libby (`en-GB-LibbyNeural`) at -4% synthesis rate, +0Hz pitch and +0% synthesis volume. Japanese explanations were split into Nanami segments while embedded English retained the selected English voice. User speed was applied by the browser at 0.5×, 1× or 1.5× with pitch preservation. These categories did not deliberately select different English voices.

A live baseline response returned HTTP 200, `audio/mpeg`, 19,584 bytes and `X-Review-Voice: us`. It supplied no full voice ID and did not expose diagnostic headers through CORS. The browser accepted any audio response without verifying the voice. The old audit accepted a missing voice header and tested combined sentences different from the real card selections. Its MP3 checks therefore did not establish actual button behavior or perceptual quality.

The memory cache lowercased text, making pronunciation-sensitive text such as `US` and `us` collide. The response was marked publicly cacheable even though a speech request can contain a private personal lesson. Phonics lists used commas, and the fallback could send a phonics heading or notation rather than a designed sound exercise. Context changes between isolated words and sentences can also change natural prosody; identical voice IDs alone do not establish identical perceived quality.

## Current contract

`src/speech-contract.js` defines the fixed identities, synthesis rate, pitch and volume, and `natural-v2` profile. Each client request includes text, accent, exact voice ID and profile. The Edge handler rejects unsupported accents and mismatched identities/profile. Older clients providing an accent remain compatible while the new function is deployed first.

Every playable response must be MP3 and confirm the accent, complete voice ID, profile, rate, pitch and volume. All diagnostic headers are exposed to the browser. Missing or mismatched values produce the existing clear natural-voice error UI before audio can be cached or played. There is no browser text-to-speech fallback. The cache preserves text case and includes endpoint, full voice identity, synthesis parameters and profile. HTTP audio is `private, no-store`; the bounded browser memory cache holds at most 24 clips.

## Phonics design

All 32 levels now have an English listening focus and two contrast pairs. The default sequence models the sound inside example words, compares contrasting words or phrases, and finishes with a natural practice sentence. Separate selections support sound examples, comparisons, practice words and the sentence. These are produced by the same pure `curriculumAudioSamples` function used by the UI and QA script. IPA, Japanese hints, and technical phonics headings never become speech targets. Sentence boundaries give word examples clearer separation than a comma-only list; no fabricated isolated IPA pronunciation is claimed.

The education audit also corrected `/cl/` and `/cr/` to `/kl/` and `/kr/`, introduced l/r before consonant blends, corrected instructions about stretching stop consonants, removed isolated `read` and `close` ambiguity from model-word lists, clarified common UK/US vowel differences, avoided variable `room` as a single-vowel model, replaced awkward practice sentences, and qualified silent-e rules with exceptions. IDs and the 32-level structure are preserved.

## Repeatable checks

- `npm run verify:voices`: 480 items, all selections in both accents (2,112 payloads), all 32 phonics levels, identical canonical category requests, strict content type/voice/profile/prosody validation, case-safe cache regression, and the actual Edge request handler against a fake provider including failure cases.
- `npm run verify:voices -- --live --output-dir=/tmp/tahmid-voice-qa`: exact primary UI targets at Levels 1, 8, 16, 24, 32 in every category for both accents; three additional seeded random levels per category; a shared canonical sentence in all categories and accents. This produces 54 MP3 responses with hashes and a separate browser listening checklist.
- `scripts/test-learning-experience.mjs`: actual client playback, speed, pitch preservation, cancellation, mixed-language ordering, and rejection of wrong or absent voice identity before playback.

The live report deliberately distinguishes MP3 delivery and identity configuration from hearing the result. Browser playback and perceptual judgments (same recognizable speaker, intelligible English, useful contrasts and rhythm, no clipping) must be recorded separately. Automated headers cannot certify human perception.

## Provider reference

The existing server-side dependency is pinned to `edge-tts-universal@1.4.0`. Its [upstream implementation and documentation](https://github.com/travisvn/edge-tts-universal/) describe the voice and prosody options and server-side Universal API. The deployed npm package declares AGPL-3.0 and contains the GNU Affero General Public License version 3; its source/license obligations and the upstream speech service terms remain relevant when distributing a commercial product. No provider key or private student text is included in audit reports.
