import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { useSession } from '@/src/core/providers/session-provider';
import { authService } from '@/src/features/auth/services/auth-service';
import { storageService } from '@/src/services/storage.service';
import { buildUserScopedStorageKey, readStoredPinHash as readDevicePinHash, verifyStoredPin } from '@/src/services/device-pin.service';

const FAILED_ATTEMPTS_PREFIX = 'stitch-community-failed-attempts';
const PIN_LOCKOUT_PREFIX = 'stitch-community-pin-lockout';
const AUTHENTICATED_APP_OPEN_COUNT_PREFIX = 'stitch-community-auth-open-count';
const BACKGROUND_LOCK_TIMEOUT_MS = 30 * 1000;
const PIN_LOCKOUT_DURATIONS_MINUTES = [2, 5, 10] as const;

type PinLockoutState = {
  level: number;
  lockedUntil: number;
};

function getFailedAttemptsStorageKey(mobileNumber: string, tenantId?: string) {
  return buildUserScopedStorageKey(FAILED_ATTEMPTS_PREFIX, mobileNumber, tenantId);
}

function getAuthenticatedAppOpenCountKey(mobileNumber: string, tenantId?: string) {
  return buildUserScopedStorageKey(AUTHENTICATED_APP_OPEN_COUNT_PREFIX, mobileNumber, tenantId);
}

function getPinLockoutStorageKey(mobileNumber: string, tenantId?: string) {
  return buildUserScopedStorageKey(PIN_LOCKOUT_PREFIX, mobileNumber, tenantId);
}

async function readStoredPinHash(mobileNumber?: string, tenantId?: string) {
  if (!mobileNumber) {
    return null;
  }

  return readDevicePinHash({ mobileNumber, tenantId });
}

async function readFailedAttempts(mobileNumber?: string, tenantId?: string) {
  if (!mobileNumber) {
    return 0;
  }

  const key = getFailedAttemptsStorageKey(mobileNumber, tenantId);
  if (!key) {
    return 0;
  }

  const value = await storageService.getItem(key);
  const count = Number(value ?? '0');
  return Number.isFinite(count) && count > 0 ? count : 0;
}

async function writeFailedAttempts(mobileNumber: string, tenantId: string, count: number) {
  const key = getFailedAttemptsStorageKey(mobileNumber, tenantId);
  if (!key) {
    return;
  }

  await storageService.setItem(key, String(Math.max(0, count)));
}

async function clearFailedAttempts(mobileNumber?: string, tenantId?: string) {
  if (!mobileNumber) {
    return;
  }

  const key = getFailedAttemptsStorageKey(mobileNumber, tenantId);
  if (!key) {
    return;
  }

  await storageService.removeItem(key);
}

async function readPinLockoutState(mobileNumber?: string, tenantId?: string): Promise<PinLockoutState | null> {
  if (!mobileNumber) {
    return null;
  }

  const key = getPinLockoutStorageKey(mobileNumber, tenantId);
  if (!key) {
    return null;
  }

  const value = await storageService.getItem(key);
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<PinLockoutState>;
    const level = Number(parsed.level);
    const lockedUntil = Number(parsed.lockedUntil);
    if (!Number.isFinite(level) || !Number.isFinite(lockedUntil) || lockedUntil <= 0) {
      return null;
    }

    return {
      level: Math.max(1, Math.floor(level)),
      lockedUntil,
    };
  } catch {
    return null;
  }
}

async function writePinLockoutState(mobileNumber: string, tenantId: string, state: PinLockoutState) {
  const key = getPinLockoutStorageKey(mobileNumber, tenantId);
  if (!key) {
    return;
  }

  await storageService.setItem(key, JSON.stringify(state));
}

async function clearPinLockoutState(mobileNumber?: string, tenantId?: string) {
  if (!mobileNumber) {
    return;
  }

  const key = getPinLockoutStorageKey(mobileNumber, tenantId);
  if (!key) {
    return;
  }

  await storageService.removeItem(key);
}

function getRemainingLockoutMs(lockout: PinLockoutState | null, now = Date.now()) {
  if (!lockout) {
    return 0;
  }

  return Math.max(0, lockout.lockedUntil - now);
}

function formatLockoutMinutes(remainingMs: number) {
  return Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
}

async function readAppOpenCount(mobileNumber: string, tenantId?: string) {
  const key = getAuthenticatedAppOpenCountKey(mobileNumber, tenantId);
  if (!key) {
    return 0;
  }

  const value = await storageService.getItem(key);
  const count = Number(value ?? '0');
  return Number.isFinite(count) && count > 0 ? count : 0;
}

