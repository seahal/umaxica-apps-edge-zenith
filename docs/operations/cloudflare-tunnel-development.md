# Cloudflare Tunnel development

The rootless Compose project includes an opt-in `cloudflare-tunnel` connector for local Worker
development. It belongs to this repository and uses its own token from the ignored root `.env`.
Never reuse a token from another repository or print token values.

To start the workspace container and connector:

```bash
scripts/dev-start --tunnel
```

Run one of the five apex development servers inside the workspace container, or start a package's
Compose service in the `app` profile. Tunnel ingress and DNS are managed outside this repository.
Every hostname on the development Tunnel must require Cloudflare Access; see
[Cloudflare Access](cloudflare-access.md) and [ADR 008](../../adr/008-edge-development-tunnel-exposure.md).

This repository does not issue Wrangler remote commands or modify Cloudflare configuration as part
of ordinary local development. The connector process makes its own outbound connection only when
the developer explicitly starts it.
