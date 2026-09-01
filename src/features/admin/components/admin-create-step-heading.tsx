import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

export function AdminCreateStepHeading({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
              {step}
            </Text>
          </View>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: typography.fontFamily.bold }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
