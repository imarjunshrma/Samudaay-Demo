import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function RosterHero() {
  return (
    <View style={{ gap: spacing[4] }}>
      <View style={{ gap: spacing[4] }}>
        <Text variant="caption" style={{ color: '#d97706', fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2 }}>
          Registry
        </Text>
        <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
          Master Directory of Client Guilds
        </Text>
        <Text variant="bodyLg" color={colors.text.muted}>
          Oversee the artisanal communities flourishing within the ecosystem. Monitor scale, status, and integrity across the collective.
        </Text>
      </View>
    </View>
  );
}
