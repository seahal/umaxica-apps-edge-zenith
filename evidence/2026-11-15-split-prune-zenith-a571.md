# Zenith split prune — 2026-11-15

## Scope

- Source commit: `a57134120fdee7d478aac461ad83c1645a85882d`.
- Current `git rev-parse HEAD`: `a57134120fdee7d478aac461ad83c1645a85882d`.
- Kept deployment packages: `app/apex`, `com/apex`, `org/apex`, `net/apex`, `dev/apex`.
- Deleted package trees: `{app,com,org}/{core,docs,help,info,news}` (15 packages), `all/busy`,
  and `tools/vpc-probe`. Root workspace, CI, scripts, tests, ADRs, docs and plans were reduced to
  the retained Workers and the development environment.
- Kept Worker `wrangler.jsonc` files were not modified. No commit, push, deploy, remote Wrangler
  command or Cloudflare change was made.

## Vite+ build attempts

The package manager install was blocked before Vite+ was available. Per the work order, each
package stopped before invoking a non-Vite+ build command.

| Package    | Result                                        |
| ---------- | --------------------------------------------- |
| `app/apex` | Blocked: `vp` unavailable; build not started. |
| `com/apex` | Blocked: `vp` unavailable; build not started. |
| `org/apex` | Blocked: `vp` unavailable; build not started. |
| `net/apex` | Blocked: `vp` unavailable; build not started. |
| `dev/apex` | Blocked: `vp` unavailable; build not started. |

## Checks

| Check                | Result                                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`       | Blocked with `ERR_PNPM_STORE_DIR_OPEN_OPERATION_LOCK`; pnpm could not open its store operation lock. No download workaround was used. The command updated pnpm package-manager metadata in the lockfile to 12.18.0, but did not regenerate the workspace importers. The lockfile still describes the old 20-unit workspace. |
| Format               | Existing Oxfmt 0.75.0 passed the targeted check on the changed tracked files. A repository-wide fallback check reports only the supplied, untracked work order as unformatted; that input file was left unchanged. The Vite+ formatter was unavailable.                                                                     |
| Lint                 | Existing Oxlint 1.90.0 passed without type-aware mode. Type-aware lint stops in all five package configs because `vite-plus` is not installed.                                                                                                                                                                              |
| Typecheck            | Existing TypeScript 7.0.2 stops in all five packages on the missing `vite-plus` module. The requested TypeScript 7.1 toolchain was unavailable.                                                                                                                                                                             |
| Knip                 | Existing Knip 6.44.1 could not load any package `vite.config.ts` because `vite-plus` is missing; unused-file and dependency output is not treated as a valid result.                                                                                                                                                        |
| Test                 | Existing Vitest 5.1.0 failed to load the root and app package config because `vite-plus` is missing. No assertions ran.                                                                                                                                                                                                     |
| `check:architecture` | PASS — dependency-cruiser analyzed 13 modules and 17 dependencies.                                                                                                                                                                                                                                                          |
| `check:deps`         | PASS — syncpack reported no issues.                                                                                                                                                                                                                                                                                         |
| `check:spelling`     | PASS — existing CSpell binary checked 516 files with no issues.                                                                                                                                                                                                                                                             |
| `check-workers`      | PASS — five apex Workers validated.                                                                                                                                                                                                                                                                                         |
| `git diff --check`   | PASS.                                                                                                                                                                                                                                                                                                                       |

The available Node runtime was 26.12.0; the repository declares 26.13.1. The package installation
blocker and missing Vite+ package prevented full CI-equivalent verification.

## Baseline separation

The pnpm store operation-lock failure was already reported for this checkout on 2026-11-14 in the
work order's observed state. The missing `vite-plus` startup errors followed the Vite+ setup change,
but installation could not complete because of that store blocker. No test assertions or package
builds ran, so there is no code-level test or build regression to compare against the source SHA.
The source SHA is still `HEAD`; no checkout switch or baseline mutation was used.

## Owner cleanup list

These names come from the deleted packages' top-level `wrangler.jsonc` files at the source commit.
Cloudflare account state, deployed environment variants and Worker existence were not queried.

- `umaxica-apps-edge-zenith-app-core`
- `umaxica-apps-edge-zenith-app-docs`
- `umaxica-apps-edge-zenith-app-help`
- `umaxica-apps-edge-zenith-app-info`
- `umaxica-apps-edge-zenith-app-news`
- `umaxica-apps-edge-zenith-com-core`
- `umaxica-apps-edge-zenith-com-docs`
- `umaxica-apps-edge-zenith-com-help`
- `umaxica-apps-edge-zenith-com-info`
- `umaxica-apps-edge-zenith-com-news`
- `umaxica-apps-edge-zenith-org-core`
- `umaxica-apps-edge-zenith-org-docs`
- `umaxica-apps-edge-zenith-org-help`
- `umaxica-apps-edge-zenith-org-info`
- `umaxica-apps-edge-zenith-org-news`
- `umaxica-apps-edge-zenith-all-busy`
- `umaxica-apps-edge-zenith-vpc-probe`
