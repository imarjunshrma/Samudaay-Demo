import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import {
  analyticsTabs,
  billingInvoices,
  cateringRequirements,
  eventAnalyticsStats,
  membersByCity,
  peopleSummaryStats,
  regionalDistribution,
  topDonationPincodes,
  transactionManagementItems,
  transactionTrendHeights,
  transactionTrendLabels,
} from '../constants';

function MobileHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}) {
  return (
    <View
      style={{
        paddingHorizontal: spacing[5],
        paddingTop: spacing[4],
        paddingBottom: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.muted,
        backgroundColor: colors.background.surface,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.lg,
            backgroundColor: colors.primary.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.text.muted}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <MaterialIcons name="more-vert" size={22} color={colors.text.secondary} />
      </View>
    </View>
  );
}

function StatCard({
  title,
  value,
  accent,
  icon,
}: {
  title: string;
  value: string;
  accent: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: '47%',
        borderRadius: 24,
        padding: spacing[5],
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.muted,
        ...shadows.sm,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.lg,
          backgroundColor: accent,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing[4],
        }}>
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderRadius: 28,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.muted,
        padding: spacing[5],
        gap: spacing[4],
        ...shadows.sm,
      }}>
      <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function TrendBar({ label, value, width, color }: { label: string; value: string; width: `${number}%`; color: string }) {
  return (
    <View style={{ gap: spacing[2] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
          {label}
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          {value}
        </Text>
      </View>
      <View style={{ height: 8, borderRadius: radius.full, backgroundColor: '#eef2f7', overflow: 'hidden' }}>
        <View style={{ width, height: '100%', borderRadius: radius.full, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function BillingContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f1ec' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ paddingHorizontal: spacing[6], paddingTop: spacing[6], gap: spacing[6] }}>
          <View style={{ gap: spacing[3] }}>
            <Text variant="caption" color="#7c4a31" style={{ letterSpacing: 1.4, textTransform: 'uppercase' }}>
              The Digital Atelier
            </Text>
            <Text variant="h1" style={{ fontSize: 36, lineHeight: 42, fontFamily: 'serif', color: '#2f1f18' }}>
              Billing & Revenue
            </Text>
            <Text variant="body" color="#7b655a" style={{ fontSize: 15, lineHeight: 22 }}>
              Elegant invoicing, recurring subscriptions, and revenue health across the studio.
            </Text>
          </View>

          <View style={{ gap: spacing[4] }}>
            <View
              style={{
                borderRadius: 28,
                padding: spacing[6],
                backgroundColor: '#31211a',
                gap: spacing[3],
              }}>
              <Text variant="caption" color="rgba(255,255,255,0.72)" style={{ textTransform: 'uppercase', letterSpacing: 1.4 }}>
                Total Monthly Recurring Revenue
              </Text>
              <Text variant="h1" color="#ffffff" style={{ fontFamily: 'serif', fontSize: 38, lineHeight: 42 }}>
                $42,850.00
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              <View style={{ flex: 1, borderRadius: 24, padding: spacing[5], backgroundColor: '#efe0d6' }}>
                <Text variant="caption" color="#7c4a31" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Upcoming Renewals
                </Text>
                <Text variant="h3" style={{ marginTop: spacing[2], fontFamily: 'serif', color: '#2f1f18' }}>
                  14
                </Text>
              </View>
              <View style={{ flex: 1, borderRadius: 24, padding: spacing[5], backgroundColor: '#eadfd3' }}>
                <Text variant="caption" color="#7c4a31" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Outstanding
                </Text>
                <Text variant="h3" style={{ marginTop: spacing[2], fontFamily: 'serif', color: '#2f1f18' }}>
                  $3,210
                </Text>
              </View>
            </View>
          </View>

          <SectionCard title="Recent Invoices">
            {billingInvoices.map(([title, code, amount, status]) => (
              <View key={code} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                    {title}
                  </Text>
                  <Text variant="caption" color="#7b655a">
                    {code}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: '#2f1f18' }}>
                    {amount}
                  </Text>
                  <Text variant="caption" color={status === 'Paid' ? '#0f766e' : status === 'Pending' ? '#b45309' : '#b91c1c'}>
                    {status}
                  </Text>
                </View>
              </View>
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function TransactionManagementContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Transaction Management
        </Text>
        {transactionManagementItems.map(([name, meta]) => (
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

export function TransactionAnalyticsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <MobileHeader title="Transaction Analytics" subtitle="Live donation and revenue intelligence" icon="analytics" />
        <View style={{ padding: spacing[5], gap: spacing[5] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
            <StatCard title="Total Donations" value="₹8,45,200" accent="#f2780d" icon="volunteer-activism" />
            <StatCard title="Matrimony Revenue" value="₹2,12,500" accent="#0f766e" icon="favorite" />
          </View>

          <SectionCard title="Revenue Trends">
            <View style={{ height: 180, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', gap: spacing[3] }}>
              {transactionTrendHeights.map((height, index) => (
                <View key={index} style={{ flex: 1, alignItems: 'center', gap: spacing[2] }}>
                  <View
                    style={{
                      width: '100%',
                      height,
                      borderTopLeftRadius: radius.lg,
                      borderTopRightRadius: radius.lg,
                      backgroundColor: index % 2 === 0 ? '#f2780d' : '#fecba1',
                    }}
                  />
                  <Text variant="caption" color={colors.text.muted}>{transactionTrendLabels[index]}</Text>
                </View>
              ))}
            </View>
          </SectionCard>

          <SectionCard title="Top Donation Pincodes">
            {topDonationPincodes.map(([label, value, width, color]) => (
              <TrendBar key={label} label={label} value={value} width={width} color={color} />
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function EventAnalyticsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <MobileHeader title="Event Analytics" subtitle="Registrations, attendance and catering" icon="insights" />
        <View style={{ padding: spacing[5], gap: spacing[5] }}>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {analyticsTabs.map((item, index) => (
              <View
                key={item}
                style={{
                  flex: 1,
                  borderRadius: radius.full,
                  backgroundColor: index === 0 ? colors.primary.DEFAULT : '#ffffff',
                  paddingVertical: spacing[2],
                  alignItems: 'center',
                  borderWidth: index === 0 ? 0 : 1,
                  borderColor: colors.border.DEFAULT,
                }}>
                <Text variant="caption" color={index === 0 ? '#ffffff' : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
            {eventAnalyticsStats.map(([title, value, accent, icon]) => (
              <StatCard key={title} title={title} value={value} accent={accent} icon={icon} />
            ))}
          </View>

          <SectionCard title="Catering Requirements">
            {cateringRequirements.map(([label, value, width, color]) => (
              <TrendBar key={label} label={label} value={value} width={width} color={color} />
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PeopleAnalyticsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fbf8f3' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[5], gap: spacing[5] }}>
          <View
            style={{
              borderRadius: 28,
              backgroundColor: '#1f2937',
              padding: spacing[6],
              gap: spacing[3],
            }}>
            <Text variant="caption" color="rgba(255,255,255,0.68)" style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
              ICC Analytics
            </Text>
            <Text variant="h1" color="#ffffff" style={{ fontSize: 38, lineHeight: 44, fontFamily: typography.fontFamily.extrabold }}>
              12,500+
            </Text>
            <Text variant="body" color="rgba(255,255,255,0.78)">
              Total community strength across active members, matrimony profiles, and new registrations.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing[4] }}>
            {peopleSummaryStats.map(([title, value]) => (
              <View key={title} style={{ flex: 1, borderRadius: 24, padding: spacing[5], backgroundColor: '#ffffff', ...shadows.sm }}>
                <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  {title}
                </Text>
                <Text variant="h3" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.bold }}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <SectionCard title="Members by City">
            {membersByCity.map(([label, value, width, color]) => (
              <TrendBar key={label} label={label} value={value} width={width} color={color} />
            ))}
          </SectionCard>

          <SectionCard title="Regional Distribution">
            {regionalDistribution.map(([label, value]) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                  {label}
                </Text>
                <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {value}
                </Text>
              </View>
            ))}
          </SectionCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
