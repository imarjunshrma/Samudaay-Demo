import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminCreateRadioCard({
  title,
  description,
  selected = false,
}: {
  title: string;
  description: string;
  selected?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: 20, borderWidth: 2, borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight, backgroundColor: selected ? colors.primary.subtle : '#ffffff', padding: spacing[5] }}>
      <View style={{ width: 24, height: 24, borderRadius: 999, borderWidth: 2, borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: selected ? colors.primary.DEFAULT : 'transparent' }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          {description}
        </Text>
      </View>
    </View>
  );
}
