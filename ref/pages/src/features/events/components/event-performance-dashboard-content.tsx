import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const metrics = [
  { title: 'Total Revenue', value: '₹45,200', delta: '+12.5%' },
  { title: 'Net Profit', value: '₹18,450', delta: '+8.2%' },
] as const;

const addOnStats = [
  { icon: 'restaurant', label: 'Lunches Served', value: '150 / 200', progress: 0.75, footer: '75% OF REGISTERED USERS' },
  { icon: 'handyman', label: 'Tool Kits Distributed', value: '165 / 170', progress: 0.97, footer: '97% OF ATTENDEES' },
  { icon: 'workspace-premium', label: 'Certificates Issued', value: '120 / 170', progress: 0.7, footer: 'CLAIMED BY ATTENDEES' },
] as const;

export function EventPerformanceDashboardContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing[4], backgroundColor: 'rgba(248,247,245,0.95)' }}>
          <Pressable style={{ padding: spacing[2], borderRadius: radius.full }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: spacing[2] }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
              Annual Artisans Meet
            </Text>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium }}>
              Mumbai Chapter • Oct 2023
            </Text>
          </View>
          <Pressable style={{ padding: spacing[2], borderRadius: radius.full }}>
            <MaterialIcons name="share" size={22} color={colors.text.primary} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingBottom: 120 }}>
          <View style={{ marginTop: spacing[4] }}>
            <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              Financial Overview
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              {metrics.map((metric) => (
                <View
                  key={metric.title}
                  style={{
                    flex: 1,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: 'rgba(242,120,13,0.2)',
                    backgroundColor: 'rgba(242,120,13,0.1)',
                    padding: spacing[5],
                  }}>
                  <Text variant="caption" color={colors.text.primary} style={{ fontSize: 14, opacity: 0.8, fontFamily: typography.fontFamily.medium }}>
                    {metric.title}
                  </Text>
                  <Text variant="h3" style={{ marginTop: 4, fontFamily: typography.fontFamily.bold }}>
                    {metric.value}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing[2] }}>
                    <MaterialIcons name="trending-up" size={16} color="#059669" />
                    <Text variant="caption" color="#059669" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                      {metric.delta}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginTop: spacing[8] }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing[4] }}>
              <View>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  Attendance Rate
                </Text>
                <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
                  Actual vs. Registered
                </Text>
              </View>
              <Text variant="h2" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                85%
              </Text>
            </View>
            <View style={{ borderRadius: radius.xl, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff', padding: spacing[6], ...shadows.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 128, gap: spacing[4], marginBottom: spacing[2] }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: '100%', height: '100%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.2)', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text variant="caption" style={{ marginTop: -28, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      200
                    </Text>
                  </View>
                  <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Registered
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: '100%', height: '85%', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: -28, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      170
                    </Text>
                  </View>
                  <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Attended
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: spacing[8] }}>
            <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              Add-on Usage
            </Text>
            <View style={{ gap: spacing[4] }}>
              {addOnStats.map((item) => (
                <View
                  key={item.label}
                  style={{
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    padding: spacing[4],
                    ...shadows.sm,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flex: 1 }}>
                      <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={colors.primary.DEFAULT} />
                      <Text variant="caption" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </View>
                    <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      {item.value}
                    </Text>
                  </View>
                  <View style={{ width: '100%', height: 8, borderRadius: radius.full, overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <View style={{ width: `${item.progress * 100}%`, height: '100%', borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} />
                  </View>
                  <Text variant="caption" color="#94a3b8" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.medium, fontSize: 10 }}>
                    {item.footer}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginTop: spacing[8], marginBottom: spacing[4] }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                borderRadius: radius.xl,
                backgroundColor: colors.primary.DEFAULT,
                paddingVertical: spacing[4],
                ...shadows.lg,
              }}>
              <MaterialIcons name="analytics" size={20} color="#ffffff" />
              <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                View Full Financial Report
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            backgroundColor: colors.background.DEFAULT,
            paddingHorizontal: spacing[6],
            paddingTop: spacing[3],
            paddingBottom: spacing[3],
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { icon: 'dashboard', label: 'Dashboard', active: true },
              { icon: 'calendar-today', label: 'Events', active: false },
              { icon: 'group', label: 'Community', active: false },
              { icon: 'person', label: 'Profile', active: false },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase' }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
