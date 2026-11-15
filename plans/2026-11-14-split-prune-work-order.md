Task (umaxica-apps-edge-zenith only): prune this repository to the packages it owns after the edge split, and
finish its setup. No commit. No push, no deploy, no `wrangler` remote command, no Cloudflare
change. Never print secrets or environment values. Do not change anything outside this repository.

This container may see only this repository. Facts from other repositories are written below; do
not look for sibling checkouts.

## Decision (owner, 2026-11-12, confirmed 2026-11-14; do not reopen)

`plans/2026-11-12-split-edge-into-three-repositories.md` (read it first, if present here) splits the
old edge repository into three. Current names: `umaxica-apps-edge-zenith` (the group the plan calls
acme or apex), `umaxica-apps-edge-sphere`, `umaxica-apps-edge-press`. Each repository was copied
whole and now deletes what it does not own.

| Path | zenith | sphere | press |
| --- | --- | --- | --- |
| `{app,com,org,dev,net}/apex` | keep | delete | delete |
| `{app,org}/core` | delete | keep | delete |
| `com/core` | delete | delete (retired) | delete |
| `{app,com,org}/{docs,help,info,news}` | delete | delete | keep |
| `all/busy` | delete | keep until unneeded | delete |
| `tools/vpc-probe` | delete | keep | delete |
| other `tools/`, `scripts/`, `test/`, `e2e/`, `.mcp.json` | keep only what a kept package uses | same | same |
| `adr/`, `docs/`, `research/`, `specs/`, `plans/` | keep what concerns kept packages | same | same |

Paths not listed follow the same rule: keep what a kept package uses.

## Observed on 2026-11-14

- Source commit of this checkout: `a57134120fdee7d478aac461ad83c1645a85882d` (branch `feature`). Use it as the comparison base for
  pre-existing failures.
- Already done here (keep it): root package renamed to `umaxica-apps-edge-zenith`, all twenty
  units renamed `umaxica-apps-edge-zenith-*`, Workers Builds triggers and the app apex Worker name
  prepared (`evidence/2026-11-14-zenith-*`). `pnpm-workspace.yaml` still lists every unit
  (apex, core, docs, help, info, news). README says seventeen units; ADR 027 says twenty.
- The VPC transport binding still exists; it serves Core and goes with the deletion of Core here
  (sphere keeps it).
- Reference setup (umaxica-apps-edge-jump, already on Vite+): scripts `format` = `vp fmt . --write`,
  `format:check` = `vp fmt . --check`, `lint` = `vp lint --type-aware --fix .`, `lint:check` =
  `vp lint --type-aware .`, `typecheck` = `tsc --noEmit`, `test` = `vp test run`, `test:cov` =
  `vp test run --coverage`; devDependency `vite-plus` from the pnpm catalog; root `vite.config.ts`;
  `engines.node` `26.13.1`; `packageManager` `pnpm@12.18.0`.

## Work

1. Delete the packages this repository does not own, with their workspace entries
   (`pnpm-workspace.yaml`), root scripts and filters, tests, e2e specs, CI jobs, lefthook entries,
   dependency-cruiser paths, cspell words, syncpack groups and `.mcp.json` entries that only serve
   them. Regenerate `pnpm-lock.yaml`.
2. Names are already done; only remove references to deleted units.
3. Vite+ (`vp`) for the kept packages, following the reference setup above. If a package cannot
   build with `vp`, stop that package and report; do not add a non-Vite tool.
4. Docs: keep ADRs and docs about kept packages. For deleted scope, delete the doc, or mark an ADR
   "Superseded: moved to umaxica-apps-edge-<other>" when a kept doc links to it. Fix README unit
   counts and lists to match what remains.
5. Keep the five apex units only (`app`, `com`, `org`, `dev`, `net`).
6. Do not change Worker names, routes, bindings, rate-limit namespaces, secrets or `wrangler`
   environments of kept packages. Removing deleted packages' `wrangler` files locally is fine; the
   live Workers stay until the owner removes them in Cloudflare.

Stop and report (continue the rest) when a kept package imports code from a deleted one, or when a
deletion would change a kept package's deployed behaviour.

## Checks and report

`pnpm install`, `format:check`, `lint:check`, `typecheck`, `knip`, `test`, `check:architecture`,
`check:spelling`, and a local build of every kept package. If the pnpm store or `.git/config` is
read-only (seen in zenith on 2026-11-14), report it and run what can run; do not work around it by
downloading tools. Separate failures that already exist at `a57134120fdee7d478aac461ad83c1645a85882d` from new ones.

Evidence: `evidence/YYYY-MM-DD-split-prune-zenith-XXXX.md` (full `git rev-parse HEAD`): source SHA,
deleted paths summary, kept packages, Vite+ result per package, check results, stopped items, owner
items (Cloudflare Workers to remove for deleted packages, listed by current Worker name).
