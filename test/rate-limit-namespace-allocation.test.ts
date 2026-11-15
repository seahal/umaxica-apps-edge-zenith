import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  expectedDevelopmentPort,
  rateLimiterNamespace,
} from '../tools/lib/rate-limit-namespaces.mjs';
import { parseJsonc, repoRoot } from '../tools/lib/wrangler-config.mjs';

const units = ['app/apex', 'com/apex', 'org/apex', 'net/apex', 'dev/apex'] as const;
const read = (path: string) => readFileSync(join(repoRoot, path), 'utf8');

describe('apex rate-limit namespace allocation', () => {
  it.each(units)('%s keeps unique global namespaces in production and test tiers', (unit) => {
    const [brand] = unit.split('/');
    const port = expectedDevelopmentPort(brand, 'apex');
    const config = parseJsonc(read(`${unit}/wrangler.jsonc`));
    const production = config.ratelimits.find(
      (limit: { name: string }) => limit.name === 'RATE_LIMITER',
    );
    const development = config.env.development.ratelimits[0];
    const test = config.env.test.ratelimits[0];
    expect(production.namespace_id).toBe(
      rateLimiterNamespace({ env: 'production', port, region: '00' }),
    );
    expect(development.namespace_id).toBe(
      rateLimiterNamespace({ env: 'development', port, region: '00' }),
    );
    expect(test.namespace_id).toBe(rateLimiterNamespace({ env: 'test', port, region: '00' }));
  });

  it('derives the stable port allocation from the TLD and apex surface', () => {
    expect(
      units.map((unit) => expectedDevelopmentPort(...(unit.split('/') as [string, string]))),
    ).toEqual(['5401', '5101', '5301', '5201', '5501']);
  });
});
