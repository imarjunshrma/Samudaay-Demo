const enabled = process.env.EXPO_PUBLIC_AUTH_PERF_LOGS === 'true' || process.env.EXPO_PUBLIC_AUTH_DEBUG === 'true';
const sampleLabel = process.env.EXPO_PUBLIC_AUTH_SAMPLE_LABEL?.trim();
const networkType = process.env.EXPO_PUBLIC_AUTH_NETWORK_TYPE?.trim();
const buildType = process.env.EXPO_PUBLIC_AUTH_BUILD_TYPE?.trim();

export function logAuthPerformance(event: string, fields: Record<string, unknown> = {}) {
  if (!enabled) {
    return;
  }

  console.log(JSON.stringify({
    scope: 'auth-performance',
    event,
    ...(sampleLabel ? { sampleLabel } : {}),
    ...(networkType ? { networkType } : {}),
    ...(buildType ? { buildType } : {}),
    ...fields,
    timestamp: new Date().toISOString(),
  }));
}
