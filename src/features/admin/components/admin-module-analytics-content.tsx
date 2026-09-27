import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import {
  AppHeader,
  AppSafeAreaView,
  EmptyState,
  EntityActionCard,
  ErrorState,
  ListRowSkeleton,
  SelectionPopup,
  StatCardSkeleton,
  Text,
} from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { downloadAnalyticsReport, type AnalyticsExportFormat } from '@/src/features/finance/services/analytics-report-service';
import { donationService, type DonationRecordItem } from '@/src/features/finance/services/donation-service';
import { notificationCampaignService, type AdminNotificationCampaignItem } from '@/src/features/communication/services/notification-campaign-service';
import { chatService } from '@/src/features/communication/services/chat-service';
import { publicationFeedService } from '@/src/features/publications/services/publication-feed-service';
import { colors, radius, spacing, typography } from '@/src/theme';
import { promotionService } from '../services/promotion-service';
import { roleManagementService } from '../services/role-management-service';
import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';

type AnalyticsMetricTone = 'primary' | 'success' | 'warning' | 'muted';

type AnalyticsMetric = {
  label: string;
  value: string;
  helper?: string;
  tone?: AnalyticsMetricTone;
};

type AnalyticsBreakdownItem = {
  label: string;
  value: string;
  helper?: string;
};

type AnalyticsRecentItem = {
  id: string;
  title: string;
  subtitle: string;
  detail?: string;
  meta: string[];
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  accentColor?: string;
};

type AnalyticsModuleData = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  metrics: AnalyticsMetric[];
  breakdown: AnalyticsBreakdownItem[];
  recent: AnalyticsRecentItem[];
  insights?: string[];
  primaryActionLabel: string;
  primaryActionHref: string;
};

type AdminAnalyticsModuleKey =
  | 'donation'
  | 'publication'
  | 'advertisement'
  | 'notification'
  | 'role'
  | 'chat';

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function formatCurrency(value: number) {
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`;
}

function formatPercent(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${safeValue.toFixed(safeValue >= 10 ? 0 : 1)}%`;
}

function formatRelativeDate(value?: string | null) {
  if (!value) {
    return 'Recently updated';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Recently updated';
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatNotificationStatusTag(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return 'Draft';
  }

  return normalized
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function humanizeEnum(value?: string | null) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return 'Not set';
  }

  return normalized
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function topEntries(record: Record<string, number>, limit = 4) {
  return Object.entries(record)
    .filter(([, value]) => value > 0)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit);
}

function getToneStyles(tone: AnalyticsMetricTone = 'primary') {
  switch (tone) {
    case 'success':
      return {
        backgroundColor: colors.status.successLight,
        borderColor: '#ccebd8',
        valueColor: colors.status.success,
      };
    case 'warning':
      return {
        backgroundColor: colors.status.warningLight,
        borderColor: '#fde3b2',
        valueColor: colors.status.warning,
      };
    case 'muted':
      return {
        backgroundColor: colors.background.muted,
        borderColor: colors.border.muted,
        valueColor: colors.text.primary,
      };
    default:
      return {
        backgroundColor: colors.primary.subtle,
        borderColor: colors.primary.borderLight,
        valueColor: colors.primary.DEFAULT,
      };
  }
}

async function loadAllDonationRecords() {
  const items: DonationRecordItem[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await donationService.loadDonationRecordsPage({
      mine: false,
      page,
      limit: 100,
    });
    items.push(...response.items);
    hasNextPage = Boolean(response.pagination?.hasNextPage);
    page += 1;
  }

  return items;
}

async function loadAllNotificationCampaigns() {
  const items: AdminNotificationCampaignItem[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await notificationCampaignService.loadAdminCampaignsPage({
      page,
      limit: 100,
    });
    items.push(...response.items);
    hasNextPage = Boolean(response.pagination?.hasNextPage);
    page += 1;
  }

  return items;
}

