import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminTagCard({
  title,
  meta,
  kind,
}: {
  title: string;
  meta: string;
  kind: string;
}) {
  return (
    <Card variant="elevated" padding="lg">
      <View style={{ gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text
            variant="caption"
            color={kind === 'System' ? '#ffffff' : colors.primary.DEFAULT}
            style={{
              backgroundColor: kind === 'System' ? '#2f1d16' : '#fff7ed',
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1],
              borderRadius: 999,
              fontFamily: typography.fontFamily.bold,
            }}>
            {kind}
          </Text>
        </View>
        <Text variant="caption" color={colors.text.muted}>
          {meta}
        </Text>
      </View>
    </Card>
  );
}
