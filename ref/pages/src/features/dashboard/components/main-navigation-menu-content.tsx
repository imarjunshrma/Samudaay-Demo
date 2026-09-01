import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { radius, spacing, typography } from '@/src/theme';

const topAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuChlT0FnLhllsGwOHBdTXcfY1A7f2IPxbunJ2of2-ioE86MvpGB_YhHmI32vgJtNseo0sJbGyCK8kLGCHAsY0RY3wzMSpo8v4PFqlSKVzbfTJFRNB6g3TFHY8_9OhSc9_TSF-o1Xg2exg2erec87sjDCe8VBZEDsgGUTMQVW6XTfaXJkm-6Zj8Y4E9DJzYR6vqFs549bv_7bv_qdWav9TOPKvUbiSaJqjhRw-gshLq05pj0qq4f3fNRvfApGRtkwussRn8UsS3u_mSH';
const profileImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFIUGZScdKNNMxDULnezEx5rj8pEQ2j4rbAeEkx4t3PaCU9ZyOTNSkvXCvZkDQrKLBSf4pUkLslr1IqWQp9gyj2fdGAQhXOFAkCW31Gj5C9L4UvcbzAjmtagVn5-tgErJszr_SHSuZAtkEDv3yMokBWg-SNYVUZevz1VESP7PhF4ab4KtO6kzydCmm0SoC9JJOm4QKipR3H8kvz_uSNGPqzedy2Zy7Fai_nbI9yNO3q_fFaaYiDxFFdA7tjg9-8GkKYTTksfVvRwk9';
const featureImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCc1RmZZ5YHIAis60Om6y0Y-JGe7WRferxqFKK-VteUKr_Q9gIUfIzODnAuN1_zykvqUlPtET1ypIMJG6EUSsWoeupFRXn07-LZE5tB3KRJwvN7uc2JFnqsCgv33TM_ouvkHur6N-JvYVVBSk3A5CBf9RJWx-J7bJ6LJ9mhsTGCf5s7ZNxjpgtSG0gG5sk1vmTEDaVpTotja8pXxyLSF3N7hFlMPLRTXQSrnyNji10Jxy0mK66KaH3drRrhHcAMmC1XyQWRXSDdgrr5';

const navItemsBase: ReadonlyArray<{
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  active?: boolean;
}> = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'person', label: 'My Profile' },
  { icon: 'group', label: 'Family' },
  { icon: 'event', label: 'Events' },
  { icon: 'volunteer-activism', label: 'Donations' },
  { icon: 'newspaper', label: 'News' },
  { icon: 'favorite', label: 'Matrimony' },
  { icon: 'payments', label: 'My Transactions' },
  { icon: 'chat', label: 'Chats' },
  { icon: 'notifications', label: 'Notifications' },
  { icon: 'cake', label: 'Birthdays' },
] as const;

