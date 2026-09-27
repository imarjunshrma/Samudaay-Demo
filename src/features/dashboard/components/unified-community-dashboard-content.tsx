import { useRouter } from 'expo-router';
import { Platform, ScrollView, View } from 'react-native';

import { AppSafeAreaView, Text } from '@/src/components';
import { isPlainUserSession } from '@/src/core/navigation/default-route';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useLocalizedProfileText } from '@/src/features/profile/services/localized-profile-text';
import { colors, spacing, typography } from '@/src/theme';
import { useMemberDashboard } from '../hooks';
import { emptyDashboardSummary } from '../services/dashboard-service';
import {
  UnifiedDashboardBanners,
  UnifiedDashboardBottomBar,
  UnifiedDashboardHero,
  UnifiedDashboardManagementGrid,
  UnifiedDashboardTopBar,
} from './dashboard-blocks';

export function UnifiedCommunityDashboardContent() {
  const router = useRouter();
  const { safeNavigateRoot, safePush } = useSafeNavigation();
  const { session } = useSession();
  const { dashboard } = useMemberDashboard();
  const summary = dashboard ?? emptyDashboardSummary;
  const isNormalUser = isPlainUserSession(session);
  const localizedMemberName = useLocalizedProfileText(summary.identityCard.memberName || 'Community');
  const managementCards = (
    [
    ['volunteer-activism', 'Donation', summary.summary?.donationCount ? `${summary.summary.donationCount} records` : 'Community welfare fund', '/member/donations'],
    ['calendar-today', 'Event Management', summary.summary?.eventsJoined ? `${summary.summary.eventsJoined} joined` : 'Workshops & Exhibitions', '/events/my-events-list'],
    ['favorite', 'Matrimony', summary.summary?.activeMatrimonyProfiles ? `${summary.summary.activeMatrimonyProfiles} active profiles` : 'Community matchmaking', '/member/matrimony'],
    ['receipt-long', 'Family', summary.summary?.familyCount ? `${summary.summary.familyCount} linked` : 'Family records', '/member/family'],
    ['newspaper', 'Publication', summary.cards.find((item) => item.title === 'Publication')?.subtitle || "The Cobbler's Journal", '/publications/archive'],
    ['forum', 'Chat', 'Discussions', '/communication/community-chats'],
    ['notifications', 'Notifications', summary.summary?.unreadNotices ? `${summary.summary.unreadNotices} unread` : 'Broadcast alerts', '/member/notifications'],
    ['trending-up', 'Overview', 'Performance insights', '/finance/finance-analytics'],
    ] as const
  ).filter(([, title]) => {
    if (Platform.OS === 'ios' && title === 'Donation') {
      return false;
    }

    return !(isNormalUser && title === 'Publication');
  });

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <UnifiedDashboardTopBar
          title={localizedMemberName || 'Community'}
          onNotificationsPress={() => safePush('/member/notifications')}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], paddingBottom: 88, gap: spacing[8], flexGrow: 1 }} style={{ flex: 1 }}>
          <UnifiedDashboardHero
            title={localizedMemberName}
            subtitle={summary.identityCard.location ? `Community overview for ${summary.identityCard.location}.` : 'Community overview and member activity.'}
            statOne={{ label: 'Events Joined', value: String(summary.summary?.eventsJoined ?? 0) }}
            statTwo={{ label: 'Unread Notices', value: String(summary.summary?.unreadNotices ?? 0), helper: 'Community updates' }}
          />

          <View>
            <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: spacing[4] }}>
              Artisan Management
            </Text>
            <UnifiedDashboardManagementGrid items={managementCards.map(([icon, title, subtitle, route]) => ({ icon, title, subtitle, onPress: () => router.push(route as never) }))} />
          </View>

          <UnifiedDashboardBanners />
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <UnifiedDashboardBottomBar
            activeKey="home"
            onChange={(key) => {
              switch (key) {
                case 'home':
                  safeNavigateRoot('/dashboard/unified-community-dashboard');
                  break;
                case 'directory':
                  safeNavigateRoot('/member/members');
                  break;
                case 'analytics':
                  safeNavigateRoot('/finance/finance-analytics');
                  break;
                case 'settings':
                  safeNavigateRoot('/dashboard/main-navigation-menu-updated');
                  break;
                default:
                  safeNavigateRoot('/dashboard/unified-community-dashboard');
              }
            }}
          />
        </View>
      </View>
    </AppSafeAreaView>
  );
}
