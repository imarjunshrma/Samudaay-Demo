import { Stack } from 'expo-router';

import { ChangeProfileDetailsScreen } from '@/src/features/profile/screens';

export default function ChangeProfileDetailsRoute() {
  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false, fullScreenGestureEnabled: false }} />
      <ChangeProfileDetailsScreen />
    </>
  );
}
