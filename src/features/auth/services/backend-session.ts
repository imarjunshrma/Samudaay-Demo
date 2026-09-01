import { apiConfig } from '@/src/constants/apiConfig';
import { readStoredSession } from '@/src/features/auth/services/session-storage';
import type { UserSession } from '@/src/types/app';

export type BackendSessionContext = {
  token: string;
  tenantId: string;
  userId: string;
  mobileNumber: string;
  session: UserSession;
};

export function isBackendApiConfigured() {
  return apiConfig.isConfigured && apiConfig.baseUrl !== 'https://example.invalid';
}

export async function getBackendSessionContext(): Promise<BackendSessionContext | null> {
  const session = await readStoredSession();
  if (!session?.accessToken || session.source !== 'backend' || !session.user.tenantId) {
    return null;
  }

  return {
    token: session.accessToken,
    tenantId: session.user.tenantId,
    userId: session.user.id,
    mobileNumber: session.user.mobileNumber,
    session,
  };
}
