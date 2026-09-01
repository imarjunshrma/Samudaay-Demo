import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminCreateToggleRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4], borderRadius: 20, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: '#ffffff', padding: spacing[4] }}>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          {description}
        </Text>
      </View>
      <View style={{ width: 52, height: 32, borderRadius: 999, backgroundColor: colors.primary.muted, padding: 4 }}>
        <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: '#ffffff' }} />
      </View>
    </View>
  );
}
