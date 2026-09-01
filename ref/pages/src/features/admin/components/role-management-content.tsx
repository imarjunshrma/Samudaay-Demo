import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function RoleManagementContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Role Management & Permissions
        </Text>
        {[
          ['Super Admin', 'Full platform access'],
          ['Community Admin', 'Events, finance, people operations'],
          ['Volunteer', 'Attendance, registrations, announcements'],
        ].map(([name, desc], index) => (
          <View key={name} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[3], ...shadows.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                {name}
              </Text>
              <View style={{ borderRadius: radius.full, backgroundColor: index === 0 ? '#2f1d16' : '#fff7ed', paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                <Text variant="caption" color={index === 0 ? '#ffffff' : colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {index === 0 ? 'System' : 'Custom'}
                </Text>
              </View>
            </View>
            <Text variant="caption" color={colors.text.muted}>
              {desc}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
              {['Users', 'Events', 'Reports', 'Notifications'].slice(0, index === 2 ? 2 : 4).map((tag) => (
                <View key={tag} style={{ borderRadius: radius.full, backgroundColor: '#f8fafc', paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                  <Text variant="caption" color={colors.text.secondary}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
