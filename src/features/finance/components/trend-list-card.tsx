import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TrendListCard({
  title,
  items,
}: {
  title: string;
  items: readonly (readonly [string, string, `${number}%`, string])[];
}) {
  return (
    <Card variant="elevated" padding="lg">
      <View style={{ gap: spacing[4] }}>
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        {items.map(([label, value, width, color]) => (
          <View key={label} style={{ gap: spacing[2] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                {label}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {value}
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 999, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
              <View style={{ width, height: '100%', borderRadius: 999, backgroundColor: color }} />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
