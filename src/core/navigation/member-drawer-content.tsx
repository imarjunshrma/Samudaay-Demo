import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';
import { Linking } from 'react-native';

import { AppSidebar } from '@/src/components/layout/AppSidebar/AppSidebar';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { useTranslations } from '@/src/i18n/use-translations';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { useLocalizedProfileText } from '@/src/features/profile/services/localized-profile-text';
import { useSession } from '@/src/core/providers/session-provider';
import { isPlainUserSession } from './default-route';
import { useSafeNavigation } from './safe-navigation';
import { getMemberSidebarItems, getMemberSidebarRoute, USER_MANUAL_URL } from './member-shell';

const memberTabRouteByKey: Record<string, string> = {
  home: 'index',
  community: 'community',
  members: 'members',
  matrimony: 'matrimony',
  profile: 'profile',
};

function getActiveSidebarKey(pathname: string) {
  if (pathname.startsWith('/member/community-directory')) return 'community-directory';
  if (pathname.startsWith('/member/community-members')) return 'community-members';
  if (pathname.startsWith('/member/birthday-reminders')) return 'birthdays';

  if (pathname === '/member' || pathname.startsWith('/member/community')) {
    return pathname === '/member' ? 'home' : 'community';
  }

  if (pathname.startsWith('/member/members')) return 'members';
  if (pathname.startsWith('/member/events') || pathname.startsWith('/events')) return 'events';
  if (pathname.startsWith('/member/trustees') || pathname.startsWith('/directory/trustees')) return 'trustees';
  if (pathname.startsWith('/finance/expenses')) return 'expenses';
  if (pathname.startsWith('/finance')) return 'finance';
  if (pathname.startsWith('/communication/birthday-reminders')) return 'birthdays';
  if (pathname.startsWith('/communication/community-hub')) return 'community';
  if (pathname.startsWith('/communication/community-chats')) return 'chats';
  if (pathname.startsWith('/communication')) return 'community';
  if (pathname.startsWith('/publications')) return 'publications';
  if (pathname.startsWith('/member/family')) return 'family';
  if (pathname.startsWith('/member/donations')) return 'donations';
  if (pathname.startsWith('/member/transactions')) return 'transactions';
  if (pathname.startsWith('/member/matrimony') || pathname.startsWith('/matrimony')) return 'matrimony';
  if (pathname.startsWith('/member/notifications')) return 'notifications';
  if (pathname.startsWith('/member/user-manual')) return 'user-manual';
  if (pathname.startsWith('/member/profile') || pathname.startsWith('/profile')) return 'profile';

  return 'home';
}

export function MemberDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { safeNavigateRoot } = useSafeNavigation();
  const { tenantName } = useLocalizedBrandText();
  const t = useTranslations();
  const { signOut, isSubmitting } = useAuthActions();
  const { session } = useSession();
  const activeKey = getActiveSidebarKey(pathname);
  const profileName = useLocalizedProfileText(session?.user.fullName || 'Committee Member');
  const profileImage = session?.user.profilePhotoUrl || undefined;
  const hideFinance = isPlainUserSession(session);
  const hideCommunityDirectory = isPlainUserSession(session);
  const hideRestrictedModules = isPlainUserSession(session);
  const badge = (() => {
    switch (session?.user.communityMembershipStatus) {
      case 'PENDING':
        return t('membership.pending');
      case 'INACTIVE':
        return t('membership.inactive');
      case 'REJECTED':
        return t('membership.rejected');
      case 'SUSPENDED':
        return t('membership.suspended');
      case 'ACTIVE':
      default:
        return t('membership.verified');
    }
  })();

  return (
    <AppSidebar
      profileName={profileName}
      profileImage={profileImage}
      badge={badge}
      subtitle={tenantName}
      items={getMemberSidebarItems(activeKey, { hideFinance, hideCommunityDirectory, hideRestrictedModules })}
      onItemPress={(key) => {
        props.navigation.closeDrawer();
        if (key === 'user-manual') {
          void Linking.openURL(USER_MANUAL_URL);
          return;
        }
        const tabRoute = memberTabRouteByKey[key];
        if (tabRoute) {
          props.navigation.navigate('(tabs)', { screen: tabRoute });
          return;
        }
        safeNavigateRoot(getMemberSidebarRoute(key));
      }}
      onLogoutPress={async () => {
        props.navigation.closeDrawer();
        await signOut();
      }}
      logoutLoading={isSubmitting}
      variant="updated"
    />
  );
}
