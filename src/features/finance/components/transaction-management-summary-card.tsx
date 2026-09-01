import { View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionManagementSummaryCard({
  title = 'Community Ledger',
  subtitle = 'Financial year transaction visibility',
  badge = 'Admin',
}: {
  title?: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.light, padding: spacing[4], gap: spacing[4], ...shadows.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: colors.primary.DEFAULT, backgroundColor: colors.background.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="person" size={28} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
            <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {title}
            </Text>
            <Text style={{ backgroundColor: colors.primary.muted, color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: radius.full }}>
              {badge}
            </Text>
          </View>
          <Text variant="body" style={{ color: colors.text.secondary, marginTop: spacing[1] }}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
