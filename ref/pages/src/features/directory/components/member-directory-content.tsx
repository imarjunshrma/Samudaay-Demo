import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

const members: ReadonlyArray<{
  name: string;
  location: string;
  role: string;
  image?: string;
  online?: boolean;
}> = [
  {
    name: 'Rajesh Kumar',
    location: 'Dharavi, Mumbai',
    role: 'Master Artisan • 15 Years Exp.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAST3OehLKpOvus-yLkhjx5q7Fy-w2Cix7kNhFZxK-kpP4RM9Gk-06Z22RVaj4l_7pHT8BGBbbDhdEhlxS_Oj0XHN4qAjqYBurRMfrybLRX-XAGiKiZNq9ItPwFQlCZKb5ZlPrwQH_RJcqVN64lZFxkk327Hww7lyePbVixzY2qtnozQyOg1EsjJjStSqOqGc6vXQOWSaer_DRqGoY3H0B_tF4Y8u3M9XCCMYY4N4MVS3LAsZoKIOJGulONFrvQaBpe4fLB5pNFexsX',
    online: true,
  },
  {
    name: 'Sunita Devi',
    location: 'Agra, Uttar Pradesh',
    role: 'Footwear Designer',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDT6URtYbcKTABNUPVbE1TcXq7xv5HdQ2YwsjVoc34rUuc0CGQUXkizj9RyfSDzzsUT7l-Mgpa_FDVB017worLZoTfECnmsqMw316SX1mmxYEveccK2z21eiIwnkVrZ3FCOQEaxmYEo3BZ_z8LL16cbCImNwXMzk_QyYo_uBzfkArzIskbqdynD8OP8g76glME_qnsNPBUHiazusoq6qUiTkscpszz9jo_ctM3K0dmTOdNJ_CXB88JhdUj16iuVWULZqn52yZdYbyvE',
  },
  {
    name: 'Mohammad Arif',
    location: 'Chandni Chowk, Delhi',
    role: 'Orthopedic Specialist',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2tgepGANWp5_KFYbuoytlxjwLb0TMARUqXUa8RQNOnxjzO313efsJdn-9jxKnghxlIxr6nOn_Bbfb517J0JpS3_-8M4vg4U-ZdMgjrMP9cDoHjtkUmuUDU9h0sGXQj1WLSm6F6sif4CPE1W9ZVdMjw-LawlaT5zrU0Gt9PI-8w91Dg9tNsE5jXV7PM0yl_PhbelFf2Bg7FfOruP4oZSxZHxWTDbRjVDbOzuaLfnrGqDhgYv_VCKeZ_s63-g0RZoTkTN3dlx2DUUY0',
  },
  {
    name: 'Amit Saxena',
    location: 'Indiranagar, Bengaluru',
    role: 'Premium Repair Service',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxCDb1gbDo05NBnBfentL8m7Bs5tACTt7uvEah7JerzbcN9ramvsW7mR4Huzde5xZityVm8Mlx_rc4N8xMM2S4-k4K0lRZ827CMbJkpm4osqmU-hLOqANFrgtqo0vcr2_Z9rUjFZFj-xMIJ8frPl1QaNqBk_Kunm4ORfDVADN5_DiKMBzKZmFWiD1hQO59CSP_Xg1RE5ar6pxWfjhLG00Uy4UDadRiNtdzE1jMfjV9-VM06ks8WxJR9U6As9VlmjA5rivFKq3JHLEN',
    online: true,
  },
  { name: 'Gopal Varma', location: 'Ameerpet, Hyderabad', role: 'Raw Material Supplier' },
] as const;

export function MemberDirectoryContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(248,247,245,0.95)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4] }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="arrow-back" size={22} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="h5" style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
              Member Directory
            </Text>
            <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="info" size={22} color={colors.primary.DEFAULT} />
            </View>
          </View>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
            <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', borderRadius: radius.xl, backgroundColor: '#ffffff' }}>
              <View style={{ paddingLeft: spacing[4], paddingRight: spacing[2] }}>
                <MaterialIcons name="search" size={22} color={colors.primary.DEFAULT} />
              </View>
              <Text variant="body" color="#94a3b8">
                Search by name or keyword
              </Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}>
            {[
              { label: 'State', active: true },
              { label: 'City', active: false },
              { label: 'Pincode', active: false },
            ].map((item) => (
              <View key={item.label} style={{ height: 36, flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.lg, borderWidth: item.active ? 0 : 1, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: item.active ? colors.primary.DEFAULT : '#ffffff', paddingHorizontal: spacing[4] }}>
                <Text variant="caption" color={item.active ? '#ffffff' : '#475569'} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                  {item.label}
                </Text>
                <MaterialIcons name="expand-more" size={16} color={item.active ? '#ffffff' : '#475569'} />
              </View>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 96 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
              Community Members
            </Text>
            <View style={{ borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontSize: 12, fontFamily: typography.fontFamily.medium }}>
                1,248 Total
              </Text>
            </View>
          </View>
          <View style={{ gap: spacing[4] }}>
            {members.map((member) => (
              <View key={member.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#ffffff', padding: spacing[4] }}>
                <View style={{ width: 64, height: 64, position: 'relative' }}>
                  {member.image ? (
                    <Image source={{ uri: member.image }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(242,120,13,0.2)' }} />
                  ) : (
                    <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="person" size={32} color={colors.primary.DEFAULT} />
                    </View>
                  )}
                  {member.online ? <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: radius.full, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#ffffff' }} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                    {member.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="location-on" size={12} color="#64748b" />
                    <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
                      {member.location}
                    </Text>
                  </View>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.semibold, fontSize: 12 }}>
                    {member.role}
                  </Text>
                </View>
                <Pressable style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="call" size={20} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            ))}
          </View>
          <View style={{ alignItems: 'center', paddingTop: spacing[4], paddingBottom: 80 }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: 'rgba(242,120,13,0.05)', paddingHorizontal: spacing[6], paddingVertical: spacing[2] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                Load More Members
              </Text>
              <MaterialIcons name="expand-more" size={18} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: spacing[2], paddingTop: spacing[2] }}>
          <View style={{ flexDirection: 'row', height: 64, alignItems: 'center', justifyContent: 'space-around' }}>
            {[
              { icon: 'home', label: 'Home', active: false },
              { icon: 'groups', label: 'Directory', active: true },
              { icon: 'event', label: 'Events', active: false },
              { icon: 'person-pin', label: 'Profile', active: false },
            ].map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 1 }}>
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