export function MainNavigationMenuContent({
  updated = false,
}: {
  updated?: boolean;
}) {
  const navItems: ReadonlyArray<{
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
    label: string;
    active?: boolean;
  }> = updated
    ? navItemsBase.map((item, index) =>
        index === 2
          ? { ...item, icon: 'person-search', label: 'Member Directory' }
          : index === 3
            ? { ...item, icon: 'supervisor-account', label: 'Trustees' }
            : item,
      )
    : navItemsBase;
  const name = updated ? 'Rajesh Mochi' : 'Rajesh Kumar';
  const badge = 'Master Cordwainer';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
      <View style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[6], paddingVertical: spacing[4], backgroundColor: 'rgba(253,251,249,0.9)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <MaterialIcons name="menu" size={22} color="#46291e" />
            <Text variant="h3" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold, fontStyle: 'italic' }}>
              The Artisan Atelier
            </Text>
          </View>
          <Image source={{ uri: topAvatar }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: radius.full }} />
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 320, backgroundColor: '#f1edea', borderTopRightRadius: radius.xl, borderBottomRightRadius: radius.xl, paddingHorizontal: spacing[4], paddingTop: spacing[8], paddingBottom: spacing[6] }}>
            <View style={{ paddingHorizontal: spacing[4], marginBottom: spacing[8] }}>
              <Image source={{ uri: profileImage }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: radius.lg, marginBottom: spacing[4] }} />
              <Text variant="h4" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                {name}
              </Text>
              <View style={{ alignSelf: 'flex-start', marginTop: spacing[2], borderRadius: 4, backgroundColor: 'rgba(255,137,40,0.2)', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                <Text variant="caption" style={{ color: '#642f00', fontFamily: typography.fontFamily.medium, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  {badge}
                </Text>
              </View>
              <Text variant="caption" style={{ marginTop: spacing[2], color: 'rgba(80,68,65,0.7)' }}>
                Guild Member since 1994 • Premium Tier
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[4] }}>
              <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(70,41,30,0.1)', paddingTop: spacing[4] }}>
                {navItems.map((item) => (
                  <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: 4, backgroundColor: item.active ? '#46291e' : 'transparent', paddingHorizontal: spacing[4], paddingVertical: spacing[3], marginBottom: 4 }}>
                    <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={item.active ? '#ffffff' : '#603f33'} />
                    <Text variant="caption" color={item.active ? '#ffffff' : '#603f33'} style={{ fontFamily: typography.fontFamily.medium, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: spacing[4], borderTopWidth: 1, borderTopColor: 'rgba(70,41,30,0.1)', paddingTop: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
                  <MaterialIcons name="logout" size={20} color="#ba1a1a" />
                  <Text variant="caption" style={{ color: '#ba1a1a', fontFamily: typography.fontFamily.medium, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Logout
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[8], paddingBottom: 96, flexGrow: 1 }} style={{ flex: 1 }}>
            <Text variant="h1" style={{ color: '#46291e', fontSize: 46, lineHeight: 50, fontFamily: typography.fontFamily.bold, fontStyle: 'italic', marginBottom: spacing[4] }}>
              Welcome back,{'\n'}Master Craftsman.
            </Text>
            <Text variant="body" style={{ color: '#504441', fontSize: 18, maxWidth: 420, marginBottom: spacing[8] }}>
              Your workshop overview and guild updates for today.
            </Text>

            <View style={{ flexDirection: 'row', gap: spacing[8] }}>
              <View style={{ flex: 2, overflow: 'hidden', borderRadius: radius.xl, backgroundColor: '#f1edea', flexDirection: 'row' }}>
                <View style={{ flex: 1, padding: spacing[8], justifyContent: 'center' }}>
                  <Text variant="caption" style={{ color: '#964900', fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: spacing[2] }}>
                    Upcoming Event
                  </Text>
                  <Text variant="h3" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold, marginBottom: spacing[4] }}>
                    The Annual Cordwainers Summit 2024
                  </Text>
                  <Text variant="caption" style={{ color: '#504441', fontSize: 14, marginBottom: spacing[6] }}>
                    Join 200+ masters in Jodhpur to share techniques on vegetable tanning and heritage lasting.
                  </Text>
                  <View style={{ alignSelf: 'flex-start', borderRadius: 4, backgroundColor: '#46291e', paddingHorizontal: spacing[6], paddingVertical: spacing[3] }}>
                    <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.medium, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      Reserve Seat
                    </Text>
                  </View>
                </View>
                <Image source={{ uri: featureImage }} resizeMode="cover" style={{ flex: 1 }} />
              </View>
              <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: 'rgba(150,73,0,0.2)', borderRadius: radius.xl, backgroundColor: '#f7f3f0', padding: spacing[8], justifyContent: 'space-between' }}>
                <View>
                  <MaterialIcons name="volunteer-activism" size={24} color="#964900" style={{ marginBottom: spacing[4] }} />
                  <Text variant="h4" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold, marginBottom: spacing[2] }}>
                    Community Fund
                  </Text>
                  <Text variant="caption" style={{ color: '#504441', fontSize: 14 }}>
                    Supporting 12 new apprentices this month through collective donations.
                  </Text>
                </View>
                <View style={{ marginTop: spacing[8] }}>
                  <Text variant="h2" style={{ color: '#46291e', fontFamily: typography.fontFamily.bold }}>
                    ₹42,500
                  </Text>
                  <Text variant="caption" style={{ color: '#504441', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    Goal Reached: 84%
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {!updated ? (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fdfbf9', borderTopWidth: 1, borderTopColor: 'rgba(70,41,30,0.1)', paddingVertical: spacing[3] }}>
            {[
              { icon: 'home', label: 'Home', active: true },
              { icon: 'calendar-today', label: 'Events' },
              { icon: 'forum', label: 'Chats' },
              { icon: 'article', label: 'News' },
              { icon: 'person', label: 'Profile' },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color={item.active ? '#964900' : 'rgba(96,63,51,0.6)'} />
                <Text variant="caption" style={{ color: item.active ? '#964900' : 'rgba(96,63,51,0.6)', fontFamily: typography.fontFamily.semibold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
