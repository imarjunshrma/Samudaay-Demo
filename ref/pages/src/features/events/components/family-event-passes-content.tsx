import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const qrImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDdDhECAUB7AhCKz1tCrwNmPLX7NleJ3NGLV4mRCji6JEkot8L0Qw5yWIM0Q27XwUwloot8kMEvBzE7rwzNTMW0rNGRrGW5FhrdL9JNuK4LNC2Gir5DCGQIqIXU5Co5XRs8aU5ntswx6WOO7lddlxwVjEFZLfrJw2x0oima_LaEQh5f1QFnhVSPVoVUI2iEbVAEP_-sH8bzp7078PgaK91EuBkWLUu2Ekjz7K-bceWDQd_4rFv6mTqry2mSIcLR8CMcdUBZSogeSse5';

const passes = [
  {
    name: 'Rajesh Kumar',
    addOns: [
      { icon: 'restaurant', title: 'Lunch Buffet' },
      { icon: 'groups', title: 'Networking Dinner' },
    ],
  },
  {
    name: 'Sunita Devi',
    addOns: [{ icon: 'restaurant', title: 'Lunch Buffet' }],
  },
  {
    name: 'Anjali Kumar',
    addOns: [{ icon: 'workspace-premium', title: 'Workshop Access' }],
  },
] as const;

function PassCard({ pass }: { pass: (typeof passes)[number] }) {
  return (
    <View style={{ width: 320, maxWidth: '100%', borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', backgroundColor: '#ffffff', ...shadows.lg }}>
      <View style={{ alignItems: 'center', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[8] }}>
        <View style={{ width: '100%', maxWidth: 240, aspectRatio: 1, borderRadius: radius.lg, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#ffffff', padding: spacing[4] }}>
          <Image source={{ uri: qrImage }} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
        </View>
        <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: spacing[4], fontFamily: typography.fontFamily.medium, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>
          Scan at Entrance
        </Text>
      </View>
      <View style={{ paddingHorizontal: spacing[6], paddingBottom: spacing[6], alignItems: 'center' }}>
        <Text variant="h3" style={{ textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
          {pass.name}
        </Text>
        <Text variant="caption" color="#64748b" style={{ marginTop: 4, fontSize: 14 }}>
          Global Tech Summit 2024
        </Text>
        <View style={{ width: '100%', marginVertical: spacing[6], position: 'relative', borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: '#e2e8f0' }}>
          <View style={{ position: 'absolute', left: -36, top: -12, width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.background.DEFAULT, borderRightWidth: 1, borderRightColor: 'rgba(242,120,13,0.1)' }} />
          <View style={{ position: 'absolute', right: -36, top: -12, width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.background.DEFAULT, borderLeftWidth: 1, borderLeftColor: 'rgba(242,120,13,0.1)' }} />
        </View>
        <View style={{ width: '100%' }}>
          <Text variant="caption" color="#94a3b8" style={{ marginBottom: spacing[2], fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Registered Add-ons
          </Text>
          <View style={{ gap: spacing[3] }}>
            {pass.addOns.map((addOn) => (
              <View key={addOn.title} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[3] }}>
                <MaterialIcons name={addOn.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={colors.primary.DEFAULT} />
                <View style={{ flex: 1 }}>
                  <Text variant="caption" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                    {addOn.title}
                  </Text>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 12 }}>
                    Included
                  </Text>
                </View>
                <MaterialIcons name="check-circle" size={18} color="#22c55e" />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export function FamilyEventPassesContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color="#475569" />
          </View>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Family Event Passes
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: spacing[8], paddingBottom: 120 }}>
          <View style={{ alignItems: 'center' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[6], paddingHorizontal: spacing[6], paddingBottom: spacing[4] }}>
              {passes.map((pass) => (
                <View key={pass.name} style={{ width: 340, alignItems: 'center', justifyContent: 'center' }}>
                  <PassCard pass={pass} />
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: spacing[2], marginTop: spacing[4] }}>
              <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} />
              <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: '#cbd5e1' }} />
              <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: '#cbd5e1' }} />
            </View>
            <Text variant="caption" color="#94a3b8" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
              Swipe for more passes
            </Text>
          </View>

          <View style={{ paddingHorizontal: spacing[6], marginTop: spacing[8] }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], ...shadows.lg }}>
              <MaterialIcons name="download" size={20} color="#ffffff" />
              <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                Download Pass
              </Text>
            </Pressable>
            <Text variant="caption" color="#64748b" style={{ marginTop: spacing[4], textAlign: 'center', lineHeight: 18 }}>
              Please have the current pass ready on your device or printed for quick entry to the venue.
            </Text>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: '#ffffff', paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[6] }}>
          <View style={{ flexDirection: 'row' }}>
            {[
              { icon: 'home', label: 'Home', active: false },
              { icon: 'calendar-today', label: 'Schedule', active: false },
              { icon: 'confirmation-number', label: 'Pass', active: true },
              { icon: 'person', label: 'Profile', active: false },
            ].map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: typography.fontFamily.medium }}>
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
