import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function MatrimonyAnalyticsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[5],
            paddingBottom: spacing[4],
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: colors.border.muted,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View style={{ width: 44, height: 44, borderRadius: radius.lg, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="favorite" size={22} color={colors.primary.DEFAULT} />
            </View>
            <View>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                Matrimony Analytics
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                Subscription and profile activity overview
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: spacing[5], gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
            {[
              ['Active Profiles', '12,450', '#f2780d'],
              ['New This Month', '840', '#7c3aed'],
              ['Subscription Revenue', '₹4.2L', '#059669'],
            ].map(([title, value, accent]) => (
              <View key={title} style={{ flex: 1, minWidth: '47%', borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
                <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  {title}
                </Text>
                <Text variant="h4" style={{ marginTop: spacing[2], color: accent, fontFamily: typography.fontFamily.extrabold }}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted, gap: spacing[4], ...shadows.sm }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Revenue Analytics
            </Text>
            <View style={{ height: 180, flexDirection: 'row', alignItems: 'flex-end', gap: spacing[3] }}>
              {[48, 64, 72, 58, 84, 96, 110].map((height, index) => (
                <View key={index} style={{ flex: 1, alignItems: 'center', gap: spacing[2] }}>
                  <View style={{ width: '100%', height, borderRadius: radius.md, backgroundColor: index % 2 === 0 ? '#f2780d' : '#fed7aa' }} />
                  <Text variant="caption" color={colors.text.muted}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
