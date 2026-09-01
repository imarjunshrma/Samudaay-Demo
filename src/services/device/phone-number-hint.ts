import { NativeModules, Platform } from 'react-native';

type PhoneNumberHintNativeModule = {
  requestPhoneNumberHint?: () => Promise<string | null>;
};

function normalizeHintPhoneNumber(phoneNumber: string | null | undefined) {
  if (!phoneNumber) {
    return null;
  }

  const digitsOnly = phoneNumber.replace(/[^\d]/g, '');
  if (digitsOnly.length < 10) {
    return null;
  }

  return digitsOnly.slice(-10);
}

export function isPhoneNumberHintAvailable() {
  return Platform.OS === 'android' && Boolean((NativeModules.PhoneNumberHint as PhoneNumberHintNativeModule | undefined)?.requestPhoneNumberHint);
}

export async function requestPhoneNumberHint() {
  if (!isPhoneNumberHintAvailable()) {
    return null;
  }

  try {
    const nativeModule = NativeModules.PhoneNumberHint as PhoneNumberHintNativeModule;
    const phoneNumber = await nativeModule.requestPhoneNumberHint?.();
    return normalizeHintPhoneNumber(phoneNumber);
  } catch {
    return null;
  }
}
