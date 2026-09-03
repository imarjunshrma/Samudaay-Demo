import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

import { ensureFirebaseApp, getFirebaseAvailabilityMessage, isNativeFirebaseAvailable } from '@/src/services/firebase/app';

let pendingConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;
let pendingPhoneNumber: string | null = null;
let isSendingOtp = false;
let authStateSubscriptionCount = 0;

type FirebaseAuthModule = typeof import('@react-native-firebase/auth');

function logOtp(message: string, details?: Record<string, unknown>) {
  if (details && Object.keys(details).length > 0) {
    console.info('[OTP]', message, details);
    return;
  }
  console.info('[OTP]', message);
}

function buildOtpClearStackTrace() {
  const stack = new Error().stack;
  if (!stack) {
    return null;
  }

  return stack
    .split('\n')
    .slice(2)
    .join('\n');
}

function getAuthModule(): FirebaseAuthModule {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/auth') as FirebaseAuthModule;
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function getAuthInstance() {
  return getAuthModule().getAuth();
}

function toUserMessage(error: unknown) {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;

    switch (code) {
      case 'auth/invalid-phone-number':
        return 'Enter a valid mobile number including country code.';
      case 'auth/too-many-requests':
        return 'Too many OTP attempts were made. Wait a moment and try again.';
      case 'auth/operation-not-allowed':
        return 'Phone OTP is not enabled for this Firebase project or SMS is not enabled for this region. Enable Phone sign-in and allow the phone number region in Firebase Authentication settings.';
      case 'auth/invalid-verification-code':
        return 'The OTP is invalid. Check the code and try again.';
      case 'auth/session-expired':
        return 'The OTP session expired. Request a new code and try again.';
      default:
        break;
    }
  }

  return error instanceof Error ? error.message : 'Firebase authentication failed.';
}

function assertNativePhoneAuthSupport() {
  if (Platform.OS === 'web') {
    throw new Error('Firebase phone authentication requires a native development build. Expo web is not supported for OTP sign-in.');
  }
}

