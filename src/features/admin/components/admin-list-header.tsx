import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminListHeader({ title }: { title: string }) {
  return (
    <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
      {title}
    </Text>
  );
}
