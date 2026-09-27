import type { AppBottomBarItem } from '@/src/components/layout/AppBottomBar/AppBottomBar';
import type { AppSidebarItem } from '@/src/components/layout/AppSidebar/AppSidebar';
import type { Permission, UserSession } from '@/src/types/app';
import { Platform } from 'react-native';

export const adminPrimaryRoutes = {
  home: '/admin/dashboard',
  clients: '/admin/(tabs)/manage-directory',
  communityMembers: '/admin/community-members',
  people: '/admin/people',
  community: '/admin/community',
  invoices: '/admin/invoices',
  donations: '/admin/manage-donations',
  notifications: '/admin/notifications',
  notificationInbox: '/admin/notification-inbox',
  createNotification: '/admin/create-notification',
  kycApprovals: '/admin/kyc-approvals',
  advertisements: '/admin/advertisements',
  publications: '/publications/archive',
  chats: '/admin/community-chats',
  birthdays: '/admin/birthday-reminders',
  transactions: '/admin/transaction-management',
  transactionAnalytics: '/admin/transaction-analytics',
  peopleAnalytics: '/admin/people-analytics',
  eventAnalytics: '/admin/event-analytics',
  matrimonyProfiles: '/admin/matrimony-profiles',
  matrimonyAnalytics: '/admin/matrimony-analytics',
  profitLoss: '/admin/profit-loss-yearly',
  addExpense: '/admin/create-expense',
  profile: '/admin/profile',
  events: '/admin/manage-events',
  trustees: '/admin/manage-trustees',
  roles: '/admin/roles',
  familyRegistry: '/admin/family-registry',
  analytics: '/admin/analytics',
  marksheetReports: '/admin/marksheet-reports',
  createEvent: '/admin/manage-events/create',
  createExpense: '/admin/create-expense',
} as const;

export const adminBottomBarItems: readonly AppBottomBarItem[] = [
  { key: 'home', icon: 'home', label: 'nav.home' },
  { key: 'clients', icon: 'groups', label: 'nav.clients' },
  { key: 'invoices', icon: 'receipt-long', label: 'nav.invoices' },
  { key: 'profile', icon: 'person-pin', label: 'nav.profile' },
] as const;

export const adminSidebarItems: readonly AppSidebarItem[] = [
  { key: 'home', icon: 'dashboard', label: 'nav.home' },
  { key: 'clients', icon: 'groups', label: 'nav.memberDirectory' },
  { key: 'community-members', icon: 'groups', label: 'nav.communityMembers' },
  { key: 'people', icon: 'badge', label: 'nav.people' },
  { key: 'community', icon: 'campaign', label: 'nav.community' },
  { key: 'invoices', icon: 'receipt-long', label: 'nav.expenses' },
  { key: 'donations', icon: 'volunteer-activism', label: 'nav.donations' },
  { key: 'notifications', icon: 'notifications', label: 'nav.notificationManagement' },
  { key: 'advertisements', icon: 'campaign', label: 'nav.advertisements' },
  { key: 'publications', icon: 'newspaper', label: 'nav.publications' },
  { key: 'chats', icon: 'forum', label: 'nav.chats' },
  { key: 'birthdays', icon: 'cake', label: 'nav.birthdays' },
  { key: 'transactions', icon: 'swap-horiz', label: 'nav.transactions' },
  { key: 'matrimony-profiles', icon: 'favorite', label: 'nav.matrimony' },
  { key: 'profit-loss', icon: 'request-page', label: 'nav.profitLoss' },
  { key: 'add-expense', icon: 'note-add', label: 'nav.addExpense' },
  { key: 'events', icon: 'event', label: 'nav.events' },
  { key: 'trustees', icon: 'people', label: 'nav.trustees' },
  { key: 'roles', icon: 'admin-panel-settings', label: 'nav.roles' },
  { key: 'family-registry', icon: 'family-restroom', label: 'nav.familyRegistry' },
  { key: 'marksheet-reports', icon: 'school', label: 'nav.marksheets' },
  { key: 'profile', icon: 'person', label: 'nav.profile' },
] as const;

const publicAdminNavKeys = new Set(['home', 'people', 'community', 'profile']);

const adminNavPermissions: Record<string, readonly Permission[]> = {
  clients: ['directory.manage', 'user.manage', 'users.view', 'users.edit', 'users.delete', 'users.block'],
  'community-members': ['directory.view', 'directory.manage', 'user.manage', 'users.view'],
  people: ['directory.view', 'directory.manage', 'user.manage', 'users.view'],
  community: ['directory.view', 'directory.manage', 'user.manage', 'users.view'],
  registration: ['registration.manage', 'kyc.approve', 'profile.manage'],
  'profile-requests': ['profile_requests.manage'],
  invoices: ['transactions.manage'],
  donations: ['donations.manage'],
  notifications: ['notifications.manage'],
  advertisements: ['promotions.view', 'promotions.manage'],
  publications: ['publications.manage'],
  chats: ['notifications.manage'],
  birthdays: ['notifications.manage'],
  transactions: ['transactions.manage'],
  'transaction-analytics': ['analytics.view'],
  'people-analytics': ['analytics.view'],
  'event-analytics': ['analytics.view'],
  'matrimony-profiles': ['matrimony.manage'],
  'matrimony-analytics': ['matrimony.manage', 'analytics.view'],
  'profit-loss': ['transactions.manage', 'analytics.view'],
  'add-expense': ['transactions.manage'],
  events: ['events.manage', 'events.attendance'],
  trustees: ['admins.manage'],
  roles: ['roles.manage'],
  'family-registry': ['directory.manage', 'user.manage', 'users.view'],
  analytics: ['analytics.view'],
  'marksheet-reports': ['directory.manage', 'user.manage', 'users.view', 'marksheet.view', 'marksheet.manage', 'children_education.view', 'children_education.manage'],
  'create-event': ['events.manage'],
  'create-expense': ['transactions.manage'],
};

