# Free / Standard / Premium / Premium+ plans and teacher review

Updated: 2026-08-11 (Asia/Tokyo)

This is the product and operations specification implemented by
`src/plans.js`, the existing Premium submission schema, and
`202608110014_premium_plus_and_entitlements.sql`. Prices, plan names and contact
links have one browser-side source of truth in `src/plans.js`; database plan
keys and entitlements remain in Supabase.

## Fixed public plans and prices

| Plan | Monthly | Six months | Main purpose |
| --- | ---: | ---: | --- |
| Free | ¥0 | ¥0 | Two complete sample lessons and safe paid-feature previews |
| Standard | ¥3,980 | ¥20,300 | Complete self-study Review Hub |
| Premium | ¥6,980 | ¥35,600 | Standard plus teacher-reviewed speaking and writing |
| Premium+ | ¥16,800 | ¥85,700 | Premium plus three 50-minute live 1:1 lessons each month |

The six-month values are approximately 15% below six monthly payments. Do not
rename the plans or publish different prices in page-specific HTML. Premium+
uses the database key `premium_plus` and the public label **Premium+**.

## Feature split

| Feature | Free | Standard | Premium | Premium+ |
| --- | :---: | :---: | :---: | :---: |
| Two complete sample lessons | Yes | Yes | Yes | Yes |
| Full lesson and phrase libraries | — | Yes | Yes | Yes |
| All 14 practice formats | Selected | Yes | Yes | Yes |
| Account progress across devices | Yes | Yes | Yes | Yes |
| Advanced visual missions | Preview | — | Yes | Yes |
| One reviewed speaking task per lesson | Preview | — | Yes | Yes |
| One reviewed essay per lesson | Preview | — | Yes | Yes |
| Teacher feedback target: 3 business days | — | — | Yes | Yes |
| Discount on extra 1:1 lessons | — | — | 10% | 15% |
| Three 50-minute live 1:1 lessons per month | — | — | — | Yes |
| Monthly progress note | — | — | — | Yes |

Core illustration questions can remain Standard. Premium should sell deeper
output and human guidance, not remove essential visual learning from the base
product. The teacher can mark individual questions Free, Standard, Premium or
Premium+ and choose a payload-free teaser or complete hiding below the required
tier.

## Deterministic entitlement priority

The shared site is never forked per learner. Supabase resolves access in this
order:

1. authorised teacher access;
2. active learner tier/feature override created in Teacher Studio;
3. active learner membership tier;
4. Free public access.

A learner feature override may explicitly allow or block `premium_image_missions`,
`speaking_submission`, `essay_submission`, `teacher_review`, `live_coaching`, or
`monthly_progress_note`. `Inherit` leaves the normal tier value unchanged. An
expiry date returns the learner to normal membership rules automatically.

Question payloads are protected by RLS. A below-tier teaser contains only the
question position, format and required plan. It never contains the prompt,
choices, hint, explanation or answer.

## Learner submission workflow

### Speaking

1. The learner opens an active speaking task.
2. The task shows the topic, target duration and required phrases/vocabulary.
3. The learner records, listens, and either re-records or submits.
4. The private object is stored in `review-premium-recordings`; Postgres stores
   only `audio_object_path` and submission metadata.
5. A submitted item is locked during review. The teacher can return it or
   publish feedback.

### Essay

1. The learner writes against the lesson-specific prompt and visible word range.
2. A draft remains private to the learner. It does not enter the teacher queue.
3. Final submission validates the configured word range and becomes read-only
   during review.
4. Published feedback appears beside the learner's original work.

Submission statuses remain `draft`, `submitted`, `in_review`, `reviewed` and
`returned`. The Teacher Studio queue intentionally excludes private drafts.
Not every submission needs a written reply, but any published feedback is tied
to a teacher and optional score.

## Teacher Studio controls

The learner detail dialog contains:

- membership period, audience and Standard/Premium/Premium+ tier;
- expiring tier and per-feature overrides;
- lesson recommendations, open/close dates and minimum plan;
- learner-specific teacher unlock/block rules with priority over normal lesson
  visibility;
- password-reset email only—passwords are never shown or stored;
- learning activity and Premium submission history.

Access-code creation/edit/reissue supports Standard, Premium and Premium+.
Newly generated full codes are shown once; history stores only the final four
characters.

## Contact-first checkout

`/plans` does not process payments and never displays a fake success state. The
learner selects a plan and billing period, copies the prepared bilingual message,
then opens the configured LINE or Instagram profile. The selected plan and
price remain visible in the dialog.

- LINE: decoded from the supplied QR asset and stored in `CONTACT_CHANNELS`.
- Instagram: the exact supplied profile URL is stored in `CONTACT_CHANNELS`.
- QR asset: `assets/contact/line-qr.jpeg`.

Payment details and access are confirmed separately by Tahmid. OAuth secrets,
service-role keys, passwords and access tokens never belong in this config.

## AI and cost boundary

There is no paid AI grading or learner-facing AI score. `ai_assisted` only
records whether a teacher used AI to prepare a draft; the teacher remains
responsible for checking and publishing it. No AI API key is shipped to the
browser.

## Safe rollout

1. Apply migrations through 013, then apply
   `202608110014_premium_plus_and_entitlements.sql`.
2. Deploy the updated `membership-access` Edge Function so Premium+ access
   codes are accepted.
3. Run the automated suite and `npm run verify:live`.
4. Test one below-tier learner, Premium learner, Premium+ learner and authorised
   teacher in the preview environment.
5. Test one real speaking upload/return and one essay feedback publication.
6. Review the Netlify preview on a physical phone before production promotion.

Do not publish production until migration 014 and the matching Edge Function
are both live; otherwise the new UI could offer a tier that the backend cannot
yet accept.