async function buildDonationAnalytics(): Promise<AnalyticsModuleData> {
  const items = await loadAllDonationRecords();
  const paidItems = items.filter((item) => item.status === 'PAID');
  const pendingItems = items.filter((item) => item.status === 'PENDING');
  const cancelledItems = items.filter((item) => item.status === 'CANCELLED');
  const totalAmount = paidItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const averageAmount = paidItems.length ? totalAmount / paidItems.length : 0;
  const recurringDonors = new Set(
    paidItems
      .map((item) => String(item.donorName || '').trim().toLowerCase())
      .filter(Boolean),
  );

  const purposeCounts = paidItems.reduce<Record<string, number>>((acc, item) => {
    const key = String(item.donationPurpose || item.purpose || 'General').trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const modeCounts = paidItems.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.paymentMode || 'manual');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    title: 'Contribution Analytics',
    subtitle: 'Fund collection, contributor behaviour and receipt coverage.',
    icon: 'volunteer-activism',
    primaryActionLabel: 'Open contribution records',
    primaryActionHref: '/admin/manage-donations',
    metrics: [
      { label: 'Paid collection', value: formatCurrency(totalAmount), helper: `${paidItems.length} settled records`, tone: 'primary' },
      { label: 'Pending approvals', value: formatCompactNumber(pendingItems.length), helper: 'Needs review or payment confirmation', tone: 'warning' },
      { label: 'Recurring contributors', value: formatCompactNumber(recurringDonors.size), helper: 'Unique paid contributors', tone: 'success' },
      { label: 'Average contribution', value: formatCurrency(averageAmount), helper: 'Across paid receipts', tone: 'muted' },
    ],
    breakdown: [
      ...topEntries(modeCounts).map(([label, value]) => ({
        label: `${label} mode`,
        value: formatCompactNumber(value),
        helper: 'Paid contribution records',
      })),
      ...topEntries(purposeCounts, 2).map(([label, value]) => ({
        label,
        value: formatCompactNumber(value),
        helper: 'Top contribution purpose',
      })),
      {
        label: 'Cancelled records',
        value: formatCompactNumber(cancelledItems.length),
        helper: 'Receipts excluded from paid collection',
      },
    ],
    recent: items.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.donorName || 'Contribution record',
      subtitle: formatCurrency(item.amount || 0),
      detail: item.receiptNo ? `Receipt ${item.receiptNo}` : item.donationPurpose || item.purpose || 'Contribution entry',
      meta: [humanizeEnum(item.status), humanizeEnum(item.paymentMode), formatRelativeDate(item.createdAt)],
      icon: 'receipt-long',
      accentColor: item.status === 'PAID' ? colors.status.success : item.status === 'PENDING' ? colors.status.warning : colors.status.error,
    })),
    insights: [
      pendingItems.length > paidItems.length ? 'Pending contribution records are higher than completed receipts.' : 'Settled donations are ahead of pending receipts.',
      recurringDonors.size ? `${formatCompactNumber(recurringDonors.size)} contributors have contributed at least once in current data.` : 'No recurring contributor trend is available yet.',
    ],
  };
}

