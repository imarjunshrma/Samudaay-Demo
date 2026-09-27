import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function OfflineDonationCard({ onAddRecord }: { onAddRecord?: () => void }) {
  return (
    <View
      style={{
        backgroundColor: '#f1f5f9',
        borderRadius: radius.xl,
        padding: spacing[4],
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#cbd5e1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.full,
            backgroundColor: '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="post-add" size={24} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
            Record Offline Donation
          </Text>
          <Text variant="caption" color="#64748b">
            Log manual cash or check donations
          </Text>
        </View>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        onPress={onAddRecord}
        style={{
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
          ...shadows.sm,
        }}>
        <Text variant="caption" color="#334155" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
          Add Record
        </Text>
      </TouchableOpacity>
    </View>
  );
}
