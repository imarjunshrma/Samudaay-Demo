import { TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function DashboardCommunityCard({
  title,
  subtitle,
  icon,
  highlight = false,
  width = '100%',
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  highlight?: boolean;
  width?: DimensionValue;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width,
        flexBasis: width,
        maxWidth: width,
        flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        gap: spacing[4],
        ...shadows.sm,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.lg,
          backgroundColor: colors.primary.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          variant="body"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={{ fontFamily: typography.fontFamily.bold, flexShrink: 1 }}>
          {title}
        </Text>
        <Text
          variant="caption"
          numberOfLines={3}
          color="#64748b"
          style={{ marginTop: 2, fontSize: 12, lineHeight: 16, flexShrink: 1 }}>
          {subtitle}
        </Text>
      </View>
      {highlight ? <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} /> : null}
    </TouchableOpacity>
  );
}

export { DashboardCommunityCard };
