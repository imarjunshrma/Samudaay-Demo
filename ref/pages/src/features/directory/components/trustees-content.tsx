import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

const trustees = [
  { name: 'Rajesh Kumar', role: 'President', meta: '25 years exp • Dharavi, Mumbai', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChyppuEfoR_oulSP7SpTqR0KbYFrXSuZFvmUTWjwqQjPucOXNjFtaaTuTpAD5gAu_GxT8CJef38XhKbNsRtmtivrkqVHt--Up8gsMczcmqWWvUyBzOxCThpBToXGFGJauTPJpjaYcqgRfZDCWSpprhX5L38zHLhEt0Kj3KIabLh9EcBqUT7tZtevekd0RADGEAMtk2A5DCt-k0tLCwepAO9YHiZV-SA26h4u7L0XLkGxniuWkNCnbQzb3G7PuaHh4VDCPilrGAWevT', primary: true },
  { name: 'Amit Shah', role: 'Secretary', meta: '18 years exp • Agra, UP', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKGLsqQNRfvCc64B8b1iZFDz8kWSWhir7mBCK_FQpWuqGy2498v24-O9lD0MXoCdEJG8fCLGF1VBRLX2wkxRzY0TAJjHboWJiPLzX1fyug8QddmpGKMzNtE0U8GiBh93j6JJM-nXeXdVynR9brmDFRcuOdUhg5re3gsoNyTlOA48YEiuxqFygbFIXc0O1n1PHFa9TRyrhQ8bKcYmIc2sQQi8rzqUWkkQRIX49WDOYgQyeW9WLEtw3uvX3JEjrSsUeSaz4sKCkuk1dg', primary: false },
  { name: 'Priya More', role: 'Treasurer', meta: '15 years exp • Kolhapur, MH', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKxSo3tAEB3wWKgTCoL7tQqriQ183NcC6N6PwX_6qLDJSRGuQRRXjZDc5u_TcRsN9omcT23eWR61ycqtJb5AKerHrPaWM9HD-8Xi6YIGmh69gFFAo5rrtiDzuzNPtnp9DcnMQn8aKuht4N3lfAN25AQ6MZQBBEG-4T3uMlITYCFpq81IA1itvxAIS8hMg6ZekynFK9YaknFSBNVdYbLePv1E1mifnm07R_RjlFCrpB-CLavQ1zelettPKxb9-qg9DbfOmG4Ru2gmwN', primary: false },
  { name: 'Vikram Singh', role: 'Senior Advisor', meta: '40 years exp • Jodhpur, RJ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKunxs7mMG-VrngBMaIJs-YNVjkk6H5XaX9e4_uhnSVHlDCLvKhZRlmE7L48g4HVd6t_SZyWcK1gGR4H2ecXx3NEM-4wXV44PGeNKQR5c4eXEFh9DKaIfYbkWCT5iJjb761nv3qI9w3FJSSuJJl0wfrkdpfRCRw1bAImviF8FjrZY4PqJCar7COJQAWCTzjpftsEjJzBdfANrdBW2s-tz_Pq7i2H9WShpYSJYVmi-bM1kfpPmn8IGQA1i78XmiAsSypo7lJpk8sela', primary: false },
];

export function TrusteesContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" color={colors.text.primary} style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>Community Trustees</Text>
          <View style={{ width: 40, alignItems: 'flex-end' }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="search" size={24} color={colors.text.primary} />
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6] }}>
            <Text variant="h2" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>Board of Trustees</Text>
            <Text variant="body" color="#64748b" style={{ marginTop: 4 }}>Dedicated leaders serving the Indian Cobbler Community since 1985.</Text>
          </View>
          <View style={{ gap: 1 }}>
            {trustees.map((item) => (
              <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], backgroundColor: colors.background.surface, paddingHorizontal: spacing[4], paddingVertical: spacing[5], borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(242,120,13,0.05)' }}>
                <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.primary.border }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>{item.name}</Text>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14, marginBottom: 4 }}>{item.role}</Text>
                  <Text variant="caption" color="#6b7280">{item.meta}</Text>
                </View>
                <Pressable style={{ borderRadius: radius.lg, backgroundColor: item.primary ? colors.primary.DEFAULT : 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                  <Text variant="caption" color={item.primary ? '#fff' : colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Contact</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <View style={{ marginHorizontal: spacing[4], marginVertical: spacing[8], padding: spacing[5], borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT }}>
            <Text variant="h5" color="#fff" style={{ marginBottom: spacing[2], fontFamily: typography.fontFamily.bold }}>Our Reach</Text>
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="rgba(255,255,255,0.8)" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Members</Text>
                <Text variant="h2" color="#fff" style={{ fontFamily: typography.fontFamily.bold }}>12,500+</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="rgba(255,255,255,0.8)" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Districts</Text>
                <Text variant="h2" color="#fff" style={{ fontFamily: typography.fontFamily.bold }}>48</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: spacing[6], paddingTop: spacing[3], paddingBottom: spacing[6] }}>
          {[
            { icon: 'home', label: 'Home', active: false },
            { icon: 'groups', label: 'Community', active: true },
            { icon: 'person', label: 'Profile', active: false },
          ].map((item) => (
            <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={26} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
