import { View } from 'react-native';

import { Text } from '@/src/components';

import { colors } from '@/src/theme';

export function AdminRoleTextBlock({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <View>
      <Text style={{ color: colors.text.primary, fontSize: small ? 12 : 18, fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}
