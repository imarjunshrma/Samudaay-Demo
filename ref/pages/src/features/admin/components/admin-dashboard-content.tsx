import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function AdminMetric({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  accent: string;
}) {
  return (
    <View style={{ flex: 1, minWidth: '47%', borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
      <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: accent, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[3] }}>
        <MaterialIcons name={icon} size={20} color="#ffffff" />
      </View>
      <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Text>
      <Text variant="h4" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.extrabold }}>
        {value}
      </Text>
    </View>
  );
}

export function AdminDashboardContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f2eb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[6], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" color="#8b5e3c" style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Admin Console
          </Text>
          <Text variant="h1" style={{ fontSize: 34, lineHeight: 40, fontFamily: 'serif', color: '#2f1d16' }}>
            Community Operations Dashboard
          </Text>
        </View>

        <View style={{ borderRadius: 32, backgroundColor: '#2f1d16', padding: spacing[6], gap: spacing[3] }}>
          <Text variant="caption" color="rgba(255,255,255,0.7)" style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Today&apos;s Overview
          </Text>
          <Text variant="h1" color="#ffffff" style={{ fontSize: 40, lineHeight: 44, fontFamily: typography.fontFamily.extrabold }}>
            1,284
          </Text>
          <Text variant="body" color="rgba(255,255,255,0.82)">
            Member actions, approvals, donations, and operational tasks across the network.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
          <AdminMetric title="Pending KYC" value="24" icon="fact-check" accent="#f2780d" />
          <AdminMetric title="Active Events" value="7" icon="event" accent="#0f766e" />
          <AdminMetric title="New Donations" value="₹84K" icon="volunteer-activism" accent="#7c3aed" />
          <AdminMetric title="Support Tickets" value="12" icon="support-agent" accent="#ea580c" />
        </View>

        <View style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[4], ...shadows.sm }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Quick Actions
          </Text>
          {[
            ['Review pending KYC profiles', 'fact-check'],
            ['Publish event announcement', 'campaign'],
            ['Approve expense requests', 'receipt-long'],
            ['Manage member directory', 'groups'],
          ].map(([label, icon]) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <View style={{ width: 36, height: 36, borderRadius: radius.lg, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name={icon as React.ComponentProps<typeof MaterialIcons>['name']} size={18} color={colors.primary.DEFAULT} />
                </View>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                  {label}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
