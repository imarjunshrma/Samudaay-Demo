import { rolePermissions } from '@/src/constants/roles';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants/apiConfig';
import { appConfig } from '@/src/constants/appConfig';
import { communityConfig } from '@/src/core/config/community';
import {
  clearPendingPhoneOtp,
  confirmPhoneOtp,
  getCurrentFirebaseUser,
  getCurrentFirebaseIdToken,
  getPendingPhoneNumber,
  hasPendingPhoneOtp,
  requestPhoneOtp,
  signOutFirebase,
} from '@/src/services/firebase/auth';
import { isFirebaseConfigured } from '@/src/services/firebase/app';
import { UI_PREVIEW_AUTH_BYPASS } from '@/src/core/config/ui-preview';
import { clearPinDisabled } from '@/src/features/profile/services/security-settings.service';
import { logAuthPerformance } from '@/src/features/auth/services/auth-performance';
import { notificationService } from '@/src/services/notification.service';
import type {
  AppLanguage,
  Permission,
  UserRole,
  SessionUser,
  UserSession,
} from '@/src/types/app';
import type {
  AuthBootstrapResult,
  LoginFormValues,
  OtpRequestPayload,
  OtpVerificationPayload,
  PendingLoginContext,
} from '@/src/features/auth/types/auth';
import {
  clearPendingLoginContext,
  clearStoredSession,
  hasLoggedOutMarker,
  markLoggedOut,
  readPendingLoginContext,
  readStoredSession,
  writePendingLoginContext,
  writeStoredSession,
} from '@/src/features/auth/services/session-storage';
import {
  normalizeMobileNumber,
  writeStoredPinHash,
} from '@/src/services/device-pin.service';

function getNow() {
  return Date.now();
}

function logOtpService(message: string, details?: Record<string, unknown>) {
  if (details && Object.keys(details).length > 0) {
    console.info('[OTP FLOW]', message, details);
    return;
  }
  console.info('[OTP FLOW]', message);
}

let finalizeFirebaseSessionPromise: Promise<UserSession> | null = null;

export const OTP_RESEND_COOLDOWN_SECONDS = 90;

