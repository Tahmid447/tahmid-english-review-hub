# Performance and accessibility audit — 2026-08-14

## Scope and release boundary

August 24 update: the current-account Preview now publishes application commit
`18571bd` as deploy `6a8c2e337479160008093171`. The historical measurements
below remain useful baselines; no new full Lighthouse performance score was
recorded in this tranche. Production remains untouched.

This document originally separated measurements taken from the older deployed
preview from optimizations that were then local-only. References below to the
dedicated v9 preview at `aad5749` are historical. The August 24 current-account
Preview deployment is real, but authenticated tier QA and physical-device
testing remain pending.

## August 24 study-music delivery update

- The first licensed-audio Preview used five 320 kbps MP3 files totalling about
  39 MB. Public playback worked, but cold CDN selection could take several
  seconds for a newly selected track.
- The final Preview uses web-optimised AAC/M4A copies totalling about 15 MB,
  while retaining the full 174–223 second recordings and CC BY 4.0 attribution.
- All five final assets were tested on the immutable deploy: each reached media
  ready state 4, reported a finite duration, advanced `currentTime`, remained
  unpaused and returned no media error.
- Music is not eagerly loaded or service-worker-precached. The selected track
  begins only after the learner's first permitted interaction; immutable CDN
  caching benefits later selections/visits without placing all audio in the
  offline shell.

## Previously recorded preview baseline

The prior mobile Lighthouse run recorded:

| Route | Performance | Accessibility | FCP | LCP | TBT | CLS | Transfer | Requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 89 | 93 | 1.9 s | 3.4 s | 0 ms | 0.004 | 406 KB | 22 |
| Phrases | 86 | 91 | 1.7 s | 3.4 s | 80 ms | 0.021 | 385 KB | 18 |
| Pricing | 97 | 100 | not recorded | not recorded | not recorded | not recorded | not recorded | not recorded |

These numbers describe the older preview, not the final local worktree. They
also do not prove real Safari/Chrome performance or authenticated pages.

## Evidence-backed local changes

- Common page headers now use `assets/app-icon-192.png` (about 38 KB) at the
  50 × 50 display size instead of downloading the 512 × 512 logo (about
  258 KB) for that small header use. The 512 asset remains a manifest icon.
- The supplied LINE QR (`assets/contact/line-qr.jpeg`, about 145 KB) now uses
  native lazy loading, asynchronous decoding, and low fetch priority.
- The phrase/vocabulary library initially renders 24 cards and provides a
  controlled **Load 24 more** action instead of mounting the full catalogue at
  once.
- The pricing hero uses a smaller Japanese companion line in bilingual mode and
  hides the unused language in English-only/Japanese-only mode. Before this
  change, the bilingual hero was observed at roughly 1,092 px high in a
  1,440 px desktop viewport and roughly 1,268 px at 390 px. A final deployed
  height/visual check has not yet been recorded.
- The 621–900 px range uses the compact header layout while the 1,024 px-and-up
  desktop arrangement is preserved.
- The public-shell service worker caches only allow-listed, same-origin static
  files. Protected routes, Supabase/API traffic, auth-bearing requests,
  recordings, answers, feedback, and learner records are excluded.

## Local accessibility corrections

- Dark-theme selected filters, Google sign-in, phrase cards/actions, favourite
  controls, lesson hints, and audio/microphone controls received explicit
  foreground/background tokens instead of translucent low-contrast cascades.
- The light-theme phrase microphone rule now wins over the generic
  `.phrase-actions button` cascade.
- Lesson answer groups use roving `tabindex`; arrow keys move focus and select
  within the radio group without triggering global next-question navigation.
- Pricing language selection, footer links, FAQ summaries, and other small
  controls have at least a 44 px interaction target in the final cascade.
- The header compacts across 621, 768, and 900 px rather than waiting for the
  phone-only breakpoint.

These corrections are present locally and covered by targeted source/runtime
regressions. They are not labelled Lighthouse 100 until measured on the exact
deployed final-product commit.

## Final local responsive Browser check

The integrated `dist/` build was exercised in a real browser before the local
commit. This is useful responsive/runtime evidence, but it is not a deployed
Lighthouse trace or a physical-device result.

- Home, pricing, phrases, and the June 29 sample lesson were opened at 390 px;
  home and pricing were also checked at 430 px. Each checked page reported
  `scrollWidth === viewport width`.
- The learner header stayed at 76 px at 621, 768, and 900 px. Desktop home was
  visually inspected at 1,024 and 1,440 px.
- The 390 px Dark home, 390/430 px pricing journey, Teacher sign-in, progressive
  phrase list, and sample lesson were visually inspected.
- Dark theme persisted across routes. Six-month prices/savings, the editable
  contact name/message, copied current text, reset behavior, and dirty-message
  retention were exercised.
- The phrase page initially rendered 24 records and exposed a six-item load
  action for the checked Free catalogue. Lesson radio ArrowRight moved from A
  to B while the question counter stayed `1 / 37`; an incorrect answer exposed
  immediate Retry and a later correct retry left the first score unchanged.
- The browser diagnostic log was empty on the final checked route.

These observations reduce local responsive risk. Deployed Lighthouse,
scroll-performance tracing, microphone/PWA checks, and real-device touch remain
release gates below.

## Final measurement gate

After migration/Edge rollout and preview deployment, record all of the
following against the exact preview commit:

1. Lighthouse Performance and Accessibility for home, phrases, pricing, and a
   representative lesson at 390 px in Light and Dark.
2. The same four pages at 768 px, plus explicit layout checks at 621, 768, 900,
   and 1,024 px.
3. Header height, horizontal overflow, lazy QR request timing, phrase initial
   DOM count, focus visibility, touch-target audit, and console errors.
4. Lesson radio keyboard behavior: Tab enters one option; ArrowLeft/Right/Up/Down
   stays inside the group, moves focus, and selects; it must not advance to the
   next question.
5. PWA install/update and offline public-shell behavior on real iPhone Safari
   and Android Chrome, with private/authenticated requests confirmed absent
   from Cache Storage.

If any accessibility score remains below 100, record the exact Lighthouse
audit name and DOM selector rather than reporting the page as complete.
