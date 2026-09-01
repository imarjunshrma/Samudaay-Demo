import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function ProvisionField({ label, placeholder }: { label: string; placeholder: string }) {
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

export function AdminProvisioningContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Assign User Role
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
          <ProvisionField label="User Email" placeholder="user@example.com" />
          <ProvisionField label="Role" placeholder="Community Admin / Volunteer" />
          <ProvisionField label="Organization" placeholder="Vadodara Community Trust" />
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Assign Role
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ClientOnboardingContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Create New Client Organization
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
          <ProvisionField label="Organization Name" placeholder="Shree Community Trust" />
          <ProvisionField label="Primary Admin" placeholder="admin@trust.org" />
          <ProvisionField label="City" placeholder="Vadodara" />
          <ProvisionField label="Subscription Plan" placeholder="Enterprise / Growth" />
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: '#2f1d16', paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Create Organization
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function CreateAdminContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Create Admin
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
          <ProvisionField label="Full Name" placeholder="Enter admin name" />
          <ProvisionField label="Email" placeholder="admin@example.com" />
          <ProvisionField label="Role" placeholder="Finance Admin / Event Admin" />
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Invite Admin
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
