import { ScrollView, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';

export function TransactionManagementFilterBar() {
  const filters = [
    { icon: 'location-on', label: 'All Cities' },
    { icon: 'category', label: 'All Types' },
    { icon: 'calendar-today', label: 'Last 30 Days' },
  ] as const;

  return (
    <View style={{ gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <MaterialIcons name="filter-list" size={18} color={colors.text.primary} />
        <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
          Filters
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], paddingBottom: spacing[1] }}>
        {filters.map((filter) => (
          <View
            key={filter.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2],
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
              backgroundColor: colors.background.surface,
            }}>
            <MaterialIcons name={filter.icon as never} size={18} color={colors.primary.DEFAULT} />
            <Text variant="body" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
              {filter.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
