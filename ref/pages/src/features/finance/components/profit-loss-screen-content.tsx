import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function SummaryTile({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 22,
        backgroundColor: '#ffffff',
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border.muted,
        ...shadows.sm,
      }}>
      <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Text>
      <Text variant="h4" style={{ marginTop: spacing[2], color, fontFamily: typography.fontFamily.extrabold }}>
        {value}
      </Text>
    </View>
  );
}

function BreakdownRow({
  label,
  amount,
  tint,
}: {
  label: string;
  amount: string;
  tint: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: radius.xl,
        backgroundColor: tint,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
      }}>
      <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
        {label}
      </Text>
      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
        {amount}
      </Text>
    </View>
  );
}

export function ProfitLossScreenContent({
  variant = 'yearly',
}: {
  variant?: 'yearly' | 'event';
}) {
  if (variant === 'event') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
          <View style={{ gap: spacing[2] }}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Event P&L
            </Text>
            <Text variant="h1" style={{ fontSize: 30, lineHeight: 36, fontFamily: typography.fontFamily.extrabold }}>
              Annual Artisans Meet 2024
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <SummaryTile title="Total Income" value="₹8,45,000" color="#166534" />
            <SummaryTile title="Total Expenses" value="₹5,12,400" color="#b91c1c" />
          </View>
          <SummaryTile title="Net Profit" value="₹3,32,600" color={colors.primary.DEFAULT} />

          <View
            style={{
              borderRadius: 28,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: colors.border.muted,
              padding: spacing[5],
              gap: spacing[4],
              ...shadows.sm,
            }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Income Breakdown
            </Text>
            <BreakdownRow label="Tickets & Registrations" amount="₹5,40,000" tint="#ecfdf5" />
            <BreakdownRow label="Sponsors" amount="₹2,15,000" tint="#fef3c7" />
            <BreakdownRow label="Stall Revenue" amount="₹90,000" tint="#eff6ff" />
          </View>

          <View
            style={{
              borderRadius: 28,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: colors.border.muted,
              padding: spacing[5],
              gap: spacing[4],
              ...shadows.sm,
            }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Expense Breakdown
            </Text>
            <BreakdownRow label="Venue & Production" amount="₹2,10,400" tint="#fff7ed" />
            <BreakdownRow label="Catering" amount="₹1,56,000" tint="#fef2f2" />
            <BreakdownRow label="Marketing & Staff" amount="₹1,46,000" tint="#f8fafc" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[3] }}>
          <Text variant="h1" style={{ fontSize: 30, lineHeight: 36, fontFamily: typography.fontFamily.extrabold }}>
            Yearly P&amp;L Statement
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {['2024', '2023', '2022'].map((year, index) => (
              <View
                key={year}
                style={{
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                  backgroundColor: index === 0 ? colors.primary.DEFAULT : '#ffffff',
                  borderWidth: index === 0 ? 0 : 1,
                  borderColor: colors.border.DEFAULT,
                }}>
                <Text variant="caption" color={index === 0 ? '#ffffff' : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
                  {year}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            borderRadius: 28,
            backgroundColor: '#171717',
            padding: spacing[6],
            gap: spacing[3],
          }}>
          <Text variant="caption" color="rgba(255,255,255,0.7)" style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Net Profit
          </Text>
          <Text variant="h1" color="#ffffff" style={{ fontSize: 40, lineHeight: 44, fontFamily: typography.fontFamily.extrabold }}>
            ₹12,45,000
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing[4] }}>
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="rgba(255,255,255,0.68)">
                Income
              </Text>
              <Text variant="h5" color="#86efac" style={{ fontFamily: typography.fontFamily.bold }}>
                ₹45.2L
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="caption" color="rgba(255,255,255,0.68)">
                Expenses
              </Text>
              <Text variant="h5" color="#fca5a5" style={{ fontFamily: typography.fontFamily.bold }}>
                ₹32.75L
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            borderRadius: 28,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: colors.border.muted,
            padding: spacing[5],
            gap: spacing[4],
            ...shadows.sm,
          }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Income Breakdown
          </Text>
          <BreakdownRow label="Donations" amount="₹21.4L" tint="#fff7ed" />
          <BreakdownRow label="Events Revenue" amount="₹14.8L" tint="#eff6ff" />
          <BreakdownRow label="Matrimony & Other" amount="₹9.0L" tint="#ecfdf5" />
        </View>

        <View
          style={{
            borderRadius: 28,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: colors.border.muted,
            padding: spacing[5],
            gap: spacing[4],
            ...shadows.sm,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Monthly Profit Trend
            </Text>
            <MaterialIcons name="show-chart" size={22} color={colors.primary.DEFAULT} />
          </View>
          <View style={{ height: 180, flexDirection: 'row', alignItems: 'flex-end', gap: spacing[2] }}>
            {[54, 70, 62, 86, 92, 108, 96, 116, 84, 74, 98, 120].map((height, index) => (
              <View key={index} style={{ flex: 1, alignItems: 'center', gap: spacing[2] }}>
                <View style={{ width: '100%', height, borderRadius: radius.md, backgroundColor: index % 3 === 0 ? '#f2780d' : '#fed7aa' }} />
                <Text variant="caption" color={colors.text.muted}>
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
