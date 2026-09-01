import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { radius, spacing, typography } from '@/src/theme';

const avatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeFJG0ITg2ZVIKyJcnhVqwC4mjjEnC-zEJKHtEcXedHiROTP3cUw_RBCitQQ4wazO6FHevLUd0y7NqEgR5ZSQPuxmeZS8aHIBnPaX8hyo0-AMyZHmItCa3wv79HJnnj4aY3V_KmyQil1SdqJC5yjwAnWK0I_gIMqdCRkNfi1W8V3nFSQuzon3xRob4Wiwy9-Lz3V6ktNM8z3X7x99Kf_ivTA0_sfoZkbsJSWuwcl_14tMAmuREQVmWy51sUAWdHvykC6bciQHnBLb';

const managementCards = [
  ['volunteer-activism', 'Donation', 'Community welfare fund'],
  ['calendar-today', 'Event Management', 'Workshops & Exhibitions'],
  ['verified', 'KYC Approvals', '4 Pending verification'],
  ['favorite', 'Matrimony', 'Community matchmaking'],
  ['receipt-long', 'Expense Tracking', 'Workshop overheads'],
  ['newspaper', 'Publication', "The Cobbler's Journal"],
  ['campaign', 'Advertisements', 'Promote artisan tools'],
  ['notifications', 'Notifications', 'Broadcast alerts'],
  ['person-pin', 'Role Management', 'Assign master status'],
  ['lock-open', 'Permissions', 'Access level control'],
  ['forum', 'Community Chat', 'Guild discussions'],
  ['trending-up', 'Analytics', 'Performance insights'],
] as const;

export function UnifiedCommunityDashboardContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
      <View style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(241,237,234,0.85)', paddingHorizontal: spacing[6], paddingVertical: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <MaterialIcons name="menu" size={22} color="#46291e" />
            <Text variant="h3" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
              The Atelier
            </Text>
          </View>
          <Image source={{ uri: avatar }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: radius.full }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[6], paddingTop: spacing[8], paddingBottom: 96 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing[8] }}>
            <View>
              <Text variant="caption" style={{ color: '#964900', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
                Master Artisan
              </Text>
              <Text variant="h1" style={{ marginTop: spacing[2], color: '#46291e', fontSize: 44, lineHeight: 48, fontFamily: typography.fontFamily.bold }}>
                Arjun Varma
              </Text>
              <Text variant="body" style={{ marginTop: spacing[2], color: '#504441', maxWidth: 320 }}>
                Overseeing the legacy of hand-stitched excellence across the Indian Cobbler Community.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              {[
                ['Active Members', '1,284'],
                ['Pending Tasks', '12'],
              ].map(([label, value], index) => (
                <View key={label} style={{ minWidth: 140, borderLeftWidth: index === 1 ? 4 : 0, borderLeftColor: '#964900', borderRadius: radius.xl, backgroundColor: '#f7f3f0', padding: spacing[6] }}>
                  <Text variant="caption" style={{ color: '#504441', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    {label}
                  </Text>
                  <Text variant="h2" style={{ marginTop: spacing[1], color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: spacing[8] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[8] }}>
              <Text variant="h3" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                Artisan Management
              </Text>
              <View style={{ flex: 1, height: 1, marginLeft: spacing[8], backgroundColor: 'rgba(130,116,112,0.3)' }} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[4] }}>
              {managementCards.map(([icon, title, subtitle], index) => (
                <View key={title} style={{ width: '31.5%', borderLeftWidth: title === 'KYC Approvals' ? 2 : 0, borderLeftColor: '#964900', borderRadius: radius.xl, backgroundColor: title === 'Analytics' ? '#46291e' : '#f1edea', padding: spacing[5], flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: title === 'Analytics' ? 'rgba(255,255,255,0.1)' : '#fdf9f6', alignItems: 'center', justifyContent: 'center', marginRight: spacing[5] }}>
                    <MaterialIcons name={icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={title === 'Analytics' ? '#ffffff' : '#964900'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" style={{ color: title === 'Analytics' ? '#ffffff' : '#46291e', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                      {title}
                    </Text>
                    <Text variant="caption" style={{ marginTop: 2, color: title === 'Analytics' ? '#d9ab9b' : title === 'KYC Approvals' ? '#964900' : '#504441', fontSize: 11, fontFamily: title === 'KYC Approvals' ? typography.fontFamily.bold : typography.fontFamily.regular }}>
                      {subtitle}
                    </Text>
                  </View>
                  {title === 'KYC Approvals' ? <View style={{ position: 'absolute', right: spacing[4], top: spacing[4], width: 8, height: 8, borderRadius: radius.full, backgroundColor: '#964900' }} /> : null}
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing[8] }}>
            <View style={{ flex: 7, borderRadius: 24, backgroundColor: '#00504b', padding: spacing[8], overflow: 'hidden' }}>
              <Text variant="caption" style={{ color: '#56c6bc', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
                Featured Guild
              </Text>
              <Text variant="h3" color="#ffffff" style={{ marginTop: spacing[2], fontFamily: typography.fontFamily.bold }}>
                Dharavi Master Craftsmen
              </Text>
              <Text variant="body" color="rgba(255,255,255,0.7)" style={{ marginTop: spacing[4], lineHeight: 22 }}>
                Recognized for their exceptional bridle leather work and sustainable practices. A collaborative of 45 artisans.
              </Text>
              <View style={{ alignSelf: 'flex-start', marginTop: spacing[6], borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: spacing[6], paddingVertical: spacing[2] }}>
                <Text variant="caption" color="#ffffff" style={{ fontSize: 14 }}>
                  View Profile
                </Text>
              </View>
            </View>
            <View style={{ flex: 5, gap: spacing[4] }}>
              {[
                ['Regional Growth', 'North Zone is seeing a 12% increase in new apprentices this month.'],
                ['Craft Preservation', 'New digital archive for Kolhapuri patterns is now 80% complete.'],
              ].map(([title, text]) => (
                <View key={title} style={{ borderBottomWidth: 2, borderBottomColor: 'rgba(150,73,0,0.2)', borderRadius: radius.xl, backgroundColor: '#f7f3f0', padding: spacing[6] }}>
                  <Text variant="h4" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                    {title}
                  </Text>
                  <Text variant="caption" style={{ marginTop: spacing[2], color: '#504441', fontSize: 14 }}>
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f1edea', paddingHorizontal: spacing[4], paddingTop: spacing[3], paddingBottom: spacing[6] }}>
          {[
            { icon: 'home', label: 'Home', active: true },
            { icon: 'menu-book', label: 'Directory', active: false },
            { icon: 'analytics', label: 'Analytics', active: false },
            { icon: 'settings', label: 'Settings', active: false },
          ].map(({ icon, label, active }) => (
            <View key={label} style={{ alignItems: 'center', borderRadius: radius.lg, backgroundColor: active ? '#46291e' : 'transparent', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
              <MaterialIcons name={icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={active ? '#ffffff' : '#603f33'} />
              <Text variant="caption" color={active ? '#ffffff' : '#603f33'} style={{ marginTop: 4, fontFamily: typography.fontFamily.semibold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
