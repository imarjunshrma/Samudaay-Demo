import { communityConfig } from '@/src/core/config/community';

export const appConfig = {
  appName: communityConfig.brandName,
  defaultCountryCode: '+91',
  toastDurationMs: 3000,
  dateFormat: 'DD/MM/YYYY',
} as const;
