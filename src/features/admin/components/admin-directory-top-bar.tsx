import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminDirectoryTopBar({ title, onBackPress, onActionPress, actionIcon = 'admin-panel-settings' }: {
  title: string;
  onBackPress?: () => void;
  onActionPress?: () => void;
  actionIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
}) {
  return (
    <View style={{ backgroundColor: colors.background.DEFAULT, borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4] }}>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onBackPress} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
          {title}
        </Text>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onActionPress} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={actionIcon} size={22} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
