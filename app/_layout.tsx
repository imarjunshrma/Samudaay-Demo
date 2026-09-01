import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ToastViewport } from '@/src/components/feedback/Toast';
import { DialogHost } from '@/src/components/feedback';
import { appStackScreenOptions } from '@/src/core/navigation/navigation-options';
import { AppProvider } from '@/src/core/providers/app-provider';
import { NavigationGuard } from '@/src/core/providers/navigation-guard';
import { AdvertisementRotationGate } from '@/src/features/advertisements/components/advertisement-rotation-gate';
import { AuthSecurityGate } from '@/src/features/auth/components/auth-security-gate';
import { useAppFonts } from '@/src/hooks';
import { NotificationProvider, PushNotificationBridge } from '@/src/notifications';
import { colors } from '@/src/theme';

import '../global.css';

let splashAutoHidePrevented = false;
SplashScreen.preventAutoHideAsync()
  .then(() => {
    splashAutoHidePrevented = true;
  })
  .catch(() => {
    splashAutoHidePrevented = false;
  });

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const splashHiddenRef = useRef(false);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background.DEFAULT).catch(() => {
      return;
    });
  }, []);

  const handleLayout = useCallback(() => {
    if (!fontsLoaded || splashHiddenRef.current || !splashAutoHidePrevented) {
      return;
    }

    splashHiddenRef.current = true;
    SplashScreen.hideAsync().catch(() => {
      return;
    });
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <NotificationProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <KeyboardProvider>
            <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} onLayout={handleLayout}>
              <StatusBar style="dark" translucent={false} backgroundColor={colors.background.DEFAULT} />
              <AuthSecurityGate>
                <PushNotificationBridge />
                <NavigationGuard>
                  <Stack screenOptions={appStackScreenOptions} />
                </NavigationGuard>
                <AdvertisementRotationGate />
              </AuthSecurityGate>
              <DialogHost />
              <ToastViewport />
            </View>
          </KeyboardProvider>
        </SafeAreaProvider>
      </NotificationProvider>
    </AppProvider>
  );
}
