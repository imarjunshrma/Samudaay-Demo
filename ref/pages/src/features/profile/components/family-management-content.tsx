import { Image, Pressable, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

const familyMembers = [
  { name: 'Rajesh Kumar', subtitle: 'Self • 42 Years', extra: 'Occupation: Master Cobbler', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGLYWtIwR5zAKOcFFilfaFv7Okkkp9xKSwGsblgoMxzYjvPmaz5kV6OSJe2fLY8lHwYdFa-ROzRy8RQ5j-VEw7oboofbURC6qGrigxyRdFFt0iLzFRpa5Sf4_teXQ33ogFAUzkde4uZc5XRUVQUMwFrbE_ufn8Wq4-2Qh18L0qfWInQIiERCgu4CXzjcOR5qoshVwY2bb94CZHXwjq01qxTaJb43kMDkwEvJPmXksunvPTvW_GZhA0c_rFVM6VfwjJdk1Njf8EmWlI', badge: 'Primary' },
  { name: 'Sunita Devi', subtitle: 'Spouse • 38 Years', extra: 'Education: 10th Pass', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrtPEuMZlpn5_Y12Gvx3BRmFuUdjcKSKjKsViZMh-LNLBNnzPwssmK5yhdf9QprdvWnuG2l1asGEZ96qSfDVirGcRY9Uppa_Za07RcRTnJdal0fmI_aVwUupyIDxXj2kDR7d3ZQh_DIzJh4zOljp4sy6IU5L2aJoZ1-L3K8ptezmcsH5FQHsn9UJJ0BMX1M1EbB2ZWIHa_6_AUOI20A0S2gua9zd6vw6luqJoup3xBxI2EvWpwq_AFHVuxP80JwD2iv3ZqKhwU_ey' },
  { name: 'Anjali Kumar', subtitle: 'Daughter • 14 Years', extra: 'Class 9 • Govt. Girls School', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw5VD6MdutS3CaNAl1HgeEKK3soJlkRoxBMGBKzKvnKcLmfNzd3YY6gBH_UPa6X4-s3fUo-KwdBFVSkFv7bg0iWDvSjeIWfgP1gWLpFo7-myLsAxT1Ekp3KydDyJxVuOps9FEaVgv2zO_Nz9zZP9VhANIZq5X9E5n-nTx46EBT8RXr_CxksgNYnDt3mXh1gyCl5crPcU6qGkIZNW538jaBe4DzQXwuVUdADzRv5A3RmUqT8y6BfMM64cTRGQCHTsbmQnC-iPm184WO' },
];

function MemberCard({ item }: { item: (typeof familyMembers)[number] }) {
  return (
    <View style={{ gap: spacing[3], borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: '#e2e8f0' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 56, height: 56, borderRadius: radius.lg }} />
          <View>
            <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>{item.name}</Text>
            <Text variant="caption" color="#6b7280">{item.subtitle}</Text>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium }}>{item.extra}</Text>
          </View>
        </View>
        {item.badge ? (
          <View style={{ borderRadius: radius.md, backgroundColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2], borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: spacing[3] }}>
        <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.lg, backgroundColor: '#f8fafc', paddingVertical: spacing[2] }}>
          <MaterialIcons name="edit" size={18} color={colors.text.primary} />
          <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>Edit</Text>
        </Pressable>
        <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.lg, backgroundColor: '#f8fafc', paddingVertical: spacing[2] }}>
          <MaterialIcons name="delete" size={18} color="#ef4444" />
          <Text variant="caption" color="#ef4444" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FamilyManagementContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingBottom: spacing[2], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" color={colors.text.primary} style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>Family Management</Text>
          <View style={{ width: 40, alignItems: 'flex-end' }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(242,120,13,0.1)' }}>
              <MaterialIcons name="group" size={24} color={colors.primary.DEFAULT} />
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          <View style={{ padding: spacing[4] }}>
            <View style={{ borderRadius: radius.xl, backgroundColor: 'rgba(242,120,13,0.05)', borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)', padding: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>Total Members</Text>
                  <Text variant="h2" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>04</Text>
                </View>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                  <MaterialIcons name="add" size={16} color="#fff" />
                  <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Add Member</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Text variant="h4" color={colors.text.primary} style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2], fontFamily: typography.fontFamily.bold }}>Your Family</Text>
          <View style={{ gap: spacing[4], padding: spacing[4] }}>
            {familyMembers.map((item) => <MemberCard key={item.name} item={item} />)}
          </View>
          <View style={{ marginHorizontal: spacing[4], marginVertical: spacing[6], borderRadius: 16, backgroundColor: '#f1f5f9', borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(242,120,13,0.3)', padding: spacing[6] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[6] }}>
              <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, padding: spacing[2] }}>
                <MaterialIcons name="person-add" size={24} color="#fff" />
              </View>
              <Text variant="h5" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>Add Family Member</Text>
            </View>
            <View style={{ gap: spacing[4] }}>
              <View>
                <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Full Name</Text>
                <TextInput placeholder="e.g. Rahul Kumar" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
              </View>
              <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Relation</Text>
                  <TextInput placeholder="Son" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Gender</Text>
                  <View style={{ flexDirection: 'row', borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', padding: 4 }}>
                    <View style={{ flex: 1, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.primary.DEFAULT, paddingVertical: 6 }}>
                      <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>Male</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                      <Text variant="caption" color="#6b7280" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>Female</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Date of Birth</Text>
                  <TextInput placeholder="dd/mm/yyyy" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Education</Text>
                  <TextInput placeholder="e.g. 8th Standard" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
                </View>
              </View>
              <View style={{ borderRadius: radius.xl, backgroundColor: 'rgba(242,120,13,0.05)', borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', padding: spacing[4], gap: spacing[4] }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>Education Details (For Children)</Text>
                <View>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>School Name</Text>
                  <TextInput placeholder="e.g. Modern High School" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
                </View>
                <View>
                  <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Current Class</Text>
                  <TextInput placeholder="e.g. 5th Grade" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
                </View>
              </View>
              <View>
                <Text variant="caption" color="#6b7280" style={{ marginBottom: 4, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>Occupation</Text>
                <TextInput placeholder="e.g. Student / Unemployed" placeholderTextColor="#94a3b8" style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[3], paddingVertical: spacing[3], color: colors.text.primary }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[3], paddingTop: spacing[2] }}>
              <Pressable style={{ flex: 1, borderRadius: radius.xl, borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: spacing[3], alignItems: 'center' }}>
                <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Cancel</Text>
              </Pressable>
              <Pressable style={{ flex: 2, borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[3], alignItems: 'center' }}>
                <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Save Member</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: spacing[6], paddingVertical: spacing[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { icon: 'home', label: 'Home', active: false },
              { icon: 'group', label: 'Family', active: true },
              { icon: 'work', label: 'Jobs', active: false },
              { icon: 'person', label: 'Profile', active: false },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
