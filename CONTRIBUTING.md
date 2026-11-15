# Contributing

Use Node.js 26.13.1 and pnpm 12.18.0. Run `pnpm install` from the repository root, then use the checks in [AGENTS.md](AGENTS.md) before submitting a change.

Keep deployment changes inside the owning apex package. Do not change Worker names, routes, bindings, secrets, or remote Cloudflare state without explicit authorization. Add evidence under `evidence/` when a completed check is useful to retain.
