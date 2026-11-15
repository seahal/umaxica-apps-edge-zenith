# Rate-limit namespace allocation

Cloudflare account-scoped counters require unique namespace ids for independent Workers. The
allocation rule and the owner-approved assignments are recorded in
[ADR 022](../../adr/022-rate-limit-namespace-allocation.md).

The five apex Worker packages declare their development ports in `scripts.dev --port`. Production
ids append the global region suffix `00`; development and test environments prefix the production
id with `2` and `3` respectively.

| Worker     | Production | Development |      Test |
| ---------- | ---------: | ----------: | --------: |
| `com/apex` |   `510100` |   `2510100` | `3510100` |
| `net/apex` |   `520100` |   `2520100` | `3520100` |
| `org/apex` |   `530100` |   `2530100` | `3530100` |
| `app/apex` |   `540100` |   `2540100` | `3540100` |
| `dev/apex` |   `550100` |   `2550100` | `3550100` |

All use a budget of 2000 requests per 60 seconds. `pnpm run check:workers` verifies Worker names,
routes, ports, environment keys, namespace uniqueness, and budgets from the local manifests.
