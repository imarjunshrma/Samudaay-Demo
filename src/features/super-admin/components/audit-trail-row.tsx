import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function AuditTrailRow() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], padding: spacing[4], borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,119,6,0.12)', backgroundColor: 'rgba(217,119,6,0.04)' }}>
      <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: '#d97706', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="history" size={18} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: '#d97706' }}>
          Audit Trail
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          View all historical configuration changes for this client.
        </Text>
      </View>
      <MaterialIcons name="arrow-forward" size={18} color="rgba(217,119,6,0.4)" />
    </View>
  );
}
