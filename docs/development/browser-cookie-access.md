# Browser cookie access

The apex packages render HTML on the server. They may read request cookies when a server-rendered
document has a defined behavior for them; currently `src/theme.ts` honors only `theme=light` and
`theme=dark`. It never writes a cookie or reflects arbitrary cookie data into markup.

No browser-side code currently reads or writes cookies. If a concrete browser feature needs cookie
access, use the browser's Cookie Store API (`cookieStore`). Do not use `document.cookie`, add a
cookie library, or introduce a wrapper module before a feature needs one.

The language detector is mounted with `caches: false`, so language negotiation does not create or
refresh a preference cookie. The Hurl contracts in each package verify that these responses set no
cookie.
