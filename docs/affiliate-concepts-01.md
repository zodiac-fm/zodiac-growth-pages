# Zodiac.fm affiliate concepts, version 01
Date: 2026-11-16. Status: draft. Owner review and browser QA pending.

These files are design previews in zodiac-fm/zodiac-growth-pages only. They do not calculate frequencies, create accounts, connect checkout, or send conversion events. No production routing changes were made. Publishing follows this repo's CLAUDE.md: a commit on main triggers the existing Vercel preview deployment.

## What was inspected
The session could not access Natasha's local filesystem. The synced growth-pages main branch at e80ed0c4e0726f58269a1857c476669654b4a063 had no landing templates, CSS, affiliate configuration, offer registry, or milestone files. Local-only edits remain uninspected and must be reconciled before anyone pulls over a working tree.

Read the growth-pages AGENTS.md, CLAUDE.md, package, register builder, and publishing configuration. Read the current workspace voice, design system, offers, writing floor, Voice and Ear, Taste Ledger, Copy Test, approved language, audience knowledge, experimental messaging, and visual authority registry. Read source templates landers/a/control.html, landers/g/control.html, landers/a/hero-2.html, their shared script, and relevant CSS. Read the source page-history and affiliate-relaunch project plan. Read Linear's six acquisition milestones and ZFM-819. No issues or external messages were changed.

The current library source is site/styleguide-library.html, version 9-25. P-238 is a banked product image, not evidence of a listener outcome. The real logo comes from inapp/app-assets/logo-black.svg. Exact colors follow design/tokens.json, with the current blue hyperlink correction and retired-disc correction. Older numbered lander histories carry superseded discounts, so brand/offers.md wins. The explicit request for new concepts authorizes a separate candidate despite the existing project milestone's narrower reuse scope.

## Consequential conversion problems
1. Shared affiliate-category-template-v1.js inserts "20% Off", despite the current offer board prohibiting that claim. It shows no plan amounts at the first offer, increasing surprise at the membership decision.
2. The same script accepts affiliate_name from the query and defaults to XXXXXX. It never resolves a permanent Inflektion ID. This lets a URL imply an unverified relationship, and its acquisition allowlist omits affiliate_id.
3. A/control opens on chart familiarity, category names, and an art-led screen. G/control exposes the same taxonomy. These openings conflict with November 8's instruction to explain the four birth-based frequencies before naming them.
4. In A/hero-2, the 535px mobile phone stage alone puts the real next step well below the first screen. The first jump points to another offer, rather than beginning birth entry.
5. Both control pages use the same extended sixteen-section pattern, front-loading substantial testimony and study detail ahead of practical music use and the next action. The named beta figures and mechanism claims were not independently revalidated in this task and were not carried into these candidates.
6. Some existing FAQ answers imply mathematical calculation proves the proposition or repeat outdated provenance. These candidates separate the declared metaphysical model from established medical or physiological mechanisms.

These are source-code and editorial findings. No measured conversion lift is claimed.

## Audience decisions
| Audience | Motivation hypothesis | Objections | Proposed sequence |
| --- | --- | --- | --- |
| Astrology | Move from curiosity and chart insight to a personal listening experience. | Is it another reading? Must I know Human Design? Do transits change the music? What happens after I click? | Product and partner context, reading-versus-listening distinction, birth-to-music explanation and Vedic premise, accessible Human Design context, daily listening expectations, complete membership terms, relevant FAQs. |
| Meditation | Add personal music to a practice the visitor already values, then carry it into daily life. | Is it a course? Why birth information? Must I accept astrology? Is it only for relaxation? Will it fit my routine? | Product and partner context, familiar listening situations, why birth details personalize the music, realistic engagement expectations, explicit next steps, membership terms, practical FAQs. |

The first-screen product image and visible input-to-music explanation precede the CTA. The CTA says "Enter my birth details", because that is the next action. No sticky CTA is used: there are two decision points, and a fixed bar would take space from reading on small phones. The pages avoid a second competing hero action and repetitive offer sections.

The copy invites exploration of self-connection. It does not make a first-session sensation the test of success. The yearly price leads with its monthly equivalent and states the full annual charge in the same line. Neither plan is preselected in the journey. The $168 comparison represents twelve $14 monthly payments, not a supposed universal lifetime saving.

## Partner configuration and permission
The four example records come from zodiac-affiliate-configuration-109.json, read in its current version on November 16. Only public page identity fields are copied. All four have empty approved_branding arrays. Names, existing IDs, vanity URLs, and coupon codes are preserved exactly.

| ID | Name | Existing category | Vanity | Coupon |
| --- | --- | --- | --- | --- |
| 51502 | Astrology Hub | A | /astrologyhub | ASTROLOGYHUB |
| 28325 | Debra Silverman Astrology | A | /debrasilvermanastrology | DEBRASILVERMANASTROLOGY |
| 18301 | Denver Zen Den | G | /zenden | ZENDEN |
| 14085 | Heartspace | M | /mcewen | MCEWEN |

The preview does not claim any of these partners approved the new page or supplied a new recommendation. "For readers and listeners of..." identifies context without putting words in their mouth. No quote, portrait, or video was invented. The generic category argument remains complete without partner media. This is the deliberate fallback until approved partner material exists.

Partners are resolved from the checked-in records by affiliate_id, with aid supported as an incoming alias. URL-supplied names, offers, and coupon overrides cannot change partner facts. Unknown IDs produce the generic page and are flagged in review details rather than misattributed.

