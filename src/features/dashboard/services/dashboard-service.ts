import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { isPlainUserSession } from '@/src/core/navigation/default-route';
import type { ListItem, MetricItem } from '@/src/types/app';

export interface DashboardCardItem extends ListItem {
  icon: string;
  route?: string;
}

function resolveDashboardCardRoute(card: Pick<DashboardCardItem, 'icon' | 'title' | 'route'>) {
  if (card.route) {
    return card.route;
  }

  switch (card.icon) {
    case 'person':
      return '/member/profile';
    case 'family-restroom':
      return '/profile/family-management';
    case 'receipt-long':
      return '/finance/expenses';
    case 'calendar-month':
      return '/events/my-events-list';
    case 'cake':
      return '/member/birthday-reminders';
    case 'volunteer-activism':
      return '/member/donations';
    case 'newspaper':
      return '/publications/archive';
    case 'chat':
    case 'forum':
      return '/communication/community-chats';
    case 'favorite':
      return '/member/matrimony';
    default:
      switch (card.title) {
        case 'My Profile':
          return '/member/profile';
        case 'Family':
          return '/profile/family-management';
        case 'Expenses':
          return '/finance/expenses';
        case 'Events':
          return '/events/my-events-list';
        case 'Birthdays':
          return '/member/birthday-reminders';
        case 'Donations':
          return '/member/donations';
        case 'News':
          return '/publications/archive';
        case 'Publication':
          return '/publications/archive';
        case 'Community Chat':
        case 'Chat':
        case 'Chats':
          return '/communication/community-chats';
        case 'Matrimony':
          return '/member/matrimony';
        default:
          return undefined;
      }
  }
}

function decorateDashboardCards(cards: DashboardCardItem[], summary?: MemberDashboardSummary['summary']) {
  return cards.map((card) => ({
    ...card,
    subtitle: resolveDashboardCardSubtitle(card, summary),
    route: resolveDashboardCardRoute(card),
  }));
}

function resolveDashboardCardSubtitle(card: DashboardCardItem, summary?: MemberDashboardSummary['summary']) {
  switch (card.title) {
    case 'Family':
      return `${summary?.familyCount ?? 0} registered`;
    case 'Events':
      return (summary?.eventsJoined ?? 0) > 0 ? `${summary?.eventsJoined} joined` : card.subtitle;
    case 'Donations':
      return `${summary?.donationCount ?? 0} records`;
    case 'Birthdays':
      return (summary?.birthdayTodayCount ?? 0) > 0 ? `${summary?.birthdayTodayCount} today` : 'Upcoming wishes';
    case 'Matrimony':
      return (summary?.activeMatrimonyProfiles ?? 0) > 0 ? `${summary?.activeMatrimonyProfiles} active profiles` : card.subtitle;
    default:
      return card.subtitle;
  }
}

function filterDashboardCards(
  cards: DashboardCardItem[],
  options: { hideFinance?: boolean; hideRestrictedModules?: boolean } = {},
) {
  return cards.filter((card) => {
    if (options.hideFinance && (['Expenses', 'Finance'].includes(card.title) || card.route?.startsWith('/finance'))) {
      return false;
    }

    if (
      options.hideRestrictedModules &&
      (card.icon === 'newspaper' ||
        card.icon === 'campaign' ||
        ['Publication', 'Publications', 'Advertisement', 'Advertisements', 'News'].includes(card.title) ||
        card.route === '/publications/archive' ||
        card.route?.startsWith('/advertisements'))
    ) {
      return false;
    }

    return true;
  });
}

const REQUIRED_MEMBER_HOME_CARDS: DashboardCardItem[] = [
  { title: 'Family', subtitle: 'Manage family members', status: 'Active', icon: 'family-restroom', route: '/profile/family-management' },
  { title: 'Expenses', subtitle: 'View community expenses', status: 'Active', icon: 'receipt-long', route: '/finance/expenses' },
  { title: 'Birthdays', subtitle: 'Upcoming wishes', status: 'Active', icon: 'cake', route: '/member/birthday-reminders' },
  { title: 'Matrimony', subtitle: 'Find matches', status: 'Active', icon: 'favorite', route: '/member/matrimony' },
  { title: 'Saint', subtitle: 'Open PDF', status: 'Active', icon: 'picture-as-pdf', route: 'asset://lalabapa-gondal' },
  { title: 'Publication', subtitle: "The Cobbler's Journal", status: 'Active', icon: 'newspaper', route: '/publications/archive' },
  { title: 'Chat', subtitle: 'Discussions', status: 'Active', icon: 'forum', route: '/communication/community-chats' },
];

