import type { ReactNode } from 'react';
import { View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/src/theme';

export function AdminAnalyticsCardShell({
  children,
  backgroundColor = colors.background.surface,
  borderColor = colors.primary.borderLight,
}: {
  children: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
}) {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        padding: spacing[4],
        backgroundColor,
        borderWidth: 1,
        borderColor,
        ...shadows.sm,
      }}>
      {children}
    </View>
  );
}
