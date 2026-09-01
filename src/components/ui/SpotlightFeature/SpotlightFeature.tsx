import { Image, Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type SpotlightFeatureVariant = 'publication' | 'promo' | 'ad';

export interface SpotlightFeatureProps {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  ctaLabel?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  variant?: SpotlightFeatureVariant;
  onPress?: () => void;
}

export function SpotlightFeature({
  title,
  subtitle,
  description,
  image,
  ctaLabel,
  icon = 'auto-awesome',
  variant = 'publication',
  onPress,
}: SpotlightFeatureProps) {
  if (variant === 'promo') {
    return (
      <View style={{ borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, padding: spacing[5], gap: spacing[2] }}>
        <Text variant="caption" color="rgba(255,255,255,0.68)" style={{ letterSpacing: 1.1, textTransform: 'uppercase' }}>
          {subtitle}
        </Text>
        <Text variant="h5" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="rgba(255,255,255,0.78)">
          {description}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: spacing[4], padding: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: 'rgba(242,120,13,0.05)' }}>
      <View style={{ width: 96, height: 128, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }}>
        {image ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : <Icon name={icon} size={36} color={colors.primary.DEFAULT} />}
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
          {subtitle}
        </Text>
        <Text variant="bodyLg" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontSize: 12, lineHeight: 18 }}>
          {description}
        </Text>
        {ctaLabel ? (
          <Pressable onPress={onPress} style={{ marginTop: spacing[3], alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing[2], backgroundColor: variant === 'ad' ? 'rgba(242,120,13,0.1)' : colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: radius.lg }}>
            <Icon name={variant === 'ad' ? 'campaign' : 'download'} size={16} color={variant === 'ad' ? colors.primary.DEFAULT : '#fff'} />
            <Text variant="caption" color={variant === 'ad' ? colors.primary.DEFAULT : '#fff'} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
              {ctaLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
