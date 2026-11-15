import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadManifest, parseJsonc, repoRoot } from '../tools/lib/wrangler-config.mjs';

const APEX = {
  'app/apex': { port: '5401', host: 'umaxica.app' },
  'com/apex': { port: '5101', host: 'umaxica.com' },
  'org/apex': { port: '5301', host: 'umaxica.org' },
  'net/apex': { port: '5201', host: 'umaxica.net' },
  'dev/apex': { port: '5501', host: 'umaxica.dev' },
} as const;

const read = (path: string) => readFileSync(join(repoRoot, path), 'utf8');
const count = (source: string, needle: string | RegExp) =>
  typeof needle === 'string'
    ? source.split(needle).length - 1
    : [...source.matchAll(new RegExp(needle, `${needle.flags.replace('g', '')}g`))].length;

describe('apex deployment units', () => {
  it('lists exactly five independently deployable workers', () => {
    const workspace = read('pnpm-workspace.yaml');
    const lock = read('pnpm-lock.yaml');
    for (const unit of Object.keys(APEX)) {
      expect(count(workspace, new RegExp(`^ {2}- ${unit}$`, 'mu')), unit).toBe(1);
      expect(existsSync(join(repoRoot, unit, 'package.json')), unit).toBe(true);
      expect(count(lock, new RegExp(`^ {2}${unit}:$`, 'mu')), unit).toBe(1);
    }
    expect(loadManifest().standalone).toEqual(Object.keys(APEX));
  });

  it('preserves each Worker name, production host, and development port', () => {
    for (const [unit, { port, host }] of Object.entries(APEX)) {
      expect(read(`${unit}/package.json`)).toContain(`vp dev --port ${port} `);
      expect(read(`${unit}/vite.config.ts`)).toContain(`allowedHosts: ['${host}']`);
      const config = parseJsonc(read(`${unit}/wrangler.jsonc`));
      expect(config.name).toBe(`umaxica-apps-edge-zenith-${unit.split('/')[0]}`);
      expect(config.routes).toEqual([{ pattern: host, custom_domain: true }]);
      expect(config.workers_dev).toBe(false);
      expect(config.preview_urls).toBe(true);
      for (const env of Object.values(config.env ?? {}) as { routes?: unknown }[]) {
        expect(env.routes).toEqual([]);
      }
    }
  });

  it('keeps every apex package in the test, build, and API CI matrices', () => {
    const integration = read('.github/workflows/integration.yaml');
    for (const unit of Object.keys(APEX)) {
      expect(count(integration, `          - ${unit}\n`), unit).toBeGreaterThan(0);
    }
    const include = integration.match(/        include:\n([\s\S]*?)\n      steps:/u)?.[1] ?? '';
    for (const unit of Object.keys(APEX)) expect(include).toContain(`dir: ${unit}`);
    for (const file of readdirSync(join(repoRoot, '.github/workflows'))) {
      expect(read(`.github/workflows/${file}`)).not.toContain('Retired Edge Worker');
    }
  });

  it('keeps preview builds limited to the five owned workers', () => {
    const deploy = read('scripts/deploy-edge-preview');
    for (const unit of Object.keys(APEX)) expect(deploy).toContain(unit);
    expect(deploy).not.toMatch(/app\/core|com\/core|org\/core|app\/docs|com\/docs|org\/docs/u);
  });
});
