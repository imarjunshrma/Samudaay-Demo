import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function DonationListItem({ amount, meta, onDownloadPress }: { amount: string; meta: string; onDownloadPress?: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            backgroundColor: colors.primary.muted ?? 'rgba(242,120,13,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="history-edu" size={20} color={colors.primary.DEFAULT} />
        </View>
        <View>
          <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
            {amount}
          </Text>
          <Text variant="caption" color="#64748b">
            {meta}
          </Text>
        </View>
      </View>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.9} onPress={onDownloadPress} style={{ padding: spacing[2], borderRadius: radius.full }}>
        <MaterialIcons name="picture-as-pdf" size={22} color={colors.primary.DEFAULT} />
      </TouchableOpacity>
    </View>
  );
}
