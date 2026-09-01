import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ClientRosterContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Client Management
        </Text>
        {[
          ['Vadodara Community Trust', 'Active • 4 admins • 18,200 members'],
          ['Ahmedabad Welfare Samaj', 'Active • 3 admins • 12,480 members'],
          ['Surat Artisan Guild', 'Trial • 1 admin • 3,920 members'],
        ].map(([name, meta]) => (
          <View key={name} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[2], ...shadows.sm }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {name}
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              {meta}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
