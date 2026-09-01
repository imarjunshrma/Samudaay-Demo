import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { radius, spacing, typography } from '@/src/theme';

const palette = {
  surface: '#fdf9f6',
  primary: '#46291e',
  secondary: '#964900',
  tertiary: '#003733',
  tertiaryContainer: '#00504b',
  onTertiaryContainer: '#56c6bc',
  surfaceContainer: '#f1edea',
  surfaceContainerLow: '#f7f3f0',
  surfaceContainerHighest: '#e5e2df',
  outlineVariant: '#d4c3be',
  onSurface: '#1c1b1a',
  onSurfaceVariant: '#504441',
  error: '#ba1a1a',
  primaryContainer: '#603f33',
  onPrimaryContainer: '#d9ab9b',
};

function SectionHeading({ children }: { children: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <Text variant="h3" color={palette.primary} style={{ fontStyle: 'italic', fontFamily: 'serif' }}>
        {children}
      </Text>
      <View style={{ height: 1, flex: 1, marginLeft: spacing[4], backgroundColor: 'rgba(212,195,190,0.3)' }} />
    </View>
  );
}

function DetailRow({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <View style={{ gap: 4, flex: 1 }}>
      <Text variant="caption" color="rgba(80,68,65,0.6)" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Text>
      <Text variant="body" color={palette.onSurface} style={{ fontFamily: typography.fontFamily.medium, fontSize: large ? 18 : 16 }}>
        {value}
      </Text>
    </View>
  );
}

