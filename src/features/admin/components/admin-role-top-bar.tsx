import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminRoleTopBar({
  onBackPress,
  onSearchPress,
  onFilterPress,
}: {
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
}) {
  return (
    <View style={{ backgroundColor: 'rgba(248,247,245,0.95)', borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onBackPress} style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={22} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
              Role Management
            </Text>
            <Text style={{ color: colors.text.muted, fontSize: 12 }}>
              Configure community access levels
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onSearchPress} style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="search" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onFilterPress} style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="filter-list" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
