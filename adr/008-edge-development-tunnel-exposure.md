# ADR 008: Development Tunnel hostnames require Cloudflare Access

## Status

The original 16-surface routing decision is superseded by the repository split. Its cross-surface
operational details moved with the Sphere and Press packages. The host-wide Access requirement and
no-bypass policy remain for Zenith's five apex development hostnames.

## Decision

1. Public hostnames exposed through the development Tunnel require Cloudflare Access.
2. Do not add an unauthenticated bypass for health, revision, or other paths.
3. The repository owns its local Tunnel connector and token boundary, as recorded in ADR 014.
4. Cloudflare ingress, DNS, and Access policies are external state. This repository documents the
   requirement but does not configure or verify that state.

## Consequences

The local procedure is documented in [Cloudflare Tunnel development](../docs/operations/cloudflare-tunnel-development.md)
and [Cloudflare Access](../docs/operations/cloudflare-access.md). Historical route tables and
verification results from the former 16-surface layout are not current deployment inventories.
