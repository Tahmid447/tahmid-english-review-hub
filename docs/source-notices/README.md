# Natural speech: third-party software and source

The `natural-speech` Supabase Edge Function uses **edge-tts-universal 1.4.0**, a server-side text-to-speech client by [travisvn and contributors](https://github.com/travisvn/edge-tts-universal/). The library is imported without modifications and its version is pinned in the function source.

| Component | Published version | License / source |
|---|---|---|
| `edge-tts-universal` | `1.4.0` | npm package metadata declares `AGPL-3.0`; the package includes GNU Affero General Public License version 3. The verbatim packaged license is [included here](edge-tts-universal-1.4.0-LICENSE.txt). |
| Upstream code | Exact npm release | [Published package archive](https://registry.npmjs.org/edge-tts-universal/-/edge-tts-universal-1.4.0.tgz), [upstream source repository](https://github.com/travisvn/edge-tts-universal/) |
| Tahmid integration | Current structured learning release | [Natural speech function source](https://github.com/Tahmid447/tahmid-english-review-hub/blob/codex/structured-learning-hub/supabase/functions/natural-speech/index.ts), [client speech contract](https://github.com/Tahmid447/tahmid-english-review-hub/blob/codex/structured-learning-hub/src/speech-contract.js), [complete project source](https://github.com/Tahmid447/tahmid-english-review-hub/tree/codex/structured-learning-hub) |

The source links above are available without a fee. The repository's release/deployment report identifies the deployed commit. To obtain that exact integration revision, use that commit rather than a moving branch. The dependency's exact release archive remains pinned at the versioned URL above.

The integration sets fixed Ava, Libby and Nanami voice identities and synthesis parameters, validates the client contract, exposes response diagnostics and returns MP3 audio. It does not modify the upstream library. To reproduce the integration, obtain the referenced project source, install the Supabase CLI, and deploy or serve `supabase/functions/natural-speech/index.ts`; the runtime resolves the pinned `npm:edge-tts-universal@1.4.0` import. `node scripts/verify-voices.mjs` checks its contract without calling the online service. See [voice design and QA](../voice-quality-design.md) for live checks.

The software license does not establish a commercial license to Microsoft's online speech service or settle the terms governing generated speech. Those service terms require a separate assessment before making commercial-service guarantees. This notice identifies the actual dependency, preserves its license text and provides source access; it does not claim that every future distribution or business arrangement automatically satisfies all applicable terms.

The original Phonics diagrams in `src/phonics-visuals.js` were created for Tahmid English Club in this project. They contain no third-party images or library artwork. Illustration and music attributions are maintained separately in `assets/ATTRIBUTIONS.md` and the music credits.
