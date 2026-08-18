# Free / Standard / Premium / Premium+ plans and teacher review

Updated: 2026-08-18 (Asia/Tokyo)

This is the product and operations specification for the four public plans,
contact-first sales flow, Premium submissions, and human teacher review. Public
names, prices, comparison rows, and contact destinations have one browser-side
source of truth in `src/plans.js`; database plan keys and entitlements remain
in Supabase.

Migrations `015` and `016` and the matching `membership-access` Edge Function
are live in shared Supabase. The additive migration
`202608180017_premium_task_topics.sql` is complete and verified locally but is
**not live yet**. The production static site remains pre-v9.

## Fixed public plans and prices

| Plan | Monthly | Six months | Exact saving | Monthly equivalent |
| --- | ---: | ---: | ---: | ---: |
| Free | ¥0 | ¥0 | ¥0 | ¥0 |
| Standard | ¥3,980 | ¥20,300 | ¥3,580 (about 15%) | ¥3,383 |
| Premium | ¥6,980 | ¥35,600 | ¥6,280 (about 15%) | ¥5,933 |
| Premium+ | ¥16,800 | ¥85,700 | ¥15,100 (about 15%) | ¥14,283 |

The monthly equivalent is the six-month total divided by six and rounded to
the nearest yen. Do not rename the plans or publish different prices in
page-specific HTML. Premium+ uses the database key `premium_plus` and the
public label **Premium+**. Premium is the recommended option in the pricing UI.

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

The pricing page renders a 13-row comparison. Core illustration questions can
remain Standard; Premium should sell deeper output and human guidance, not
remove essential visual learning from the base product. An authorised teacher
can mark individual questions Free, Standard, Premium, or Premium+ and choose
a payload-free teaser or complete hiding below the required tier.

## Deterministic entitlement priority

The shared site is never forked per learner. Supabase resolves access in this
order:

1. authorised teacher preview;
2. active learner tier/feature override created in Teacher Studio;
3. active learner membership tier;
4. Free public access.

A learner feature override may explicitly allow or block
`premium_image_missions`, `speaking_submission`, `essay_submission`,
`teacher_review`, `live_coaching`, or `monthly_progress_note`. `Inherit` leaves
the normal tier value unchanged. An expiry date returns the learner to normal
membership rules automatically.

Question payloads are protected by RLS. A below-tier teaser contains only the
question position, format, and required plan. It never contains the prompt,
choices, hint, explanation, or answer. A visual blur is presentation only and
must never be treated as access control.

## Task inventory and learner submission workflow

Migration `015` seeded exactly 34 active tasks: one speaking and one essay task
for every one of the 17 lessons. The live postcondition has been verified.
Migration `017` adds the same three authored topic choices to each lesson's two
tasks, for 51 unique lesson topics and 102 task/topic presentations. It keeps
task IDs and submission history intact.

### Speaking

1. The learner opens an active speaking task.
2. The learner chooses one of three lesson-specific topics. The task then shows
   that topic's bilingual prompt, target duration, recommended phrases and
   vocabulary.
3. The learner records, listens, and either re-records or submits.
4. The private object is stored in `review-premium-recordings`; Postgres stores
   only `audio_object_path` and submission metadata.
5. Migration `015` validates learner ownership, active speaking-task binding,
   object existence, and upload limits before the path can be accepted.
6. A submitted item is locked during review. The teacher can return it or
   publish human feedback.

### Essay

1. The learner chooses one of three lesson-specific topics and writes against
   its bilingual essay prompt and the visible word range.
2. A draft remains private to the learner and does not enter the teacher queue.
3. Final submission validates the word range and becomes read-only during
   review. Essay rows cannot carry an audio object path.
4. Published feedback appears beside the learner's original work.

Submission statuses remain `draft`, `submitted`, `in_review`, `reviewed`, and
`returned`. Teachers cannot read learner drafts under migration `015`.
Returning work and resubmitting refreshes the queue timestamps. Review feedback
and status are changed through one transactional teacher RPC so a partial
write cannot publish one without the other.

