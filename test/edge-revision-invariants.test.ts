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

describe('Edge revision representations', () => {
  it.each(APEX)('%s registers both revision representations on Hono', (unit) => {
    const source = code(`${unit}/src/create-apex-app.ts`);
    expect(source).toContain("app.get('/revision'");
    expect(source).toContain("app.get('/api/v0/revision.json'");
    expect(source).toContain('c.text');
    expect(source).toContain('c.json(versionMetadata(c)');
    expect(source).toContain('CF_VERSION_METADATA');
  });

  it.each(APEX)('%s ships the shared Hurl revision contract', (unit) => {
    const source = read(`${unit}/api/revision-api.hurl`);
    expect(source).toContain('GET {{base}}/api/v0/revision.json');
    expect(source).toContain('header "content-type" contains "application/json"');
    expect(source).toContain('jsonpath "$.*" count == 3');
    expect(source).toContain('GET {{base}}/revision\n');
    expect(source).toContain('header "content-type" matches /^text\\/plain/');
  });

  it('keeps revision contracts identical across the five apex workers', () => {
    const contracts = new Set(APEX.map((unit) => read(`${unit}/api/revision-api.hurl`)));
    expect(contracts.size).toBe(1);
  });
});
