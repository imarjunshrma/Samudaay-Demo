import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdvertisementFormScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Create Advertisement
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
          {[
            ['Campaign Name', 'Summer Donation Drive'],
            ['Placement', 'Dashboard Hero / Popup'],
            ['CTA Label', 'Donate Now'],
            ['Target URL', 'https://example.com'],
          ].map(([label, placeholder]) => (
            <View key={label} style={{ gap: spacing[2] }}>
              <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {label}
              </Text>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                style={{
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border.DEFAULT,
                  backgroundColor: '#ffffff',
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[4],
                  fontFamily: typography.fontFamily.medium,
                }}
              />
            </View>
          ))}
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Save Advertisement
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
