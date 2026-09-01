import { Redirect, useSegments } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { UI_PREVIEW_AUTH_BYPASS } from '@/src/core/config/ui-preview';
import { appPaths } from '@/src/core/navigation/paths';
import { useSession } from '@/src/core/providers/session-provider';
import { isPlainUserSession } from './default-route';
import { colors } from '@/src/theme';

export function ProtectedRouteBoundary({ children }: { children: ReactNode }) {
  const { status, session } = useSession();
  const segments = useSegments();

  if (UI_PREVIEW_AUTH_BYPASS) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.DEFAULT }}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (status === 'signedOut' || !session) {
    return <Redirect href="/login" />;
  }

  if (isPlainUserSession(session) && segments[0] === 'finance') {
    return <Redirect href={appPaths.member.home} />;
  }

  return <>{children}</>;
}