async function incrementAppOpenCount(mobileNumber: string, tenantId?: string) {
  const key = getAuthenticatedAppOpenCountKey(mobileNumber, tenantId);
  if (!key) {
    return 0;
  }

  const nextCount = (await readAppOpenCount(mobileNumber, tenantId)) + 1;
  await storageService.setItem(key, String(nextCount));
  return nextCount;
}

async function readPinHashExists(mobileNumber?: string, tenantId?: string) {
  return Boolean(await readStoredPinHash(mobileNumber, tenantId));
}

export type AuthSecurityController = {
  isSetupRequired: boolean;
  isLocked: boolean;
  isReady: boolean;
  pinResetAuthorized: boolean;
  unlockWithPin: (pin: string) => Promise<boolean>;
  setupPin: (pin: string, options?: { unlock?: boolean }) => Promise<boolean>;
  requestRecoveryOtp: () => Promise<boolean>;
  verifyRecoveryOtp: (otpCode: string) => Promise<boolean>;
  dismissSetupPrompt: () => void;
};

export function useAuthSecurity() {
  const { session } = useSession();
  const countedSessionRef = useRef<string | null>(null);
  const lastInactiveAtRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [appOpenCount, setAppOpenCount] = useState(0);
  const [pinHashExists, setPinHashExists] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [setupDismissed, setSetupDismissed] = useState(false);
  const [pinResetAuthorized, setPinResetAuthorized] = useState(false);
  const [resolvedIdentityKey, setResolvedIdentityKey] = useState<string | null>(null);
  const tenantId = session?.user.tenantId;
  const userId = session?.user.id;
  const mobileNumber = session?.user.mobileNumber;
  const storageScopeKey = tenantId && mobileNumber ? `${tenantId}.${mobileNumber}` : null;
  const securityIdentityKey = tenantId && userId && mobileNumber ? `${tenantId}.${userId}.${mobileNumber}` : null;
  const isSecurityEligible = Boolean(session?.user.onboardingComplete);
  const isReady = !securityIdentityKey ? true : ready && resolvedIdentityKey === securityIdentityKey;

  useEffect(() => {
    if (!securityIdentityKey || !mobileNumber || !tenantId) {
      countedSessionRef.current = null;
      setAppOpenCount(0);
      setPinHashExists(false);
      setPinResetAuthorized(false);
      setResolvedIdentityKey(null);
      setReady(true);
      return;
    }

    let active = true;
    const shouldIncrementOpenCount = countedSessionRef.current !== storageScopeKey;
    countedSessionRef.current = storageScopeKey;
    setReady(false);

    void (async () => {
      const [nextOpenCount, hasPinHash] = await Promise.all([
        shouldIncrementOpenCount ? incrementAppOpenCount(mobileNumber, tenantId) : readAppOpenCount(mobileNumber, tenantId),
        readPinHashExists(mobileNumber, tenantId),
      ]);

      if (!active) {
        return;
      }

      setAppOpenCount(nextOpenCount);
      setPinHashExists(hasPinHash);
      setResolvedIdentityKey(securityIdentityKey);
      setReady(true);
    })().catch(() => {
      if (!active) {
        return;
      }

      setResolvedIdentityKey(securityIdentityKey);
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, [mobileNumber, securityIdentityKey, storageScopeKey, tenantId]);

  useEffect(() => {
    if (!securityIdentityKey) {
      setUnlocked(true);
      setSetupDismissed(false);
      setPinResetAuthorized(false);
      return;
    }

    setUnlocked(false);
    setSetupDismissed(false);
    setPinResetAuthorized(false);
  }, [securityIdentityKey]);

  useEffect(() => {
    if (!mobileNumber || !tenantId) {
      setPinHashExists(false);
      return;
    }

    let active = true;

    void (async () => {
      const hasPinHash = await readPinHashExists(mobileNumber, tenantId);
      if (active) {
        setPinHashExists(hasPinHash);
      }
    })();

    return () => {
      active = false;
    };
  }, [mobileNumber, tenantId]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'inactive' || nextState === 'background') {
        lastInactiveAtRef.current = Date.now();
        return;
      }

      if (nextState !== 'active') {
        return;
      }

      const lastInactiveAt = lastInactiveAtRef.current;
      lastInactiveAtRef.current = null;

      if (!lastInactiveAt || !securityIdentityKey || !pinHashExists) {
        return;
      }

      if (Date.now() - lastInactiveAt > BACKGROUND_LOCK_TIMEOUT_MS) {
        setUnlocked(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [pinHashExists, securityIdentityKey]);

  const isSetupRequired = useMemo(() => {
    if (!isReady || !session || !isSecurityEligible) {
      return false;
    }

    return appOpenCount >= 2 && !pinHashExists && !setupDismissed;
  }, [appOpenCount, isReady, isSecurityEligible, pinHashExists, session, setupDismissed]);

  const isLocked = useMemo(() => {
    if (!isReady || !session || !isSecurityEligible) {
      return false;
    }

    return pinHashExists && !unlocked && !isSetupRequired;
  }, [isReady, isSecurityEligible, isSetupRequired, pinHashExists, session, unlocked]);

  async function setupPin(pin: string, options?: { unlock?: boolean }) {
    if (!session) {
      throw new Error('You must be signed in before setting a PIN.');
    }

    await authService.setupPin(pin, {
      mobileNumber: session.user.mobileNumber,
      tenantId: session.user.tenantId,
      session,
    });

    setPinHashExists(true);
    setPinResetAuthorized(false);
    if (options?.unlock !== false) {
      setUnlocked(true);
    }
    await clearFailedAttempts(session.user.mobileNumber, session.user.tenantId);
    await clearPinLockoutState(session.user.mobileNumber, session.user.tenantId);
    return true;
  }

  function dismissSetupPrompt() {
    setSetupDismissed(true);
    setUnlocked(true);
  }

  async function requestRecoveryOtp() {
    if (!session) {
      return false;
    }

    await authService.clearPendingOtp();
    await authService.requestSignInOtp({
      mobileNumber: session.user.mobileNumber,
      preferredLanguage: session.user.preferredLanguage,
      tenantId: session.user.tenantId,
      subCommunity: session.user.subCommunity,
    });

    return true;
  }

  async function verifyRecoveryOtp(otpCode: string) {
    if (!session) {
      return false;
    }

    await authService.confirmSignInOtp({ otpCode });
    await clearFailedAttempts(session.user.mobileNumber, session.user.tenantId);
    await clearPinLockoutState(session.user.mobileNumber, session.user.tenantId);
    setPinResetAuthorized(true);
    return true;
  }

  async function unlockWithPin(pin: string) {
    if (!session) {
      return false;
    }

    const existingLockout = await readPinLockoutState(session.user.mobileNumber, session.user.tenantId);
    const remainingLockoutMs = getRemainingLockoutMs(existingLockout);
    if (remainingLockoutMs > 0) {
      throw new Error(`Too many incorrect PIN attempts. Try again in ${formatLockoutMinutes(remainingLockoutMs)} minute(s) or use Forgot PIN.`);
    }

    if (existingLockout && remainingLockoutMs <= 0) {
      await clearPinLockoutState(session.user.mobileNumber, session.user.tenantId);
      await clearFailedAttempts(session.user.mobileNumber, session.user.tenantId);
    }

    const hasPin = await readStoredPinHash(session.user.mobileNumber, session.user.tenantId);
    if (!hasPin) {
      return false;
    }

    if (await verifyStoredPin(pin, {
      mobileNumber: session.user.mobileNumber,
      tenantId: session.user.tenantId,
    })) {
      setUnlocked(true);
      setPinResetAuthorized(false);
      await clearFailedAttempts(session.user.mobileNumber, session.user.tenantId);
      await clearPinLockoutState(session.user.mobileNumber, session.user.tenantId);
      return true;
    }

    const nextAttempts = (await readFailedAttempts(session.user.mobileNumber, session.user.tenantId)) + 1;
    await writeFailedAttempts(session.user.mobileNumber, session.user.tenantId, nextAttempts);

    if (nextAttempts >= 5) {
      const previousLevel = existingLockout?.level ?? 0;
      const nextLevel = Math.min(previousLevel + 1, PIN_LOCKOUT_DURATIONS_MINUTES.length);
      const durationMinutes = PIN_LOCKOUT_DURATIONS_MINUTES[nextLevel - 1];
      await writePinLockoutState(session.user.mobileNumber, session.user.tenantId, {
        level: nextLevel,
        lockedUntil: Date.now() + durationMinutes * 60 * 1000,
      });
      await clearFailedAttempts(session.user.mobileNumber, session.user.tenantId);
      throw new Error(`Too many incorrect PIN attempts. App lock is disabled for ${durationMinutes} minute(s). Use Forgot PIN if you need to reset it now.`);
    }

    return false;
  }

  return {
    isSetupRequired,
    isLocked,
    isReady,
    pinResetAuthorized,
    unlockWithPin,
    setupPin,
    requestRecoveryOtp,
    verifyRecoveryOtp,
    dismissSetupPrompt,
  } satisfies AuthSecurityController;
}
