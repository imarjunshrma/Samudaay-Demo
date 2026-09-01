import { View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { spacing, typography } from '@/src/theme';

export type PremiumBannerCardVariant = 'dark' | 'light';

export interface PremiumBannerCardProps {
  eyebrow?: string;
  title: string;
  description: string;
  variant?: PremiumBannerCardVariant;
}

export function PremiumBannerCard({
  eyebrow = 'Premium',
  title,
  description,
  variant = 'dark',
}: PremiumBannerCardProps) {
  const dark = variant === 'dark';

  return (
    <View
      style={{
        borderRadius: 28,
        backgroundColor: dark ? '#2f1d16' : '#ffffff',
        borderWidth: dark ? 0 : 1,
        borderColor: '#e7e5e4',
        padding: spacing[5],
        gap: spacing[2],
      }}>
      <Text
        variant="caption"
        color={dark ? 'rgba(255,255,255,0.68)' : '#f2780d'}
        style={{ letterSpacing: 1.1, textTransform: 'uppercase' }}>
        {eyebrow}
      </Text>
      <Text
        variant="h5"
        color={dark ? '#ffffff' : '#2f1d16'}
        style={{ fontFamily: typography.fontFamily.bold }}>
        {title}
      </Text>
      <Text variant="caption" color={dark ? 'rgba(255,255,255,0.78)' : '#504441'}>
        {description}
      </Text>
    </View>
  );
}
