import '../global.css';
import 'react-native-reanimated';

import CreateEventScreen from '@/htmls/Create New Event (Admin)';
import { AppProvider } from '@/src/core/providers/app-provider';

export default function RootLayout() {
  return (
    <AppProvider>
      {/* <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </NavigationGuard>
      <StatusBar style="dark" /> */}
      <CreateEventScreen />
    </AppProvider>
  );
}
