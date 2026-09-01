import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/src/theme';

export function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="auto"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248,247,245,0.72)',
      }}>
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
    </View>
  );
}