Supported optional branding keys are logo_url, portrait_url, introduction, endorsement, video_url, video_captions_url, and video_transcript. Each requires its exact field name in approved_branding. Text renders as text, not HTML. Asset URLs must be local approved assets or HTTPS assets hosted at zodiac-pages.vercel.app. This is an intentional approved-asset boundary, not permission to hotlink an arbitrary external interview. Video is click-to-play with preload none. It renders only when both an approved caption track and an approved readable transcript exist. A named partner portrait alone does not imply a recommendation. Missing or failed images fall back to the text page. Production must supply permission provenance and check the transcript and caption quality before using a video.

M remains Manifestation. Meditation is an explicit messaging direction, not a reinterpretation of category M. The new meditation page can be reviewed with an existing G or other approved partner without changing that record. Before production, add a separate messaging_variant and its approval metadata to the configuration, then have the existing vanity resolver select it only for explicitly approved partners. Do not infer a variant from a company name, coupon, or category, and preserve A/G/M, vanity URLs, and codes.

## Continuity and preview boundaries
The path is landing -> local birth-details page -> clearly labeled example results -> explicit plan choice -> preview completion. Birth data stays in DOM fields only, is reset on continuation, and never enters URLs, cookies, storage, logs, or requests. Only the referral allowlist and chosen plan enter the local preview URL. No account or payment request exists. Example Hz values are whole numbers and clearly labeled as illustrative.

The carried referral fields match the existing acquisition allowlist, plus canonical affiliate_id/aid, the record's coupon, offer_id, audience, and template_version. A review-only disclosure panel shows those values at every step. Real first-touch/last-touch rules, consent, cross-domain sessions, Inflektion validation, and commission reconciliation remain Walter's production integration work.

The offer record owns all prices and terms. Source templates contain offer placeholders. The build renders them before constructing the page register. Existing versions are preserved and all new entries remain draft.

## Validation status
In this session, 69 static checks passed and a separate 51-check query-logic harness passed canonical partner resolution, both audiences, query preservation, coupon conflicts, unknown IDs, and rejection of URL-supplied partner names. That harness used an in-memory parameter adapter because this tool runtime has no native URL classes. Script syntax checks passed. Native Node URL and safe-asset checks are included in the build gate and remained unexecuted at authoring time. Static review checks the new pages for local CTA destinations, one H1 per lander, image dimensions and alternatives, no real checkout or tracking references, plan choice, renewal disclosure, and offer consistency.

No local execution environment or browser-control tool was exposed. npm build, browser rendering, screenshots, actual taps, keyboard traversal, screen-reader behavior, image loading, font CORS, and measured page speed were not executed. Responsive CSS is designed for 390px first with 350px, 700px, and 1100px rules. Those are implemented breakpoints, not browser-verified results.

Before customer release, verify 350x760, 390x844, 768x1024, and 1440x900. Confirm the product, partner context, and CTA fit on the first screen at 390px. Test 200% text zoom and 320 CSS px reflow. Test keyboard and VoiceOver, native radio choice, focus changes between stages, validation, unknown-time path, all demo links, all missing branding, image failures, and back navigation. Check every asset returns the intended content and fonts load without CORS errors.

Only one approved image loads per lander. It reserves its aspect ratio, uses no animation, and is shared across variants for cache reuse. The full source PNG and three licensed font resources are still served from the established asset host. Their bytes, loading speed, and CORS behavior are unmeasured. Before launch, create appropriately sized responsive derivatives from the approved original without changing artwork, host fonts with the page, and measure LCP and transferred bytes.

## Prioritized experiments
Run after Michael's approval and production wiring, with user-level persistent assignment within affiliate and device. Validate exposure and paid-revenue joins before launch. Agree minimum meaningful effect, sample requirements, and stopping rules before looking at results.

| Priority | Hypothesis and comparison | Primary metric | Revenue or retention guardrail |
| --- | --- | --- | --- |
| 1 | These shorter, audience-specific explanations and explicit birth-entry CTAs improve qualified acquisition versus the existing approved category page. Run astrology and meditation separately within comparable partners. | Day-8 successful first payments per eligible landing visitor, intention to treat. | Net collected revenue per visitor through day 60, after affiliate commission and payment fees, must not degrade. Also monitor day-30 paid listener engagement and cancellation before billing. |
| 2 | A verified partner introduction placed next to the product explanation improves understanding and paid conversion beyond name-only context. Compare only after an exact quote and usage permission exist. | Successful first payment per eligible landing visitor. | Net revenue per visitor through day 60 and day-30 paid retention must not degrade. Check complaints and cancellation reasons for expectation mismatch. |
| 3 | Making annual value clearer with the same $88 versus twelve $14 payments comparison increases revenue without pushing unsuitable commitments. Compare equal plan presentation against annual-first explanation, keeping monthly equally easy and never hidden. | Net collected revenue per eligible visitor through day 60, after commissions and fees. | Day-30 paid listening and paid-member retention must not degrade. Watch billing complaints, disputes, and early cancellation by chosen plan. Never judge this on annual selection alone. |

Trial starts, birth-form completion, first listening, and plan mix are diagnostic metrics. They do not override successful payment, net revenue, or engagement guardrails.

## Handoff for Natasha to share after approval
Walter: these are separate version-01 candidates, not changes to production or existing controls. Review the chosen audience and partner variant with Michael first. Reuse the offer record, permission checks, and canonical ID mapping. Replace the preview birth form, example profile, and plan confirmation with the actual calculation, account, checkout, and first-listen flow. Keep the affiliate lane and chosen plan continuous through Stripe and the native-app sign-in bridge. Add the actual billing date, reminder, cancellation route, Terms and Privacy links, consent-aware tracking, event deduplication, and Inflektion reconciliation. Verify unknown-time behavior and location/time-zone resolution. Do not ship the sample profile or diagnostic panels. Do not change A/G/M routing until the separate messaging_variant is approved.
