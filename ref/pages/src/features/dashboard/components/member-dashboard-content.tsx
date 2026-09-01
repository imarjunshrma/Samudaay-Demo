import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import { activityImage, bottomTabs, dashboardItems, memberImage, qrImage, sponsorImage } from '../constants';

function DashboardShell({ withPopup }: { withPopup: boolean }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        {withPopup ? (
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: spacing[4] }}>
            <View style={{ width: '100%', maxWidth: 360, overflow: 'hidden', borderRadius: 24, backgroundColor: '#ffffff', ...shadows.lg }}>
              <Pressable style={{ position: 'absolute', right: spacing[3], top: spacing[3], zIndex: 10, width: 36, height: 36, borderRadius: radius.full, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="close" size={20} color="#ffffff" />
              </Pressable>
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB' }} resizeMode="cover" style={{ width: '100%', aspectRatio: 4 / 3 }} />
              <View style={{ position: 'absolute', left: spacing[4], top: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                  <MaterialIcons name="campaign" size={10} color="#ffffff" />
                  <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                    Sponsored
                  </Text>
                </View>
              </View>
              <View style={{ padding: spacing[6] }}>
                <Text variant="h4" style={{ marginBottom: spacing[2], fontFamily: typography.fontFamily.bold }}>
                  Exclusive Member Discount
                </Text>
                <Text variant="caption" color="#64748b" style={{ marginBottom: spacing[6], lineHeight: 20, fontSize: 14 }}>
                  Get up to 30% off on all premium leather tools and raw hides this festive season. Only for registered ICC members. Limited time offer!
                </Text>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[3] }}>
                  <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                    Shop Now
                  </Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(248,247,245,0.9)', padding: spacing[4] }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <MaterialIcons name="shield" size={28} color={colors.primary.DEFAULT} />
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                ICC Digital ID
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="notifications" size={22} color={colors.text.primary} />
              </View>
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="menu" size={22} color={colors.text.primary} />
              </View>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
              <View style={{ overflow: 'hidden', borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: '#ffffff', padding: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="info" size={12} color="#94a3b8" />
                    <Text variant="caption" color="#94a3b8" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      Sponsored
                    </Text>
                  </View>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                    Learn More
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <Image source={{ uri: sponsorImage }} resizeMode="cover" style={{ width: 64, height: 64, borderRadius: radius.lg }} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      Premium Leather Supplies
                    </Text>
                    <Text variant="caption" color="#64748b" style={{ marginTop: 4, lineHeight: 18 }}>
                      Get 20% off on bulk orders of authentic full-grain leather. Certified quality for ICC members.
                    </Text>
                  </View>
                  <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="open-in-new" size={20} color="#ffffff" />
                  </View>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
              <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                Digital Membership Card
              </Text>
              <View style={{ overflow: 'hidden', borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, padding: spacing[6], ...shadows.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[6] }}>
                  <View>
                    <Text variant="caption" color="#ffffff" style={{ opacity: 0.8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      Indian Cobbler Community
                    </Text>
                    <Text variant="caption" color="#ffffff" style={{ marginTop: 2, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      Official Member
                    </Text>
                  </View>
                  <MaterialIcons name="contactless" size={40} color="rgba(255,255,255,0.5)" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <View style={{ width: 96, height: 96, borderRadius: radius.lg, backgroundColor: '#ffffff', padding: 4 }}>
                    <Image source={{ uri: memberImage }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: radius.md }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                      Rajesh Kumar
                    </Text>
                    <Text variant="caption" color="#ffffff" style={{ marginTop: 4, opacity: 0.9 }}>
                      ID: IC-2024-8839
                    </Text>
                    <View style={{ marginTop: spacing[3], gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="location-on" size={12} color="#ffffff" />
                        <Text variant="caption" color="#ffffff">Mumbai, Maharashtra</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="event-available" size={12} color="#ffffff" />
                        <Text variant="caption" color="#ffffff">Valid thru: Dec 2030</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: spacing[6], flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: spacing[4] }}>
                  <View style={{ borderRadius: radius.lg, backgroundColor: '#ffffff', padding: spacing[2] }}>
                    <Image source={{ uri: qrImage }} resizeMode="contain" style={{ width: 48, height: 48 }} />
                  </View>
                  <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                    <MaterialIcons name="qr-code-scanner" size={16} color="#ffffff" />
                    <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      Verify Card
                    </Text>
                  </Pressable>
                </View>
                <MaterialIcons name="badge" size={160} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: -40, bottom: -40 }} />
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[8] }}>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                Community Dashboard
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[4] }}>
                {dashboardItems.map((item) => (
                  <View key={item.title} style={{ width: '47%', borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', backgroundColor: '#ffffff', padding: spacing[4] }}>
                    <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing[3] }}>
                      <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={colors.primary.DEFAULT} />
                    </View>
                    <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                      {item.title}
                    </Text>
                    <Text variant="caption" color="#64748b" style={{ marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[8] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  Recent Updates
                </Text>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  View All
                </Text>
              </View>
              <View style={{ gap: spacing[4] }}>
                <View style={{ flexDirection: 'row', gap: spacing[4], borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#ffffff', padding: spacing[3] }}>
                  <Image source={{ uri: activityImage }} resizeMode="cover" style={{ width: 48, height: 48, borderRadius: radius.lg }} />
                  <View>
                    <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      Skill Workshop in Mumbai
                    </Text>
                    <Text variant="caption" color="#64748b">2 days ago • Community Center</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing[4], borderRadius: radius.lg, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#ffffff', padding: spacing[3] }}>
                  <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="campaign" size={22} color={colors.primary.DEFAULT} />
                  </View>
                  <View>
                    <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      Health Insurance Drive Started
                    </Text>
                    <Text variant="caption" color="#64748b">5 days ago • Welfare Board</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[4] }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            {bottomTabs.map((item) => (
              <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
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

export function MemberDashboardContent({
  withPopupBehavior = false,
}: {
  withPopupBehavior?: boolean;
}) {
  return <DashboardShell withPopup={withPopupBehavior} />;
}