async function buildPublicationAnalytics(): Promise<AnalyticsModuleData> {
  const items = await publicationFeedService.loadArchive();
  const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.status || 'draft');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const typeCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.publicationType || 'system_generated');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const withCover = items.filter((item) => Boolean(item.coverImageUrl)).length;
  const publishedCount = items.filter((item) => item.status === 'PUBLISHED').length;
  const generatedCount = items.filter((item) => item.status === 'GENERATED').length;
  const withAds = items.filter((item) => item.includeAds).length;
  const withMatrimony = items.filter((item) => item.includeMatrimony).length;
  const totalAdsIncluded = items.reduce((sum, item) => sum + Number(item.summary?.advertisementCount || 0), 0);
  const totalProfilesIncluded = items.reduce((sum, item) => sum + Number(item.summary?.matrimonyCount || 0), 0);

  return {
    title: 'Publication Analytics',
    subtitle: 'Issue lifecycle, generated content coverage, and publication readiness.',
    icon: 'newspaper',
    primaryActionLabel: 'Open publication archive',
    primaryActionHref: '/publications/archive',
    metrics: [
      { label: 'Total issues', value: formatCompactNumber(items.length), helper: 'Draft to archived publication records', tone: 'primary' },
      { label: 'Published issues', value: formatCompactNumber(publishedCount), helper: 'Visible to members and trustees', tone: 'success' },
      { label: 'Generated issues', value: formatCompactNumber(generatedCount), helper: 'Waiting to publish or recently generated', tone: 'warning' },
      { label: 'Cover ready', value: formatCompactNumber(withCover), helper: 'Issues with a cover image', tone: 'muted' },
      { label: 'Ads included', value: formatCompactNumber(totalAdsIncluded), helper: `${withAds} issues configured with advertisement section`, tone: 'primary' },
      { label: 'Profiles included', value: formatCompactNumber(totalProfilesIncluded), helper: `${withMatrimony} issues configured with matrimony section`, tone: 'success' },
    ],
    breakdown: [
      ...topEntries(statusCounts, 4).map(([label, value]) => ({
        label: `${label} issues`,
        value: formatCompactNumber(value),
        helper: 'By lifecycle status',
      })),
      ...topEntries(typeCounts, 2).map(([label, value]) => ({
        label: `${label} type`,
        value: formatCompactNumber(value),
        helper: 'Manual vs system generated',
      })),
      {
        label: 'Average ads per issue',
        value: items.length ? (totalAdsIncluded / items.length).toFixed(1) : '0.0',
        helper: 'Generated content density',
      },
      {
        label: 'Average profiles per issue',
        value: items.length ? (totalProfilesIncluded / items.length).toFixed(1) : '0.0',
        helper: 'Approved matrimony coverage',
      },
    ],
    recent: items.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title || 'Publication issue',
      subtitle: item.edition || 'Community Edition',
      detail: item.status ? `${humanizeEnum(item.status)} • ${humanizeEnum(item.publicationType)}` : undefined,
      meta: [
        item.coverImageUrl ? 'Cover attached' : 'No cover image',
        `${item.summary?.advertisementCount || 0} ads`,
        `${item.summary?.matrimonyCount || 0} matrimony profiles`,
      ],
      icon: 'menu-book',
      accentColor: colors.primary.DEFAULT,
    })),
    insights: [
      withCover < items.length ? 'Some issues still do not have a cover image attached.' : 'Every issue currently includes a cover image.',
      generatedCount > publishedCount ? 'There are generated issues pending publication.' : 'Generated issues are broadly being published without backlog.',
      items.length ? 'Publication analytics are derived from the live issue archive and generated summaries.' : 'Archive is empty, so publication analytics have no issue history yet.',
    ],
  };
}

