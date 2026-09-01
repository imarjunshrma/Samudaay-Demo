import { Image, Pressable, SafeAreaView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const memberImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVMkCFB0gq-x-pgREX5Bx2fwCJh-SnyQ0B92eDO9SNh2bCvT7A_R3feQCHrBPI2RC0e3WNshD_oIm-oC8D8Mq8YSSyxlSTSytkucBfrb8RZ2kk6grzicr49tpByQqMnA0bb0BlfAn029mxn7UelWgnUfmUjc5m2DsQAMaefYQoacdcK2sMcA-iJZSbiwqPveOOxfKVuGXzvT4DT46M-x1oolJ-R3AK6uFt6VZlkidysGcYpXMl2LkY1C6FNgRDioz8gj9IHaH2DsUn';

const services = [
  { icon: 'restaurant', title: 'Lunch Coupon', subtitle: 'Traditional Thali', state: 'action' },
  { icon: 'redeem', title: 'Gift Pack', subtitle: 'Tool Kit V2', state: 'redeemed' },
  { icon: 'dinner-dining', title: 'Dinner Pass', subtitle: 'Networking Gala', state: 'action' },
] as const;

export function QrScannerContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT }}>
          <View style={{ width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
            Admin QR Scanner
          </Text>
          <View style={{ width: 48, alignItems: 'flex-end' }}>
            <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="history" size={22} color={colors.text.primary} />
            </View>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#111827', opacity: 0.6 }} />
          <View style={{ width: 256, height: 256, position: 'relative', zIndex: 10 }}>
            <View style={{ width: '100%', height: '100%', borderRadius: radius.xl, borderWidth: 2, borderColor: 'rgba(242,120,13,0.5)', backgroundColor: 'transparent' }} />
            {[
              { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radius.lg },
              { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radius.lg },
              { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radius.lg },
              { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radius.lg },
            ].map((corner, index) => (
              <View key={index} style={{ position: 'absolute', width: 40, height: 40, borderColor: colors.primary.DEFAULT, ...corner }} />
            ))}
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, backgroundColor: colors.primary.DEFAULT, shadowColor: colors.primary.DEFAULT, shadowOpacity: 0.8, shadowRadius: 10 }} />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 32, zIndex: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[6] }}>
            <View style={{ width: 48, height: 48, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="flashlight-on" size={22} color="#ffffff" />
            </View>
            <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', ...shadows.lg }}>
              <MaterialIcons name="qr-code-scanner" size={36} color="#ffffff" />
            </View>
            <View style={{ width: 48, height: 48, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="sync" size={22} color="#ffffff" />
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: radius.xl, backgroundColor: 'rgba(242,120,13,0.1)', padding: 4 }}>
            <View style={{ flex: 1, borderRadius: radius.lg, backgroundColor: '#ffffff', paddingVertical: spacing[3], alignItems: 'center', ...shadows.sm }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                Event Attendance
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: spacing[3] }}>
              <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                Add-on Verification
              </Text>
            </View>
          </View>
        </View>

        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#ffffff', padding: spacing[6], ...shadows.lg }}>
            <View style={{ width: 48, height: 6, borderRadius: radius.full, backgroundColor: '#e2e8f0', alignSelf: 'center', marginBottom: spacing[6] }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginBottom: spacing[6] }}>
              <Image source={{ uri: memberImage }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 18, borderWidth: 2, borderColor: colors.primary.DEFAULT }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                    Rajesh Kumar
                  </Text>
                  <View style={{ borderRadius: radius.full, backgroundColor: '#dcfce7', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                    <Text variant="caption" color="#15803d" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase' }}>
                      Verified
                    </Text>
                  </View>
                </View>
                <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
                  Member ID: #ICC-2024-8892
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <MaterialIcons name="event-available" size={16} color={colors.primary.DEFAULT} />
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 12 }}>
                    National Cobbler Meet 2024
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[4] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginBottom: spacing[3], fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Service Verification
              </Text>
              <View style={{ gap: spacing[3] }}>
                {services.map((service) => (
                  <View key={service.title} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', paddingVertical: spacing[2], opacity: service.state === 'redeemed' ? 0.6 : 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, paddingRight: spacing[3] }}>
                      <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: service.state === 'redeemed' ? '#f1f5f9' : 'rgba(242,120,13,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name={service.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={service.state === 'redeemed' ? '#64748b' : colors.primary.DEFAULT} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                          {service.title}
                        </Text>
                        <Text variant="caption" color="#64748b" style={{ fontSize: 12 }}>
                          {service.subtitle}
                        </Text>
                      </View>
                    </View>
                    {service.state === 'redeemed' ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="check-circle" size={16} color="#16a34a" />
                        <Text variant="caption" color="#16a34a" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase' }}>
                          Redeemed
                        </Text>
                      </View>
                    ) : (
                      <Pressable style={{ borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                        <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                          Mark as Used
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <Pressable style={{ marginTop: spacing[4], borderRadius: radius.xl, backgroundColor: '#0f172a', paddingVertical: spacing[4], alignItems: 'center' }}>
              <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                Next Scan
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[3] }}>
          <View style={{ flexDirection: 'row' }}>
            {[
              { icon: 'qr-code-scanner', label: 'Scan', active: true },
              { icon: 'group', label: 'Members', active: false },
              { icon: 'settings', label: 'Settings', active: false },
            ].map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#64748b'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#64748b'} style={{ fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium, fontSize: 12 }}>
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
