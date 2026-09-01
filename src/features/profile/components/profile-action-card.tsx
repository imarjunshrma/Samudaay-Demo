import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function ProfileActionCard({
  icon,
  iconBackground,
  iconColor,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconBackground: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[6],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
        <View
          style={{
            width: 48,
            height: 48,
            flexShrink: 0,
            borderRadius: radius.full,
            backgroundColor: iconBackground,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="label" color={colors.text.primary} numberOfLines={1} style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="body" color={colors.text.secondary} style={{ fontSize: 14, lineHeight: 20, flexShrink: 1 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.primary.DEFAULT} style={{ flexShrink: 0 }} />
    </Pressable>
  );
}
