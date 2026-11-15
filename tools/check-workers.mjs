#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  expectedDevelopmentPort,
  isPositiveIntegerString,
  rateLimiterNamespace,
  RATE_LIMITER_BUDGET,
} from './lib/rate-limit-namespaces.mjs';
import { loadManifest, readWranglerConfig, repoRoot } from './lib/wrangler-config.mjs';

const expectedUnits = ['app/apex', 'com/apex', 'org/apex', 'net/apex', 'dev/apex'];
const failures = [];
const uniqueNamespaces = new Set();
const manifest = loadManifest();
const workspaces = readFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'utf8');
const declaredUnits = [...workspaces.matchAll(/^  - ([^\n]+)$/gmu)].map((match) => match[1]);

if (JSON.stringify(declaredUnits) !== JSON.stringify(expectedUnits)) {
  failures.push(`workspace units must be ${expectedUnits.join(', ')}`);
}
if (JSON.stringify(manifest.standalone) !== JSON.stringify(expectedUnits)) {
  failures.push(`workers manifest must list exactly ${expectedUnits.join(', ')}`);
}
for (const group of [
  'railsBacked',
  'railsBackedVite',
  'railsBackedVpcVite',
  'contentSurface',
  'external',
]) {
  if (!Array.isArray(manifest[group]) || manifest[group].length !== 0) {
    failures.push(`workers manifest ${group} must be empty`);
  }
}

for (const unit of expectedUnits) {
  const [brand] = unit.split('/');
  let config;
  try {
    config = readWranglerConfig(unit);
  } catch (error) {
    failures.push(`${unit}: ${error.message}`);
    continue;
  }
  const host = `umaxica.${brand}`;
  const packageJson = JSON.parse(readFileSync(join(repoRoot, unit, 'package.json'), 'utf8'));
  const port = expectedDevelopmentPort(brand, 'apex');
  const scriptPort = /--port\s+(\d+)/u.exec(packageJson.scripts?.dev ?? '')?.[1];

  if (config.name !== `umaxica-apps-edge-zenith-${brand}`)
    failures.push(`${unit}: Worker name changed unexpectedly`);
  if (JSON.stringify(config.routes) !== JSON.stringify([{ pattern: host, custom_domain: true }])) {
    failures.push(`${unit}: production custom-domain route mismatch`);
  }
  if (config.workers_dev !== false || config.preview_urls !== true)
    failures.push(`${unit}: preview settings mismatch`);
  if (scriptPort !== port) failures.push(`${unit}: dev port must be ${port}`);
  if (config.vars?.EDGE_ENV !== 'production') failures.push(`${unit}: production EDGE_ENV missing`);
  if (
    JSON.stringify(Object.keys(config.env ?? {}).sort()) !== JSON.stringify(['development', 'test'])
  ) {
    failures.push(`${unit}: expected only development and test environments`);
  }
  if (config.vpc_services || Object.values(config.env ?? {}).some((env) => env.vpc_services)) {
    failures.push(`${unit}: apex Worker must not carry a VPC binding`);
  }

  for (const [environment, prefix] of [
    ['production', ''],
    ['development', '2'],
    ['test', '3'],
  ]) {
    const target = environment === 'production' ? config : config.env?.[environment];
    if (!target) continue;
    if (environment !== 'production' && target.vars?.EDGE_ENV !== environment) {
      failures.push(`${unit}: env.${environment} EDGE_ENV mismatch`);
    }
    if (environment !== 'production' && JSON.stringify(target.routes) !== '[]') {
      failures.push(`${unit}: env.${environment} must not inherit production routes`);
    }
    const limit = (target.ratelimits ?? []).find((binding) => binding.name === 'RATE_LIMITER');
    const expectedId = rateLimiterNamespace({ env: environment, port, region: '00' });
    if (!limit) {
      failures.push(`${unit}: ${environment} RATE_LIMITER missing`);
      continue;
    }
    if (!isPositiveIntegerString(limit.namespace_id) || limit.namespace_id !== expectedId) {
      failures.push(`${unit}: ${environment} RATE_LIMITER namespace mismatch`);
    }
    if (
      limit.simple?.limit !== RATE_LIMITER_BUDGET.limit ||
      limit.simple?.period !== RATE_LIMITER_BUDGET.period
    ) {
      failures.push(`${unit}: ${environment} RATE_LIMITER budget mismatch`);
    }
    const uniqueKey = `${prefix}${limit.namespace_id}`;
    if (uniqueNamespaces.has(uniqueKey)) failures.push(`${unit}: duplicate rate-limit namespace`);
    uniqueNamespaces.add(uniqueKey);
  }
}

if (failures.length) {
  process.stderr.write(
    `check-workers: FAIL\n${failures.map((failure) => `  - ${failure}\n`).join('')}`,
  );
  process.exit(1);
}
process.stdout.write(`check-workers: OK (${expectedUnits.length} apex Workers validated)\n`);
