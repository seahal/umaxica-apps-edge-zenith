import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = join(fileURLToPath(new URL('../..', import.meta.url)));

export function parseJsonc(source) {
  let output = '';
  let inString = false;
  for (let index = 0; index < source.length; index += 1) {
    const pair = source.slice(index, index + 2);
    if (inString) {
      output += source[index];
      if (source[index] === '\\') {
        output += source[index + 1] ?? '';
        index += 1;
      } else if (source[index] === '"') {
        inString = false;
      }
    } else if (source[index] === '"') {
      inString = true;
      output += source[index];
    } else if (pair === '//') {
      while (index < source.length && source[index] !== '\n') index += 1;
      output += '\n';
    } else if (pair === '/*') {
      index += 2;
      while (index < source.length && source.slice(index, index + 2) !== '*/') index += 1;
      index += 1;
    } else {
      output += source[index];
    }
  }
  return JSON.parse(output.replace(/,(\s*[}\]])/gu, '$1'));
}

export function loadManifest() {
  return JSON.parse(readFileSync(join(repoRoot, 'tools/workers-manifest.json'), 'utf8'));
}

export function readWranglerConfig(workspace) {
  const path = join(repoRoot, workspace, 'wrangler.jsonc');
  return parseJsonc(readFileSync(path, 'utf8'));
}
