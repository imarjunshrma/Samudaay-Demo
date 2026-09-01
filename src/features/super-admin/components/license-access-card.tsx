import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

import { ClientToggleRow } from './client-toggle-row';

export function LicenseAccessCard() {
  return (
    <View style={{ borderRadius: 24, backgroundColor: '#f7f3f0', padding: spacing[5], gap: spacing[5] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <MaterialIcons name="verified-user" size={20} color={colors.primary.DEFAULT} />
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          License & Access
        </Text>
      </View>
      <View style={{ gap: spacing[4] }}>
        <View style={{ gap: spacing[2] }}>
          <FormLabel uppercase>License Type</FormLabel>
          <TextField
            value="Artisan Studio (Pro)"
            onChangeText={() => undefined}
            variant="registration"
            labelVariant="default"
            rightIcon={<MaterialIcons name="expand-more" size={20} color="#94a3b8" />}
          />
        </View>
        <View style={{ gap: spacing[2] }}>
          <FormLabel uppercase>Max User Count</FormLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <TextField value="24" onChangeText={() => undefined} variant="registration" labelVariant="default" />
            </View>
            <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: '#d97706', textTransform: 'uppercase', letterSpacing: 1 }}>
              Seats Left: 4
            </Text>
          </View>
        </View>
      </View>
      <ClientToggleRow />
    </View>
  );
}
