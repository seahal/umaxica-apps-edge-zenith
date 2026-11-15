# ADR 014: Edge owns its development Tunnel

## Status

Accepted; retained for the Zenith development environment.

## Decision

The repository may run an opt-in `cloudflare-tunnel` Compose service. It reads one
`CLOUDFLARED_TOKEN` from the ignored root `.env`; it does not use a fallback token variable. The
connector shares the local Compose network with this repository's Worker development services.
Starting the connector is explicit through `scripts/dev-start --tunnel`.

The token must belong to this repository's Tunnel. `scripts/dev-start --tunnel` checks for an
existing local Cloudflare connector using the same Tunnel identifier and refuses to start a second
connector for that Tunnel. Do not print the token or decoded data other than the identifier used by
that local duplicate check.

Development hostnames must remain protected by Cloudflare Access (ADR 008). Tunnel ingress,
hostname routes, and Access configuration are external to this repository and are not changed by
this decision.

## Consequences

The connector is defined in `compose.yaml` and does not start by default. A missing token prevents
the explicit `--tunnel` path from starting; ordinary local development does not require a Tunnel.
See [Cloudflare Tunnel development](../docs/operations/cloudflare-tunnel-development.md).
