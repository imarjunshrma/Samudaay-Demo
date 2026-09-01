import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, shadows, spacing } from '@/src/theme/tokens';

export type GradientTone = 'warm' | 'cool' | 'earth';

const toneStyles: Record<GradientTone, { light: string[]; dark: string[] }> = {
  warm: {
    light: ['#fff7f1', '#f0dfd1'],
    dark: ['#37261f', '#241712'],
  },
  cool: {
    light: ['#eef9f8', '#d7ece8'],
    dark: ['#17332f', '#132420'],
  },
  earth: {
    light: ['#f7f2e8', '#e5d7c1'],
    dark: ['#3a2e1f', '#251b12'],
  },
};

export function LinearGradientLikeBackground({
  children,
  tone,
}: PropsWithChildren<{ tone: GradientTone }>) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];
  const [start, end] = toneStyles[tone][resolvedTheme];

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.topGlow, { backgroundColor: start }]} />
      <View style={[styles.bottomGlow, { backgroundColor: end }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  content: {
    padding: spacing.xxl,
  },
  topGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  bottomGlow: {
    position: 'absolute',
    right: -60,
    top: 50,
    width: 220,
    height: 220,
    borderRadius: 200,
    opacity: 0.45,
  },
});
