import { Redirect } from 'expo-router';

import { securityConfig } from '@/src/core/config/security';
import { ProfileSecurityContent } from '@/src/features/profile/components/profile-security-content';

export default function ProfileSecurityRoute() {
  if (!securityConfig.authSecurityEnabled) {
    return <Redirect href="/profile/my-profile" />;
  }

  return <ProfileSecurityContent />;
}
