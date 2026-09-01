import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ManageDirectoryContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Manage Member Directory
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.full, backgroundColor: '#ffffff', paddingHorizontal: spacing[4], borderWidth: 1, borderColor: colors.border.DEFAULT }}>
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput placeholder="Search member, city, ID" placeholderTextColor="#94a3b8" style={{ flex: 1, paddingVertical: spacing[4], fontFamily: typography.fontFamily.medium }} />
        </View>
        {[
          ['Rajesh Kumar', 'IC-2024-8839 • Vadodara'],
          ['Poonam Solanki', 'IC-2023-4182 • Ahmedabad'],
          ['Nitin Parmar', 'IC-2024-9921 • Surat'],
        ].map(([name, meta]) => (
          <View key={name} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[3], ...shadows.sm }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {name}
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              {meta}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                Edit
              </Text>
              <Text variant="caption" color="#b91c1c" style={{ fontFamily: typography.fontFamily.bold }}>
                Suspend
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
