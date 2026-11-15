import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite-plus';

/*
 * Vite is a BUILD tool here and nothing else. Nothing it ships reaches a
 * deployed Worker: `vite build` emits the Worker bundle, the hashed client
 * assets, and an output `wrangler.json` that `wrangler deploy` reads on its
 * own. There is no Vite in the request path and no Node server in production.
 *
 * Two things are deliberately absent from this file.
 *
 * There is no `assets.directory`, here or in wrangler.jsonc: the plugin fills
 * it in with the client build output when it writes the output config.
 * Declaring it in the input config is the documented way to get it wrong.
 *
 * There is no root `index.html`, and none must ever be added. Cloudflare
 * matches static assets BEFORE the Worker runs, so an `index.html` in the
 * build output would answer `/` itself and the Hono route behind it would
 * become unreachable — silently, and only in production.
 *
 * `inspectorPort` is pinned per unit because the root `dev` script runs every
 * unit in parallel; on the plugin's default (9229) they would collide.
 */
export default defineConfig({
  // Source maps for the WORKER build only. `wrangler.jsonc` sets
  // `upload_source_maps`, and the output is `no_bundle`, so wrangler uploads the
  // maps it finds next to the Worker module. The environment is named after the
  // Worker (`name` in wrangler.jsonc, hyphens as underscores). Setting
  // `build.sourcemap` at the root instead would also emit maps into
  // `dist/client`, where they would be served as public static assets.
  environments: { umaxica_apps_edge_zenith_app: { build: { sourcemap: true } } },
  plugins: [cloudflare({ inspectorPort: 9401 }), tailwindcss()],
  server: { allowedHosts: ['umaxica.app'] },
  test: {
    coverage: {
      exclude: [
        '**/+types/**',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/__mocks__/**',
        '**/public/**',
        '**/*.css',
        '**/*.svg',
        '**/locales/**',
        '**/coverage/**',
        '**/.wrangler/**',
        '**/e2e/**',
        '**/playwright.config.ts',
        '**/vitest.config.ts',
        '**/vitest.setup.ts',
        // Browser-rendered entry and UI modules belong to Playwright/Hurl, not
        // Vitest; coverage must measure only the internal-logic layer.
        '**/src/index.tsx',
        '**/src/page-content.tsx',
        '**/src/renderer.tsx',
        '**/src/shell.tsx',
      ],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      // A small uncovered file must not hide behind a large covered one.
      // Vitest 5: per-file floors live on `thresholds`, not CoverageOptions.
      thresholds: {
        perFile: true,
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    deps: {
      interopDefault: true,
    },
    environment: 'happy-dom',
    globals: true,
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    // --- Hardened execution contract -----------------------------------------
    // Identical across all five apex units and kept inline in each,
    // never a shared import or root config, so the directory stays independently
    // runnable and extractable (test/deployment-unit-boundaries.test.ts).
    // Rationale and the concurrency benchmark: evidence/2026-09-07-vitest-hardening.md.
    allowOnly: false,
    passWithNoTests: false,
    retry: 0,
    isolate: true,
    fileParallelism: true,
    // Bounded because up to four units run at once under the root `pnpm -r`
    // fan-out (`--workspace-concurrency=4`); workspace concurrency x maxWorkers
    // is the real worker ceiling (4 x 2 = 8). Vitest 5 dropped `minWorkers`;
    // `maxWorkers: 2` is the per-unit ceiling.
    maxWorkers: 2,
    maxConcurrency: 4,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    dangerouslyIgnoreUnhandledErrors: false,
    testTimeout: 10_000,
    hookTimeout: 10_000,
    teardownTimeout: 10_000,
    slowTestThreshold: 300,
    // Normal runs are deterministic order, non-concurrent. The stress loop
    // (`pnpm run test:stress`) turns shuffling on from the CLI instead, so an
    // order-dependency bug surfaces there rather than flaking the fast loop.
    sequence: {
      concurrent: false,
      shuffle: false,
    },
  },
});
