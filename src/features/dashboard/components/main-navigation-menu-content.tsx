import { ScrollView, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppBottomBar } from '@/src/components';
import { getMemberBottomBarRoute, getMemberSidebarRoute, memberBottomBarItems } from '@/src/core/navigation/member-shell';
import { isPlainUserSession } from '@/src/core/navigation/default-route';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing } from '@/src/theme';
import { MainNavigationBanners, MainNavigationHero, MainNavigationSidebar } from './dashboard-blocks';

export function MainNavigationMenuContent({
  updated = false,
}: {
  updated?: boolean;
}) {
  const { safeNavigateRoot } = useSafeNavigation();
  const t = useTranslations('dashboard.main-navigation-menu');
  const { session } = useSession();
  const profileName = session?.user.fullName || t('profile.name');
  const profileImage = session?.user.profilePhotoUrl || undefined;
  const isNormalUser = isPlainUserSession(session);
  const navItemsBase: readonly {
    icon: string;
    label: string;
    active?: boolean;
  }[] = [
    { icon: 'dashboard', label: t('nav.dashboard'), active: true },
    { icon: 'person', label: t('nav.profile') },
    { icon: 'group', label: t('nav.family') },
    { icon: 'event', label: t('nav.events') },
    { icon: 'volunteer-activism', label: t('nav.donations') },
    { icon: 'newspaper', label: t('nav.news') },
    { icon: 'favorite', label: t('nav.matrimony') },
    { icon: 'payments', label: t('nav.transactions') },
    { icon: 'chat', label: t('nav.chats') },
    { icon: 'notifications', label: t('nav.notifications') },
    { icon: 'cake', label: t('nav.birthdays') },
  ];
  const updatedSidebarItems = [
    { key: 'home', icon: 'dashboard', label: t('nav.dashboard'), active: true },
    { key: 'community-directory', icon: 'badge', label: t('nav.people') },
    { key: 'community', icon: 'campaign', label: t('nav.community') },
    { key: 'trustees', icon: 'badge', label: t('nav.trustees') },
    { key: 'events', icon: 'event', label: t('nav.events') },
    { key: 'finance', icon: 'payments', label: t('nav.finance') },
    { key: 'expenses', icon: 'receipt-long', label: t('nav.expenses') },
    { key: 'communication', icon: 'chat', label: t('nav.communication') },
    { key: 'birthdays', icon: 'cake', label: t('nav.birthdays') },
    { key: 'family', icon: 'group', label: t('nav.family') },
    { key: 'donations', icon: 'volunteer-activism', label: t('nav.donations') },
    { key: 'transactions', icon: 'payments', label: t('nav.transactions') },
    { key: 'matrimony', icon: 'favorite', label: t('nav.matrimony') },
    { key: 'notifications', icon: 'notifications', label: t('nav.notifications') },
    { key: 'profile', icon: 'person', label: t('nav.profile') },
  ].filter((item) => !(isNormalUser && (item.key === 'finance' || item.key === 'expenses')));
  const navItems = updated ? updatedSidebarItems : navItemsBase.filter((item) => !(isNormalUser && item.label === t('nav.transactions')));

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fdf9f6' }}>
        <MainNavigationSidebar
          title={t('title.sidebar')}
          subtitle={t('subtitle.sidebar')}
          profileName={profileName}
          profileImage={profileImage}
          badge={t('profile.badge')}
          items={
            updated
              ? updatedSidebarItems.map((item) => ({ key: item.key, icon: item.icon as never, label: item.label, active: item.active }))
              : navItems.map((item) => ({ key: item.label, icon: item.icon as never, label: item.label, active: item.active }))
          }
          onItemPress={(key) => updated && safeNavigateRoot(getMemberSidebarRoute(key))}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[8], paddingBottom: 96, gap: spacing[8], flexGrow: 1 }} style={{ flex: 1 }}>
          <MainNavigationHero
            title={t('hero.title')}
            description={t('hero.description')}
          />
          <MainNavigationBanners />
        </ScrollView>
      </View>

      {!updated ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <AppBottomBar
            activeKey="home"
            onChange={(key) => safeNavigateRoot(getMemberBottomBarRoute(key))}
            items={memberBottomBarItems}
          />
        </View>
      ) : null}
    </AppSafeAreaView>
  );
}
