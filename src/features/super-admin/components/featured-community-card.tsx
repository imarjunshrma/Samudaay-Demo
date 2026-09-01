import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export function FeaturedCommunityCard() {
  return (
    <View style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[6], borderWidth: 1, borderColor: 'rgba(242,120,13,0.04)', position: 'relative', overflow: 'hidden' }}>
      <View style={{ position: 'absolute', right: -64, top: -64, width: 128, height: 128, borderRadius: 999, backgroundColor: 'rgba(242,120,13,0.04)' }} />
      <View style={{ gap: spacing[4], marginBottom: spacing[6] }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[4] }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.primary.subtle, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="token" size={28} color={colors.primary.DEFAULT} />
          </View>
          <View style={{ flex: 1, gap: spacing[1] }}>
            <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
              Stitch & Sole Collective
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#14b8a6' }} />
              <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, color: '#0f766e', textTransform: 'uppercase', letterSpacing: 1 }}>
                Active Community
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end' }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons name="edit" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85}>
            <MaterialIcons name="block" size={20} color="#b91c1c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4], borderTopWidth: 1, borderTopColor: 'rgba(212,195,190,0.12)', paddingTop: spacing[6] }}>
        <View style={{ width: '48%' }}>
          <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Artisans
          </Text>
          <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
            1,284
          </Text>
        </View>
        <View style={{ width: '48%' }}>
          <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Last Sync
          </Text>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            2h ago
          </Text>
        </View>
        <View style={{ width: '48%' }}>
          <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Tier
          </Text>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: '#d97706' }}>
            Foundry Pro
          </Text>
        </View>
      </View>
    </View>
  );
}
