import { Image, Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type ProfileCardVariant = 'member' | 'trustee' | 'family';

export interface ProfileCardProps {
  name: string;
  location?: string;
  role: string;
  image?: string;
  online?: boolean;
  badge?: string;
  actionLabel?: string;
  variant?: ProfileCardVariant;
}

export function ProfileCard({
  name,
  location,
  role,
  image,
  online,
  badge,
  actionLabel,
  variant = 'member',
}: ProfileCardProps) {
  const isTrustee = variant === 'trustee';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: isTrustee ? 'rgba(24,168,117,0.05)' : '#f1f5f9', backgroundColor: '#ffffff', paddingHorizontal: spacing[4], paddingVertical: isTrustee ? spacing[5] : spacing[4] }}>
      <View style={{ width: 64, height: 64, position: 'relative' }}>
        {image ? (
          <Image source={{ uri: image }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(24,168,117,0.2)' }} />
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: colors.primary.border, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="person" size={32} color={colors.primary.DEFAULT} />
          </View>
        )}
        {online ? <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: radius.full, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#ffffff' }} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant={isTrustee ? 'bodyLg' : 'body'} color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
          {name}
        </Text>
        {isTrustee ? (
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14, marginBottom: 4 }}>
            {role}
          </Text>
        ) : null}
        {location ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="location-on" size={12} color="#64748b" />
            <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
              {location}
            </Text>
          </View>
        ) : null}
        <Text variant="caption" color={isTrustee ? '#6b7280' : colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.semibold, fontSize: 12 }}>
          {isTrustee ? role : role}
        </Text>
      </View>
      {badge ? (
        <View style={{ borderRadius: radius.md, backgroundColor: 'rgba(24,168,117,0.1)', paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>
            {badge}
          </Text>
        </View>
      ) : actionLabel ? (
        <Pressable style={{ borderRadius: radius.lg, backgroundColor: isTrustee ? colors.primary.DEFAULT : 'rgba(24,168,117,0.1)', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
          <Text variant="caption" color={isTrustee ? '#fff' : colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : (
        <Pressable style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: 'rgba(24,168,117,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="call" size={20} color={colors.primary.DEFAULT} />
        </Pressable>
      )}
    </View>
  );
}
