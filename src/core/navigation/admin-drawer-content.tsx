import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';
import { useMemo } from 'react';

import { AppSidebar } from '@/src/components/layout/AppSidebar/AppSidebar';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { useSession } from '@/src/core/providers/session-provider';
import { useSafeNavigation } from './safe-navigation';
import { adminSidebarItems, getAdminNavKeyForPath, getAdminSidebarRoute, getVisibleAdminSidebarItems } from './admin-shell';

export function AdminDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { safeNavigateRoot } = useSafeNavigation();
  const { tenantName } = useLocalizedBrandText();
  const { signOut, isSubmitting } = useAuthActions();
  const { session } = useSession();
  const activeKey = getAdminNavKeyForPath(pathname);
  const profileName = session?.user.fullName || 'Admin';
  const profileImage = session?.user.profilePhotoUrl || undefined;
  const items = useMemo(
    () => {
      const visibleItems = getVisibleAdminSidebarItems(session);
      const hasPeopleItem = visibleItems.some((item) => item.key === 'people');
      const hasCommunityItem = visibleItems.some((item) => item.key === 'community');
      const peopleItem = adminSidebarItems.find((item) => item.key === 'people');
      const communityItem = adminSidebarItems.find((item) => item.key === 'community');
      const rawItems = [
        ...visibleItems,
        ...(!hasPeopleItem && peopleItem ? [peopleItem] : []),
        ...(!hasCommunityItem && communityItem ? [communityItem] : []),
      ];
      const nextItems = adminSidebarItems.filter((sidebarItem) => rawItems.some((item) => item.key === sidebarItem.key));

      return nextItems.map((item) => ({ ...item, active: item.key === activeKey }));
    },
    [activeKey, session],
  );

  return (
    <AppSidebar
      profileName={profileName}
      profileImage={profileImage}
      badge="Admin"
      subtitle={tenantName}
      items={items}
      onItemPress={(key) => {
        props.navigation.closeDrawer();
        const tabScreenByKey: Record<string, string> = {
          home: 'dashboard',
          clients: 'manage-directory',
          members: 'manage-directory',
          invoices: 'invoices',
          profile: 'profile',
        };
        const tabScreen = tabScreenByKey[key];
        if (tabScreen) {
          props.navigation.navigate('(tabs)' as never, { screen: tabScreen } as never);
          return;
        }
        safeNavigateRoot(getAdminSidebarRoute(key));
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
