import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function ClientToggleRow() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4], borderRadius: 20, backgroundColor: '#ebe7e4', padding: spacing[4] }}>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
          Allow Sub-communities
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          Enable creation of nested guild-style departments within this client&apos;s workspace.
        </Text>
      </View>
      <View style={{ width: 56, height: 28, borderRadius: 999, backgroundColor: '#603f33', padding: 4 }}>
        <View style={{ width: 20, height: 20, borderRadius: 999, backgroundColor: '#ffffff' }} />
      </View>
    </View>
  );
}
