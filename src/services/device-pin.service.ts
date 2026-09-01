import * as Crypto from 'expo-crypto';

import { appConfig } from '@/src/constants/appConfig';
import { communityConfig } from '@/src/core/config/community';
import { storageService } from '@/src/services/storage.service';

const PIN_HASH_STORAGE_PREFIX = 'stitch-community-pin-hash';

export type DevicePinIdentity = {
  mobileNumber?: string;
  tenantId?: string;
};

export function normalizeMobileNumber(mobileNumber: string) {
  const trimmed = mobileNumber.trim();
  const defaultCountryCode = appConfig.defaultCountryCode.replace(/[^\d+]/g, '');
  const defaultCountryDigits = defaultCountryCode.replace(/[^\d]/g, '');
  const digitsOnly = trimmed.replace(/[^\d]/g, '');

  if (!digitsOnly) {
    return '';
  }

  if (trimmed.startsWith('+')) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `${defaultCountryCode}${digitsOnly}`;
  }

  if (defaultCountryDigits && digitsOnly.startsWith(defaultCountryDigits)) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }

  return digitsOnly;
}

export function toSecureStoreKeyPart(value: string) {
  return value.replace(/[^A-Za-z0-9._-]/g, '_');
}

export function buildUserScopedStorageKey(
  prefix: string,
  identityOrMobileNumber: DevicePinIdentity | string,
  tenantId = communityConfig.tenantId,
) {
  const identity =
    typeof identityOrMobileNumber === 'string'
      ? { mobileNumber: identityOrMobileNumber, tenantId }
      : identityOrMobileNumber;

  if (!identity.mobileNumber) {
    return null;
  }

  const resolvedTenantId = identity.tenantId || tenantId;
  return `${prefix}.${toSecureStoreKeyPart(resolvedTenantId)}.${toSecureStoreKeyPart(normalizeMobileNumber(identity.mobileNumber))}`;
}

export function getPinHashStorageKey(
  identityOrMobileNumber: DevicePinIdentity | string,
  tenantId = communityConfig.tenantId,
) {
  return buildUserScopedStorageKey(PIN_HASH_STORAGE_PREFIX, identityOrMobileNumber, tenantId);
}

export async function generatePinHash(pin: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export async function readStoredPinHash(
  identityOrMobileNumber: DevicePinIdentity | string,
  tenantId = communityConfig.tenantId,
) {
  const key = getPinHashStorageKey(identityOrMobileNumber, tenantId);
  if (!key) {
    return null;
  }

  return (await storageService.getItem(key)) ?? null;
}

export async function writeStoredPinHash(
  pin: string,
  identityOrMobileNumber: DevicePinIdentity | string,
  tenantId = communityConfig.tenantId,
) {
  const key = getPinHashStorageKey(identityOrMobileNumber, tenantId);
  if (!key) {
    return false;
  }

  await storageService.setItem(key, await generatePinHash(pin));
  return true;
}

export async function verifyPinHash(pin: string, storedHash: string | null | undefined) {
  if (!storedHash) {
    return false;
  }

  return (await generatePinHash(pin)) === storedHash;
}

export async function verifyStoredPin(pin: string, identity?: DevicePinIdentity) {
  return verifyPinHash(pin, await readStoredPinHash(identity ?? {}));
}
