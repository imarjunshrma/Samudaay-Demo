import { Platform } from 'react-native';

import { donationModuleConfig } from '../config/donation-module-config';

export function useDonationModuleVisibility() {
  const androidEnabled = donationModuleConfig.enabled && donationModuleConfig.androidEnabled;
  const iosEnabled = donationModuleConfig.enabled && donationModuleConfig.iosEnabled;

  if (Platform.OS === 'android') {
    return { enabled: androidEnabled };
  }

  if (Platform.OS === 'ios') {
    return { enabled: iosEnabled };
  }

  return { enabled: androidEnabled || iosEnabled };
}
