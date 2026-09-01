import type { PendingLoginContext } from '@/src/features/auth/types/auth';
import { getSecureItem, removeSecureItem, setSecureItem } from '@/src/services/secure-storage';
import type { UserSession } from '@/src/types/app';

const SESSION_KEY = 'stitch-community-session';
const PENDING_LOGIN_KEY = 'stitch-community-pending-login';
const LOGGED_OUT_KEY = 'stitch-community-logged-out';
const APP_VIEW_MODE_KEY = 'stitch-community-app-view-mode';

export type AppViewMode = 'admin' | 'user';

type StoredUserSession = Pick<UserSession, 'issuedAt' | 'source' | 'accessToken'> & {
  user: Pick<
    UserSession['user'],
    | 'id'
    | 'fullName'
    | 'mobileNumber'
    | 'role'
    | 'permissions'
    | 'preferredLanguage'
    | 'onboardingComplete'
    | 'tenantId'
  > & Partial<
    Pick<
      UserSession['user'],
      | 'countryCode'
      | 'email'
      | 'communityMembershipId'
      | 'communityMembershipStatus'
      | 'kycStatus'
      | 'communityPermissions'
      | 'subCommunity'
      | 'profilePhotoUrl'
    >
  >;
};

async function getAuthStorageItem(key: string) {
  return getSecureItem(key);
}

async function setAuthStorageItem(key: string, value: string) {
  await setSecureItem(key, value);
}

async function removeAuthStorageItem(key: string) {
  await removeSecureItem(key).catch(() => {
    return;
  });
}

export async function readStoredSession() {
  const raw = await getAuthStorageItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as UserSession) : null;
}

function toStoredSession(session: UserSession): StoredUserSession {
  const extraCommunityPermissions = (session.user.communityPermissions ?? []).filter(
    (permission) => !session.user.permissions.includes(permission),
  );

  return {
    issuedAt: session.issuedAt,
    source: session.source,
    accessToken: session.accessToken,
    user: {
      id: session.user.id,
      fullName: session.user.fullName,
      mobileNumber: session.user.mobileNumber,
      role: session.user.role,
      permissions: session.user.permissions,
      preferredLanguage: session.user.preferredLanguage,
      onboardingComplete: session.user.onboardingComplete,
      tenantId: session.user.tenantId,
      ...(session.user.countryCode ? { countryCode: session.user.countryCode } : {}),
      ...(session.user.email ? { email: session.user.email } : {}),
      ...(session.user.communityMembershipId ? { communityMembershipId: session.user.communityMembershipId } : {}),
      ...(session.user.communityMembershipStatus ? { communityMembershipStatus: session.user.communityMembershipStatus } : {}),
      ...(session.user.kycStatus ? { kycStatus: session.user.kycStatus } : {}),
      ...(extraCommunityPermissions.length ? { communityPermissions: extraCommunityPermissions } : {}),
      ...(session.user.subCommunity ? { subCommunity: session.user.subCommunity } : {}),
      ...(session.user.profilePhotoUrl ? { profilePhotoUrl: session.user.profilePhotoUrl } : {}),
    },
  };
}

export async function writeStoredSession(session: UserSession) {
  await removeAuthStorageItem(LOGGED_OUT_KEY);
  await setAuthStorageItem(SESSION_KEY, JSON.stringify(toStoredSession(session)));
}

export async function clearStoredSession() {
  await removeAuthStorageItem(SESSION_KEY);
}

export async function markLoggedOut() {
  await setAuthStorageItem(LOGGED_OUT_KEY, 'true');
}

export async function hasLoggedOutMarker() {
  return (await getAuthStorageItem(LOGGED_OUT_KEY)) === 'true';
}

export async function readStoredAppViewMode(): Promise<AppViewMode | null> {
  const raw = await getAuthStorageItem(APP_VIEW_MODE_KEY);
  return raw === 'admin' || raw === 'user' ? raw : null;
}

export async function writeStoredAppViewMode(mode: AppViewMode) {
  await setAuthStorageItem(APP_VIEW_MODE_KEY, mode);
}

export async function clearStoredAppViewMode() {
  await removeAuthStorageItem(APP_VIEW_MODE_KEY);
}

export async function readPendingLoginContext() {
  const raw = await getAuthStorageItem(PENDING_LOGIN_KEY);
  return raw ? (JSON.parse(raw) as PendingLoginContext) : null;
}

export async function writePendingLoginContext(context: PendingLoginContext) {
  await setAuthStorageItem(PENDING_LOGIN_KEY, JSON.stringify(context));
}

export async function clearPendingLoginContext() {
  await removeAuthStorageItem(PENDING_LOGIN_KEY);
}