async function buildAdvertisementAnalytics(): Promise<AnalyticsModuleData> {
  const items = await promotionService.loadPromotions();
  const totalCount = items.length;
  const activeCount = items.filter((item) => String(item.status || '').toUpperCase() === 'ACTIVE').length;
  const expiredCount = items.filter((item) => String(item.status || '').toUpperCase() === 'EXPIRED').length;
  const paidCount = items.filter((item) => String(item.pricingType || '').toUpperCase() === 'PAID').length;
  const freeCount = totalCount - paidCount;
  const totalRevenue = items.reduce((sum, item) => sum + Number(item.pricingType === 'PAID' ? item.amount || 0 : 0), 0);
  const totalImpressions = items.reduce((sum, item) => sum + Number(item.impressionCount || 0), 0);
  const totalClicks = items.reduce((sum, item) => sum + Number(item.clickCount || 0), 0);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const typeCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.contentType);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.category || 'other');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const expiringSoon = items.filter((item) => {
    if (!item.endAt) return false;
    const endDate = new Date(item.endAt);
    if (Number.isNaN(endDate.getTime())) return false;
    const daysRemaining = (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysRemaining >= 0 && daysRemaining <= 7;
  }).length;
  const skipEnabledCount = items.filter((item) => item.skipEnabled).length;
  const rotationCompliantCount = items.filter((item) => Number(item.displayIntervalSeconds || 300) === 300).length;
  const topPerformers = [...items].sort((left, right) => {
    const rightScore = Number(right.clickCount || 0) * 1000 + Number(right.impressionCount || 0);
    const leftScore = Number(left.clickCount || 0) * 1000 + Number(left.impressionCount || 0);
    return rightScore - leftScore;
  });
  const lowPerformers = items.filter((item) => Number(item.impressionCount || 0) < 5 && String(item.status || '').toUpperCase() === 'ACTIVE').length;

  return {
    title: 'Advertisement Analytics',
    subtitle: 'Inventory, revenue, engagement, and rotation compliance.',
    icon: 'campaign',
    primaryActionLabel: 'Open advertisements',
    primaryActionHref: '/admin/advertisements',
    metrics: [
      { label: 'Total advertisements', value: formatCompactNumber(totalCount), helper: 'All inventory records', tone: 'primary' },
      { label: 'Active advertisements', value: formatCompactNumber(activeCount), helper: 'Currently eligible for display', tone: 'success' },
      { label: 'Expired advertisements', value: formatCompactNumber(expiredCount), helper: 'Outside live duration window', tone: 'warning' },
      { label: 'Advertisement revenue', value: formatCurrency(totalRevenue), helper: `${paidCount} paid advertisement bookings`, tone: 'muted' },
      { label: 'Impressions', value: formatCompactNumber(totalImpressions), helper: 'Total display count', tone: 'primary' },
      { label: 'CTR', value: formatPercent(ctr), helper: `${formatCompactNumber(totalClicks)} clicks recorded`, tone: 'success' },
    ],
    breakdown: [
      { label: 'Paid advertisements', value: formatCompactNumber(paidCount), helper: 'Revenue-linked inventory' },
      { label: 'Free advertisements', value: formatCompactNumber(freeCount), helper: 'Community or free placements' },
      ...topEntries(typeCounts, 3).map(([label, value]) => ({
        label: `${label} ads`,
        value: formatCompactNumber(value),
        helper: 'By creative type',
      })),
      ...topEntries(categoryCounts, 3).map(([label, value]) => ({
        label: `${label} category`,
        value: formatCompactNumber(value),
        helper: 'By business category',
      })),
      {
        label: 'Skip enabled',
        value: formatCompactNumber(skipEnabledCount),
        helper: 'Ads with user skip option',
      },
      {
        label: '5 min interval aligned',
        value: formatCompactNumber(rotationCompliantCount),
        helper: 'Display interval matches PRD default',
      },
    ],
    recent: topPerformers.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title || 'Advertisement card',
      subtitle: `${humanizeEnum(item.contentType)} • ${humanizeEnum(item.category)}`,
      detail: formatDateRange(item.startAt, item.endAt),
      meta: [
        humanizeEnum(item.status),
        humanizeEnum(item.pricingType),
        `${item.impressionCount || 0} impressions`,
        `${item.clickCount || 0} clicks`,
      ],
      icon: 'ads-click',
      accentColor: colors.primary.DEFAULT,
    })),
    insights: [
      expiringSoon ? `${formatCompactNumber(expiringSoon)} advertisements need renewal attention this week.` : 'No advertisement is expiring within the next 7 days.',
      totalImpressions > 0 ? `${formatCompactNumber(totalClicks)} clicks have been recorded from ${formatCompactNumber(totalImpressions)} impressions.` : 'No advertisement impressions have been recorded yet.',
      lowPerformers ? `${formatCompactNumber(lowPerformers)} active advertisements are currently low performing.` : 'No active advertisement is currently in the low-impression bucket.',
    ],
  };
}

function formatDateRange(startAt?: string | null, endAt?: string | null) {
  const start = formatRelativeDate(startAt);
  const end = formatRelativeDate(endAt);

  if (startAt && endAt) {
    return `${start} to ${end}`;
  }

  return startAt ? `Starts ${start}` : endAt ? `Ends ${end}` : 'No active date range';
}

