# Apex HTML contract

**Status: normative for the five apex Workers.** The packages render `/about` as their only
user-facing page; the root route redirects to the regional site. This contract covers their HTML
documents and does not describe the Core or public content applications.

## Page shell

The `/about` document has one `<header>`, one `<main>`, and one `<footer>` in that order. The
header contains the UMAXICA home link and no inactive controls. The page owns the only `<h1>`.
There is one skip link before the header; its `#main-content` target is focusable. The utility
navigation lives in the footer and links only to routes the Worker serves.

404 and error documents do not include the page shell. They still have one title, a main landmark,
localized content, a return link, and the same compiled stylesheet. The 429 response follows the
same status document contract.

## Styling

Tailwind CSS v4 utilities express visual rules in markup. Each package owns its stylesheet and
`@theme`; do not add a shared preset or a CSS-in-JS layer. The compiled stylesheet is a fingerprinted
asset referenced through `src/assets.ts`; document markup has no inline stylesheet or `style`
attribute. `--color-brand` is pinned to `#2563eb` across the five packages.

The HTML uses semantic elements and visible focus. The current page has no JavaScript controls or
breakpoint-dependent behavior. Any future interactive control must work with a keyboard and follow
[Keyboard guidelines](keyboard-guidelines.md).

## Titles, language, and cookies

Each HTML document has exactly one non-empty `<title>` in the form `UMAXICA (TLD)` or
`{page title} — UMAXICA (TLD)`. User-facing titles do not expose internal surface or runtime names.

The HTML language and localized copy follow the Hono language detector. Its cache is disabled, so
language negotiation does not issue `Set-Cookie`. The server may read `theme=light` or `theme=dark`
to select the rendered theme; it does not write a cookie.

## HTTP evidence

The response contract is exercised by each package's Hurl suite. `ui-shell-contract.hurl` checks
the rendered landmarks, focus path, navigation, stylesheet, and internal destinations;
`title-contract.hurl` checks titles; `status-surfaces.hurl` checks the error documents. Keep
response assertions in Hurl because they describe the HTTP document a client receives.
