import { Stack } from 'expo-router';

import { appStackScreenOptions } from '@/src/core/navigation/navigation-options';

export default function MatrimonyLayout() {
  return (
    <Stack screenOptions={appStackScreenOptions}>
      {/* Lateral tab peers — no slide animation */}
      <Stack.Screen name="index"     options={{ animation: 'none' }} />
      <Stack.Screen name="discovery" options={{ animation: 'none' }} />
      <Stack.Screen name="requests"  options={{ animation: 'none' }} />
      <Stack.Screen name="messages"  options={{ animation: 'none' }} />
      {/* Deeper screens keep the default slide */}
    </Stack>
  );
}
