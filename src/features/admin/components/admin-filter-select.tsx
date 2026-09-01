import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminFilterSelect({
  value,
  tags,
}: {
  value: string;
  tags: string[];
}) {
  return (
    <SelectField
      variant="pill"
      value={value}
      options={tags.map((tag) => ({ label: tag, value: tag }))}
    />
  );
}