function ensureMemberHomeCards(cards: DashboardCardItem[]) {
  const existingRoutes = new Set(cards.map((card) => card.route).filter(Boolean));
  const existingTitles = new Set(cards.map((card) => card.title.trim().toLowerCase()));
  const missingCards = REQUIRED_MEMBER_HOME_CARDS.filter(
    (card) => !existingRoutes.has(card.route) && !existingTitles.has(card.title.trim().toLowerCase()),
  );

  return [...cards, ...missingCards];
}

export interface DashboardIdentityCard {
  memberName: string;
  memberId: string;
  location: string;
  validity: string;
  bloodGroup?: string | null;
  photo: string | null;
  qrImage: string;
}

export interface DashboardSponsoredCard {
  title: string;
  description: string;
  image: string | null;
  linkUrl?: string | null;
}

export interface DashboardUpdateItem {
  title: string;
  subtitle: string;
  image?: string | null;
  icon?: string | null;
}

export interface MemberDashboardSummary {
  metrics: MetricItem[];
  cards: DashboardCardItem[];
  updates: DashboardUpdateItem[];
  sponsoredCard: DashboardSponsoredCard | null;
  identityCard: DashboardIdentityCard;
  summary?: {
    familyCount: number;
    childCount: number;
    activeMatrimonyProfiles: number;
    unreadNotices: number;
    eventsJoined: number;
    donationCount: number;
    birthdayTodayCount?: number;
  };
}

export const emptyDashboardSummary: MemberDashboardSummary = {
  metrics: [
    { label: 'Events joined', value: '0', accent: 'primary' },
    { label: 'Unread notices', value: '0', accent: 'warning' },
    { label: 'Card status', value: 'Pending', accent: 'accent' },
  ],
  cards: [
    { title: 'My Profile', subtitle: 'Manage details', status: 'Active', icon: 'person', route: '/member/profile' },
    { title: 'Family', subtitle: '0 registered', status: 'Active', icon: 'family-restroom', route: '/profile/family-management' },
    { title: 'Events', subtitle: 'Browse upcoming events', status: 'Active', icon: 'calendar-month', route: '/events/my-events-list' },
    { title: 'Donations', subtitle: 'History & Support', status: 'Active', icon: 'volunteer-activism', route: '/member/donations' },
    { title: 'Expenses', subtitle: 'View community expenses', status: 'Active', icon: 'receipt-long', route: '/finance/expenses' },
    { title: 'Birthdays', subtitle: 'Upcoming wishes', status: 'Active', icon: 'cake', route: '/member/birthday-reminders' },
    { title: 'Matrimony', subtitle: 'Find matches', status: 'Active', icon: 'favorite', route: '/member/matrimony' },
    { title: 'Publication', subtitle: "The Cobbler's Journal", status: 'Active', icon: 'newspaper', route: '/publications/archive' },
    { title: 'Chat', subtitle: 'Discussions', status: 'Active', icon: 'forum', route: '/communication/community-chats' },
  ],
  updates: [],
  sponsoredCard: null,
  identityCard: {
    memberName: 'Community Member',
    memberId: 'Pending',
    location: '',
    validity: 'Pending approval',
    bloodGroup: null,
    photo: null,
    qrImage: '',
  },
  summary: {
    familyCount: 0,
    childCount: 0,
    activeMatrimonyProfiles: 0,
    unreadNotices: 0,
    eventsJoined: 0,
    donationCount: 0,
  },
};

export const dashboardService = {
  async loadMemberDashboard(): Promise<MemberDashboardSummary> {
    if (!isBackendApiConfigured()) {
      return emptyDashboardSummary;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return emptyDashboardSummary;
    }

    const response = await apiClient<{ data: MemberDashboardSummary }>(
      apiEndpoints.communityMemberDashboard(backendSession.tenantId),
      { token: backendSession.token },
    );

    return {
      ...emptyDashboardSummary,
      ...response.data,
      metrics: response.data.metrics ?? emptyDashboardSummary.metrics,
      cards: filterDashboardCards(
        ensureMemberHomeCards(decorateDashboardCards(response.data.cards ?? emptyDashboardSummary.cards, response.data.summary)),
        {
          hideFinance: isPlainUserSession(backendSession.session),
          hideRestrictedModules: isPlainUserSession(backendSession.session),
        },
      ),
      updates: response.data.updates ?? emptyDashboardSummary.updates,
      sponsoredCard: response.data.sponsoredCard ?? emptyDashboardSummary.sponsoredCard,
      identityCard: {
        ...(response.data.identityCard ?? emptyDashboardSummary.identityCard),
        photo:
          response.data.identityCard?.photo ??
          backendSession.session.user.profilePhotoUrl ??
          emptyDashboardSummary.identityCard.photo,
      },
    };
  },
};
