# Website preview hub
November 16, 2026.

The root address is the entry point for people reviewing Zodiac.fm pages without prior project context. It explains the product, the purpose of the previews, how to review, and which actions are disconnected.

The latest available astrology page, meditation page, and example signup appear first. Their approval statuses remain visible and unchanged. The latest review guide follows as optional context. Earlier versions are grouped by version and collapsed, with a short explanation of what changed. Every page remains listed exactly once.

Search works across audience, purpose, partner, version, original title, and path. A query opens matching earlier-version groups. Clearing it restores the latest-first view. Search doesn't send requests or store queries.

All links and descriptions are rendered during the build. With JavaScript off, reviewers can still open the latest previews and expand earlier-version groups. No loading screen or client-side fetch is needed to see the register.

Page metadata lives in pages.json. Added fields are label, summary, family, revisionNote, previewQuery, and examplePartner. The original path, title, status, updated, and liveUrl fields are preserved. Missing metadata, missing folders, unknown page types, and missing live URLs remain visible rather than silently disappearing.

The newest version in a known family is selected by its numeric suffix, excluding missing folders and retired pages. Newer does not mean approved. Status changes continue to follow CLAUDE.md. Partner examples are preview links only and don't alter Inflektion IDs, categories, vanity URLs, or production routing.

Implementation: templates/register/index.html, scripts/register-model.mjs, scripts/register-render.mjs, scripts/build-register.mjs, and public/assets/register/. The build creates public/register.json and the complete public/index.html.

Verification covers numeric version sorting, missing-page fallbacks, retained records, safe links, escaping, original metadata preservation, collapsed history, and usable HTML without JavaScript. The search controller is checked with DOM doubles. Browser rendering, focus behavior, screen-reader announcements, mobile layout, and real taps remain unverified because browser control and local execution are unavailable in this session.

No landing-page copy, sample flow, offer, approval status, or production page is changed.

In this session, 125 model, content, metadata, and search-controller assertions passed. Search was tested with DOM doubles, not a browser. Two native URL checks are deferred to the build. Script syntax checks passed. The build validates earlier page versions before generating this hub.
