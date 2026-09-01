import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function ExpenseField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <View style={{ gap: spacing[2] }}>
      <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: '#ffffff',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          fontFamily: typography.fontFamily.medium,
        }}
      />
    </View>
  );
}

export function ExpenseManagementContent({
  mode = 'list',
}: {
  mode?: 'list' | 'create';
}) {
  if (mode === 'create') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Create New Expense
          </Text>
          <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
            <ExpenseField label="Expense Title" placeholder="Venue advance" />
            <ExpenseField label="Amount" placeholder="₹ 0.00" />
            <ExpenseField label="Category" placeholder="Operations / Event / Admin" />
            <ExpenseField label="Date" placeholder="08 Apr 2026" />
          </View>
          <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
            <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Save Expense
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Expense Management
        </Text>
        {[
          ['Event Stage Setup', '₹1,24,000 • Approved'],
          ['Scholarship Printing', '₹18,450 • Pending'],
          ['Volunteer Refreshments', '₹9,200 • Paid'],
        ].map(([title, meta]) => (
          <View key={title} style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[2], ...shadows.sm }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {title}
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