Migration `017` stores the choice as `selected_topic_key`. A draft or returned
attempt may change topics; a final submission must use one of the task's three
offered keys, and the choice is locked while the teacher reviews it. Teacher
Studio displays the chosen title beside the attempt so feedback can address the
actual prompt.

## Teacher Studio controls

Teacher Studio is organised around seven teacher jobs:

1. **Dashboard** — what needs attention;
2. **Learners** — accounts, membership, assignments, and access;
3. **Access codes** — create, edit, reissue, disable, and delete;
4. **Lessons & content** — lesson and question publishing controls;
5. **Submissions** — speaking and essay review queue;
6. **Sources** — origin and sync status;
7. **Insights** — learning activity and outcomes.

The workspace supports one-language-at-a-time English/Japanese display,
learner search and plan/status filters, submission-status filters, and a
teacher-only Free/Standard/Premium/Premium+ preview. Preview is visibly marked,
does not change a learner membership, and disables learner submission actions.

The learner detail view includes membership dates, expiring tier/feature
overrides, assignments, learner-specific unlock/block rules, activity history,
and submitted Premium work. Draft Premium work remains private. Password-reset
email is the only password-related teacher action; passwords are never shown or
stored.

Access-code creation/edit/reissue supports Standard, Premium, and Premium+.
New full codes are displayed only at creation/reissue time; stored history
shows only the safe suffix. Migration `015` makes redemption and reissue
transactional and rejects incompatible overlapping grants rather than silently
over-granting access.

## No AI grading

There is no automatic grading, learner-facing AI score, or AI review workflow.
No AI API key is shipped to the browser. The legacy `ai_assisted` database
column remains only for schema compatibility; the new review workflow always
writes it as `false`. Tahmid is responsible for reading/listening, deciding the
feedback and score, and publishing the result.

## Contact-first checkout

`/plans` does not process payments and never displays a fake success state. The
learner selects a plan and billing period, may enter a name and edit the
bilingual message, copies the current edited text, and then opens the configured
LINE or Instagram profile. A reset action intentionally restores the generated
message. The selected plan, period, price, and savings remain visible.

- LINE: decoded from the supplied QR and stored in `CONTACT_CHANNELS`.
- Instagram: the exact supplied profile URL stored in `CONTACT_CHANNELS`.
- QR asset: `assets/contact/line-qr.jpeg` (loaded lazily on the pricing page).

Payment details and access are confirmed separately by Tahmid. OAuth secrets,
service-role keys, passwords, and access tokens never belong in this config.

## Human-review capacity warning

The advertised human-feedback promise has an ongoing labour cost and needs a
launch cap. A planning scenario—not a measured usage forecast—illustrates the
risk: if 100 Premium learners each submit one speaking task and one essay in a
week, the queue receives 200 reviews. At 10–15 minutes per review, that is about
33–50 teacher hours per week before follow-up and administration. Separately,
100 Premium+ members using three included 50-minute sessions would require 250
live-teaching hours per month.

Before opening sales, define and enforce a realistic active-member cap,
submission allowance or cadence, booking capacity, holiday policy, and queue
fallback. Do not promise unlimited review. Recheck the three-business-day target
against actual queue time during a small preview cohort before scaling.

## Safe rollout

1. Export/back up the current Supabase schema and relevant Review Hub data.
2. Confirm the final local suite and build pass on the exact commit to deploy.
3. Confirm live migrations `015` and `016`, all 17 expected lesson slugs, and
   all 34 stable Premium task seeds.
4. Apply `202608180017_premium_task_topics.sql` as one transaction and verify
   its 34-row/51-topic postconditions.
5. Deploy the exact matching final-product commit to the dedicated v9 preview
   only.
6. Test an authorised teacher and Free, Standard, Premium, and Premium+ learner
   accounts, including below-tier payload withholding.
7. Test access-code create/reissue/redeem conflicts and one real speaking
   upload/return/resubmission plus one essay feedback publication.
8. Complete real-phone touch, microphone, PWA install/update, and offline-shell
   checks.
9. Promote to production only after every preview gate passes and a known-good
   rollback point is preserved.

Migration `017` and its matching UI are not live as of this document's update.
Do not expose the topic UI before its database columns exist, and do not expose
the final product in Production before authenticated Preview QA and the
physical-device gate are complete.
