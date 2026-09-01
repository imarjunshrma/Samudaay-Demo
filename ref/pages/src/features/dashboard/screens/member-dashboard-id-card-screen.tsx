import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import {
  memberDashboardBottomNav,
  memberDashboardCards,
  memberDashboardImages,
  memberDashboardUpdates,
} from '../constants';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function Header() {
  return (
    <View
      style={{
        backgroundColor: 'rgba(248,247,245,0.92)',
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.borderLight,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          maxWidth: 672,
          width: '100%',
          alignSelf: 'center',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <MaterialIcons name="shield" size={30} color={colors.primary.DEFAULT} />
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            ICC Digital ID
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.9} style={{ padding: spacing[2], borderRadius: radius.full }}>
            <MaterialIcons name="notifications" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.9} style={{ padding: spacing[2], borderRadius: radius.full }}>
            <MaterialIcons name="menu" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function DashboardCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }) {
  return (
    <Pressable
      style={{
        width: '48%',
        padding: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        gap: spacing[3],
        ...shadows.sm,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.lg,
          backgroundColor: colors.primary.muted,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
      </View>
      <View>
        <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#64748b">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function BottomBar() {
  return (
    <View
      style={{
        backgroundColor: colors.background.DEFAULT,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[4],
      }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        {memberDashboardBottomNav.map((item) => (
          <Pressable key={item.key} style={{ alignItems: 'center', gap: 4, minWidth: 64 }}>
            <MaterialIcons name={item.icon} size={24} color={item.active ? colors.primary.DEFAULT : '#9ca3af'} />
            <Text variant="navLabel" color={item.active ? colors.primary.DEFAULT : '#9ca3af'}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function MemberDashboardIdCardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <Header />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
              <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                Digital Membership Card
              </Text>
              <View
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: radius.xl,
                  padding: spacing[6],
                  backgroundColor: colors.primary.DEFAULT,
                  ...shadows.lg,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[6] }}>
                  <View>
                    <Text variant="caption" color="rgba(255,255,255,0.8)" style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
                      Indian Cobbler Community
                    </Text>
                    <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      Official Member
                    </Text>
                  </View>
                  <MaterialIcons name="contactless" size={40} color="rgba(255,255,255,0.5)" />
                </View>

                <View style={{ flexDirection: 'row', gap: spacing[4], alignItems: 'center' }}>
                  <View
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: radius.lg,
                      backgroundColor: colors.background.surface,
                      padding: 4,
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{
                        uri: memberDashboardImages.memberPhoto,
                      }}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%', borderRadius: radius.md }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="h2" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, lineHeight: 30 }}>
                      Rajesh Kumar
                    </Text>
                    <Text variant="caption" color="rgba(255,255,255,0.9)" style={{ marginTop: 4, fontSize: 14 }}>
                      ID: IC-2024-8839
                    </Text>
                    <View style={{ marginTop: spacing[3], gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="location-on" size={12} color={colors.text.inverse} />
                        <Text variant="caption" color={colors.text.inverse}>
                          Mumbai, Maharashtra
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="event-available" size={12} color={colors.text.inverse} />
                        <Text variant="caption" color={colors.text.inverse}>
                          Valid thru: Dec 2030
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: spacing[6],
                    paddingTop: spacing[4],
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255,255,255,0.2)',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ backgroundColor: colors.background.surface, padding: spacing[2], borderRadius: radius.lg }}>
                    <Image
                      source={{
                        uri: memberDashboardImages.qrCode,
                      }}
                      resizeMode="contain"
                      style={{ width: 48, height: 48 }}
                    />
                  </View>
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.9}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      paddingHorizontal: spacing[4],
                      paddingVertical: spacing[2],
                      borderRadius: radius.lg,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[2],
                    }}>
                    <MaterialIcons name="qr-code-scanner" size={16} color={colors.text.inverse} />
                    <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      Verify Card
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.1 }}>
                  <MaterialIcons name="badge" size={160} color={colors.text.inverse} />
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[8] }}>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                Community Dashboard
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4], justifyContent: 'space-between' }}>
                {memberDashboardCards.map((item) => (
                  <DashboardCard key={item.title} title={item.title} subtitle={item.subtitle} icon={item.icon} />
                ))}
              </View>
            </View>

            <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[8], marginBottom: spacing[16] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  Recent Updates
                </Text>
                <TouchableOpacity accessibilityRole="button" activeOpacity={0.9}>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: spacing[4] }}>
                {memberDashboardUpdates.map((item) => (
                  <View
                    key={item.title}
                    style={{
                      flexDirection: 'row',
                      gap: spacing[4],
                      padding: spacing[3],
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    {item.type === 'image' ? (
                      <View style={{ width: 48, height: 48, borderRadius: radius.lg, overflow: 'hidden' }}>
                        <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: radius.lg,
                          backgroundColor: colors.primary.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <MaterialIcons name={item.icon} size={24} color={colors.primary.DEFAULT} />
                      </View>
                    )}
                    <View>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                        {item.title}
                      </Text>
                      <Text variant="caption" color="#64748b">
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <BottomBar />
        </View>
      </View>
    </SafeAreaView>
  );
}
