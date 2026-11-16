# Affiliate concepts 02
Date: November 16, 2026. Status: draft.

Version 01 remains intact. These are separate pages in zodiac-fm/zodiac-growth-pages. Production pages and routing are unchanged. The repo's existing main-to-Vercel publishing route is the only publishing route used.

## Changes responding to the conversion and UX review
| Problem | Version 02 change |
| --- | --- |
| Product explanation was abstract | Named compositions, approved sound descriptions, duration filters, and a clear explanation of how a song carries a personal frequency. |
| Paid membership sounded like an unspecified library | Compare the three free short compositions with five additional longer compositions. Names and app-label lengths appear before the pricing decision. No multiplication of frequency variants into supposedly different songs. |
| Partner name lacked a reason to trust | Use approved first-person accounts from Molly McCord and David McEwen on their matching example routes. Other partners use clearly named supporting testimony, without attributing it to the partner. |
| Phone art was unreadable at 90px | Larger approved P-238 artwork in the explanatory section. Desktop gets an additional responsive product view. Both use the same cached source. The hero's real composition description earns the first action on mobile without requiring a large image above it. |
| Two arguments felt interchangeable | Astrology starts with self-recognition beyond a reading. Meditation starts with choosing music for an existing practice and the time available, then explains birth-based personalization. |
| Qualification displaced desire | Explain the metaphysical premise once in the main argument. Keep realistic expectations beside how to begin listening. No invented science, outcome guarantees, urgency, or bodily sensation promises. |
| CTA foregrounded a chore | “Find my music” has an adjacent explanation that birth date, time, and place come next, then results, then plan choice. This is a testable proposal, not a proven conversion winner. |
| Sensitive information request lacked context | Explain what the inputs personalize and link to the actual privacy policy. Do not promise birth information is used only for calculation or never shared. |
| Results were just four numbers | Pair the example values with plain meanings and a concrete composition. Label all values as illustrative and not calculated. |
| Browser back did not follow the steps | New local controller uses safe history state and popstate. Birth values never enter history or URLs and clear on continuation. |
| Page ended after objections | A compact action follows the FAQs. There are three actions total, without another repeated pricing chapter. |
| Cost comparison outweighed listening value | Explain the five longer paid compositions first. Prices remain from the same canonical offer record. Neither plan is preselected. Remove the redundant preview agreement checkbox. |

## Exact source boundaries
- Brand sources previously read remain authoritative. Current offer matrix and writing floor were reread for this revision. brand/approved-language.md was read again.
- Composition names, approved descriptions, ordered purpose terms, and app-label lengths: copy/song-catalog.md, approved July 1 and current card. Product boundaries: knowledge/product/audio-catalog-and-playback.md and its deep reference.
- Quiet Success, Kindred Spirits, and Elysian Surge stay free. Membership adds Starseed, Astrolith, Cosmic Drift, Temple Space, and Galactic Deep. Each composition has four member-facing frequency placements, not four different compositions.
- Cosmic Drift retains its 25-minute app label. The catalog discloses that its measured source file runs 27:59.
- Temple Space has no approved one-line description, so its current approved purpose words appear in their accepted order. No new sound description was invented.
- Artwork: P-238 from the current site/styleguide-library.html. It is an illustrative app mockup, not a visitor's result or listener evidence.
- Cormorant and Switzer font files are copied unchanged from the established approved sources and served locally for this version. Licensed type and color tokens remain unchanged.
- Approved text accounts come from winners/testimonials.md, read November 16. Molly's Full is APPROVED November 4. David's Full is APPROVED July 20. Katie's supporting quote is a contiguous excerpt of her approved Full, omitting the flagged health line. No unverified portraits are shown.
- Molly's existing Inflektion record is 52145, category A, vanity /intuitiveastrology, coupon INTUITIVEASTROLOGY. Heartspace remains 14085, category M, vanity /mcewen, coupon MCEWEN. David's named quote is attached only through the verified matching affiliate example. Earlier example records remain unchanged.
- Optional logos, portraits, introductions, quotes, and captioned interview videos require field approvals. A portrait cannot be attached beside someone else's supporting quote. Interview video requires approved captions and a transcript before it renders.
- Privacy and Terms routes were opened November 16 at https://zodiac.fm/privacy and https://zodiac.fm/terms. Policy descriptions do not establish deployed consent behavior or backend data handling.

