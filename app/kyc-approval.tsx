import { Stack } from 'expo-router';
import { KycApprovalScreen } from '@/src/features/registration/screens';

export default function KycApprovalRoute() {
  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false, fullScreenGestureEnabled: false }} />
      <KycApprovalScreen />
    </>
  );
}