function normalizeRoleKey(roleKey: string | null | undefined) {
  return String(roleKey || '').trim().toLowerCase().replace(/-/g, '_');
}

export function isSuperAdminSession(session: UserSession | null | undefined) {
  const normalizedRole = normalizeRoleKey(session?.user.role);
  const communityRoleKeys = session?.user.communityRoleKeys ?? [];

  return Boolean(
    normalizedRole === 'super_admin' ||
      normalizedRole === 'superadmin' ||
      communityRoleKeys.some((roleKey) => ['super_admin', 'superadmin'].includes(normalizeRoleKey(roleKey))),
  );
}

function isFullAdminSession(session: UserSession | null | undefined) {
  const normalizedRole = normalizeRoleKey(session?.user.role);
  const communityRoleKeys = session?.user.communityRoleKeys ?? [];

  return Boolean(
    normalizedRole === 'admin' ||
      normalizedRole === 'admin_staff' ||
      normalizedRole === 'super_admin' ||
      normalizedRole === 'superadmin' ||
      communityRoleKeys.some((roleKey) => ['admin', 'admin_staff', 'super_admin', 'superadmin'].includes(normalizeRoleKey(roleKey))),
  );
}

export function canAccessAdminNavKey(key: string, session: UserSession | null | undefined) {
  if (publicAdminNavKeys.has(key)) {
    return true;
  }

  if (isFullAdminSession(session)) {
    return true;
  }

  const requiredPermissions = adminNavPermissions[key] ?? [];
  if (!requiredPermissions.length) {
    return false;
  }

  const permissions = new Set([...(session?.user.permissions ?? []), ...(session?.user.communityPermissions ?? [])]);
  return requiredPermissions.some((permission) => permissions.has(permission));
}

export function getVisibleAdminSidebarItems(session: UserSession | null | undefined) {
  return adminSidebarItems.filter((item) => {
    if (Platform.OS === 'ios' && item.key === 'donations') {
      return false;
    }

    return canAccessAdminNavKey(String(item.key), session);
  });
}

export function getVisibleAdminBottomBarItems(session: UserSession | null | undefined) {
  return adminBottomBarItems.filter((item) => canAccessAdminNavKey(String(item.key), session));
}