async function buildNotificationAnalytics(): Promise<AnalyticsModuleData> {
  const items = await loadAllNotificationCampaigns();
  const statusCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = formatNotificationStatusTag(item.tag);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const mutedCount = items.filter((item) => item.muted).length;
  const sendingCount = items.filter((item) => /sending|scheduled/i.test(item.tag)).length;
  const completedCount = items.filter((item) => /complete|sent/i.test(item.tag)).length;

  return {
    title: 'Notification Analytics',
    subtitle: 'Campaign state, delivery readiness and recent broadcast activity.',
    icon: 'notifications-active',
    primaryActionLabel: 'Open notification center',
    primaryActionHref: '/admin/notifications',
    metrics: [
      { label: 'Total campaigns', value: formatCompactNumber(items.length), helper: 'Admin broadcast records', tone: 'primary' },
      { label: 'Completed or sent', value: formatCompactNumber(completedCount), helper: 'Campaigns delivered successfully', tone: 'success' },
      { label: 'Queued or scheduled', value: formatCompactNumber(sendingCount), helper: 'Still in delivery pipeline', tone: 'warning' },
      { label: 'Muted / failed', value: formatCompactNumber(mutedCount), helper: 'Draft, cancelled or failed states', tone: 'muted' },
    ],
    breakdown: topEntries(statusCounts, 6).map(([label, value]) => ({
      label,
      value: formatCompactNumber(value),
      helper: 'Campaign status count',
    })),
    recent: items.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      detail: item.time,
      meta: [formatNotificationStatusTag(item.tag)],
      icon: 'campaign',
      accentColor: item.muted ? colors.status.warning : colors.primary.DEFAULT,
    })),
    insights: [
      sendingCount ? `${formatCompactNumber(sendingCount)} campaigns are still queued, sending or scheduled.` : 'No queued notification campaign is pending delivery.',
      completedCount < items.length / 2 ? 'A large share of campaigns are still drafts or inactive states.' : 'Most campaigns have already moved to a completed state.',
    ],
  };
}

async function buildRoleAnalytics(): Promise<AnalyticsModuleData> {
  const catalog = await roleManagementService.loadCatalog();
  const roles = catalog.roles;
  const permissions = catalog.permissions;
  const customRoles = roles.filter((item) => !item.isSystem);
  const systemRoles = roles.filter((item) => item.isSystem);
  const averagePermissions = roles.length
    ? roles.reduce((sum, role) => sum + role.permissions.length, 0) / roles.length
    : 0;
  const moduleCounts = permissions.reduce<Record<string, number>>((acc, permission) => {
    const key = humanizeEnum(permission.module);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    title: 'Role Analytics',
    subtitle: 'Role catalog size, permission spread and custom-role usage.',
    icon: 'admin-panel-settings',
    primaryActionLabel: 'Open role management',
    primaryActionHref: '/admin/roles',
    metrics: [
      { label: 'Total roles', value: formatCompactNumber(roles.length), helper: `${systemRoles.length} system / ${customRoles.length} custom`, tone: 'primary' },
      { label: 'Permission keys', value: formatCompactNumber(permissions.length), helper: 'Available permission catalog', tone: 'success' },
      { label: 'Average per role', value: averagePermissions.toFixed(1), helper: 'Permissions assigned per role', tone: 'warning' },
      { label: 'Custom roles', value: formatCompactNumber(customRoles.length), helper: 'Tenant-defined roles', tone: 'muted' },
    ],
    breakdown: [
      ...topEntries(moduleCounts, 5).map(([label, value]) => ({
        label,
        value: formatCompactNumber(value),
        helper: 'Permissions in this module',
      })),
    ],
    recent: roles.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.name,
      subtitle: item.description || (item.isSystem ? 'System role' : 'Custom role'),
      detail: `${item.permissions.length} permissions`,
      meta: [item.isSystem ? 'System' : 'Custom', item.key],
      icon: item.isSystem ? 'verified-user' : 'person-pin',
      accentColor: item.isSystem ? colors.primary.DEFAULT : colors.status.warning,
    })),
    insights: [
      customRoles.length ? `${formatCompactNumber(customRoles.length)} custom roles need consistent permission review.` : 'Only system roles are configured right now.',
      permissions.length ? 'Permission analytics are derived from the live tenant role catalog.' : 'Permission catalog is empty, so role analytics are limited.',
    ],
  };
}

