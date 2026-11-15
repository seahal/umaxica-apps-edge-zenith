# Edge development container

`Containerfile` builds the rootless Podman development image. It pins Node.js 26.13.1 and pnpm
12.18.0 to the versions declared in `package.json`. The image includes GitHub CLI, Chromium
prerequisites, Wrangler through project dependencies, and the development CLIs. No credential is
copied into an image layer.

pnpm is installed from its standalone install script into `$PNPM_HOME/bin`. Corepack is removed so
it cannot put a second pnpm ahead of the pinned installation. The versions in `Containerfile` and
`package.json` are covered by `test/development-container-security.test.ts`.

The effective user is `edge`, mapped through rootless `keep-id:uid=1000,gid=1000`. The image creates
the tool and writable XDG paths at build time.

Start the Dev Container from the repository root:

```bash
scripts/devcontainer-up
```

The five apex Workers can be started by hand inside the workspace container. The direct Compose
entrypoint is also available:

```bash
scripts/dev-start [--tunnel]
podman compose exec core bash -l
```

See [Dev Containers CLI startup on rootless Podman](devcontainer-cli-podman-startup.md) for the
launcher details and [development environment overview](development-environment-overview.md) for
the available services.
