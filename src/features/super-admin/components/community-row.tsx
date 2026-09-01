import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

type IconName = keyof typeof MaterialIcons.glyphMap;

export function CommunityRow({
  name,
  users,
  status,
  icon,
}: {
  name: string;
  users: string;
  status: string;
  icon: IconName;
}) {
  return (
    <View style={{ borderRadius: 20, backgroundColor: '#ffffff', padding: spacing[5], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(212,195,190,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={20} color={colors.primary.DEFAULT} />
        </View>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
          {name}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Users
        </Text>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {users}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Status
        </Text>
        <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: '#166534', backgroundColor: '#dcfce7', paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 999 }}>
          {status}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons name="settings-input-component" size={22} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85}>
          <MaterialIcons name="open-in-new" size={22} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
