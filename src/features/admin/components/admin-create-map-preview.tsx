import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminCreateMapPreview({
  imageUri,
}: {
  imageUri: string;
}) {
  return (
    <View style={{ height: 160, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.borderLight }}>
      <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.28)' }]} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: 12, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.surface, paddingHorizontal: spacing[3], paddingVertical: spacing[2], ...({ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 } as const) }}>
          <MaterialIcons name="location-on" size={18} color={colors.primary.DEFAULT} />
          <Text variant="caption" style={{ fontFamily: typography.fontFamily.medium }}>
            Verify on Map
          </Text>
        </View>
      </View>
    </View>
  );
}
