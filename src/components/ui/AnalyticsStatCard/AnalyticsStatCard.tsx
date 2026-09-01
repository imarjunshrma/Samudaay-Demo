import { View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors, shadows, spacing, typography } from '@/src/theme';

export type AnalyticsStatCardVariant = 'default' | 'accent' | 'success' | 'purple';

export interface AnalyticsStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: AnalyticsStatCardVariant;
}

const toneMap = {
  default: colors.text.primary,
  accent: colors.primary.DEFAULT,
  success: '#0f766e',
  purple: '#7c3aed',
} as const;

export function AnalyticsStatCard({
  title,
  value,
  subtitle,
  variant = 'default',
}: AnalyticsStatCardProps) {
  return (
    <View
      style={{
        borderRadius: 24,
        backgroundColor: '#ffffff',
        padding: spacing[5],
        ...shadows.sm,
      }}>
      <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Text>
      <Text
        variant="h4"
        style={{
          marginTop: spacing[2],
          color: toneMap[variant],
          fontFamily: typography.fontFamily.extrabold,
        }}>
        {value}
      </Text>
      {subtitle ? (
        <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[2] }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
