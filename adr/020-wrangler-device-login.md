# ADR 020: Wrangler authenticates with the Device Authorization Grant

## Status

Accepted — 2026-09-19; retained for the Zenith development environment.

## Context

Wrangler's default OAuth flow returns to a browser at `http://localhost:8976/oauth/callback`.
That callback is unavailable when Wrangler runs inside a container without a browser on the same
host, such as through `podman exec` or SSH.

## Decision

Use Wrangler's device authorization flow when the browser cannot reach the callback:

```bash
pnpm run login:device
```

The CLI prints a verification URL and one-time code, then polls for authorization. The wrapper
`scripts/wrangler-login --device` also disables browser launch and keyring use for the development
container.

## Consequences

- The same login flow works from the workspace container and remote shells.
- The login session remains in the container's local Wrangler configuration directory; it is not
  copied into the repository or image.
- [Wrangler authentication](../docs/development/wrangler-authentication.md) documents the current
  procedure.
