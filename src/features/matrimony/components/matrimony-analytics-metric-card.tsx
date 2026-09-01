import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function MatrimonyAnalyticsMetricCard({
  title,
  value,
  icon,
  trend,
  trendTone = colors.status.success,
  caption,
}: {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  trend: string;
  trendTone?: string;
  caption: string;
}) {
  return (
    <View style={{ gap: spacing[2], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: '#ffffff', padding: spacing[4], shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.medium }}>
          {title}
        </Text>
        <View style={{ width: 28, height: 28, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={16} color={colors.primary.DEFAULT} />
        </View>
      </View>
      <Text variant="h2" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, letterSpacing: -0.3 }}>
        {value}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], marginTop: spacing[1] }}>
        <MaterialIcons name="trending-up" size={14} color={trendTone} />
        <Text variant="caption" style={{ color: trendTone, fontFamily: typography.fontFamily.semibold }}>
          {trend}
          <Text style={{ color: colors.text.disabled, fontFamily: typography.fontFamily.regular }}> {caption}</Text>
        </Text>
      </View>
    </View>
  );
}
