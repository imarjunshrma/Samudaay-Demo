import { apiConfig } from '@/src/constants';
import { getActiveTenantRequestHeaders } from '@/src/core/config/community';
import { getErrorMessage } from '@/src/services/error-message';
import { isAuthExpirationError, notifyAuthExpired } from './auth-expiration';
import { isCommunityUnavailableError, notifyCommunityUnavailable } from './community-availability';
import { withAuthHeaders } from './interceptors';

export interface ApiClientInit extends RequestInit {
  token?: string;
}

export async function apiClient<TResponse>(input: string, init?: ApiClientInit): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), apiConfig.timeoutMs);
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  try {
    const response = await fetch(`${apiConfig.baseUrl}${input}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...getActiveTenantRequestHeaders(),
        ...withAuthHeaders(init?.headers ?? {}, { token: init?.token }),
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let errorMessage = `Request failed with status ${response.status}`;

      try {
        if (contentType.includes('application/json')) {
          const payload = await response.json();
          errorMessage = getErrorMessage(payload, errorMessage);
        } else {
          const bodyText = await response.text();
          if (bodyText.trim()) {
            errorMessage = getErrorMessage(bodyText, bodyText.trim());
          }
        }
      } catch {
        // Fall back to the generic status-based message.
      }

      if (isCommunityUnavailableError(response.status, errorMessage)) {
        notifyCommunityUnavailable();
      }

      if (isAuthExpirationError(response.status, errorMessage, Boolean(init?.token))) {
        const sessionExpiredMessage = 'Your session has expired. Please log in again.';
        notifyAuthExpired(sessionExpiredMessage);
        throw new Error(sessionExpiredMessage);
      }

      throw new Error(errorMessage);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The request timed out. Check your connection and try again.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
