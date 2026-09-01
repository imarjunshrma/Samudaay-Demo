import { Stack } from 'expo-router';

import { appStackScreenOptions } from '@/src/core/navigation/navigation-options';
import { ProtectedRouteBoundary } from '@/src/core/navigation/ProtectedRouteBoundary';

export default function DashboardLayout() {
  return (
    <ProtectedRouteBoundary>
      <Stack screenOptions={appStackScreenOptions} />
    </ProtectedRouteBoundary>
  );
}
