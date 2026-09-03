import { View } from 'react-native';

import { colors, radius } from '@/src/theme';

export function EventScannerFrame() {
  return (
    <View style={{ width: 256, height: 256, position: 'relative' }}>
      <View style={{ width: '100%', height: '100%', borderRadius: radius.xl, borderWidth: 2, borderColor: 'rgba(24,168,117,0.28)', backgroundColor: 'transparent' }} />
      {[
        { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radius.lg },
        { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radius.lg },
        { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radius.lg },
        { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radius.lg },
      ].map((corner, index) => (
        <View key={index} style={{ position: 'absolute', width: 42, height: 42, borderColor: colors.primary.DEFAULT, ...corner }} />
      ))}
      <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: colors.primary.DEFAULT, shadowColor: colors.primary.DEFAULT, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } }} />
    </View>
  );
}
