import * as LocalAuthentication from 'expo-local-authentication';

import { storageKeys } from '@/src/constants/storageKeys';
import { buildUserScopedStorageKey, getPinHashStorageKey, normalizeMobileNumber, toSecureStoreKeyPart, verifyStoredPin } from '@/src/services/device-pin.service';
import { storageService } from '@/src/services/storage.service';

const FINGERPRINT_TYPE = 1;
const FACE_ID_TYPE = 2;

export type BiometricCapability = {
  available: boolean;
  hardwareAvailable: boolean;
  enrolled: boolean;
  types: LocalAuthentication.AuthenticationType[];
};

type BiometricIdentity = {
  mobileNumber?: string;
  tenantId?: string;
};

function getBiometricEnabledKey(identity?: BiometricIdentity) {
  if (!identity?.tenantId || !identity.mobileNumber) {
    return storageKeys.biometricEnabled;
  }

  return `${storageKeys.biometricEnabled}.${toSecureStoreKeyPart(identity.tenantId)}.${toSecureStoreKeyPart(normalizeMobileNumber(identity.mobileNumber))}`;
}

function getPinDisabledKey(identity?: BiometricIdentity) {
  return buildUserScopedStorageKey(storageKeys.pinDisabled, identity ?? {});
}

export function resolveBiometricLabel(types: LocalAuthentication.AuthenticationType[]) {
  const numericTypes = types.map((type) => Number(type));

  if (numericTypes.includes(FACE_ID_TYPE)) {
    return 'Face ID';
  }

  if (numericTypes.includes(FINGERPRINT_TYPE)) {
    return 'Fingerprint';
  }

  return 'Biometric';
}

export async function loadBiometricCapability(): Promise<BiometricCapability> {
  const [hasHardware, enrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  return {
    available: hasHardware && enrolled,
    hardwareAvailable: hasHardware,
    enrolled,
    types: types ?? [],
  };
}

export async function readBiometricEnabled(identity?: BiometricIdentity) {
  return (await storageService.getItem(getBiometricEnabledKey(identity))) === 'true';
}

export async function readPinEnabled(identity?: BiometricIdentity) {
  const key = getPinHashStorageKey(identity ?? {});
  if (!key) {
    return false;
  }

  return Boolean(await storageService.getItem(key));
}

export { verifyStoredPin } from '@/src/services/device-pin.service';
export async function clearPinDisabled(identity?: BiometricIdentity) {
  const key = getPinDisabledKey(identity);
  if (!key) {
    return;
  }

  await storageService.removeItem(key);
}

export async function setBiometricEnabled(enabled: boolean, identity?: BiometricIdentity) {
  const key = getBiometricEnabledKey(identity);

  if (enabled) {
    await storageService.setItem(key, 'true');
    return true;
  }

  await storageService.removeItem(key);
  return false;
}

export async function authenticateWithBiometric() {
  const capability = await loadBiometricCapability();
  if (!capability.hardwareAvailable || !capability.enrolled) {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock with biometrics',
    cancelLabel: 'Use OTP',
    disableDeviceFallback: false,
  });

  return result.success;
}
