import { View } from 'react-native';

import { Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { colors, typography } from '@/src/theme';

export function ProfileDetailRow({ label, value, large }: { label: string; value: string; large?: boolean }) {
  const { language } = useAppPreferences();

  return (
    <View style={{ gap: 4, flex: 1 }}>
      <Text
        variant="caption"
        color={colors.text.muted}
        style={{
          fontFamily: typography.fontFamily.bold,
          textTransform: language === 'gu' ? 'none' : 'uppercase',
          letterSpacing: language === 'gu' ? 0 : 1,
        }}>
        {label}
      </Text>
      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.medium, fontSize: large ? 18 : 16 }}>
        {value}
      </Text>
    </View>
  );
}
