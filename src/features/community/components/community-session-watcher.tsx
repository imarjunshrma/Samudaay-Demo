import { useEffect, useRef } from 'react';

import { communityStore } from '@/src/core/config/community';
import { useSession } from '@/src/core/providers/session-provider';
import type { UserSession } from '@/src/types/app';

import { writePickEveryLaunch, writeStoredCommunity } from '../services/community-selection.service';
import { useCommunityGate } from './community-gate';

const SUPER_ADMIN_KEYS = new Set(['super_admin', 'superadmin']);

export function isSuperAdminSession(session: UserSession) {
  const role = String(session.user.role || '').toLowerCase();
  return SUPER_ADMIN_KEYS.has(role) || (session.user.communityRoleKeys ?? []).some((key) => SUPER_ADMIN_KEYS.has(String(key).toLowerCase()));
}

/**
 * Samudaay: super admins pick a community on every launch (and after logout);
 * normal users keep the community they registered with.
 */
export function CommunitySessionWatcher() {
  const { selectionEnabled, requestCommunityChange } = useCommunityGate();
  const { status, session } = useSession();
  const signedInRef = useRef(false);
  const superAdminRef = useRef(false);

  useEffect(() => {
    if (!selectionEnabled) {
      return;
    }

    if (status === 'signedIn' && session) {
      const superAdmin = isSuperAdminSession(session);
      const selectedCommunity = communityStore.getState().selected;
      superAdminRef.current = superAdmin;
      signedInRef.current = true;
      void writePickEveryLaunch(superAdmin);
      if (selectedCommunity && selectedCommunity.id === session.user.tenantId) {
        void writeStoredCommunity(selectedCommunity);
      }
      return;
    }

    if (status === 'signedOut' && signedInRef.current) {
      signedInRef.current = false;
      if (superAdminRef.current) {
        requestCommunityChange();
      }
    }
  }, [requestCommunityChange, selectionEnabled, session, status]);

  return null;
}