function getOtpResendCooldownRemainingSeconds(requestedAt?: number | null) {
  if (!requestedAt || !Number.isFinite(requestedAt)) {
    return 0;
  }

  const elapsedSeconds = Math.floor((getNow() - requestedAt) / 1000);
  return Math.max(0, OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
}

function resolveDemoRoleForMobileNumber(mobileNumber: string): UserRole {
  const digits = mobileNumber.replace(/[^\d]/g, '').slice(-10);

  if (digits === '9000000001') {
    return 'admin';
  }

  return 'user';
}

type AuthSessionRecord = {
  fullName: string;
  mobileNumber: string;
  countryCode?: string;
  email?: string;
  role: UserRole;
  permissions: Permission[];
  preferredLanguage: AppLanguage;
  onboardingComplete: boolean;
  tenantId: string;
  kycStatus?: SessionUser['kycStatus'];
};

function buildFallbackUserRecord(
  uid: string,
  phoneNumber: string | null | undefined,
  preferredLanguage: AppLanguage,
  tenantId = communityConfig.tenantId,
): AuthSessionRecord {
  const role = phoneNumber ? resolveDemoRoleForMobileNumber(phoneNumber) : 'user';
  const onboardingComplete = role === 'admin';
  return {
    fullName: phoneNumber ? `Member ${phoneNumber.slice(-4)}` : 'Community Member',
    mobileNumber: phoneNumber ? normalizeMobileNumber(phoneNumber) : '',
    countryCode: appConfig.defaultCountryCode.replace(/[^\d]/g, '') || '91',
    role,
    permissions: rolePermissions[role],
    preferredLanguage,
    onboardingComplete,
    tenantId,
    kycStatus: 'NOT_UPLOADED',
  };
}

function buildDevOtp(mobileNumber: string) {
  const digits = mobileNumber.replace(/[^\d]/g, '').slice(-4);
  const seed = Number(digits || '0');
  return String(100000 + (seed % 900000)).padStart(6, '0');
}

function isBackendAuthExchangeConfigured() {
  return apiConfig.isConfigured && apiConfig.baseUrl !== 'https://example.invalid';
}

function isDevOtpEnabled() {
  return process.env.EXPO_PUBLIC_ALLOW_DEV_OTP === 'true';
}

function createLoginAttemptId() {
  return `login-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function doMobileNumbersMatch(left?: string | null, right?: string | null) {
  const normalize = (value?: string | null) => normalizeMobileNumber(value || '').replace(/[^\d]/g, '');
  const leftDigits = normalize(left);
  const rightDigits = normalize(right);
  return Boolean(leftDigits && rightDigits && leftDigits === rightDigits);
}

function buildSessionFromRecord(
  uid: string,
  record: AuthSessionRecord,
  source: UserSession['source'],
  extras?: Partial<UserSession>,
): UserSession {
  const permissions = record.permissions?.length ? record.permissions : rolePermissions[record.role];
  const onboardingComplete = record.onboardingComplete || record.kycStatus === 'APPROVED';
  const user: SessionUser = {
    id: uid,
    fullName: record.fullName,
    mobileNumber: record.mobileNumber,
    countryCode: record.countryCode,
    email: record.email,
    role: record.role,
    permissions,
    preferredLanguage: record.preferredLanguage,
    onboardingComplete,
    tenantId: record.tenantId,
  };

  return {
    user,
    issuedAt: getNow(),
    source,
    ...extras,
  };
}

function normalizeOnboardingComplete(
  onboardingComplete: boolean,
  kycStatus?: SessionUser['kycStatus'],
  membershipStatus?: SessionUser['communityMembershipStatus'],
) {
  return Boolean(onboardingComplete || kycStatus === 'APPROVED' || membershipStatus === 'ACTIVE');
}

async function ensureUserRecordForLocalSession(
  uid: string,
  mobileNumber: string | null | undefined,
  preferredLanguage: AppLanguage,
  tenantId = communityConfig.tenantId,
) {
  return buildFallbackUserRecord(uid, mobileNumber, preferredLanguage, tenantId);
}

async function hydrateSessionFromCurrentUser() {
  const storedSession = await readStoredSession();
  if (!storedSession) {
    await clearStoredSession();
    return null;
  }

  return storedSession;
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function persistSessionUser(nextSession: UserSession) {
  await writeStoredSession(nextSession);
}

async function finalizeFirebaseSessionFromPendingContext(
  pendingContext: PendingLoginContext,
  options: {
    source: 'auto-auth-state' | 'manual-confirm-fallback';
  },
) {
  logOtpService('Starting Firebase session finalization from pending context.', {
    source: options.source,
    loginAttemptId: pendingContext.loginAttemptId,
    mobileNumber: pendingContext.mobileNumber,
    tenantId: pendingContext.tenantId || communityConfig.tenantId,
    hasCurrentFirebaseUser: Boolean(getCurrentFirebaseUser()),
  });

  if (finalizeFirebaseSessionPromise) {
    logOtpService('Joining existing Firebase session finalization.', {
      source: options.source,
      loginAttemptId: pendingContext.loginAttemptId,
    });
    return finalizeFirebaseSessionPromise;
  }

  finalizeFirebaseSessionPromise = (async () => {
    const tokenFetchStartedAt = Date.now();
    const idToken = await getCurrentFirebaseIdToken(false);
    const currentFirebaseUser = getCurrentFirebaseUser();
    logOtpService('Fetched Firebase ID token for backend session finalization.', {
      source: options.source,
      loginAttemptId: pendingContext.loginAttemptId,
      firebaseUserId: currentFirebaseUser?.uid ?? null,
      firebasePhoneNumber: currentFirebaseUser?.phoneNumber ?? null,
    });
    logAuthPerformance('token_fetch', {
      durationMs: Date.now() - tokenFetchStartedAt,
      loginAttemptId: pendingContext.loginAttemptId,
    });

    if (!isBackendAuthExchangeConfigured()) {
      throw new Error('Backend API is required after Firebase OTP verification.');
    }

    const backendExchangeStartedAt = Date.now();
    logOtpService('Calling backend community auth exchange.', {
      source: options.source,
      loginAttemptId: pendingContext.loginAttemptId,
      tenantId: pendingContext.tenantId || communityConfig.tenantId,
    });
    const response = await apiClient<{ data: BackendCommunitySessionResponse }>(
      apiEndpoints.communityAuth(pendingContext.tenantId || communityConfig.tenantId),
      {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          preferredLanguage: pendingContext.preferredLanguage,
          subCommunity: pendingContext.subCommunity,
          loginAttemptId: pendingContext.loginAttemptId,
        }),
      },
    );
    logAuthPerformance('backend_exchange', {
      durationMs: Date.now() - backendExchangeStartedAt,
      tenantId: pendingContext.tenantId || communityConfig.tenantId,
      loginAttemptId: pendingContext.loginAttemptId,
    });
    logOtpService('Backend community auth exchange completed.', {
      source: options.source,
      loginAttemptId: pendingContext.loginAttemptId,
      tenantId: pendingContext.tenantId || communityConfig.tenantId,
      hasAccessToken: Boolean(response.data.accessToken || response.data.token),
      backendUserId: response.data.user.id,
      membershipStatus: response.data.membership.status,
    });

    const payloadData = response.data;
    const accessToken = payloadData.accessToken || payloadData.token;
    if (!accessToken) {
      throw new Error('Backend did not return an app session token.');
    }

    const communityMembershipStatus = payloadData.membership.status;
    const kycStatus = normalizeEffectiveKycStatus(payloadData.membership.kycStatus, communityMembershipStatus);
    const role = normalizeBackendRole(payloadData.role);
    const permissions = normalizeSessionPermissions(role, payloadData.permissions);
    const session: UserSession = {
      user: {
        id: payloadData.user.id,
        fullName: payloadData.user.name || payloadData.user.phone || 'Community Member',
        mobileNumber: payloadData.user.phone,
        countryCode: payloadData.user.countryCode || undefined,
        email: payloadData.user.email ?? undefined,
        role,
        permissions,
        preferredLanguage: pendingContext.preferredLanguage,
        onboardingComplete: normalizeOnboardingComplete(
          payloadData.membership.onboardingCompleted,
          kycStatus,
          communityMembershipStatus,
        ),
        tenantId: payloadData.community.id,
        communityMembershipId: payloadData.membership.id,
        communityMembershipStatus,
        kycStatus,
        appMembership: payloadData.membership.appMembership ?? undefined,
        communityPermissions: permissions,
        communityRoleKeys: payloadData.roleKeys,
        subCommunity: payloadData.membership.subCommunity ?? undefined,
        profilePhotoUrl: resolveBackendMediaUrl(payloadData.user.profilePic),
      },
      issuedAt: getNow(),
      source: 'backend',
      accessToken,
    };

    logOtpService('Firebase session finalized through backend exchange.', {
      source: options.source,
      loginAttemptId: pendingContext.loginAttemptId,
      tenantId: pendingContext.tenantId || communityConfig.tenantId,
      mobileNumber: pendingContext.mobileNumber,
      firebaseUid: currentFirebaseUser?.uid ?? null,
    });
    await persistSessionUser(session);
    await clearPendingLoginContext();
    clearPendingPhoneOtp(`finalize-firebase-session:${options.source}`);
    return session;
  })();

  try {
    return await finalizeFirebaseSessionPromise;
  } finally {
    finalizeFirebaseSessionPromise = null;
  }
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  const trimmed = fileUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(https?:|file:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  return `${apiConfig.baseUrl}/${trimmed.replace(/^\/+/, '')}`;
}

type BackendCommunitySessionResponse = {
  accessToken?: string;
  token?: string;
  isNewUser?: boolean;
  role: SessionUser['role'];
  permissions: string[];
  roleKeys: string[];
  community: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    phone: string;
    countryCode?: string | null;
    name?: string | null;
    email?: string | null;
    memberId?: string | null;
    profilePic?: string | null;
  };
  membership: {
    id: string;
    status: SessionUser['communityMembershipStatus'];
    kycStatus: SessionUser['kycStatus'];
    onboardingCompleted: boolean;
    subCommunity?: string | null;
  };
};

type BackendMeResponse = {
  id: string;
  name?: string | null;
  phone?: string | null;
  countryCode?: string | null;
  email?: string | null;
  memberId?: string | null;
  status?: string | null;
  userType?: string | null;
  roleKeys?: string[];
  permissions?: string[];
  profilePic?: string | null;
  registration?: {
    id?: string | null;
    status?: string | null;
    kycStatus?: SessionUser['kycStatus'] | null;
    onboardingCompleted?: boolean | null;
    subCommunity?: string | null;
    appMembership?: SessionUser['appMembership'] | null;
  } | null;
};

function normalizeBackendRole(role: string | null | undefined, fallback: UserRole = 'user'): UserRole {
  const normalizedRole = String(role || fallback).trim().toLowerCase().replace(/-/g, '_');
  if (
    normalizedRole === 'admin' ||
    normalizedRole === 'admin_staff' ||
    normalizedRole === 'super_admin' ||
    normalizedRole === 'superadmin'
  ) {
    return 'admin';
  }
  if (normalizedRole === 'member' || normalizedRole === 'community_member' || normalizedRole === 'trustee' || normalizedRole === 'user') {
    return normalizedRole;
  }

  return fallback;
}

function normalizeMembershipStatus(status: string | null | undefined): SessionUser['communityMembershipStatus'] {
  const nextStatus = String(status || '').toUpperCase();
  if (nextStatus === 'ACTIVE' || nextStatus === 'APPROVED') {
    return 'ACTIVE';
  }
  if (nextStatus === 'REJECTED') {
    return 'REJECTED';
  }
  if (nextStatus === 'INACTIVE') {
    return 'INACTIVE';
  }
  if (nextStatus === 'SUSPENDED') {
    return 'SUSPENDED';
  }
  if (nextStatus === 'APP_PAYMENT_REQUIRED') {
    return 'APP_PAYMENT_REQUIRED';
  }
  return 'PENDING';
}

function normalizeEffectiveKycStatus(
  kycStatus: SessionUser['kycStatus'] | null | undefined,
  membershipStatus?: SessionUser['communityMembershipStatus'],
): SessionUser['kycStatus'] {
  if (membershipStatus === 'ACTIVE') {
    return 'APPROVED';
  }

  return kycStatus ?? 'NOT_UPLOADED';
}

const backendPermissionToFrontendPermission: Partial<Record<string, Permission>> = {
  'registration.manage': 'registration.manage',
  'kyc.approve': 'kyc.approve',
  'profile_requests.manage': 'profile_requests.manage',
  'profile.manage': 'profile.manage',
  'directory.view': 'directory.view',
  'directory.manage': 'directory.manage',
  'admin.manage': 'admins.manage',
  'user.manage': 'user.manage',
  'users.view': 'users.view',
  'phone.view': 'phone.view',
  'users.edit': 'users.edit',
  'users.delete': 'users.delete',
  'users.block': 'users.block',
  'events.view': 'events.view',
  'events.manage': 'events.manage',
  'events.attendance': 'events.attendance',
  'donations.view': 'donations.view',
  'donations.manage': 'donations.manage',
  'transactions.manage': 'transactions.manage',
  'analytics.view': 'analytics.view',
  'roles.manage': 'roles.manage',
  'admins.manage': 'admins.manage',
  'notifications.manage': 'notifications.manage',
  'promotions.view': 'promotions.view',
  'promotions.manage': 'promotions.manage',
  'matrimony.manage': 'matrimony.manage',
  'publications.manage': 'publications.manage',
  'community.view': 'directory.view',
  'registration.review': 'registration.manage',
  'kyc.review': 'kyc.approve',
  'approval.review': 'registration.manage',
  'card.manage': 'profile.manage',
  'donation.manage': 'donations.manage',
  'family.manage': 'profile.manage',
  'birthday.manage': 'notifications.manage',
  'expense.manage': 'transactions.manage',
  'role.manage': 'roles.manage',
  'permission.manage': 'roles.manage',
  'audit.view': 'analytics.view',
  'communication.manage': 'notifications.manage',
  'advertisement.view': 'promotions.view',
  'advertisement.manage': 'promotions.manage',
  'publication.manage': 'publications.manage',
  'event.manage': 'events.manage',
  'event.attendance': 'events.attendance',
};

function normalizeBackendPermissions(permissionKeys: string[] = []) {
  return Array.from(
    new Set(
      permissionKeys
        .map((permissionKey) => backendPermissionToFrontendPermission[permissionKey])
        .filter((permission): permission is Permission => Boolean(permission)),
    ),
  );
}

function normalizeSessionPermissions(role: SessionUser['role'], permissionKeys: string[] = []) {
  const permissions = normalizeBackendPermissions(permissionKeys);
  if (permissions.length > 0) {
    return permissions;
  }

  return role === 'admin' ? rolePermissions.admin : permissions;
}

async function refreshBackendSession(storedSession: UserSession) {
  if (storedSession.source !== 'backend' || !storedSession.accessToken) {
    return storedSession;
  }

  const response = await apiClient<{ data: BackendMeResponse }>(
    apiEndpoints.communityMe(storedSession.user.tenantId),
    {
      token: storedSession.accessToken,
    },
  );

  const data = response.data;
  const communityMembershipStatus = normalizeMembershipStatus(data.registration?.status ?? data.status ?? storedSession.user.communityMembershipStatus);
  const kycStatus = normalizeEffectiveKycStatus(data.registration?.kycStatus ?? storedSession.user.kycStatus, communityMembershipStatus);
  const role = normalizeBackendRole(data.userType, storedSession.user.role);
  const permissions = data.permissions ? normalizeSessionPermissions(role, data.permissions) : storedSession.user.permissions;
  const nextSession: UserSession = {
    ...storedSession,
    user: {
      ...storedSession.user,
      fullName: data.name || storedSession.user.fullName,
      mobileNumber: data.phone || storedSession.user.mobileNumber,
      countryCode: data.countryCode || storedSession.user.countryCode,
      email: data.email ?? storedSession.user.email,
      role,
      permissions,
      communityMembershipStatus,
      kycStatus,
      appMembership: data.registration?.appMembership ?? storedSession.user.appMembership,
      onboardingComplete: normalizeOnboardingComplete(Boolean(data.registration?.onboardingCompleted ?? storedSession.user.onboardingComplete), kycStatus, communityMembershipStatus),
      communityMembershipId: data.registration?.id ?? storedSession.user.communityMembershipId,
      subCommunity: data.registration?.subCommunity ?? storedSession.user.subCommunity,
      profilePhotoUrl: resolveBackendMediaUrl(data.profilePic ?? storedSession.user.profilePhotoUrl),
      communityPermissions: data.permissions ? permissions : storedSession.user.communityPermissions,
      communityRoleKeys: data.roleKeys ?? storedSession.user.communityRoleKeys,
    },
    issuedAt: getNow(),
  };

  await writeStoredSession(nextSession);
  return nextSession;
}

async function refreshStoredBackendSession() {
  const storedSession = await readStoredSession();
  if (!storedSession || storedSession.source !== 'backend' || !storedSession.accessToken) {
    return storedSession;
  }

  const refreshedSession = await refreshBackendSession(storedSession);
  if (
    !refreshedSession.user.onboardingComplete &&
    normalizeOnboardingComplete(
      refreshedSession.user.onboardingComplete,
      refreshedSession.user.kycStatus,
      refreshedSession.user.communityMembershipStatus,
    )
  ) {
    const normalizedSession: UserSession = {
      ...refreshedSession,
      user: {
        ...refreshedSession.user,
        onboardingComplete: true,
      },
    };
    await writeStoredSession(normalizedSession);
    return normalizedSession;
  }

  return refreshedSession;
}

export const authService = {
  async bootstrapSession(): Promise<AuthBootstrapResult> {
    const hasLogoutMarker = await hasLoggedOutMarker();
    logOtpService('bootstrapSession started.', {
      hasLoggedOutMarker: hasLogoutMarker,
    });
    if (hasLogoutMarker) {
      await clearStoredSession();
      logOtpService('bootstrapSession resolved with no session because logout marker was present.');
      return { session: null, source: 'none' };
    }

    if (!isFirebaseConfigured()) {
      const storedSession = await readStoredSession();
      if (!UI_PREVIEW_AUTH_BYPASS && storedSession?.source === 'local-dev' && storedSession.user.tenantId === 'preview-community') {
        await clearStoredSession();
        logOtpService('bootstrapSession cleared preview local-dev session.');
        return { session: null, source: 'none' };
      }
      if (storedSession) {
        logOtpService('bootstrapSession restored stored non-Firebase session.', {
          source: storedSession.source,
          tenantId: storedSession.user.tenantId,
        });
        return { session: storedSession, source: storedSession.source };
      }

      logOtpService('bootstrapSession found no non-Firebase session.');
      return { session: null, source: 'none' };
    }

    const storedSession = await readStoredSession();
    if (storedSession) {
      logOtpService('bootstrapSession restored stored Firebase/backend session.', {
        source: storedSession.source,
        tenantId: storedSession.user.tenantId,
      });
      return { session: storedSession, source: storedSession.source };
    }

    logOtpService('bootstrapSession finished with no session.');
    return { session: null, source: 'none' };
  },

  async requestSignInOtp(values: LoginFormValues) {
    if (isFirebaseConfigured()) {
      const normalizedMobileNumber = normalizeMobileNumber(values.mobileNumber);
      await clearStoredSession();
      const currentFirebaseUser = getCurrentFirebaseUser();
      if (currentFirebaseUser?.phoneNumber && !doMobileNumbersMatch(currentFirebaseUser.phoneNumber, normalizedMobileNumber)) {
        await signOutFirebase().catch(() => {
          return;
        });
      }
      const pendingContext: PendingLoginContext = {
        mobileNumber: normalizedMobileNumber,
        preferredLanguage: values.preferredLanguage,
        tenantId: values.tenantId || communityConfig.tenantId,
        subCommunity: values.subCommunity,
        provider: 'firebase',
        loginAttemptId: createLoginAttemptId(),
        otpRequestedAt: getNow(),
      };
      await writePendingLoginContext(pendingContext);
      logOtpService('Pending login context stored before OTP request.', {
        mobileNumber: pendingContext.mobileNumber,
        loginAttemptId: pendingContext.loginAttemptId,
      });

      try {
        await requestPhoneOtp(pendingContext.mobileNumber);
        return pendingContext;
      } catch (error) {
        await clearPendingLoginContext();
        throw new Error(toErrorMessage(error, 'Unable to request OTP.'));
      }
    }

    if (isDevOtpEnabled()) {
      const pendingContext: PendingLoginContext = {
        mobileNumber: normalizeMobileNumber(values.mobileNumber),
        preferredLanguage: values.preferredLanguage,
        tenantId: values.tenantId || communityConfig.tenantId,
        subCommunity: values.subCommunity,
        testOtp: buildDevOtp(values.mobileNumber),
        provider: 'local-dev',
        loginAttemptId: createLoginAttemptId(),
        otpRequestedAt: getNow(),
      };

      await writePendingLoginContext(pendingContext);
      console.log(`[DEV OTP] ${pendingContext.mobileNumber}: ${pendingContext.testOtp}`);
      return pendingContext;
    }

    throw new Error('Firebase phone authentication is not available. Use an Expo development build with Firebase native config.');
  },

  async confirmSignInOtp(payload: OtpVerificationPayload) {
    const pendingContext = await readPendingLoginContext();
    if (!pendingContext) {
      throw new Error('Your login session expired. Start again from the login screen.');
    }

    logOtpService('confirmSignInOtp started.', {
      loginAttemptId: pendingContext.loginAttemptId,
      provider: pendingContext.provider ?? null,
      mobileNumber: pendingContext.mobileNumber,
      hasPendingPhoneOtp: hasPendingPhoneOtp(),
      hasCurrentFirebaseUser: Boolean(getCurrentFirebaseUser()),
    });

    try {
      if (pendingContext.provider === 'firebase' || isFirebaseConfigured()) {
        if (!hasPendingPhoneOtp()) {
          const storedSession = await readStoredSession();
          if (storedSession?.source === 'backend' && doMobileNumbersMatch(storedSession.user.mobileNumber, pendingContext.mobileNumber)) {
            logOtpService('Manual OTP verification found an already finalized backend session.', {
              loginAttemptId: pendingContext.loginAttemptId,
              tenantId: storedSession.user.tenantId,
            });
            return storedSession;
          }

          const currentFirebaseUser = getCurrentFirebaseUser();
          if (currentFirebaseUser && doMobileNumbersMatch(currentFirebaseUser.phoneNumber, pendingContext.mobileNumber)) {
            logOtpService('Manual OTP verification found an already authenticated Firebase user without a live confirmation.', {
              loginAttemptId: pendingContext.loginAttemptId,
              mobileNumber: pendingContext.mobileNumber,
            });
            return finalizeFirebaseSessionFromPendingContext(pendingContext, { source: 'manual-confirm-fallback' });
          }
        }

        const otpConfirmStartedAt = Date.now();
        try {
          await confirmPhoneOtp(payload.otpCode);
          logOtpService('confirmPhoneOtp completed successfully.', {
            loginAttemptId: pendingContext.loginAttemptId,
            hasCurrentFirebaseUser: Boolean(getCurrentFirebaseUser()),
          });
        } catch (error) {
          const storedSession = await readStoredSession();
          if (storedSession?.source === 'backend' && doMobileNumbersMatch(storedSession.user.mobileNumber, pendingContext.mobileNumber)) {
            logOtpService('Manual OTP verification joined a backend session completed by Firebase auto-auth.', {
              loginAttemptId: pendingContext.loginAttemptId,
              tenantId: storedSession.user.tenantId,
            });
            return storedSession;
          }

          if (
            error instanceof Error &&
            error.message === 'Your OTP session expired. Request a new code and try again.' &&
            doMobileNumbersMatch(getCurrentFirebaseUser()?.phoneNumber, pendingContext.mobileNumber)
          ) {
            logOtpService('Manual OTP verification recovered from an expired local confirmation using the authenticated Firebase user.', {
              loginAttemptId: pendingContext.loginAttemptId,
              mobileNumber: pendingContext.mobileNumber,
            });
            return finalizeFirebaseSessionFromPendingContext(pendingContext, { source: 'manual-confirm-fallback' });
          }

          throw error;
        }
        logAuthPerformance('otp_confirm', {
          durationMs: Date.now() - otpConfirmStartedAt,
          loginAttemptId: pendingContext.loginAttemptId,
        });

        const storedSession = await readStoredSession();
        if (storedSession?.source === 'backend' && doMobileNumbersMatch(storedSession.user.mobileNumber, pendingContext.mobileNumber)) {
          logOtpService('confirmSignInOtp reused backend session created during OTP confirmation.', {
            loginAttemptId: pendingContext.loginAttemptId,
            tenantId: storedSession.user.tenantId,
          });
          return storedSession;
        }

        if (doMobileNumbersMatch(getCurrentFirebaseUser()?.phoneNumber, pendingContext.mobileNumber)) {
          logOtpService('confirmSignInOtp is finalizing backend session after successful manual OTP confirmation.', {
            loginAttemptId: pendingContext.loginAttemptId,
            mobileNumber: pendingContext.mobileNumber,
          });
          return finalizeFirebaseSessionFromPendingContext(pendingContext, { source: 'manual-confirm-fallback' });
        }

        logOtpService('confirmSignInOtp finished after manual confirmation.', {
          loginAttemptId: pendingContext.loginAttemptId,
          hasStoredSession: Boolean(storedSession),
          storedSessionSource: storedSession?.source ?? null,
          hasCurrentFirebaseUser: Boolean(getCurrentFirebaseUser()),
        });
        return storedSession ?? null;
      }

      const firebaseConfigured = isFirebaseConfigured();
      const isDevOtpFlow = !firebaseConfigured || Boolean(pendingContext.testOtp);
      const devUid = `local-dev-${pendingContext.mobileNumber.replace(/[^\d]/g, '') || 'user'}`;
      const expectedOtp = pendingContext.testOtp || buildDevOtp(pendingContext.mobileNumber);
      const otpMatches = isDevOtpFlow ? payload.otpCode === expectedOtp : true;

      if (!otpMatches) {
        throw new Error('The OTP is invalid. Check the code and try again.');
      }

      if (!isDevOtpFlow) {
        throw new Error('Backend API is required after Firebase OTP verification.');
      }

      const record = await ensureUserRecordForLocalSession(
            devUid,
            pendingContext.mobileNumber,
            pendingContext.preferredLanguage,
            pendingContext.tenantId || communityConfig.tenantId,
          );

      const session = buildSessionFromRecord(
        devUid,
        record,
        'local-dev',
      );

      await writeStoredSession(session);
      await clearPendingLoginContext();
      return session;
    } catch (error) {
      throw new Error(toErrorMessage(error, 'Unable to verify OTP.'));
    }
  },

  async completeCommunitySelection(payload: { tenantId: string; subCommunity?: string }) {
    const pendingContext = await readPendingLoginContext();
    const storedSession = await readStoredSession();
    const nextTenantId = payload.tenantId || storedSession?.user.tenantId || pendingContext?.tenantId || communityConfig.tenantId;
    const nextSubCommunity = payload.subCommunity ?? storedSession?.user.subCommunity ?? pendingContext?.subCommunity;

    try {
      if (storedSession?.source === 'backend') {
        if (storedSession.user.tenantId && storedSession.user.tenantId !== nextTenantId) {
          throw new Error('Community cannot be changed after OTP verification. Go back and start login again.');
        }

        const session: UserSession = {
          ...storedSession,
          user: {
            ...storedSession.user,
            tenantId: nextTenantId,
            subCommunity: nextSubCommunity,
          },
        };

        await writeStoredSession(session);
        await clearPendingLoginContext();
        return session;
      }

      if (!pendingContext && !storedSession) {
        throw new Error('Your login session expired. Start again from the login screen.');
      }

      const currentUserId = storedSession?.user.id || `local-dev-${(pendingContext?.mobileNumber || '').replace(/[^\d]/g, '') || 'user'}`;
      const currentPhone = storedSession?.user.mobileNumber || pendingContext?.mobileNumber || '';
      const record = buildFallbackUserRecord(
        currentUserId,
        currentPhone,
        pendingContext?.preferredLanguage || storedSession?.user.preferredLanguage || 'en',
        nextTenantId,
      );

      const session = buildSessionFromRecord(
        currentUserId,
        record,
        storedSession?.source === 'firebase' ? 'firebase' : 'local-dev',
        {
        accessToken: storedSession?.accessToken,
        },
      );
      session.user.tenantId = nextTenantId;
      session.user.subCommunity = nextSubCommunity;

      await writeStoredSession(session);
      await clearPendingLoginContext();
      return session;
    } catch (error) {
      throw new Error(toErrorMessage(error, 'Unable to complete community selection.'));
    }
  },

  async resendPendingOtp() {
    const pendingContext = await readPendingLoginContext();
    if (!pendingContext) {
      throw new Error('There is no active OTP request. Go back and start login again.');
    }

    const remainingCooldownSeconds = getOtpResendCooldownRemainingSeconds(pendingContext.otpRequestedAt);
    if (remainingCooldownSeconds > 0) {
      throw new Error(`Please wait ${remainingCooldownSeconds}s before requesting a new OTP.`);
    }

    await this.requestSignInOtp({
      mobileNumber: pendingContext.mobileNumber,
      preferredLanguage: pendingContext.preferredLanguage,
      tenantId: pendingContext.tenantId,
      subCommunity: pendingContext.subCommunity,
    });
    return pendingContext.mobileNumber;
  },

  hasPendingOtpVerification() {
    return hasPendingPhoneOtp();
  },

  async hasPendingOtpContext() {
    return Boolean(await readPendingLoginContext());
  },

  async getPendingLoginContext() {
    return readPendingLoginContext();
  },

  getPendingOtpPhoneNumber() {
    return getPendingPhoneNumber();
  },

  async updateSession(nextSession: UserSession) {
    await persistSessionUser(nextSession);
    return nextSession;
  },

  async refreshStoredBackendSession() {
    return refreshStoredBackendSession();
  },

  async completePendingFirebaseSignInFromCurrentUser(source: 'auto-auth-state' = 'auto-auth-state') {
    const pendingContext = await readPendingLoginContext();
    const currentFirebaseUser = getCurrentFirebaseUser();
    logOtpService('completePendingFirebaseSignInFromCurrentUser invoked.', {
      source,
      hasPendingContext: Boolean(pendingContext),
      provider: pendingContext?.provider ?? null,
      loginAttemptId: pendingContext?.loginAttemptId ?? null,
      firebaseUserId: currentFirebaseUser?.uid ?? null,
      firebasePhoneNumber: currentFirebaseUser?.phoneNumber ?? null,
    });
    if (!pendingContext || pendingContext.provider !== 'firebase' || !currentFirebaseUser) {
      logOtpService('Skipped pending Firebase session completion because required state was missing.', {
        source,
        hasPendingContext: Boolean(pendingContext),
        provider: pendingContext?.provider ?? null,
        firebaseUserId: currentFirebaseUser?.uid ?? null,
      });
      return null;
    }

    return finalizeFirebaseSessionFromPendingContext(pendingContext, { source });
  },

  async completeOnboarding(
    session: UserSession,
    profile: { fullNameEn: string; fullNameGu: string; mobileNumber: string },
  ) {
    const nextSession: UserSession = {
      ...session,
      user: {
        ...session.user,
        fullName: profile.fullNameEn,
        mobileNumber: normalizeMobileNumber(profile.mobileNumber),
        onboardingComplete: true,
      },
      issuedAt: getNow(),
    };
    await persistSessionUser(nextSession);
    return nextSession;
  },

  async logout() {
    await clearPendingLoginContext();
    await markLoggedOut();
    await notificationService.deactivatePushToken().catch(() => {
      return;
    });
    await clearStoredSession();
    await signOutFirebase().catch(() => {
      return;
    });
  },

  async requestOtp(payload: OtpRequestPayload) {
    if (!isFirebaseConfigured()) {
      const pendingContext: PendingLoginContext = {
        mobileNumber: normalizeMobileNumber(payload.mobileNumber),
        preferredLanguage: 'en',
        testOtp: buildDevOtp(payload.mobileNumber),
      };

      await writePendingLoginContext(pendingContext);
      console.log(`[DEV OTP] ${pendingContext.mobileNumber}: ${pendingContext.testOtp}`);
      return Promise.resolve({ success: true as const });
    }

    await this.requestSignInOtp({
      mobileNumber: payload.mobileNumber,
      preferredLanguage: 'en',
      tenantId: communityConfig.tenantId,
    });
    return Promise.resolve({ success: true as const });
  },

  async verifyOtp(payload: OtpVerificationPayload) {
    if (!isFirebaseConfigured()) {
      const pendingContext = await readPendingLoginContext();
      if (!pendingContext?.testOtp) {
        throw new Error('Your login session expired. Start again from the login screen.');
      }

      if (payload.otpCode !== pendingContext.testOtp) {
        throw new Error('The OTP is invalid. Check the code and try again.');
      }

      const localUid = `local-dev-${pendingContext.mobileNumber.replace(/[^\d]/g, '') || 'user'}`;
      const record = buildFallbackUserRecord(
        localUid,
        pendingContext.mobileNumber,
        pendingContext.preferredLanguage,
        pendingContext.tenantId || communityConfig.tenantId,
      );

      const session = buildSessionFromRecord(localUid, record, 'local-dev');
      await writeStoredSession(session);
      await clearPendingLoginContext();
      return Promise.resolve({ success: true as const, verified: true });
    }

    await this.confirmSignInOtp(payload);
    return Promise.resolve({ success: true as const, verified: true });
  },

  async setupPin(
    pin: string,
    context?: {
      mobileNumber?: string;
      tenantId?: string;
      session?: UserSession | null;
    },
  ) {
    const firebaseUser = getCurrentFirebaseUser();
    const storedSession = context?.session ?? (await readStoredSession());
    if (!firebaseUser && !storedSession) {
      throw new Error('You must be signed in before verifying or setting a PIN.');
    }

    const mobileNumber = firebaseUser?.phoneNumber || context?.mobileNumber || storedSession?.user.mobileNumber;
    const tenantId = context?.tenantId || storedSession?.user.tenantId || communityConfig.tenantId;

    if (mobileNumber) {
      await writeStoredPinHash(pin, { mobileNumber, tenantId });
      await clearPinDisabled({ mobileNumber, tenantId });
    }

    return Promise.resolve({ success: true as const, saved: true });
  },

  async clearPendingOtp() {
    clearPendingPhoneOtp();
    await clearPendingLoginContext();
  },

  async refreshSessionFromFirebase() {
    return hydrateSessionFromCurrentUser();
  },
};
