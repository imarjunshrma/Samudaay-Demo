import { Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export type FeatureCardVariant = 'dashboard' | 'shortcut' | 'compact' | 'promo';

export interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  variant?: FeatureCardVariant;
  onPress?: () => void;
}

const variantStyleMap = {
  dashboard: {
    width: '48%' as const,
    padding: spacing[4],
    borderRadius: radius.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    gap: spacing[3],
    ...shadows.sm,
  },
  shortcut: {
    width: '100%' as const,
    padding: spacing[4],
    borderRadius: radius.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    gap: spacing[3],
  },
  compact: {
    width: '48%' as const,
    padding: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    gap: spacing[2],
  },
  promo: {
    width: '100%' as const,
    padding: spacing[5],
    borderRadius: radius.xl,
    backgroundColor: 'rgba(24,168,117,0.05)',
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    gap: spacing[3],
  },
} as const;

export function FeatureCard({ title, subtitle, icon, variant = 'dashboard', onPress }: FeatureCardProps) {
  const style = variantStyleMap[variant];
  const iconBoxSize = variant === 'compact' ? 36 : 40;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [style, { opacity: pressed ? 0.94 : 1 }]}>
      <View
        style={{
          width: iconBoxSize,
          height: iconBoxSize,
          borderRadius: variant === 'compact' ? radius.md : radius.lg,
          backgroundColor: colors.primary.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={variant === 'compact' ? 20 : 22} color={colors.primary.DEFAULT} />
      </View>
      <View>
        <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#64748b">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
