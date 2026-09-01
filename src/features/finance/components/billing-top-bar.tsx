import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function BillingTopBar({
  onMenuPress,
}: {
  onMenuPress?: () => void;
}) {
  return (
    <View style={{ backgroundColor: 'rgba(253,249,246,0.92)', borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingVertical: spacing[4], maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Pressable accessibilityRole="button" onPress={onMenuPress} style={{ padding: spacing[1], borderRadius: radius.full }}>
            <MaterialIcons name="grid-view" size={24} color={colors.text.primary} />
          </Pressable>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontStyle: 'italic' }}>
            The Digital Atelier
          </Text>
        </View>
        <View style={{ width: 40, height: 40, borderRadius: radius.full, overflow: 'hidden', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="account-circle" size={28} color={colors.primary.DEFAULT} />
        </View>
      </View>
    </View>
  );
}
