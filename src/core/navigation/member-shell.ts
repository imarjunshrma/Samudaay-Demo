import type { AppBottomBarItem } from '@/src/components/layout/AppBottomBar/AppBottomBar';
import type { AppSidebarItem } from '@/src/components/layout/AppSidebar/AppSidebar';
import { Platform } from 'react-native';

export const memberPrimaryRoutes = {
  home: '/member',
  community: '/member/community',
  communityDirectory: '/member/community-directory',
  communityMembers: '/member/community-members',
  members: '/member/members',
  trustees: '/member/trustees',
  events: '/member/events',
  finance: '/finance/finance-analytics',
  expenses: '/finance/expenses',
  communication: '/member/community',
  chats: '/communication/community-chats',
  publications: '/publications/archive',
  birthdays: '/member/birthday-reminders',
  matrimony: '/member/matrimony',
  profile: '/member/profile',
  sidebar: '/dashboard/main-navigation-menu-updated',
  donations: '/member/donations',
  transactions: '/member/transactions',
  family: '/member/family',
  notifications: '/member/notifications',
  userManual: '/member/user-manual',
} as const;

export const USER_MANUAL_URL = 'https://samudaay.co.in/usermanual/mectv-android-docs/en/';

export const memberBottomBarItems: readonly AppBottomBarItem[] = [
  { key: 'home', icon: 'home', label: 'nav.home' },
  { key: 'community', icon: 'campaign', label: 'nav.community' },
  { key: 'members', icon: 'groups', label: 'nav.members' },
  { key: 'matrimony', icon: 'favorite', label: 'nav.matrimony' },
  { key: 'profile', icon: 'person-pin', label: 'nav.profile' },
] as const;

export function getMemberBottomBarRoute(key: string) {
  switch (key) {
    case 'home':
      return memberPrimaryRoutes.home;
    case 'community':
      return memberPrimaryRoutes.community;
    case 'members':
      return memberPrimaryRoutes.members;
    case 'matrimony':
      return memberPrimaryRoutes.matrimony;
    case 'profile':
      return memberPrimaryRoutes.profile;
    default:
      return memberPrimaryRoutes.home;
  }
}

export function getMemberSidebarItems(
  activeKey: string,
  options?: { hideFinance?: boolean; hideCommunityDirectory?: boolean; hideRestrictedModules?: boolean },
): AppSidebarItem[] {
  return [
    { key: 'home', icon: 'dashboard', label: 'nav.dashboard', active: activeKey === 'home' },
    { key: 'community-directory', icon: 'badge', label: 'nav.people', active: activeKey === 'community-directory' },
    { key: 'community-members', icon: 'groups', label: 'nav.communityMembers', active: activeKey === 'community-members' },
    { key: 'trustees', icon: 'badge', label: 'nav.trustees', active: activeKey === 'trustees' },
    { key: 'events', icon: 'event', label: 'nav.events', active: activeKey === 'events' },
    { key: 'finance', icon: 'payments', label: 'nav.finance', active: activeKey === 'finance' },
    { key: 'expenses', icon: 'receipt-long', label: 'nav.expenses', active: activeKey === 'expenses' },
    { key: 'community', icon: 'campaign', label: 'nav.community', active: activeKey === 'community' },
    { key: 'chats', icon: 'forum', label: 'nav.chats', active: activeKey === 'chats' },
    { key: 'publications', icon: 'newspaper', label: 'nav.publications', active: activeKey === 'publications' },
    { key: 'birthdays', icon: 'cake', label: 'nav.birthdays', active: activeKey === 'birthdays' },
    { key: 'family', icon: 'group', label: 'nav.family', active: activeKey === 'family' },
    { key: 'donations', icon: 'volunteer-activism', label: 'nav.donations', active: activeKey === 'donations' },
    { key: 'transactions', icon: 'payments', label: 'nav.transactions', active: activeKey === 'transactions' },
    { key: 'matrimony', icon: 'favorite', label: 'nav.matrimony', active: activeKey === 'matrimony' },
    { key: 'notifications', icon: 'notifications', label: 'nav.notifications', active: activeKey === 'notifications' },
    { key: 'user-manual', icon: 'help-outline', label: 'nav.userManual', active: activeKey === 'user-manual' },
  ].filter((item) => {
    if (options?.hideFinance && (item.key === 'finance' || item.key === 'expenses')) {
      return false;
    }

    if (options?.hideCommunityDirectory && item.key === 'community-directory') {
      return false;
    }

    if (options?.hideRestrictedModules && item.key === 'publications') {
      return false;
    }

    if (Platform.OS === 'ios' && item.key === 'donations') {
      return false;
    }

    return true;
  });
}

export function getMemberSidebarRoute(key: string) {
  switch (key) {
    case 'home':
      return memberPrimaryRoutes.home;
    case 'community':
      return memberPrimaryRoutes.community;
    case 'trustees':
      return memberPrimaryRoutes.trustees;
    case 'community-directory':
      return memberPrimaryRoutes.communityDirectory;
    case 'community-members':
      return memberPrimaryRoutes.communityMembers;
    case 'events':
      return memberPrimaryRoutes.events;
    case 'finance':
      return memberPrimaryRoutes.finance;
    case 'expenses':
      return memberPrimaryRoutes.expenses;
    case 'communication':
      return memberPrimaryRoutes.communication;
    case 'chats':
      return memberPrimaryRoutes.chats;
    case 'publications':
      return memberPrimaryRoutes.publications;
    case 'birthdays':
      return memberPrimaryRoutes.birthdays;
    case 'matrimony':
      return memberPrimaryRoutes.matrimony;
    case 'family':
      return memberPrimaryRoutes.family;
    case 'donations':
      return memberPrimaryRoutes.donations;
    case 'transactions':
      return memberPrimaryRoutes.transactions;
    case 'notifications':
      return memberPrimaryRoutes.notifications;
    case 'user-manual':
      return memberPrimaryRoutes.userManual;
    default:
      return memberPrimaryRoutes.home;
  }
}
