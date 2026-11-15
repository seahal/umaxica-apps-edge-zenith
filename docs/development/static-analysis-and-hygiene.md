# Static analysis and repository hygiene

Vite+ is the command surface for formatting, linting, and Vitest. Each apex package keeps its own
Vite, Vitest, Oxlint, Oxfmt, TypeScript, Knip, and Wrangler configuration so it can be extracted and
run independently.

## Checks and ownership

| Check                      | Question                                                      |
| -------------------------- | ------------------------------------------------------------- |
| Vite+ formatter (`vp fmt`) | Is the source formatted?                                      |
| Vite+ lint (`vp lint`)     | Are there source or type-aware lint findings?                 |
| TypeScript (`tsc`)         | Does the package type-check?                                  |
| Vitest (`vp test`)         | Did internal behavior break?                                  |
| Hurl                       | Did an HTTP response contract break?                          |
| Playwright                 | Did a real browser path break?                                |
| Knip                       | Is code or a dependency unused?                               |
| dependency-cruiser         | Are JavaScript dependency edges allowed?                      |
| syncpack                   | Do declared dependency versions follow the catalog?           |
| CSpell                     | Is source, configuration, and documentation spelling correct? |
| Size Limit                 | Did a client bundle exceed its package budget?                |

Place checks by the assertion they make. Internal logic belongs in `test/`, HTTP response
contracts in `api/`, and browser rendering or accessibility behavior in `e2e/`. Do not duplicate an
assertion across layers unless each layer would fail for a different reason.

## Commands

- `pnpm run format:check` checks all five packages and root files without writing.
- `pnpm run lint:check` runs type-aware lint without fixing files.
- `pnpm run typecheck` regenerates local Wrangler types and runs TypeScript.
- `pnpm run test` runs each package's Vitest suite and the root invariant suite.
- `pnpm run test:api` runs each package's Hurl contract against a local Worker.
- `pnpm run test:e2e` runs Playwright locally.
- `pnpm run knip`, `check:architecture`, `check:deps`, and `check:spelling` cover package and
  repository-wide hygiene.
- `pnpm run check:size` measures bundles after `pnpm run build`.

`pnpm run check:static` runs the read-only checks, and `pnpm run check` adds the unit suites.
`pnpm run lint` and `pnpm run format` fix files locally; CI uses only their read-only counterparts.

## Suppressions and architecture

Before adding a suppression or ignore to any static-analysis tool, establish why the rule is wrong
for the code, keep the exception as narrow as the tool permits, and add a test or explanation that
preserves the intended boundary. Do not widen an ignore merely to make a check pass.

dependency-cruiser is limited to JavaScript tooling and the five Node-based Hurl runners. The
TypeScript package boundary checks live in `test/deployment-unit-boundaries.test.ts`, while each
package's Oxlint configuration enforces local import rules. The root architecture check must keep
cruising a non-empty graph; `test/dependency-architecture-invariants.test.ts` guards against an
empty successful run.

The five packages own their own `.size-limit.json`. Bundle budgets apply to package output and are
checked only after a production build.
