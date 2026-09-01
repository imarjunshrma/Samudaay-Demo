import { useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomSafeSpacing(base = 0) {
  const insets = useSafeAreaInsets();
  return base + insets.bottom;
}

export function SafeAreaBottomSpacer({ height = 0 }: { height?: number }) {
  const bottom = useBottomSafeSpacing(height);
  return <View style={{ height: bottom }} />;
}

export function SafeAreaBottomView({
  basePadding = 0,
  style,
  ...props
}: ViewProps & { basePadding?: number }) {
  const paddingBottom = useBottomSafeSpacing(basePadding);
  const nextStyle = useMemo(() => [{ paddingBottom }, style], [paddingBottom, style]);

  return <View {...props} style={nextStyle} />;
}
