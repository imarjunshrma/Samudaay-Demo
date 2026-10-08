import { readStoredSession } from '@/src/features/auth/services/session-storage';

export type AuditActor = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
};

export async function buildDedicatedAppAuditPayload() {
  const session = await readStoredSession();
  const user = session?.user;

  if (!user?.id) {
    return {};
  }

  return {
    reviewedByUserId: user.id,
    reviewedByName: user.fullName || user.mobileNumber || user.email || user.id,
    reviewedByEmail: user.email || undefined,
  };
}

export function formatAuditActor(actor?: AuditActor | null) {
  if (!actor) {
    return '';
  }

  return actor.name || actor.email || actor.id || '';
}
