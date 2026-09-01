import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminFormStack({
  fields,
  submitLabel,
}: {
  fields: readonly [string, string][];
  submitLabel: string;
}) {
  return (
    <View style={{ gap: spacing[5] }}>
      <View style={{ gap: spacing[4] }}>
        {fields.map(([label, placeholder]) => (
          <TextField key={label} label={label} placeholder={placeholder} />
        ))}
      </View>
      <Button fullWidth>{submitLabel}</Button>
    </View>
  );
}
