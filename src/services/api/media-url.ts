import { apiConfig } from '@/src/constants/apiConfig';

export function resolveBackendMediaUrl(fileUrl?: string | null) {
  const value = String(fileUrl || '').trim();
  if (!value) {
    return undefined;
  }

  if (/^(https?:|file:|data:|blob:)/i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${apiConfig.baseUrl}${normalizedPath}`;
}
