import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { securityConfig } from '@/src/core/config/security';
import { useSession } from '@/src/core/providers/session-provider';
import { useAuthSecurity } from '@/src/features/auth/hooks/use-auth-security';
import { colors } from '@/src/theme';

import { AuthSecurityFlow } from './auth-security-flow';

export function AuthSecurityGate({ children }: { children?: ReactNode }) {
  const { status, session } = useSession();
  const security = useAuthSecurity();
  const shouldShowLoader = status === 'loading' || (session && !security.isReady);

  if (!securityConfig.authSecurityEnabled) {
    return <>{children ?? null}</>;
  }

  if (shouldShowLoader) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background.DEFAULT,
        }}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (security.isLocked || security.isSetupRequired) {
    return <AuthSecurityFlow security={security} />;
  }

  return <>{children ?? null}</>;
}
