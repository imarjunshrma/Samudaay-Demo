import type {
  DashboardCardItem,
  DashboardIdentityCard,
  MemberDashboardSummary,
} from './dashboard-service';

type TranslateFn = (key: string) => string;

function translateCardTitle(icon: string, title: string, t: TranslateFn) {
  switch (icon) {
    case 'person':
      return t('cards.profile.title');
    case 'family-restroom':
      return t('cards.family.title');
    case 'calendar-month':
      return t('cards.events.title');
    case 'volunteer-activism':
      return t('cards.donations.title');
    case 'receipt-long':
      return t('cards.expenses.title');
    case 'cake':
      return t('cards.birthdays.title');
    case 'favorite':
      return t('cards.matrimony.title');
    case 'newspaper':
      return title === 'News' ? t('cards.news.title') : t('cards.publication.title');
    case 'campaign':
      return t('cards.advertisements.title');
    case 'forum':
    case 'chat':
      return t('cards.communityChat.title');
    default:
      return title;
  }
}

function translateCardSubtitle(
  card: DashboardCardItem,
  summary: MemberDashboardSummary['summary'] | undefined,
  t: TranslateFn,
) {
  switch (card.icon) {
    case 'person':
      return t('cards.profile.subtitle');
    case 'family-restroom':
      return t('cards.family.count').replace('{count}', String(summary?.familyCount ?? 0));
    case 'calendar-month':
      return (summary?.eventsJoined ?? 0) > 0
        ? t('cards.events.count').replace('{count}', String(summary?.eventsJoined ?? 0))
        : t('cards.events.subtitle');
    case 'volunteer-activism':
      return t('cards.donations.count').replace('{count}', String(summary?.donationCount ?? 0));
    case 'receipt-long':
      return t('cards.expenses.subtitle');
    case 'cake':
      return (summary?.birthdayTodayCount ?? 0) > 0
        ? t('cards.birthdays.count').replace('{count}', String(summary?.birthdayTodayCount ?? 0))
        : t('cards.birthdays.subtitle');
    case 'favorite':
      return (summary?.activeMatrimonyProfiles ?? 0) > 0
        ? t('cards.matrimony.count').replace('{count}', String(summary?.activeMatrimonyProfiles ?? 0))
        : t('cards.matrimony.subtitle');
    case 'newspaper':
      return card.title === 'News' ? t('cards.news.subtitle') : t('cards.publication.subtitle');
    case 'campaign':
      return t('cards.advertisements.subtitle');
    case 'forum':
    case 'chat':
      return t('cards.communityChat.subtitle');
    default:
      return card.subtitle;
  }
}

function translateIdentityMember(memberName: string, t: TranslateFn) {
  return memberName === 'Community Member' ? t('identity.member') : memberName;
}

function translateIdentityValidity(validity: string, t: TranslateFn) {
  switch (validity) {
    case 'Active':
      return t('identity.active');
    case 'Pending':
      return t('identity.pending');
    case 'Pending approval':
      return t('identity.pendingApproval');
    default:
      return validity;
  }
}

export function localizeDashboardCards(
  cards: DashboardCardItem[],
  summary: MemberDashboardSummary['summary'] | undefined,
  t: TranslateFn,
) {
  return cards.map((card) => ({
    ...card,
    title: translateCardTitle(card.icon, card.title, t),
    subtitle: translateCardSubtitle(card, summary, t),
  }));
}

export function localizeDashboardIdentityCard(
  identityCard: DashboardIdentityCard,
  t: TranslateFn,
) {
  return {
    ...identityCard,
    memberName: translateIdentityMember(identityCard.memberName, t),
    validity: translateIdentityValidity(identityCard.validity, t),
  };
}