export async function requestPhoneOtp(mobileNumber: string, options: { preserveExisting?: boolean } = {}) {
  assertNativePhoneAuthSupport();
  if (isSendingOtp) {
    throw new Error('OTP request already in progress. Please wait and try again.');
  }

  isSendingOtp = true;
  pendingConfirmation = null;
  pendingPhoneNumber = mobileNumber;

  logOtp('Requesting OTP.', {
    mobileNumber,
  });

  try {
    const firebaseInitStartedAt = Date.now();
    await ensureFirebaseApp();
    logOtp('Firebase initialized for OTP request.', {
      elapsedMs: Date.now() - firebaseInitStartedAt,
    });

    if (!options.preserveExisting) {
      const currentUser = getCurrentFirebaseUser();
      if (currentUser) {
        logOtp('Signing out existing Firebase user before requesting OTP.', {
          currentFirebaseUserId: currentUser.uid,
          currentFirebaseUserPhoneNumber: currentUser.phoneNumber ?? null,
        });
        const authModule = getAuthModule();
        await authModule.signOut(authModule.getAuth());
      }
    }

    const authModule = getAuthModule();
    const signInStartedAt = Date.now();
    const confirmation = await authModule.signInWithPhoneNumber(authModule.getAuth(), mobileNumber);
    pendingConfirmation = confirmation;
    pendingPhoneNumber = mobileNumber;
    logOtp('OTP request completed.', {
      mobileNumber,
      verificationId: confirmation.verificationId ?? null,
      elapsedMs: Date.now() - signInStartedAt,
    });

    return confirmation;
  } catch (error) {
    pendingPhoneNumber = null;
    logOtp('OTP request failed.', {
      mobileNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(toUserMessage(error));
  } finally {
    isSendingOtp = false;
  }
}

export async function confirmPhoneOtp(otpCode: string) {
  assertNativePhoneAuthSupport();
  const currentFirebaseUser = getCurrentFirebaseUser();
  logOtp('Confirming OTP requested.', {
    hasPendingConfirmation: Boolean(pendingConfirmation),
    currentFirebaseUserId: currentFirebaseUser?.uid ?? null,
    currentFirebaseUserPhoneNumber: currentFirebaseUser?.phoneNumber ?? null,
    pendingPhoneNumber,
    otpLength: otpCode.length,
  });

  if (!pendingConfirmation) {
    throw new Error('Your OTP session expired. Request a new code and try again.');
  }

  logOtp('Confirming OTP.', {
    pendingPhoneNumber,
    otpLength: otpCode.length,
  });

  try {
    const firebaseInitStartedAt = Date.now();
    await ensureFirebaseApp();
    logOtp('Firebase initialized for OTP confirmation.', {
      elapsedMs: Date.now() - firebaseInitStartedAt,
    });

    const confirmation = pendingConfirmation;
    const confirmStartedAt = Date.now();
    const result = await confirmation.confirm(otpCode);
    if (!result?.user) {
      throw new Error('Firebase did not return an authenticated user after OTP verification.');
    }
    logOtp('OTP confirmation completed.', {
      pendingPhoneNumber: result.user.phoneNumber ?? pendingPhoneNumber,
      firebaseUserId: result.user.uid,
      elapsedMs: Date.now() - confirmStartedAt,
    });
    return result.user;
  } catch (error) {
    logOtp('OTP confirmation failed.', {
      pendingPhoneNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(toUserMessage(error));
  }
}

export function hasPendingPhoneOtp() {
  return Boolean(pendingConfirmation);
}

export function getPendingPhoneNumber() {
  return pendingPhoneNumber;
}

export function clearPendingPhoneOtp(reason = 'manual-clear') {
  logOtp('Clearing pending OTP state.', {
    timestamp: new Date().toISOString(),
    reason,
    pendingPhoneNumber,
    hasConfirmation: Boolean(pendingConfirmation),
    stack: buildOtpClearStackTrace(),
  });
  pendingConfirmation = null;
  pendingPhoneNumber = null;
  isSendingOtp = false;
}

export function onFirebaseAuthChanged(
  listener: (user: FirebaseAuthTypes.User | null) => void,
) {
  const authModule = getAuthModule();
  authStateSubscriptionCount += 1;
  logOtp('Registering Firebase auth state listener.', {
    subscriptionCount: authStateSubscriptionCount,
  });
  const unsubscribe = authModule.onAuthStateChanged(authModule.getAuth(), (user) => {
    logOtp('Firebase auth state changed.', {
      userId: user?.uid ?? null,
      phoneNumber: user?.phoneNumber ?? null,
    });
    logOtp('OTP AUTO AUTH observed Firebase auth state.', {
      timestamp: new Date().toISOString(),
      uid: user?.uid ?? null,
      phoneNumber: user?.phoneNumber ?? null,
      hasPendingConfirmation: Boolean(pendingConfirmation),
      pendingPhoneNumber,
    });
    listener(user);
  });
  return () => {
    authStateSubscriptionCount = Math.max(0, authStateSubscriptionCount - 1);
    logOtp('Removing Firebase auth state listener.', {
      subscriptionCount: authStateSubscriptionCount,
    });
    unsubscribe();
  };
}

export function getCurrentFirebaseUser() {
  if (!isNativeFirebaseAvailable()) {
    return null;
  }

  return getAuthInstance().currentUser;
}

export async function getCurrentFirebaseIdToken(forceRefresh = false) {
  const user = getCurrentFirebaseUser();
  if (!user) {
    throw new Error('Firebase did not return an authenticated user. Please verify OTP again.');
  }

  return getAuthModule().getIdToken(user, forceRefresh);
}

export async function signOutFirebase() {
  logOtp('Signing out from Firebase.', {
    pendingPhoneNumber,
    hasConfirmation: Boolean(pendingConfirmation),
    currentFirebaseUser: getCurrentFirebaseUser()?.uid ?? null,
  });
  if (!isNativeFirebaseAvailable()) {
    clearPendingPhoneOtp('signout-without-native-firebase');
    return;
  }

  clearPendingPhoneOtp('signout');
  const authModule = getAuthModule();
  await authModule.signOut(authModule.getAuth());
}
