import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export function EventAddOnUsageCard({
  icon,
  label,
  value,
  progress,
  footer,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
  progress: number;
  footer: string;
}) {
  return (
    <Card variant="default" padding="md">
      <View style={{ gap: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flex: 1 }}>
            <MaterialIcons name={icon} size={18} color={colors.primary.DEFAULT} />
            <Text variant="caption" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>{label}</Text>
          </View>
          <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>{value}</Text>
        </View>
        <View style={{ width: '100%', height: 8, borderRadius: 999, overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
          <View style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 999, backgroundColor: colors.primary.DEFAULT }} />
        </View>
        <Text variant="caption" color="#94a3b8" style={{ fontFamily: typography.fontFamily.medium, fontSize: 10 }}>{footer}</Text>
      </View>
    </Card>
  );
}
