import { rolePermissions } from '@/src/constants/roles';
import type { UserSession } from '@/src/types/app';

export const UI_PREVIEW_AUTH_BYPASS = process.env.EXPO_PUBLIC_UI_PREVIEW_AUTH_BYPASS === 'true';

export const uiPreviewSession: UserSession = {
  user: {
    id: 'ui-preview-user',
    fullName: 'UI Preview Admin',
    mobileNumber: '+919876543210',
    email: 'preview@example.com',
    role: 'admin',
    permissions: rolePermissions.admin,
    preferredLanguage: 'en',
    onboardingComplete: true,
    tenantId: 'preview-community',
  },
  issuedAt: Date.now(),
  source: 'local-dev',
};
