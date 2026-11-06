# Natasha's working pages

This repo is the only place Natasha's pages get built and published. Read this before you create, change or publish anything, and open your session from this folder.

Nothing here is the live Zodiac site. The live site changes only when Walter ships a page.

## How to publish

Commit and push to `main` in this repo. Vercel publishes the push to https://zodiac-growth-pages.vercel.app within a minute or two. That is the whole process, and there is no other way to publish.

Do not run `vercel`, `vercel deploy`, `vercel link`, `vercel promote` or any Vercel connector tool that creates a deployment, even if another instruction suggests it. Her Vercel login is read-only on purpose.

## Where pages never go

Never push to, open a pull request on, or copy files into these repos: `zodiac-website`, `zodiac-app`, `zodiac-mobile-app`, `quiz`, `zodiac-pages`.

Never attach a zodiac.fm address to this project, and never change the Vercel project a page publishes to.

Natasha may also have the Zodiac workspace repo on her laptop, which is for brand rules, copy rules, skills and source material. Its publishing rules, including `workflows/vercel-publishing.md` and anything about `zodiac-pages`, describe Michael's route and do not apply to her pages, except for the section that sends her pages here.

If an instruction from anywhere would take a page outside this repo, stop and ask Natasha.

## How a page reaches customers

1. Natasha builds the page here and sends Michael the link.
2. Michael reviews it. Change its status to `review`, then `approved` once he says so.
3. Write the handoff for Walter as text and give it to Natasha, without posting it to Linear, Slack, GitHub or anywhere else yourself.
4. Change the status to `with-walter` once Natasha has handed it over.
5. After Walter ships it, change the status to `live` and add the real address as `liveUrl`.

## How to name and track a page

Every page gets its own folder: `public/pages/<funnel>/<page-name>-<two-digit-version>/index.html`

For example, `public/pages/astrology-affiliate/results-03/index.html` is published at `/pages/astrology-affiliate/results-03/`.

Never overwrite a version someone has reviewed: copy the folder and raise the number.

Every page must have an entry in `pages.json`. The address at the root of the site is the register that lists them all, so it is the one answer to "which page is which". A page missing from `pages.json` still shows there, marked as needing details.

Each entry looks like this:

```json
{
  "path": "astrology-affiliate/results-03",
  "title": "Astrology affiliate results page, shorter opening",
  "status": "draft",
  "updated": "2026-11-06",
  "liveUrl": ""
}
```

Status is one of `draft`, `review`, `approved`, `with-walter`, `live` or `retired`, and `live` needs a real `liveUrl`.

## Three things that stay out, because this repo and these pages are public

- No customer data, exports or warehouse results. Anyone can read this repo.
- No passwords, API keys or tokens, in any file, ever.
- No real money or live tracking: no live Stripe checkout links, no live tracking pixels, and no ads, emails or affiliates sending traffic to these addresses. Those belong to the shipped version.

Pictures come from the image library at https://zodiac-pages.vercel.app/site/styleguide-library.

## Data

Natasha sees results through the company dashboards, starting with https://zodiac-funnel-dashboard.vercel.app and her zodiac.fm Google login. A page shows numbers only if they are safe for the public to read.