function ActionCard({
  icon,
  iconBackground,
  iconColor,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconBackground: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[6],
        borderRadius: radius.xl,
        backgroundColor: 'rgba(229,226,223,0.4)',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[5] }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.full,
            backgroundColor: iconBackground,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        <View>
          <Text variant="label" color={palette.onSurface} style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="body" color={palette.onSurfaceVariant} style={{ fontSize: 14 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={palette.primary} />
    </Pressable>
  );
}

export function MyProfileContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.surface }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(250,250,249,0.92)',
            paddingHorizontal: spacing[6],
            paddingVertical: spacing[4],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <Pressable accessibilityRole="button" style={{ padding: spacing[2], borderRadius: radius.full }}>
              <MaterialIcons name="arrow-back" size={24} color="#7c2d12" />
            </Pressable>
            <Text variant="h4" color="#7c2d12" style={{ fontStyle: 'italic', fontFamily: 'serif' }}>
              Profile
            </Text>
          </View>
          <Text variant="label" color="#431407" style={{ fontFamily: 'serif', fontWeight: '700' }}>
            IC Community
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 96, paddingHorizontal: spacing[6], paddingBottom: 140, gap: 40 }}>
          <View style={{ alignItems: 'center', gap: spacing[4] }}>
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  overflow: 'hidden',
                  borderWidth: 4,
                  borderColor: palette.surfaceContainer,
                }}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYoc9Ev32jOQfSa8Sg5ayqCCa0Kwb-2Tinp9fnoeQV-YO2Ow2TyvCnlhfRV0d3qrhCG5Vsx8WmveM2LEqAHKGsoehWA_70FaYGbNLDDESfVpBp9S7VoOfrK8NWh1fLd6E0VTYI9mf0LoLNlpfEJdmEvq5ZWNloVGly-7ycdfGGiQrY-9PZE9usJxog2xZ1SkPTCJXzoa86BXiGHDshlDiu49buCZvjlUpRO0R02CJoazf7OrILTLvLQkpRqQ1a6w5XlOKSUl2BcacV' }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 4,
                  bottom: 4,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: palette.surface,
                  backgroundColor: palette.tertiary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons name="verified" size={16} color="#fff" />
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="h1" color={palette.primary} style={{ letterSpacing: -0.5, fontFamily: 'serif', fontSize: 34 }}>
                Rajesh Kumar
              </Text>
              <Text variant="caption" color={palette.onSurfaceVariant} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, letterSpacing: 1 }}>
                MEMBER ID: IC-2024-8839
              </Text>
              <View
                style={{
                  marginTop: spacing[3],
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                  borderRadius: radius.full,
                  backgroundColor: palette.tertiaryContainer,
                }}>
                <Text variant="caption" color={palette.onTertiaryContainer} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.4 }}>
                  Verified Artisan
                </Text>
              </View>
            </View>
          </View>

          <View style={{ gap: spacing[6] }}>
            <SectionHeading>Personal Details</SectionHeading>
            <View style={{ backgroundColor: palette.surfaceContainerLow, padding: spacing[6], borderRadius: radius.xl, gap: spacing[6] }}>
              <View style={{ gap: spacing[6], borderBottomWidth: 1, borderBottomColor: 'rgba(212,195,190,0.2)', paddingBottom: spacing[6] }}>
                <DetailRow label="Full Name (English)" value="Rajesh Kumar" />
                <DetailRow label="Full Name (Gujarati) / પૂરું નામ (ગુજરાતી)" value="રાજેશ કુમાર" large />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[8], rowGap: spacing[6] }}>
                <View style={{ width: '47%' }}><DetailRow label="Father Name" value="Suresh Kumar" /></View>
                <View style={{ width: '47%' }}><DetailRow label="Gender" value="Male" /></View>
                <View style={{ width: '47%' }}><DetailRow label="Date of Birth" value="12th August 1985" /></View>
                <View style={{ width: '47%' }}><DetailRow label="Occupation" value="Master Cordwainer" /></View>
              </View>
            </View>
          </View>

          <View style={{ gap: spacing[6] }}>
            <SectionHeading>Contact & Location</SectionHeading>
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <View style={{ flex: 1, backgroundColor: palette.surfaceContainer, padding: spacing[5], borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <MaterialIcons name="call" size={24} color={palette.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" color="rgba(80,68,65,0.6)" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      Mobile Number
                    </Text>
                    <Text variant="body" color={palette.onSurface} style={{ fontFamily: typography.fontFamily.semibold }}>
                      +91 98765 43210
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, backgroundColor: palette.surfaceContainer, padding: spacing[5], borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <MaterialIcons name="mail" size={24} color={palette.secondary} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" color="rgba(80,68,65,0.6)" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      Email Address
                    </Text>
                    <Text variant="body" color={palette.onSurface} style={{ fontFamily: typography.fontFamily.semibold }}>
                      rajesh.kumar@artisan.in
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: palette.surfaceContainerLow, padding: spacing[6], borderRadius: radius.xl }}>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <MaterialIcons name="location-on" size={24} color={palette.secondary} style={{ marginTop: 4 }} />
                  <View style={{ flex: 1, gap: spacing[6] }}>
                    <View style={{ gap: spacing[4], borderBottomWidth: 1, borderBottomColor: 'rgba(212,195,190,0.2)', paddingBottom: spacing[4] }}>
                      <View>
                        <Text variant="caption" color="rgba(80,68,65,0.6)" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>
                          Address (English)
                        </Text>
                        <Text variant="body" color={palette.onSurface} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
                          42, Leather Artisan Row, Dharavi Market
                        </Text>
                      </View>
                      <View>
                        <Text variant="caption" color="rgba(80,68,65,0.6)" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>
                          Address (Gujarati) / સરનામું (ગુજરાતી)
                        </Text>
                        <Text variant="body" color={palette.onSurface} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24, fontSize: 18 }}>
                          ૪૨, લેધર આર્ટિસન રો, ધારાવી માર્કેટ
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                      <View style={{ flex: 1 }}><DetailRow label="City" value="Mumbai" /></View>
                      <View style={{ flex: 1 }}><DetailRow label="Pincode" value="400017" /></View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ gap: spacing[4] }}>
            <Text variant="h3" color={palette.primary} style={{ fontStyle: 'italic', fontFamily: 'serif', marginBottom: spacing[2] }}>
              Management
            </Text>
            <ActionCard icon="groups" iconBackground={palette.primaryContainer} iconColor={palette.onPrimaryContainer} title="Manage Family Members" subtitle="4 Registered Members" />
            <ActionCard icon="folder-shared" iconBackground={palette.tertiaryContainer} iconColor={palette.onTertiaryContainer} title="Document Management" subtitle="View uploaded KYC documents" />
          </View>

          <View style={{ paddingTop: spacing[8], paddingBottom: spacing[12], alignItems: 'center', gap: spacing[6] }}>
            <Pressable
              accessibilityRole="button"
              style={{
                paddingHorizontal: spacing[8],
                paddingVertical: spacing[3],
                borderRadius: 999,
                borderWidth: 1,
                borderColor: palette.error,
              }}>
              <Text variant="body" color={palette.error} style={{ fontFamily: typography.fontFamily.bold }}>
                Sign Out
              </Text>
            </Pressable>
            <Text variant="caption" color="rgba(80,68,65,0.4)" style={{ textAlign: 'center', fontFamily: typography.fontFamily.medium }}>
              Version 2.4.1 (Artisan Cordwain Edition){'\n'}Crafted with pride in India
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingHorizontal: spacing[4],
            paddingTop: spacing[3],
            paddingBottom: spacing[6],
            backgroundColor: '#fafaf9',
            borderTopWidth: 1,
            borderTopColor: 'rgba(231,229,228,0.6)',
          }}>
          {[
            { icon: 'newspaper', label: 'Feed', active: false },
            { icon: 'groups', label: 'Community', active: false },
            { icon: 'person', label: 'Profile', active: true },
            { icon: 'settings', label: 'Settings', active: false },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[1],
                borderRadius: radius.xl,
                backgroundColor: item.active ? 'rgba(254,215,170,0.5)' : 'transparent',
              }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? '#7c2d12' : '#78716c'} />
              <Text variant="caption" color={item.active ? '#7c2d12' : '#78716c'} style={{ marginTop: 4, fontSize: 11, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
