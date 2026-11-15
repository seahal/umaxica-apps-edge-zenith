import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const repoRoot = join(import.meta.dirname, '..');
const read = (path: string) => readFileSync(join(repoRoot, path), 'utf8');
const code = (path: string) =>
  read(path)
    .replace(/\/\*[\s\S]*?\*\//gu, '')
    .replace(/\/\/.*$/gmu, '');
const APEX = ['app/apex', 'com/apex', 'org/apex', 'net/apex', 'dev/apex'] as const;

describe('Edge self-health API', () => {
  it.each(APEX)('%s serves the Hono self-health route without Rails', (unit) => {
    const source = code(`${unit}/src/create-apex-app.ts`);
    expect(source).toContain("app.get('/api/v0/health.json'");
    expect(source).toContain('renderHealthApi');
    expect(source).not.toContain('checkRailsHealth');
    expect(source).not.toContain('getRailsClient');
  });

  it.each(APEX)('%s ships the shared Hurl contract', (unit) => {
    const source = read(`${unit}/api/health-api.hurl`);
    expect(source).toContain('GET {{base}}/api/v0/health.json');
    expect(source).toContain('header "cache-control" contains "no-store"');
    expect(source).toContain('jsonpath "$.rails" not exists');
  });

  it('keeps Hurl self-health contracts byte-identical across all five workers', () => {
    const contracts = new Set(APEX.map((unit) => read(`${unit}/api/health-api.hurl`)));
    expect(contracts.size).toBe(1);
  });
});
