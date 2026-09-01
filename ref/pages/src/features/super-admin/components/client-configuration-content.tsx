import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ClientConfigurationContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Client Configuration
        </Text>
        {[
          ['Brand Theme', 'Orange Classic'],
          ['Member Modules', 'Directory, Events, Matrimony, Education'],
          ['Billing Plan', 'Enterprise Annual'],
          ['Notifications', 'Email + Push Enabled'],
        ].map(([name, value]) => (
          <View key={name} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[2], ...shadows.sm }}>
            <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {name}
            </Text>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {value}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