export function getAdminNavKeyForPath(pathname: string) {
  if (pathname.startsWith('/admin/people')) return 'people';
  if (pathname.startsWith('/admin/community-members')) return 'community-members';
  if (pathname.startsWith('/admin/manage-directory') || pathname.startsWith('/admin/users')) return 'clients';
  if (pathname.startsWith('/admin/community-chats')) return 'chats';
  if (pathname.startsWith('/admin/community')) return 'community';
  if (pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/my-expenses') || pathname.startsWith('/finance/billing')) return 'invoices';
  if (pathname.startsWith('/admin/manage-donations') || pathname.startsWith('/admin/donations') || pathname.startsWith('/member/donations')) return 'donations';
  if (pathname.startsWith('/admin/notification-inbox') || pathname.startsWith('/admin/notifications') || pathname.startsWith('/admin/create-notification') || pathname.startsWith('/communication/notifications')) return 'notifications';
  if (pathname.startsWith('/admin/advertisements') || pathname.startsWith('/advertisements')) return 'advertisements';
  if (pathname.startsWith('/publications')) return 'publications';
  if (pathname.startsWith('/admin/birthday-reminders') || pathname.startsWith('/admin/send-birthday-card') || pathname.startsWith('/admin/birthday-card-editor')) return 'birthdays';
  if (pathname.startsWith('/admin/transaction-management')) return 'transactions';
  if (pathname.startsWith('/admin/profit-loss-yearly')) return 'profit-loss';
  if (pathname.startsWith('/admin/create-expense')) return 'add-expense';
  if (pathname.startsWith('/admin/profile')) return 'profile';
  if (pathname.startsWith('/admin/manage-events') || pathname.startsWith('/admin/create-event')) return 'events';
  if (pathname.startsWith('/admin/manage-trustees') || pathname.startsWith('/admin/create-admin')) return 'trustees';
  if (pathname.startsWith('/admin/roles') || pathname.startsWith('/admin/permissions')) return 'roles';
  if (pathname.startsWith('/admin/family-registry')) return 'family-registry';
  if (pathname.startsWith('/admin/marksheet-reports')) return 'marksheet-reports';
  if (pathname.startsWith('/admin/matrimony-profiles')) return 'matrimony-profiles';
  if (pathname.startsWith('/admin/analytics')) return 'analytics';
  if (pathname.startsWith('/admin/transaction-analytics')) return 'transaction-analytics';
  if (pathname.startsWith('/admin/people-analytics')) return 'people-analytics';
  if (pathname.startsWith('/admin/event-analytics')) return 'event-analytics';
  if (pathname.startsWith('/admin/matrimony-analytics')) return 'matrimony-analytics';
  if (pathname.startsWith('/admin/kyc-approvals')) return 'registration';
  if (pathname.startsWith('/admin/profile-requests')) return 'profile-requests';
  if (pathname.startsWith('/admin/expenses')) return 'invoices';
  if (pathname.startsWith('/admin')) return 'home';

  return 'home';
}

export function getAdminBottomBarRoute(key: string) {
  switch (key) {
    case 'home':
      return adminPrimaryRoutes.home;
    case 'clients':
    case 'members':
      return adminPrimaryRoutes.clients;
    case 'community-members':
      return adminPrimaryRoutes.communityMembers;
    case 'people':
      return adminPrimaryRoutes.people;
    case 'community':
      return adminPrimaryRoutes.community;
    case 'invoices':
      return adminPrimaryRoutes.invoices;
    case 'donations':
      return adminPrimaryRoutes.donations;
    case 'notifications':
      return adminPrimaryRoutes.notifications;
    case 'advertisements':
      return adminPrimaryRoutes.advertisements;
    case 'publications':
      return adminPrimaryRoutes.publications;
    case 'chats':
      return adminPrimaryRoutes.chats;
    case 'birthdays':
      return adminPrimaryRoutes.birthdays;
    case 'transactions':
      return adminPrimaryRoutes.transactions;
    case 'transaction-analytics':
      return adminPrimaryRoutes.transactionAnalytics;
    case 'people-analytics':
      return adminPrimaryRoutes.peopleAnalytics;
    case 'event-analytics':
      return adminPrimaryRoutes.eventAnalytics;
    case 'matrimony-profiles':
      return adminPrimaryRoutes.matrimonyProfiles;
    case 'matrimony-analytics':
      return adminPrimaryRoutes.matrimonyAnalytics;
    case 'profit-loss':
      return adminPrimaryRoutes.profitLoss;
    case 'add-expense':
      return adminPrimaryRoutes.addExpense;
    case 'profile':
      return adminPrimaryRoutes.profile;
    default:
      return adminPrimaryRoutes.home;
  }
}

export function getAdminSidebarRoute(key: string) {
  switch (key) {
    case 'home':
      return adminPrimaryRoutes.home;
    case 'clients':
    case 'members':
      return adminPrimaryRoutes.clients;
    case 'community-members':
      return adminPrimaryRoutes.communityMembers;
    case 'people':
      return adminPrimaryRoutes.people;
    case 'community':
      return adminPrimaryRoutes.community;
    case 'invoices':
      return adminPrimaryRoutes.invoices;
    case 'donations':
      return adminPrimaryRoutes.donations;
    case 'notifications':
      return adminPrimaryRoutes.notifications;
    case 'advertisements':
      return adminPrimaryRoutes.advertisements;
    case 'publications':
      return adminPrimaryRoutes.publications;
    case 'chats':
      return adminPrimaryRoutes.chats;
    case 'birthdays':
      return adminPrimaryRoutes.birthdays;
    case 'profile':
      return adminPrimaryRoutes.profile;
    case 'events':
      return adminPrimaryRoutes.events;
    case 'trustees':
      return adminPrimaryRoutes.trustees;
    case 'roles':
      return adminPrimaryRoutes.roles;
    case 'family-registry':
      return adminPrimaryRoutes.familyRegistry;
    case 'analytics':
      return adminPrimaryRoutes.analytics;
    case 'marksheet-reports':
      return adminPrimaryRoutes.marksheetReports;
    case 'transactions':
      return adminPrimaryRoutes.transactions;
    case 'transaction-analytics':
      return adminPrimaryRoutes.transactionAnalytics;
    case 'people-analytics':
      return adminPrimaryRoutes.peopleAnalytics;
    case 'event-analytics':
      return adminPrimaryRoutes.eventAnalytics;
    case 'matrimony-profiles':
      return adminPrimaryRoutes.matrimonyProfiles;
    case 'matrimony-analytics':
      return adminPrimaryRoutes.matrimonyAnalytics;
    case 'profit-loss':
      return adminPrimaryRoutes.profitLoss;
    case 'add-expense':
      return adminPrimaryRoutes.addExpense;
    case 'create-event':
      return adminPrimaryRoutes.createEvent;
    case 'create-expense':
      return adminPrimaryRoutes.createExpense;
    default:
      return adminPrimaryRoutes.home;
  }
}
