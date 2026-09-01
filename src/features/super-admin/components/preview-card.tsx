import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function PreviewCard() {
  return (
    <View style={{ borderRadius: 24, borderWidth: 1, borderColor: 'rgba(242,120,13,0.08)', backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[4] }}>
      <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
        Real-time Interface Preview
      </Text>
      <View style={{ aspectRatio: 16 / 9, borderRadius: 20, backgroundColor: '#ffffff', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(212,195,190,0.25)' }}>
        <View style={{ height: 16, backgroundColor: colors.primary.DEFAULT }} />
        <View style={{ flex: 1, padding: spacing[4], gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#f3efe8', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#f2780d' }} />
            </View>
            <View style={{ gap: 4 }}>
              <View style={{ width: 96, height: 8, borderRadius: 999, backgroundColor: '#e5e7eb' }} />
              <View style={{ width: 72, height: 6, borderRadius: 999, backgroundColor: '#f3f4f6' }} />
            </View>
          </View>
          <View style={{ flex: 1, borderRadius: 16, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="caption" color={colors.text.muted} style={{ fontStyle: 'italic' }}>
              Dashboard Content Placeholder
            </Text>
          </View>
        </View>
      </View>
      <Text variant="caption" color={colors.text.muted} style={{ fontStyle: 'italic' }}>
        Changes to the palette and logo will propagate across the client&apos;s workspace instantly upon saving.
      </Text>
    </View>
  );
}
