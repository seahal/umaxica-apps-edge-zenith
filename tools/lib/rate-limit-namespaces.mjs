export const REGION = { GLOBAL: '00' };

export const TLD_CODE = {
  com: '51',
  net: '52',
  org: '53',
  app: '54',
  dev: '55',
};

export const SURFACE_CODE = { apex: '01' };
export const ENV_PREFIX = { production: '', development: '2', test: '3' };
export const RATE_LIMITER_BUDGET = { limit: 2000, period: 60 };
export const POSITIVE_INTEGER_STRING = /^[1-9][0-9]*$/u;

export function expectedDevelopmentPort(brand, surface) {
  const tld = TLD_CODE[brand];
  const code = SURFACE_CODE[surface];
  return tld && code ? `${tld}${code}` : null;
}

export function rateLimiterNamespace({ env, port, region = REGION.GLOBAL }) {
  const prefix = ENV_PREFIX[env];
  if (prefix === undefined) throw new Error(`unknown rate-limit environment ${env}`);
  return `${prefix}${port}${region}`;
}

export function isPositiveIntegerString(namespaceId) {
  return POSITIVE_INTEGER_STRING.test(String(namespaceId));
}
