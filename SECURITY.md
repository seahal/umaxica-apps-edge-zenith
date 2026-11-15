# Security Policy

This repository contains five public Cloudflare Workers: `app/apex`, `com/apex`, `org/apex`,
`net/apex`, and `dev/apex`. The Rails application is maintained in a separate repository and is
outside this policy.

## Reporting a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/seahal/umaxica-apps-edge-zenith/security/advisories/new).
The report is visible only to the maintainer. Do not publish reproduction steps for an unfixed
vulnerability in a public issue.

Include the affected package or production hostname, the commit tested, the observed impact, and
whether the issue has been disclosed elsewhere. Do not include live credentials or private user
data in a report.

## Scope

In scope are the five deployment units in `pnpm-workspace.yaml` and their production apex
hostnames: `umaxica.app`, `umaxica.com`, `umaxica.org`, `umaxica.net`, and `umaxica.dev`.

Out of scope are the Rails application, Cloudflare's platform, local development Tunnel hostnames,
non-production environments, test fixtures, and denial-of-service or load testing against
production. Report platform vulnerabilities to Cloudflare. The development Tunnel must remain
protected by Cloudflare Access; see [ADR 008](adr/008-edge-development-tunnel-exposure.md) and
[ADR 014](adr/014-edge-owned-development-tunnel.md).

## Existing controls

- Each package owns its response security headers, Hurl contracts, and Worker configuration.
- `no-console` is an error. Structured logging uses closed fields and must not expose credentials,
  cookies, request bodies, user identifiers, or free-form text.
- Container credentials are obtained interactively; secrets are not added to the repository or
  image. See [credential and secret management](docs/development/credential-and-secret-management.md).
- CI runs dependency auditing and secret scanning.

This policy describes the repository's intended controls. It does not claim a current production
security audit has been completed.
