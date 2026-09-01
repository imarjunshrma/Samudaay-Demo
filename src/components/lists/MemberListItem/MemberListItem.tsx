import type { ComponentProps } from 'react';
import { Image, Linking, Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type MemberListItemVariant = 'directory' | 'trustee' | 'chat';

export function MemberListItem({
  name,
  subtitle,
  avatarUrl,
  location,
  phone,
  online,
  actionLabel,
  actionIcon,
  actionTone = 'primary',
  onPress,
  onActionPress,
  variant = 'directory',
  selected = false,
}: {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  location?: string;
  phone?: string | null;
  online?: boolean;
  actionLabel?: string;
  actionIcon?: ComponentProps<typeof Icon>['name'];
  actionTone?: 'primary' | 'success';
  onPress?: () => void;
  onActionPress?: () => void;
  variant?: MemberListItemVariant;
  selected?: boolean;
}) {
  if (variant === 'chat') {
    const showActionBadge = Boolean(actionLabel);
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[4], paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderRadius: radius.xl }}>
        <View style={{ flexDirection: 'row', gap: spacing[4], flex: 1 }}>
          <Image
            source={{ uri: avatarUrl }}
            resizeMode="cover"
            style={{
              width: 60,
              height: 60,
              borderRadius: radius.full,
              borderWidth: 1.5,
              borderColor: selected ? colors.primary.DEFAULT : colors.primary.border,
            }}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: selected ? colors.primary.DEFAULT : colors.text.primary }}>
                {name}
              </Text>
              {location ? <Text variant="caption" color="#64748b" style={{ fontSize: 12 }}>{location}</Text> : null}
            </View>
            <Text variant="caption" color="#64748b" style={{ marginTop: 2, fontSize: 14 }}>
              {subtitle}
            </Text>
          </View>
        </View>
        {showActionBadge ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                {actionLabel}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  const isTrustee = variant === 'trustee';
  const actionBackgroundColor = actionTone === 'success' ? colors.status.successLight : colors.primary.DEFAULT;
  const actionTextColor = actionTone === 'success' ? colors.status.success : '#fff';
  const dialPhoneNumber = phone?.replace(/[^\d+#*]/g, '') ?? '';
  const handleDefaultActionPress = dialPhoneNumber
    ? () => {
        void Linking.openURL(`tel:${dialPhoneNumber}`);
      }
    : undefined;
  const resolvedActionPress = onActionPress ?? handleDefaultActionPress;
  const cardStyle = {
    width: '100%' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing[4],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: isTrustee ? 'rgba(242,120,13,0.05)' : '#f1f5f9',
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing[4],
    paddingVertical: isTrustee ? spacing[5] : spacing[4],
  };
  const content = (
    <>
      <View style={{ width: 64, height: 64, position: 'relative' }}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(242,120,13,0.2)' }} />
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: colors.primary.border, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="person" size={32} color={colors.primary.DEFAULT} />
          </View>
        )}
        {online ? <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: radius.full, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#ffffff' }} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text variant={isTrustee ? 'bodyLg' : 'body'} style={{ fontFamily: typography.fontFamily.bold }}>
          {name}
        </Text>
        {location ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="location-on" size={12} color="#64748b" />
            <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
              {location}
            </Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text
            variant="caption"
            color={colors.primary.DEFAULT}
            style={{ marginTop: 4, fontFamily: typography.fontFamily.semibold, fontSize: isTrustee ? 14 : 12 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      {isTrustee ? (
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            resolvedActionPress?.();
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: !resolvedActionPress }}
          disabled={!resolvedActionPress}
          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.lg, backgroundColor: actionBackgroundColor, opacity: resolvedActionPress ? 1 : 0.55, paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
          {actionIcon ? <Icon name={actionIcon} size={16} color={actionTextColor} /> : null}
          <Text variant="caption" color={actionTextColor} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            {actionLabel ?? 'Contact'}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            resolvedActionPress?.();
          }}
          accessibilityRole="button"
          accessibilityState={{ disabled: !resolvedActionPress }}
          disabled={!resolvedActionPress}
          style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', opacity: resolvedActionPress ? 1 : 0.55, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="call" size={20} color={colors.primary.DEFAULT} />
        </Pressable>
      )}
    </>
  );

  if (!onPress) {
    return <View style={cardStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        cardStyle,
        { opacity: pressed ? 0.96 : 1 },
      ]}>
      {content}
    </Pressable>
  );
}
