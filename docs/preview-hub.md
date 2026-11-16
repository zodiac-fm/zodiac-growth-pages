# GTM review register
November 16, 2026.

Natasha corrected the register's framing: these are different versions to review, not earlier versions to hide behind a latest-first recommendation. She requested an easy place to review GTM work and landing pages, using tables with nothing fancy.

The root register now contains four plain tables:
1. GTM work, linking to the existing public strategy, membership, partner-content, and copy notes.
2. Landing pages, with audience, version, approach, example partner, status, and preview link.
3. Example signup flows, with each version's focus, status, and preview link.
4. Review guides, with context for each version.

Every version has equal visibility. No automatic latest selection, collapsed versions, cards, search, numbered start flow, or client-side rendering. Tables scroll horizontally on smaller screens and can receive keyboard focus. Header cells identify columns and rows.

All 12 preview pages, their original titles, paths, approval statuses, update dates, and live URLs are preserved. Version notes now describe the approach without calling a version earlier, original, or preferred. Partner example query parameters continue to use the existing records. No landing-page content, partner category, vanity URL, offer, or production routing is changed.

pages.json owns page metadata. review-links.json owns the GTM reference links. They point to notes already available in the public preview repository. Internal project and issue URLs were not added. The register does not invent progress or copy potentially stale task statuses.

The build renders the complete HTML and JSON register. Missing pages and unknown page families remain visible. Tests cover equal version visibility, retained records, numeric ordering, original metadata, safe addresses, working preview paths, GTM references, table semantics, and usable content without JavaScript.

Browser rendering, actual keyboard scrolling, screen-reader behavior, and mobile appearance remain unverified because no browser-control tool is available in this session.
