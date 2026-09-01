import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminAnalyticsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Analytics
          </Text>
          <Text variant="h1" style={{ fontSize: 30, lineHeight: 36, fontFamily: typography.fontFamily.extrabold }}>
            Admin Dashboard Analytics
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
          {[
            ['Active Users', '18,420', '#f2780d'],
            ['Monthly Donations', '₹12.6L', '#0f766e'],
            ['Event Registrations', '4,821', '#7c3aed'],
          ].map(([title, value, color]) => (
            <View key={title} style={{ flex: 1, minWidth: '47%', borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
              <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {title}
              </Text>
              <Text variant="h4" style={{ marginTop: spacing[2], color, fontFamily: typography.fontFamily.extrabold }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[4], ...shadows.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Traffic Trend
            </Text>
            <MaterialIcons name="insights" size={22} color={colors.primary.DEFAULT} />
          </View>
          <View style={{ height: 180, flexDirection: 'row', alignItems: 'flex-end', gap: spacing[3] }}>
            {[60, 92, 74, 118, 86, 132, 120].map((height, index) => (
              <View key={index} style={{ flex: 1, alignItems: 'center', gap: spacing[2] }}>
                <View style={{ width: '100%', height, borderRadius: radius.md, backgroundColor: index % 2 === 0 ? '#f2780d' : '#fed7aa' }} />
                <Text variant="caption" color={colors.text.muted}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
