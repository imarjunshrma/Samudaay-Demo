import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function SubscriptionCard() {
  return (
    <View style={{ borderRadius: 24, backgroundColor: colors.primary.DEFAULT, padding: spacing[5], overflow: 'hidden' }}>
      <View style={{ position: 'absolute', right: -48, top: -48, width: 180, height: 180, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)' }} />
      <Text variant="caption" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
        Active Subscription
      </Text>
      <Text variant="h3" style={{ color: '#ffffff', marginTop: spacing[4], fontFamily: typography.fontFamily.bold, fontStyle: 'italic' }}>
        Enterprise Tallow
      </Text>
      <View style={{ gap: spacing[3], marginTop: spacing[4] }}>
        {[
          ['Created', 'Jan 12, 2024'],
          ['Last Configured', '2 hours ago'],
          ['Managed By', 'Julian Vane'],
        ].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)', paddingBottom: spacing[2] }}>
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {label}
            </Text>
            <Text variant="caption" style={{ color: '#ffffff', fontFamily: typography.fontFamily.medium }}>
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
