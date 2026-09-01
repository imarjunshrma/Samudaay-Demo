import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, shadows, spacing, typography } from '@/src/theme';
import { DashboardHeaderActions } from './dashboard-header-actions';

export function UnifiedDashboardTopBar({
  title,
  onNotificationsPress,
  onMenuPress,
}: {
  title: string;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
}) {
  return (
    <View style={{ backgroundColor: 'rgba(253,249,246,0.92)', borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, ...shadows.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[6], paddingVertical: spacing[4], maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onMenuPress}>
            <MaterialIcons name="menu" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
        </View>
        <DashboardHeaderActions onNotificationsPress={onNotificationsPress} />
      </View>
    </View>
  );
}
