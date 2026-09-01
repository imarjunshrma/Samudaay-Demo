import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, Button, SelectField, Text, TextField } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminExpenseTopBar({
  onBackPress,
  onSearchPress,
  onNotificationsPress,
}: {
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
}) {
  const t = useTranslations('admin.manage-expenses');
  return (
    <View style={{ backgroundColor: colors.background.DEFAULT, borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingVertical: spacing[3], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onBackPress} style={{ width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <Text style={{ flex: 1, marginLeft: spacing[2], color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
        {t('title.list')}
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onSearchPress} style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="search" size={20} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onNotificationsPress} style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="notifications" size={20} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
