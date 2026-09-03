import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventMetaCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], backgroundColor: colors.background.surface, padding: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight }}>
      <View style={{ width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted ?? 'rgba(24,168,117,0.1)' }}>
        <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>{title}</Text>
        <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>{subtitle}</Text>
      </View>
    </View>
  );
}
