import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ManageTrusteesContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Manage Community Trustees
        </Text>
        {[
          ['Harishbhai Patel', 'Chairman • 9 years'],
          ['Urmila Ben Shah', 'Education Trustee • 6 years'],
          ['Suresh Parmar', 'Finance Trustee • 4 years'],
        ].map(([name, meta]) => (
          <View key={name} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...shadows.sm }}>
            <View>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                {name}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {meta}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
