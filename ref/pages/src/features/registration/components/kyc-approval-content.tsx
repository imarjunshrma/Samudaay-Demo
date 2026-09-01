import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function KycApprovalContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
      <View style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(241,237,234,0.9)', paddingHorizontal: spacing[6], paddingVertical: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <MaterialIcons name="menu" size={24} color="#46291e" />
            <Text variant="h4" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
              KYC Approval
            </Text>
          </View>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxamhfIl1LvmjtPTgBBDFsB4K_LlnGm4LIiCxbkWYM_zACwgGmzk35dhb20azpEM3Sxc-A3UGffVNwoM0Ee5KDa2P0KmTs4m8UxdP4V7ASZ2zUIOeyd-MVg-f647lDfqdNJTuIg9xVrG92m1BUYMDe0p1uGyHBRkry95RvBsdKmca0Fc4ldG4jFbDOpGkT36YBlNTwXPVaSQoIqMPwo-PX4Cj1IBIFGfM7serSZc5Nv3EHnvsMU0ISAosADecCMeGHIz27tunu-CAl' }} resizeMode="cover" style={{ width: 32, height: 32, borderRadius: radius.full }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[6], paddingBottom: 40 }}>
          <View style={{ gap: spacing[8] }}>
            <View>
              <Text variant="caption" style={{ color: '#964900', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
                Application #88421
              </Text>
              <Text variant="h1" style={{ marginTop: spacing[2], color: '#46291e', fontSize: 40, lineHeight: 46, fontFamily: typography.fontFamily.bold }}>
                Arjun Varma
              </Text>
              <Text variant="body" style={{ marginTop: spacing[2], color: '#827470', fontSize: 18, fontStyle: 'italic' }}>
                Third Generation Cordwainer, Kanpur District
              </Text>
            </View>

            <View style={{ borderLeftWidth: 4, borderLeftColor: '#46291e', borderRadius: radius.xl, backgroundColor: '#f7f3f0', padding: spacing[8] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[6] }}>
                <MaterialIcons name="person" size={18} color="#46291e" />
                <Text variant="caption" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Profile Information
                </Text>
              </View>
              <View style={{ gap: spacing[6] }}>
                {[
                  ['Full Name', 'Arjun Kumar Varma'],
                  ["Father's Name", 'Rajesh Varma'],
                  ['Phone Number', '+91 98765 43210'],
                  ['Village / City', 'Kanpur, Uttar Pradesh'],
                  ['Primary Occupation', 'Traditional Footwear Maker'],
                  ['Experience', '18 Years'],
                ].map(([label, value]) => (
                  <View key={label} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(130,116,112,0.2)', paddingBottom: spacing[2] }}>
                    <Text variant="caption" style={{ color: '#827470', fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
                      {label}
                    </Text>
                    <Text variant="body" style={{ marginTop: 4, color: '#1c1b1a', fontFamily: typography.fontFamily.medium, fontSize: 18 }}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ borderRadius: radius.xl, backgroundColor: '#f1edea', padding: spacing[6] }}>
              <Text variant="h4" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                Documents Submitted
              </Text>
              <View style={{ gap: spacing[4], marginTop: spacing[4] }}>
                {[
                  { icon: 'badge', title: 'Government ID Proof', subtitle: 'Aadhaar card uploaded and readable' },
                  { icon: 'home-work', title: 'Address Verification', subtitle: 'Local reference letter attached' },
                  { icon: 'photo-camera', title: 'Workshop Photograph', subtitle: 'Workbench and tools clearly visible' },
                ].map((item) => (
                  <View key={item.title} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: radius.lg, backgroundColor: '#ffffff', padding: spacing[4] }}>
                    <View style={{ width: 44, height: 44, borderRadius: radius.lg, backgroundColor: 'rgba(255,137,40,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color="#964900" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ color: '#1c1b1a', fontFamily: typography.fontFamily.bold }}>
                        {item.title}
                      </Text>
                      <Text variant="caption" style={{ color: '#504441', fontSize: 13 }}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ borderRadius: radius.xl, backgroundColor: '#00504b', padding: spacing[8] }}>
              <Text variant="caption" style={{ color: '#56c6bc', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
                Inspector Note
              </Text>
              <Text variant="body" style={{ marginTop: spacing[3], color: '#ffffff', lineHeight: 24 }}>
                Application is complete and the workshop details align with submitted records. Final approval can be granted after one last district verification call.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              <Pressable style={{ flex: 1, borderRadius: radius.xl, borderWidth: 1, borderColor: '#ba1a1a', paddingVertical: spacing[4], alignItems: 'center' }}>
                <Text variant="body" style={{ color: '#ba1a1a', fontFamily: typography.fontFamily.bold }}>
                  Reject
                </Text>
              </Pressable>
              <Pressable style={{ flex: 1, borderRadius: radius.xl, backgroundColor: '#46291e', paddingVertical: spacing[4], alignItems: 'center' }}>
                <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                  Approve
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
