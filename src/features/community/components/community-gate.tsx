import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { SplashScreen } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COMMUNITY_SELECTION_ENABLED, communityStore, type SelectedCommunity } from '@/src/core/config/community';
import { authService } from '@/src/features/auth/services/auth-service';
import { clearPendingLoginContext, readStoredSession } from '@/src/features/auth/services/session-storage';
import { apiQueryClient } from '@/src/services/api/query-client';
import { subscribeToCommunityUnavailable } from '@/src/services/api/community-availability';
import { colors } from '@/src/theme/colors';

import { CommunityPickerScreen } from './community-picker-screen';
import {
  COMMUNITY_UNAVAILABLE_MESSAGE,
  activateCommunity,
  preparePrintAssets,
  readStoredCommunity,
  writeStoredCommunity,
} from '../services/community-selection.service';

type Phase = 'hydrating' | 'select' | 'activating' | 'ready';

interface CommunityGateValue {
  /** True in the Samudaay build, where the community is chosen at runtime. */
  selectionEnabled: boolean;
  /** Returns to the community picker (e.g. "Change community" on the login screen). */
  requestCommunityChange: () => void;
}

const CommunityGateContext = createContext<CommunityGateValue>({
  selectionEnabled: false,
  requestCommunityChange: () => undefined,
});

export function useCommunityGate() {
  return useContext(CommunityGateContext);
}

function isUnavailableError(error: unknown) {
  const message = error instanceof Error ? error.message.trim().toLowerCase() : '';
  return message === COMMUNITY_UNAVAILABLE_MESSAGE.toLowerCase() || message === 'tenant not found';
}

/**
 * Samudaay: resolves the active community before the session and the rest of the app mount, so every
 * API call (including session restore) goes to the selected tenant. Dedicated builds pass through.
 */
export function CommunityGate({ children }: PropsWithChildren) {
  if (!COMMUNITY_SELECTION_ENABLED) {
    return <>{children}</>;
  }

  return <SelectionGate>{children}</SelectionGate>;
}

function SelectionGate({ children }: PropsWithChildren) {
  const [phase, setPhase] = useState<Phase>('hydrating');
  const [notice, setNotice] = useState<string | null>(null);
  // True when the picker was opened from "Change" while a community is active (so it can be cancelled).
  const [changing, setChanging] = useState(false);
  const [lastCommunity, setLastCommunity] = useState<SelectedCommunity | null>(null);
  const lastCommunityRef = useRef<SelectedCommunity | null>(null);

  const rememberCommunity = useCallback((community: SelectedCommunity | null) => {
    lastCommunityRef.current = community;
    setLastCommunity(community);
  }, []);

  // The stored session belongs to one community; drop it before using another one.
  const logoutFrom = useCallback(async (community: SelectedCommunity | null) => {
    if (community) {
      communityStore.setSelected(community);
    }
    await authService.logout().catch(() => undefined);
    apiQueryClient.clear();
  }, []);

  const dropCommunity = useCallback(
    async (community: SelectedCommunity | null, message: string) => {
      await logoutFrom(community);
      await writeStoredCommunity(null);
      communityStore.setSelected(null);
      communityStore.setAppConfig(null);
      await preparePrintAssets(null);
      rememberCommunity(null);
      setNotice(message);
      setPhase('select');
    },
    [logoutFrom, rememberCommunity],
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      const [stored, storedSession] = await Promise.all([
        readStoredCommunity(),
        readStoredSession().catch(() => null),
      ]);
      if (!active) {
        return;
      }
      rememberCommunity(stored);

      // Logged-out Samudaay users must choose the community as step one before auth.
      // A stored signed-in session can restore its own community so session bootstrap hits the right tenant.
      const canRestoreStoredCommunity = Boolean(
        stored &&
        storedSession?.user.tenantId &&
        storedSession.user.tenantId === stored.id,
      );

      if (!canRestoreStoredCommunity) {
        setPhase('select');
        return;
      }

      try {
        await activateCommunity(stored);
      } catch (error) {
        if (isUnavailableError(error)) {
          await dropCommunity(stored, `${stored.name} is not available right now. Please choose your community again.`);
          return;
        }
        // Offline or server error: keep the stored community; screens show their own errors.
        communityStore.setSelected(stored);
      }
      if (active) {
        setPhase('ready');
      }
    })();

    return () => {
      active = false;
    };
  }, [dropCommunity, rememberCommunity]);

  useEffect(
    () =>
      subscribeToCommunityUnavailable(() => {
        const current = communityStore.getState().selected;
        void dropCommunity(current, `${current?.name ?? 'This community'} has been disabled. Please choose another community.`);
      }),
    [dropCommunity],
  );

  const selectCommunity = useCallback(
    async (community: SelectedCommunity) => {
      setChanging(false);
      setPhase('activating');
      setNotice(null);

      const storedSession = await readStoredSession().catch(() => null);
      const switching = Boolean(lastCommunityRef.current && lastCommunityRef.current.id !== community.id);
      if (storedSession?.user.tenantId && storedSession.user.tenantId !== community.id) {
        await logoutFrom(lastCommunityRef.current);
      } else if (switching) {
        apiQueryClient.clear();
      }
      if (switching) {
        // A half-finished OTP login belongs to the previous community.
        await clearPendingLoginContext().catch(() => undefined);
      }

      try {
        await activateCommunity(community);
        rememberCommunity(community);
        setPhase('ready');
      } catch (error) {
        communityStore.setSelected(null);
        setNotice(
          isUnavailableError(error)
            ? `${community.name} is not available right now.`
            : error instanceof Error
              ? error.message
              : 'Could not open this community. Please try again.',
        );
        setPhase('select');
      }
    },
    [logoutFrom, rememberCommunity],
  );

  // The native splash is normally hidden by the root layout, which is not mounted while the gate shows
  // its own screen. Hide it here so the community picker (the first step) is visible.
  useEffect(() => {
    if (phase === 'select' || phase === 'activating') {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [phase]);

  const value = useMemo<CommunityGateValue>(
    () => ({
      selectionEnabled: true,
      requestCommunityChange: () => {
        setNotice(null);
        setChanging(Boolean(communityStore.getState().selected));
        setPhase('select');
      },
    }),
    [],
  );

  if (phase === 'hydrating' || phase === 'activating') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (phase === 'select') {
    return (
      <CommunityPickerScreen
        notice={notice}
        currentCommunityId={lastCommunity?.id ?? null}
        onSelect={(community) => {
          void selectCommunity(community);
        }}
        onCancel={
          changing
            ? () => {
                setChanging(false);
                setPhase('ready');
              }
            : undefined
        }
      />
    );
  }

  return <CommunityGateContext.Provider value={value}>{children}</CommunityGateContext.Provider>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.DEFAULT,
  },
});