async function buildChatAnalytics(): Promise<AnalyticsModuleData> {
  const [communicationChats, eventChats] = await Promise.all([
    chatService.loadChats({ context: 'communication' }),
    chatService.loadChats({ context: 'event' }),
  ]);
  const items = Array.from(new Map([...communicationChats, ...eventChats].map((item) => [item.id, item])).values());
  const activeCount = items.filter((item) => item.active).length;
  const restrictedCount = items.filter((item) => String(item.status || '').toUpperCase() === 'RESTRICTED').length;
  const disabledCount = items.filter((item) => String(item.status || '').toUpperCase() === 'DISABLED').length;
  const postEnabledCount = items.filter((item) => item.canPost).length;
  const totalMembers = items.reduce((sum, item) => sum + Number(item.memberCount || 0), 0);
  const totalMessages = items.reduce((sum, item) => sum + Number(item.messageCount || 0), 0);
  const averageMembers = items.length ? totalMembers / items.length : 0;
  const eventCount = items.filter((item) => String(item.type || '').toUpperCase() === 'EVENT').length;
  const typeCounts = items.reduce<Record<string, number>>((acc, item) => {
    const key = humanizeEnum(item.type || 'group');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    title: 'Chat Analytics',
    subtitle: 'Group and event chat coverage, restrictions, and message activity.',
    icon: 'forum',
    primaryActionLabel: 'Open community chats',
    primaryActionHref: '/admin/community-chats',
    metrics: [
      { label: 'Chat rooms', value: formatCompactNumber(items.length), helper: 'Community and event chat rooms', tone: 'primary' },
      { label: 'Active rooms', value: formatCompactNumber(activeCount), helper: 'Currently active chat groups', tone: 'success' },
      { label: 'Restricted rooms', value: formatCompactNumber(restrictedCount), helper: 'Admin-only posting mode', tone: 'warning' },
      { label: 'Disabled rooms', value: formatCompactNumber(disabledCount), helper: 'Archived or turned off chats', tone: 'muted' },
      { label: 'Members covered', value: formatCompactNumber(totalMembers), helper: 'Total chat memberships', tone: 'primary' },
      { label: 'Messages stored', value: formatCompactNumber(totalMessages), helper: 'Visible message history count', tone: 'success' },
    ],
    breakdown: [
      ...topEntries(typeCounts, 4).map(([label, value]) => ({
        label,
        value: formatCompactNumber(value),
        helper: 'Chat type distribution',
      })),
      {
        label: 'Posting enabled',
        value: formatCompactNumber(postEnabledCount),
        helper: 'Rooms where members can post',
      },
      {
        label: 'Event chats',
        value: formatCompactNumber(eventCount),
        helper: 'Auto-created or event-linked rooms',
      },
      {
        label: 'Average room size',
        value: averageMembers.toFixed(1),
        helper: 'Members per chat',
      },
    ],
    recent: items.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.preview,
      detail: item.time || 'No recent message timestamp',
      meta: [
        humanizeEnum(item.status || (item.active ? 'active' : 'inactive')),
        `${item.memberCount || 0} members`,
        `${item.messageCount || 0} messages`,
      ],
      icon: 'chat-bubble-outline',
      accentColor: item.active ? colors.status.success : colors.text.muted,
    })),
    insights: [
      items.length ? 'Chat analytics are based on live group and event rooms.' : 'No communication rooms are available yet.',
      restrictedCount ? `${formatCompactNumber(restrictedCount)} chat rooms are operating in admin-only mode.` : 'No chat room is currently restricted to admin-only posting.',
      postEnabledCount < activeCount ? 'Some active chat rooms are read-only for members.' : 'Most active chat rooms currently allow posting.',
    ],
  };
}

