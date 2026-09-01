import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

type IconName = keyof typeof MaterialIcons.glyphMap;

export function CommunityCard({
  title,
  users,
  status,
  icon,
  muted = false,
}: {
  title: string;
  users: string;
  status: string;
  icon: IconName;
  muted?: boolean;
}) {
  return (
    <View style={{ borderRadius: 24, backgroundColor: '#ffffff', opacity: muted ? 0.6 : 1, padding: spacing[5], borderWidth: 1, borderColor: 'rgba(242,120,13,0.04)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(212,195,190,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {status}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
            {users}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            users
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[3], marginTop: spacing[4] }}>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.2)' }}>
          <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
            {muted ? 'Reactivate' : 'Edit Guild'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ borderBottomWidth: 1, borderBottomColor: muted ? 'transparent' : 'rgba(242,120,13,0.2)' }}>
          <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: muted ? colors.text.muted : '#b91c1c' }}>
            {muted ? 'Settings' : 'Inactivate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
