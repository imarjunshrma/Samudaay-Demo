import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, FilterChips, SearchInput, Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminEventsPagination() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing[2], marginTop: spacing[4], marginBottom: spacing[8] }}>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[2], borderRadius: radius.lg }}>
        <MaterialIcons name="chevron-left" size={24} color={colors.text.muted} />
      </TouchableOpacity>
      {['1', '2', '3'].map((page, index) => {
        const active = index === 0;
        return (
          <TouchableOpacity
            key={page}
            accessibilityRole="button"
            activeOpacity={0.85}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
            }}>
            <Text style={{ color: active ? colors.text.inverse : colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {page}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[2], borderRadius: radius.lg }}>
        <MaterialIcons name="chevron-right" size={24} color={colors.text.muted} />
      </TouchableOpacity>
    </View>
  );
}