async function loadModuleAnalytics(moduleKey: AdminAnalyticsModuleKey) {
  switch (moduleKey) {
    case 'donation':
      return buildDonationAnalytics();
    case 'publication':
      return buildPublicationAnalytics();
    case 'advertisement':
      return buildAdvertisementAnalytics();
    case 'notification':
      return buildNotificationAnalytics();
    case 'role':
      return buildRoleAnalytics();
    case 'chat':
      return buildChatAnalytics();
  }
}

function ModuleAnalyticsSkeleton() {
  return (
    <View style={{ gap: spacing[5] }}>
      <AdminAnalyticsCardShell>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <StatCardSkeleton minHeight={72} />
        </View>
      </AdminAnalyticsCardShell>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        {Array.from({ length: 4 }, (_, index) => (
          <View key={index} style={{ width: '47%' }}>
            <StatCardSkeleton minHeight={110} />
          </View>
        ))}
      </View>
      <AdminAnalyticsCardShell>
        <View style={{ gap: spacing[3] }}>
          {Array.from({ length: 4 }, (_, index) => (
            <ListRowSkeleton key={index} minHeight={56} />
          ))}
        </View>
      </AdminAnalyticsCardShell>
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: 3 }, (_, index) => (
          <ListRowSkeleton key={index} minHeight={92} />
        ))}
      </View>
    </View>
  );
}

function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  const toneStyles = getToneStyles(metric.tone);

  return (
    <View
      style={{
        width: '47%',
        minHeight: 112,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: toneStyles.borderColor,
        backgroundColor: toneStyles.backgroundColor,
        padding: spacing[4],
        gap: spacing[2],
      }}>
      <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {metric.label}
      </Text>
      <Text variant="h3" style={{ color: toneStyles.valueColor, fontFamily: typography.fontFamily.bold }}>
        {metric.value}
      </Text>
      {metric.helper ? (
        <Text variant="caption" style={{ color: colors.text.muted }}>
          {metric.helper}
        </Text>
      ) : null}
    </View>
  );
}

function BreakdownCard({ items }: { items: AnalyticsBreakdownItem[] }) {
  return (
    <AdminAnalyticsCardShell>
      <View style={{ gap: spacing[3] }}>
        <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
          Breakdown
        </Text>
        {items.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: spacing[3],
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: colors.border.muted,
              paddingTop: index === 0 ? 0 : spacing[3],
            }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
                {item.label}
              </Text>
              {item.helper ? (
                <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                  {item.helper}
                </Text>
              ) : null}
            </View>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </AdminAnalyticsCardShell>
  );
}

function RecentActivitySection({ items }: { items: AnalyticsRecentItem[] }) {
  return (
    <View style={{ gap: spacing[3] }}>
      <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
        Recent Activity
      </Text>
      {items.map((item) => (
        <EntityActionCard
          key={item.id}
          accentColor={item.accentColor}
          leading={(
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary.subtle,
              }}>
              <MaterialIcons name={item.icon} size={22} color={colors.primary.DEFAULT} />
            </View>
          )}
          title={item.title}
          subtitle={item.subtitle}
          detail={item.detail}
          metaItems={item.meta.map((meta, index) => ({
            key: `${item.id}-${index}`,
            label: meta,
            color: colors.text.muted,
          }))}
        />
      ))}
    </View>
  );
}

