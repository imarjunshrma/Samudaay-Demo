import type { ReactNode } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export function ManualDonationSectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  children: ReactNode;
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <MaterialIcons name={icon} size={20} color={colors.primary.DEFAULT} />
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
