import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

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
          borderColor: colors.border.DEFAULT,
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

export function ManageEventsContent({
  mode = 'list',
}: {
  mode?: 'list' | 'create';
}) {
  if (mode === 'create') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Create New Event
          </Text>
          <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
            <Field label="Event Name" placeholder="Annual Community Meet" />
            <Field label="Date" placeholder="08 Apr 2026" />
            <Field label="Venue" placeholder="Pragati Hall, Vadodara" />
            <Field label="Category" placeholder="Community / Matrimony / Education" />
          </View>
          <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
            <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Publish Event
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
          Manage Events
        </Text>
        {[
          ['Community Youth Summit', '24 Apr 2026 • 842 registrations'],
          ['Matrimony Meet Vadodara', '01 May 2026 • 218 registrations'],
          ['Education Scholarship Drive', '12 May 2026 • 104 applications'],
        ].map(([title, meta]) => (
          <View key={title} style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[3], ...shadows.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  {title}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {meta}
                </Text>
              </View>
              <MaterialIcons name="more-vert" size={22} color="#94a3b8" />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#fff7ed', paddingVertical: spacing[3], alignItems: 'center' }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  Edit
                </Text>
              </View>
              <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#ecfdf5', paddingVertical: spacing[3], alignItems: 'center' }}>
                <Text variant="caption" color="#047857" style={{ fontFamily: typography.fontFamily.bold }}>
                  View Registrations
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
