import type { ComponentProps } from 'react';

import { ImageBackground, Pressable, ScrollView, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons } from '@expo/vector-icons';

import { Card, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function TransactionManagementTopBar({
  onBackPress,
  onSearchPress,
  onDownloadPress,
}: {
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onDownloadPress?: () => void;
}) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border.light, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing[4], gap: spacing[2] }}>
        <Pressable
          accessibilityRole="button"
          onPress={onBackPress}
          style={{ width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text variant="h5" style={{ flex: 1, color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
          All Transactions
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <Pressable
            accessibilityRole="button"
            onPress={onSearchPress}
            style={{ width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="search" size={22} color={colors.text.primary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDownloadPress}
            style={{ width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="download" size={22} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