function InsightSection({
  insights,
  actionLabel,
  actionHref,
}: {
  insights?: string[];
  actionLabel: string;
  actionHref: string;
}) {
  const router = useRouter();

  return (
    <AdminAnalyticsCardShell>
      <View style={{ gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            Operational Notes
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => router.push(actionHref as never)}
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
              borderRadius: radius.full,
              backgroundColor: colors.primary.subtle,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
            }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {(insights ?? []).map((insight, index) => (
          <View key={`${insight}-${index}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] }}>
            <MaterialIcons name="check-circle" size={18} color={colors.primary.DEFAULT} style={{ marginTop: 1 }} />
            <Text style={{ flex: 1, color: colors.text.secondary }}>{insight}</Text>
          </View>
        ))}
      </View>
    </AdminAnalyticsCardShell>
  );
}

export function AdminModuleAnalyticsContent({ moduleKey }: { moduleKey: AdminAnalyticsModuleKey }) {
  const navigateBack = useBackNavigation();
  const [data, setData] = useState<AnalyticsModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>('pdf');
  const [showExportPopup, setShowExportPopup] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextData = await loadModuleAnalytics(moduleKey);
      setData(nextData);
    } catch (error) {
      setData(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [moduleKey]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const handleDownloadReport = useCallback(async () => {
    if (!data) {
      return;
    }

    try {
      await downloadAnalyticsReport({
        title: data.title,
        subtitle: data.subtitle,
        fileBaseName: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        format: exportFormat,
        summary: data.metrics.map((metric) => ({
          label: metric.label,
          value: metric.value,
        })),
        sections: data.insights?.length
          ? [{
              title: 'Operational Notes',
              items: data.insights.map((insight, index) => ({
                label: `Note ${index + 1}`,
                value: insight,
              })),
            }]
          : [],
        tables: [
          {
            title: 'Breakdown',
            columns: ['Label', 'Value', 'Helper'],
            rows: data.breakdown.map((item) => [item.label, item.value, item.helper || '']),
          },
          {
            title: 'Recent Activity',
            columns: ['Title', 'Subtitle', 'Detail', 'Meta'],
            rows: data.recent.map((item) => [item.title, item.subtitle, item.detail || '', item.meta.join(' | ')]),
          },
        ].filter((table) => table.rows.length),
      });
    } finally {
      setShowExportPopup(false);
    }
  }, [data, exportFormat]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={data?.title || 'Analytics'}
          subtitle={data?.subtitle || 'Module analytics overview'}
          onLeftPress={navigateBack}
          actions={data ? [{ key: 'download', icon: 'download', variant: 'outlined', onPress: () => setShowExportPopup(true) }] : undefined}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: spacing[4],
            paddingBottom: 96,
            paddingHorizontal: spacing[4],
            width: '100%',
            maxWidth: 448,
            alignSelf: 'center',
            gap: spacing[5],
          }}>
          {isLoading ? <ModuleAnalyticsSkeleton /> : null}

          {!isLoading && errorMessage ? (
            <ErrorState
              title="Unable to load analytics"
              description={errorMessage}
              onRetry={() => {
                void loadData();
              }}
            />
          ) : null}

          {!isLoading && !errorMessage && !data ? (
            <EmptyState
              icon="insights"
              title="No analytics available"
              description="This module does not have enough live data yet."
              action={{ label: 'Retry', onPress: () => { void loadData(); } }}
            />
          ) : null}

          {!isLoading && !errorMessage && data ? (
            <>
              <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: radius.xl,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary.subtle,
                    }}>
                    <MaterialIcons name={data.icon} size={26} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1, gap: spacing[1] }}>
                    <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      {data.title}
                    </Text>
                    <Text style={{ color: colors.text.secondary }}>
                      {data.subtitle}
                    </Text>
                  </View>
                </View>
              </AdminAnalyticsCardShell>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], justifyContent: 'space-between' }}>
                {data.metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </View>

              {data.breakdown.length ? <BreakdownCard items={data.breakdown} /> : null}
              {data.recent.length ? <RecentActivitySection items={data.recent} /> : null}
              <InsightSection
                insights={data.insights}
                actionLabel={data.primaryActionLabel}
                actionHref={data.primaryActionHref}
              />
            </>
          ) : null}
        </ScrollView>
        <SelectionPopup
          visible={showExportPopup}
          title="Export report"
          subtitle="Choose the format for this analytics report."
          options={[
            { key: 'pdf', label: 'PDF statement' },
            { key: 'excel', label: 'Excel XLSX' },
          ]}
          selectedKey={exportFormat}
          onSelect={(key) => setExportFormat(key === 'excel' ? 'excel' : 'pdf')}
          onClose={() => setShowExportPopup(false)}
          onConfirm={() => { void handleDownloadReport(); }}
          confirmLabel="Download"
        />
      </View>
    </AppSafeAreaView>
  );
}
