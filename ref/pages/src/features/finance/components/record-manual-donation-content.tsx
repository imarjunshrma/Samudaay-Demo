import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

function Field({ label, placeholder }: { label: string; placeholder: string }) {
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
          borderColor: '#e2e8f0',
          backgroundColor: '#ffffff',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          fontFamily: typography.fontFamily.medium,
          fontSize: 15,
          color: colors.text.primary,
        }}
      />
    </View>
  );
}

export function RecordManualDonationContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[5],
            paddingBottom: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.border.muted,
            backgroundColor: '#ffffff',
          }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Manual Donation Entry
          </Text>
        </View>

        <View style={{ padding: spacing[5], gap: spacing[5] }}>
          <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Donor Information
            </Text>
            <Field label="Donor Name" placeholder="Enter full name" />
            <Field label="Mobile Number" placeholder="+91 98765 43210" />
            <Field label="Member ID" placeholder="Optional member ID" />
          </View>

          <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Transaction Details
            </Text>
            <Field label="Donation Amount" placeholder="₹ 0.00" />
            <Field label="Donation Purpose" placeholder="Temple donation / event support" />
            <Field label="Date" placeholder="08 Apr 2026" />
          </View>

          <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              Payment Mode
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              {[
                ['Cash', 'payments'],
                ['Transfer', 'account-balance'],
                ['Cheque', 'receipt-long'],
              ].map(([label, icon], index) => (
                <View
                  key={label}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    gap: spacing[2],
                    borderRadius: 22,
                    paddingVertical: spacing[4],
                    borderWidth: 1,
                    borderColor: index === 0 ? colors.primary.border : '#e2e8f0',
                    backgroundColor: index === 0 ? colors.primary.muted : '#ffffff',
                  }}>
                  <MaterialIcons name={icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={index === 0 ? colors.primary.DEFAULT : '#64748b'} />
                  <Text variant="caption" color={index === 0 ? colors.primary.DEFAULT : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              borderRadius: 28,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.primary.border,
              backgroundColor: '#fff7ed',
              padding: spacing[6],
              alignItems: 'center',
              gap: spacing[3],
            }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.full,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="cloud-upload" size={28} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              Verification Proof
            </Text>
            <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'center' }}>
              Upload receipt, cheque image, or transfer screenshot
            </Text>
          </View>

          <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
            <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Save Donation Entry
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
