import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';

import { UI_PREVIEW_AUTH_BYPASS, uiPreviewSession } from '@/src/core/config/ui-preview';
import { authService } from '@/src/features/auth/services/auth-service';
import { readStoredAppViewMode, writeStoredAppViewMode, type AppViewMode } from '@/src/features/auth/services/session-storage';
import { apiQueryClient, subscribeToAuthExpiration } from '@/src/services/api';
import { onFirebaseAuthChanged } from '@/src/services/firebase/auth';
import type { AuthStatus, Permission, UserSession, UserRole } from '@/src/types/app';

interface SessionContextValue {
  status: AuthStatus;
  session: UserSession | null;
  accessToken: string | null;
  role: UserRole | null;
  permissions: Permission[];
  appViewMode: AppViewMode;
  setAppViewMode: (mode: AppViewMode) => Promise<void>;
  bootstrapError?: string;
  setStatus: (status: AuthStatus) => void;
  setSession: (session: UserSession | null) => void;
  updateSession: (updater: (current: UserSession) => UserSession) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = PropsWithChildren<{
  onSessionLanguageChange?: (language: UserSession['user']['preferredLanguage']) => void;
}>;

function normalizeStringArray(values?: readonly string[] | null) {
  return [...new Set((values ?? []).map((value) => String(value)))].sort();
}

function areArraysEqual(left?: readonly string[] | null, right?: readonly string[] | null) {
  const normalizedLeft = normalizeStringArray(left);
  const normalizedRight = normalizeStringArray(right);
  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }

  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function hasMeaningfulSessionChanges(current: UserSession | null, next: UserSession | null) {
  if (current === next) {
    return false;
  }

  if (!current || !next) {
    return current !== next;
  }

  return !(
    current.source === next.source &&
    current.accessToken === next.accessToken &&
    current.user.id === next.user.id &&
    current.user.fullName === next.user.fullName &&
    current.user.mobileNumber === next.user.mobileNumber &&
    current.user.countryCode === next.user.countryCode &&
    current.user.email === next.user.email &&
    current.user.role === next.user.role &&
    current.user.preferredLanguage === next.user.preferredLanguage &&
    current.user.onboardingComplete === next.user.onboardingComplete &&
    current.user.tenantId === next.user.tenantId &&
    current.user.communityMembershipId === next.user.communityMembershipId &&
    current.user.communityMembershipStatus === next.user.communityMembershipStatus &&
    current.user.kycStatus === next.user.kycStatus &&
    JSON.stringify(current.user.appMembership ?? null) === JSON.stringify(next.user.appMembership ?? null) &&
    current.user.subCommunity === next.user.subCommunity &&
    current.user.profilePhotoUrl === next.user.profilePhotoUrl &&
    areArraysEqual(current.user.permissions, next.user.permissions) &&
    areArraysEqual(current.user.communityPermissions, next.user.communityPermissions) &&
    areArraysEqual(current.user.communityRoleKeys, next.user.communityRoleKeys)
  );
}

export function SessionProvider({ children, onSessionLanguageChange }: SessionProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<UserSession | null>(null);
  const [appViewMode, setAppViewModeState] = useState<AppViewMode>('admin');
  const [bootstrapError, setBootstrapError] = useState<string>();
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const sessionRef = useRef<UserSession | null>(null);
  const expirationLogoutInProgressRef = useRef(false);

  const refreshSession = useCallback(async () => {
    if (UI_PREVIEW_AUTH_BYPASS) {
      if (mountedRef.current) {
        setBootstrapError(undefined);
        setSession(uiPreviewSession);
        setStatus('signedIn');
      }
      return;
    }

    const requestId = ++requestIdRef.current;
    console.info('[OTP FLOW]', 'SessionProvider.refreshSession started.', {
      requestId,
      hasCurrentSession: Boolean(sessionRef.current),
    });
    if (mountedRef.current) {
      if (!sessionRef.current) {
        setStatus('loading');
      }
      setBootstrapError(undefined);
    }

    try {
      const result = await authService.bootstrapSession();
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setSession(result.session);
      setStatus(result.session ? 'signedIn' : 'signedOut');
      console.info('[OTP FLOW]', 'SessionProvider.refreshSession applied bootstrap result.', {
        requestId,
        source: result.source,
        hasSession: Boolean(result.session),
      });
      if (result.session?.source === 'backend') {
        authService.refreshStoredBackendSession().then((refreshedSession) => {
          if (!mountedRef.current || requestId !== requestIdRef.current || !refreshedSession) {
            return;
          }
          if (!hasMeaningfulSessionChanges(result.session, refreshedSession)) {
            console.info('[OTP FLOW]', 'Backend refresh returned no meaningful session changes.', {
              requestId,
              tenantId: refreshedSession.user.tenantId,
            });
            return;
          }
          setSession(refreshedSession);
          setStatus('signedIn');
          console.info('[OTP FLOW]', 'SessionProvider.refreshSession applied refreshed backend session.', {
            requestId,
            tenantId: refreshedSession.user.tenantId,
          });
        }).catch((error) => {
          if (!mountedRef.current || requestId !== requestIdRef.current) {
            return;
          }
          setBootstrapError(error instanceof Error ? error.message : 'Unable to refresh your session.');
        });
      }
    } catch (error) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }
      setSession(null);
      setStatus('signedOut');
      setBootstrapError(error instanceof Error ? error.message : 'Unable to restore your session.');
      console.info('[OTP FLOW]', 'SessionProvider.refreshSession failed.', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, []);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (UI_PREVIEW_AUTH_BYPASS) {
      return;
    }

    return subscribeToAuthExpiration((message) => {
      if (expirationLogoutInProgressRef.current) {
        return;
      }

      expirationLogoutInProgressRef.current = true;
      requestIdRef.current += 1;

      if (mountedRef.current) {
        setBootstrapError(undefined);
        setSession(null);
        setStatus('signedOut');
        setAppViewModeState('admin');
      }

      apiQueryClient.clear();
      writeStoredAppViewMode('admin').catch(() => {
        return;
      });

      Alert.alert('Session expired', message || 'Your session has expired. Please log in again.');

      authService.logout()
        .catch(() => {
          return;
        })
        .finally(() => {
          expirationLogoutInProgressRef.current = false;
        });
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    readStoredAppViewMode()
      .then((storedMode) => {
        if (mountedRef.current && storedMode) {
          setAppViewModeState(storedMode);
        }
      })
      .catch(() => {
        return;
      });
    refreshSession().catch(() => {
      return;
    });

    return () => {
      mountedRef.current = false;
    };
  }, [refreshSession]);

  useEffect(() => {
    if (UI_PREVIEW_AUTH_BYPASS) {
      return;
    }

    try {
      return onFirebaseAuthChanged((firebaseUser) => {
        console.info('[OTP FLOW]', 'SessionProvider received Firebase auth state callback.', {
          firebaseUserId: firebaseUser?.uid ?? null,
          phoneNumber: firebaseUser?.phoneNumber ?? null,
          hasExistingSession: Boolean(sessionRef.current),
          mounted: mountedRef.current,
        });
        if (!firebaseUser || sessionRef.current) {
          console.info('[OTP FLOW]', 'SessionProvider ignored Firebase auth state callback.', {
            reason: !firebaseUser ? 'missing-firebase-user' : 'session-already-exists',
            firebaseUserId: firebaseUser?.uid ?? null,
          });
          return;
        }

        console.info('[OTP FLOW]', 'SessionProvider observed an authenticated Firebase user without an app session.', {
          firebaseUserId: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber ?? null,
        });

        authService.completePendingFirebaseSignInFromCurrentUser('auto-auth-state')
          .then((nextSession) => {
            console.info('[OTP FLOW]', 'SessionProvider received result from completePendingFirebaseSignInFromCurrentUser.', {
              hasNextSession: Boolean(nextSession),
              nextSessionSource: nextSession?.source ?? null,
              firebaseUserId: firebaseUser.uid,
            });
            if (!mountedRef.current || !nextSession) {
              console.info('[OTP FLOW]', 'SessionProvider skipped applying Firebase-completed session.', {
                mounted: mountedRef.current,
                hasNextSession: Boolean(nextSession),
              });
              return;
            }
            setBootstrapError(undefined);
            setSession(nextSession);
            setStatus('signedIn');
            console.info('[OTP FLOW]', 'SessionProvider applied session from Firebase auth state.', {
              sessionSource: nextSession.source,
              tenantId: nextSession.user.tenantId,
              userId: nextSession.user.id,
            });
          })
          .catch((error) => {
            if (!mountedRef.current) {
              return;
            }
            console.info('[OTP FLOW]', 'SessionProvider failed to complete Firebase sign-in after auth state.', {
              error: error instanceof Error ? error.message : String(error),
              firebaseUserId: firebaseUser.uid,
            });
            setBootstrapError(error instanceof Error ? error.message : 'Unable to complete Firebase sign-in.');
          });
      });
    } catch (error) {
      console.info('[OTP FLOW]', 'Firebase auth state listener was not registered.', {
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    onSessionLanguageChange?.(session.user.preferredLanguage);
  }, [onSessionLanguageChange, session]);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      session,
      accessToken: session?.accessToken ?? null,
      role: session?.user.role ?? null,
      permissions: session?.user.permissions ?? [],
      appViewMode,
      setAppViewMode: async (mode) => {
        if (!UI_PREVIEW_AUTH_BYPASS) {
          await writeStoredAppViewMode(mode);
        }
        setAppViewModeState(mode);
      },
      bootstrapError,
      setStatus,
      setSession,
      updateSession: async (updater) => {
        if (!session) {
          return;
        }
        const nextSession = updater(session);
        if (!UI_PREVIEW_AUTH_BYPASS) {
          await authService.updateSession(nextSession);
        }
        setSession(nextSession);
      },
      hasPermission: (permission) => Boolean(session?.user.permissions.includes(permission)),
      refreshSession,
    }),
    [appViewMode, bootstrapError, refreshSession, session, status],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
