import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, AppHeader, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminDashboardManagementGrid({
  items,
  onItemPress,
}: {
  items: readonly { title: string; subtitle: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; highlight?: boolean; onPress?: () => void }[];
  onItemPress?: (item: { title: string; subtitle: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; highlight?: boolean; onPress?: () => void }) => void;
}) {
  const rows: typeof items[] = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2) as typeof items);
  }

  return (
    <View style={{ gap: spacing[3], width: '100%' }}>
      {rows.map((row, rowIndex) => (
        <View key={`admin-mgmt-row-${rowIndex}`} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          {row.map((item) => (
            <TouchableOpacity
              key={item.title}
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => onItemPress?.(item)}
              style={{
                width: '48%',
                flexBasis: '48%',
                maxWidth: '48%',
                flexGrow: 0,
                flexShrink: 0,
                flexDirection: 'column',
                padding: spacing[4],
                backgroundColor: colors.background.surface,
                borderWidth: item.highlight ? 2 : 1,
                borderColor: item.highlight ? colors.primary.DEFAULT : colors.border.light,
                borderRadius: radius.xl,
                ...shadows.sm,
              }}>
              <View style={{ width: 32, height: 32, borderRadius: radius.lg, backgroundColor: item.highlight ? colors.primary.DEFAULT : colors.background.elevated, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] }}>
                <MaterialIcons name={item.icon} size={18} color={item.highlight ? colors.text.inverse : colors.primary.DEFAULT} />
              </View>
              {item.highlight ? <View style={{ position: 'absolute', top: spacing[4], right: spacing[4], width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} /> : null}
              <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, lineHeight: 18 }}>
                {item.title}
              </Text>
              <Text variant="caption" style={{ color: '#64748b', fontFamily: item.highlight ? typography.fontFamily.bold : typography.fontFamily.medium, marginTop: 2, fontSize: 12, lineHeight: 16 }}>
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
          {row.length === 1 ? <View style={{ width: '48%', flexBasis: '48%', maxWidth: '48%', flexGrow: 0, flexShrink: 0 }} /> : null}
        </View>
      ))}
    </View>
  );
}
