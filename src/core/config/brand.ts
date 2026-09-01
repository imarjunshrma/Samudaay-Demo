import { useAppPreferences } from '@/src/core/providers/app-provider';
import type { AppLanguage } from '@/src/types/app';

import { communityConfig } from './community';

export const APP_SHORT_NAME = communityConfig.brandName;
export const APP_FULL_NAME = communityConfig.tenantName;
export const APP_TAGLINE = communityConfig.tagline;
export const APP_LOGO_SOURCE = require('../../../app/logo.png');

export function getTenantName(language: AppLanguage) {
  return language === 'gu' ? communityConfig.tenantNameGu : communityConfig.tenantName;
}

export function getTenantTagline(language: AppLanguage) {
  return language === 'gu' ? communityConfig.taglineGu : communityConfig.tagline;
}

export function useLocalizedBrandText() {
  const { language } = useAppPreferences();

  return {
    tenantName: getTenantName(language),
    tagline: getTenantTagline(language),
    shortName: APP_SHORT_NAME,
    logoSource: APP_LOGO_SOURCE,
  };
}