## Audio remains a gap
An existing /inapp/elysian-sky-600hz.mp3 demo was located. The approved song catalog identifies Elysian Sky as the production name of Elysian Surge, with checksum evidence for that naming relationship. That does not establish the marketing rights, release state, or current exact-file identity of this separate demo. The audio catalog explicitly separates possession from permission and current release. No audio was added or generated. There is no fake play control.

The revised catalog is a stronger text and product demonstration, not a substitute for hearing the music. Before a sample test, attach a cleared, versioned marketing audio asset and verify audible playback, volume, source identity, caption or text alternative as applicable, and loading behavior. The main birth-entry action should remain clear.

## Implementation and preview boundaries
- Sources: templates/affiliate-02/. Compiled pages: public/pages/astrology-affiliate/landing-02/, meditation-affiliate/landing-02/, and affiliate-preview/birth-details-02/.
- Shared CSS and controller: public/assets/affiliate-02/. Version 02 imports OFFER from version 01's canonical record. No second price registry.
- npm build retains the version 01 render/check steps and then runs version 02 rendering and checks before constructing the page register.
- Query names, quotes, coupons, offers, HTML, and asset URLs cannot override trusted partner records. Unknown IDs use a generic partner context and approved supporting proof.
- Existing campaign and click parameters carry into the local journey. Canonical affiliate_id/aid, coupon, offer_id, audience, and template_version=02 remain attached. No actual tracking fires.
- A/G/M categories do not change. Meditation is an explicit draft messaging direction. No existing vanity route or checkout resolver is changed.
- All four stages remain disconnected. No account, birth calculation, place lookup, checkout, subscription, or conversion event is created. Sample details and results remain marked as examples.
- Real signup, privacy/consent behavior, cancellation routing, reminder email, exact billing date, Stripe entitlements, Inflektion attribution, app sign-in, and first-listen measurement need production integration by Walter after approval.

## Verification
Local execution and browser-control tools remain unavailable in this session. In-session results: 95 static page/content checks, 73 query/catalog logic checks, and 13 controller checks passed. The latter two use an in-memory URL-parameter adapter and DOM doubles, not a browser. Source and compiled HTML matched exactly when the renderer ran against an in-memory filesystem. Script syntax passed. The three local font blobs match the original source hashes. Native Node checks run as part of the Vercel build. Publishing success does not establish browser QA or Michael's approval.

Pending browser verification: 350x760, 390x844, 768x1024, 1440x900, 200% text zoom, 320px reflow, first-screen CTA visibility, actual catalog filter behavior, date/time input behavior, unknown-time validation, focus movement, browser-back behavior, radio choice, keyboard and VoiceOver, image loading and failure, font loading, layout shift, transferred bytes, LCP, and route availability.

The approved source PNG remains unoptimized. It is lazy-loaded and reused across placements. The local font files remove the external font dependency for version 02. No media, motion, third-party scripts, or analytics load by default.

## Experiments, in priority order
1. Compare the revised audience argument plus concrete music catalog with version 01 within the same partner and device. Hypothesis: understanding what is available and why it fits increases qualified paid acquisition. Primary metric: successful first payments per eligible visitor. Guardrails: day-60 net collected revenue per visitor after commissions and fees, day-30 paid listening engagement, and expectation-related cancellation.
2. Compare approved partner-specific accounts with named supporting proof on eligible routes. Hypothesis: the partner's actual listening account makes the recommendation more credible. Primary metric: successful first payments per eligible visitor. Guardrails: day-60 net revenue, paid retention, and complaints. Do not compare different partners as though random assignment removed audience differences.
3. Once cleared audio is available, compare the concrete catalog alone with a brief representative listening sample. Hypothesis: visitors who know what they will hear make better trial and subscription decisions. Primary metric: day-30 engaged paying listeners per visitor. Guardrails: net revenue per visitor, LCP, form-start rate, and billing cancellations. Clearly label the sample as representative, not personalized.

Use persistent user-level assignment, intention-to-treat denominators, verified exposure-to-payment joins, and a pre-agreed minimum meaningful effect and stopping rule. Raw trial starts do not determine a winner.

## Review links
- /pages/affiliate-preview/review-02/
- /pages/astrology-affiliate/landing-02/?affiliate_id=52145
- /pages/meditation-affiliate/landing-02/?affiliate_id=14085
- /pages/astrology-affiliate/landing-02/?affiliate_id=51502
- /pages/meditation-affiliate/landing-02/?affiliate_id=18301

No team messages, Linear changes, production routing, or subscription actions were performed.
