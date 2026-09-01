const DEFAULT_BASE_URL = 'https://example.invalid';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const normalizedBaseUrl = configuredBaseUrl?.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const apiConfig = {
  baseUrl: normalizedBaseUrl || DEFAULT_BASE_URL,
  timeoutMs: 15000,
  isConfigured: Boolean(normalizedBaseUrl && normalizedBaseUrl !== DEFAULT_BASE_URL),
} as const;
