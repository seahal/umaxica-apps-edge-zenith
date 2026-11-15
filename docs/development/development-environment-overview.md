# Edge development environment

The development environment uses rootless Podman and a workspace container named `core`. The
repository owns five standalone Hono Workers: `app/apex`, `com/apex`, `org/apex`, `net/apex`, and
`dev/apex`. The container does not receive the host HOME, private keys, CLI credential stores, or
Podman/Docker sockets.

## Dev Container

Start the Dev Container from the repository root:

```bash
scripts/devcontainer-up
```

Run a Worker from the workspace root inside the container:

```bash
pnpm --dir app/apex run dev
```

Replace `app/apex` with another package to start a different Worker. The container publishes the
five development ports and Wrangler's login callback.

## Direct Compose

`scripts/dev-start` starts the workspace container. Add `--tunnel` to start this repository's
Cloudflare Tunnel connector too:

```bash
scripts/dev-start [--tunnel]
```

The connector reads `CLOUDFLARED_TOKEN` from the ignored repository-root `.env`. Public tunnel
hostnames must remain protected by Cloudflare Access. The repository does not manage the external
Tunnel ingress or Access configuration; see [Tunnel development](../operations/cloudflare-tunnel-development.md).

The `app` Compose profile can run an apex Worker as its own service. For example:

```bash
podman compose --profile app up app-apex
```

The optional local override in `compose.override.yaml.example` is host-specific. The base files are
enough for a fresh clone; no override is required.

## Toolchain and credentials

Use Node.js 26.13.1 and pnpm 12.18.0. Wrangler credentials are obtained interactively inside the
container with `pnpm run login` or `pnpm run login:device`; see
[Wrangler authentication](wrangler-authentication.md). Other development credentials and container
boundaries are documented in [credential and secret management](credential-and-secret-management.md)
and [container security policy](container-security-policy.md).
