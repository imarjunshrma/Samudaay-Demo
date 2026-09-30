import { useSyncExternalStore } from 'react';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import type { AppLanguage } from '@/src/types/app';

import { communityConfig, communityStore } from './community';

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

// Community logos from app-config (Samudaay); the bundled logo is the fallback everywhere.
function toImageSource(url: string | null | undefined) {
  const uri = resolveBackendMediaUrl(url);
  return uri ? { uri } : APP_LOGO_SOURCE;
}

export function useLocalizedBrandText() {
  const { language } = useAppPreferences();
  const { appConfig } = useSyncExternalStore(communityStore.subscribe, communityStore.getState, communityStore.getState);

  return {
    tenantName: getTenantName(language),
    tagline: getTenantTagline(language),
    shortName: APP_SHORT_NAME,
    logoSource: toImageSource(appConfig?.branding.appStartLogoUrl),
    idCardLogoSource: toImageSource(appConfig?.branding.idCardLogoUrl),
  };
}
