import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppHeaderSearch,
  DateField,
  Dialog,
  type DialogVariant,
  FilterChips,
  FilterSheet,
  SelectionPopup,
  Text,
} from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useDebounce } from '@/src/hooks';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { AdminQuickInsightsSection } from '@/src/features/admin/components/admin-quick-insights-section';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';
import type { MatrimonyPeriodFilterKey, MatrimonyStatus, MatrimonyTabKey } from '../data/approve-profiles-data';
import { matrimonyFeedService, type MatrimonyProfileRecord } from '../services/matrimony-feed-service';
import { MatrimonyApprovalListSkeleton } from './matrimony-loading-states';

const ALL_FILTERS = 'all';
const PAGE_SIZE = 20;

type AdminMatrimonyFilterKey =
  | 'gender'
  | 'state'
  | 'city'
  | 'maritalStatus'
  | 'education'
  | 'height'
  | 'occupation'
  | 'familyType'
  | 'caste'
  | 'minAge'
  | 'maxAge';

const emptyFilters: Record<AdminMatrimonyFilterKey, string> = {
  gender: ALL_FILTERS,
  state: ALL_FILTERS,
  city: ALL_FILTERS,
  maritalStatus: ALL_FILTERS,
  education: ALL_FILTERS,
  height: ALL_FILTERS,
  occupation: ALL_FILTERS,
  familyType: ALL_FILTERS,
  caste: ALL_FILTERS,
  minAge: ALL_FILTERS,
  maxAge: ALL_FILTERS,
};

const heightFilterOptions = [
  { key: ALL_FILTERS, label: 'All heights' },
  { key: '5-0', label: `5' 0"` },
  { key: '5-2', label: `5' 2"` },
  { key: '5-4', label: `5' 4"` },
  { key: '5-6', label: `5' 6"` },
  { key: '5-8', label: `5' 8"` },
  { key: '6-0', label: `6' 0"` },
];

const educationFilterOptions = [
  { key: ALL_FILTERS, label: 'All education' },
  { key: 'hs', label: 'High School' },
  { key: 'diploma', label: 'Diploma' },
  { key: 'bachelors', label: "Bachelor's" },
  { key: 'masters', label: "Master's" },
  { key: 'phd', label: 'PhD' },
];

const ageFilterOptions = [
  { key: ALL_FILTERS, label: 'Any age' },
  { key: '18', label: '18+' },
  { key: '21', label: '21+' },
  { key: '25', label: '25+' },
  { key: '30', label: '30+' },
  { key: '35', label: '35+' },
  { key: '40', label: '40+' },
];

const maxAgeFilterOptions = [
  { key: ALL_FILTERS, label: 'No max age' },
  { key: '25', label: 'Up to 25' },
  { key: '30', label: 'Up to 30' },
  { key: '35', label: 'Up to 35' },
  { key: '40', label: 'Up to 40' },
  { key: '45', label: 'Up to 45' },
  { key: '50', label: 'Up to 50' },
];

const familyTypeFilterOptions = [
  { key: ALL_FILTERS, label: 'All family types' },
  { key: 'Joint', label: 'Joint' },
  { key: 'Nuclear', label: 'Nuclear' },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function getTime(value?: string | null) {
  if (!value) {
    return null;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function matchesCreatedPeriod(
  createdAt: string,
  period: MatrimonyPeriodFilterKey,
  customFrom: Date | null,
  customTo: Date | null,
) {
  if (period === 'all') {
    return true;
  }

  const createdTime = getTime(createdAt);
  if (createdTime === null) {
    return false;
  }

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  if (period === 'today') {
    return createdTime >= todayStart.getTime() && createdTime <= todayEnd.getTime();
  }

  if (period === 'last7Days') {
    return createdTime >= todayStart.getTime() - (6 * DAY_IN_MS) && createdTime <= todayEnd.getTime();
  }

  if (period === 'thisMonth') {
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1).getTime();
    return createdTime >= monthStart && createdTime <= todayEnd.getTime();
  }

  if (period === 'older') {
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1).getTime();
    return createdTime < monthStart;
  }

  if (!customFrom && !customTo) {
    return true;
  }

  const fromTime = customFrom ? startOfDay(customFrom).getTime() : Number.NEGATIVE_INFINITY;
  const toTime = customTo ? endOfDay(customTo).getTime() : Number.POSITIVE_INFINITY;
  return createdTime >= Math.min(fromTime, toTime) && createdTime <= Math.max(fromTime, toTime);
}

function normalizeOption(value?: string | null) {
  return String(value ?? '').trim();
}

function normalizeMaritalStatusToken(value?: string | null) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function maritalStatusMatchesFilter(value?: string | null, filter = ALL_FILTERS) {
  if (filter === ALL_FILTERS) {
    return true;
  }

  const valueToken = normalizeMaritalStatusToken(value);
  const filterToken = normalizeMaritalStatusToken(filter);
  const equivalentTokens: Record<string, string[]> = {
    never_married: ['never_married', 'unmarried', 'single'],
    unmarried: ['never_married', 'unmarried', 'single'],
    single: ['never_married', 'unmarried', 'single'],
    divorced: ['divorced'],
    widowed: ['widowed', 'widow', 'widower'],
    widow: ['widowed', 'widow', 'widower'],
    widower: ['widowed', 'widow', 'widower'],
    separated: ['separated'],
  };

  return (equivalentTokens[filterToken] || [filterToken]).includes(valueToken);
}

function uniqueOptions(values: (string | null | undefined)[], allLabel: string) {
  const options = Array.from(new Set(values.map(normalizeOption).filter(Boolean))).sort((left, right) => left.localeCompare(right));
  return [{ key: ALL_FILTERS, label: allLabel }, ...options.map((value) => ({ key: value, label: value }))];
}

function selectOptionsToFilterOptions(options: { label: string; value: string }[], allLabel: string) {
  return [{ key: ALL_FILTERS, label: allLabel }, ...options.map((option) => ({ key: option.value, label: option.label }))];
}

function withCount(label: string, count: number) {
  return `${label} (${count})`;
}

function getStatusStyle(status: MatrimonyStatus) {
  switch (status) {
    case 'Approved':
      return {
        backgroundColor: 'rgba(0,80,75,0.1)',
        color: colors.status.success,
        icon: 'verified' as const,
      };
    case 'Rejected':
      return {
        backgroundColor: colors.status.errorLight,
        color: colors.status.error,
        icon: 'cancel' as const,
      };
    default:
      return {
        backgroundColor: colors.primary.muted,
        color: colors.primary.DEFAULT,
        icon: 'schedule' as const,
      };
  }
}

function formatRelativeLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Recently';

  const diffHours = Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapReviewProfile(profile: MatrimonyProfileRecord, status: MatrimonyStatus, language: 'en' | 'gu') {
  const name = `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`.trim() || 'Member';
  const age = profile.dob ? Math.max(Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)), 0) : null;
  const city = profile.city || 'Community';
  const state = profile.state || '';
  const requestType = profile.reviewRequestType === 'PROFILE_UPDATE' ? 'Update Request' : 'New Profile';
  const pendingReviewPhotos = Array.isArray(profile.pendingReviewData?.photoUrls)
    ? profile.pendingReviewData.photoUrls.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    : [];
  const photoUrls = (pendingReviewPhotos.length ? pendingReviewPhotos : profile.photoUrls).filter(Boolean);
  return {
    id: profile.id,
    name,
    ageLocation: [age ? `${age} yrs` : null, translateLocationText([city, state].filter(Boolean).join(', '), language)].filter(Boolean).join(' • '),
    profession: profile.occupation || profile.education || 'Community member',
    image: photoUrls[0] || profile.profilePhotoUrl || 'https://api.dicebear.com/7.x/initials/png?seed=' + encodeURIComponent(name),
    photoUrls,
    status,
    submittedAt: profile.updatedAt || profile.createdAt || new Date().toISOString(),
    createdAt: profile.createdAt || profile.updatedAt || new Date().toISOString(),
    city,
    state,
    age,
    gender: profile.gender || null,
    maritalStatus: profile.maritalStatus || null,
    education: profile.education || null,
    height: profile.height || null,
    occupation: profile.occupation || null,
    familyType: profile.familyType || null,
    caste: profile.caste || null,
    note: profile.aboutMe || undefined,
    requestType,
    changeSummary: profile.reviewChangeSummary ?? [],
    rejectionReason: status === 'Rejected' ? profile.remarks || undefined : undefined,
  };
}

function dedupeReviewProfiles(items: ReturnType<typeof mapReviewProfile>[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.status}:${item.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getReviewStatusForTab(tab: MatrimonyTabKey): 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' {
  if (tab === 'approved') return 'APPROVED';
  if (tab === 'rejected') return 'REJECTED';
  return 'PENDING_APPROVAL';
}

function getReviewLabelForStatus(status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'): MatrimonyStatus {
  if (status === 'APPROVED') return 'Approved';
  if (status === 'REJECTED') return 'Rejected';
  return 'New Request';
}

export function ApproveMatrimonyProfilesContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const pathname = usePathname();
  const t = useTranslations('matrimony.approve-profiles');
  const { language } = useAppPreferences();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const effectiveSearch = search.trim() ? debouncedSearch : '';
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [activeTab, setActiveTab] = useState<MatrimonyTabKey>('new');
  const [activePeriodFilter, setActivePeriodFilter] = useState<MatrimonyPeriodFilterKey>('all');
  const [customCreatedFrom, setCustomCreatedFrom] = useState<Date | null>(null);
  const [customCreatedTo, setCustomCreatedTo] = useState<Date | null>(null);
  const [filters, setFilters] = useState<Record<AdminMatrimonyFilterKey, string>>(emptyFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const [rejectPopupVisible, setRejectPopupVisible] = useState(false);
  const [rejectingName, setRejectingName] = useState('Rajesh Kumar');
  const [rejectingProfileId, setRejectingProfileId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState('inappropriate');
  const [reviewProfiles, setReviewProfiles] = useState<ReturnType<typeof mapReviewProfile>[]>([]);
  const [selectedReviewImages, setSelectedReviewImages] = useState<Record<string, string>>({});
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingMoreProfiles, setLoadingMoreProfiles] = useState(false);
  const [refreshingProfiles, setRefreshingProfiles] = useState(false);
  const [profilePage, setProfilePage] = useState(1);
  const [hasNextProfilePage, setHasNextProfilePage] = useState(false);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [reviewTotals, setReviewTotals] = useState({ new: 0, approved: 0, rejected: 0 });
  const reviewRequestIdRef = useRef(0);
  const reviewTotalsRequestIdRef = useRef(0);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
  });
  const { stateOptions, cityOptions } = useCountryStateCityOptions({
    countryName: 'India',
    stateName: filters.state === ALL_FILTERS ? '' : filters.state,
  });

  const rejectionOptions = [
    { key: 'inappropriate', label: t('reasons.inappropriate') },
    { key: 'blurry', label: t('reasons.blurry') },
    { key: 'incomplete', label: t('reasons.incomplete') },
    { key: 'duplicate', label: t('reasons.duplicate') },
  ] as const;

  const buildReviewFilters = useCallback(() => ({
    gender: filters.gender,
    state: filters.state,
    city: filters.city,
    maritalStatus: filters.maritalStatus,
    education: filters.education,
    height: filters.height,
    occupation: filters.occupation,
    familyType: filters.familyType,
    caste: filters.caste,
    minAge: filters.minAge,
    maxAge: filters.maxAge,
  }), [filters]);

  const loadReviewTotals = useCallback(async () => {
    const requestId = ++reviewTotalsRequestIdRef.current;
    const common = { limit: 1, page: 1, search: effectiveSearch, filters: buildReviewFilters() };
    const [pending, approved, rejected] = await Promise.all([
      matrimonyFeedService.loadProfilesForReviewPage({ ...common, status: 'PENDING_APPROVAL' }),
      matrimonyFeedService.loadProfilesForReviewPage({ ...common, status: 'APPROVED' }),
      matrimonyFeedService.loadProfilesForReviewPage({ ...common, status: 'REJECTED' }),
    ]);
    if (requestId !== reviewTotalsRequestIdRef.current) {
      return;
    }
    setReviewTotals({
      new: getPaginationTotal(pending.pagination, pending.items.length),
      approved: getPaginationTotal(approved.pagination, approved.items.length),
      rejected: getPaginationTotal(rejected.pagination, rejected.items.length),
    });
  }, [buildReviewFilters, effectiveSearch]);

  const loadReviewProfiles = useCallback(({ page = 1, append = false, refresh = false } = {}) => {
    let active = true;
    const requestId = ++reviewRequestIdRef.current;
    if (append) {
      setLoadingMoreProfiles(true);
    } else if (refresh) {
      setRefreshingProfiles(true);
    } else {
      setLoadingProfiles(true);
    }

    const status = getReviewStatusForTab(activeTab);
    void Promise.all([
      matrimonyFeedService.loadProfilesForReviewPage({
        status,
        page,
        limit: PAGE_SIZE,
        search: effectiveSearch,
        filters: buildReviewFilters(),
      }),
      append ? Promise.resolve() : loadReviewTotals().catch(() => undefined),
    ]).then(([result]) => {
      if (!active || requestId !== reviewRequestIdRef.current) return;
      const mapped = result.items.map((profile) => mapReviewProfile(profile, getReviewLabelForStatus(status), language));
      setReviewProfiles((current) => append ? dedupeReviewProfiles([...current, ...mapped]) : mapped);
      setProfilePage(result.pagination?.page ?? page);
      setHasNextProfilePage(Boolean(result.pagination?.hasNextPage));
      setProfileLoadError(null);
    }).catch(() => {
      if (active && requestId === reviewRequestIdRef.current) {
        if (!append) {
          setReviewProfiles([]);
        }
        setProfileLoadError('Unable to load matrimony profiles.');
      }
    }).finally(() => {
      if (active && requestId === reviewRequestIdRef.current) {
        setLoadingProfiles(false);
        setLoadingMoreProfiles(false);
        setRefreshingProfiles(false);
      }
    });

    return () => {
      active = false;
    };
  }, [activeTab, buildReviewFilters, effectiveSearch, language, loadReviewTotals]);

  useFocusEffect(
    useCallback(() => {
      const cleanup = loadReviewProfiles();
      return cleanup;
    }, [loadReviewProfiles]),
  );

  const filteredReviews = useMemo(() => {
    const term = effectiveSearch.trim().toLowerCase();
    return reviewProfiles.filter((item) => {
      const tabMatches =
        activeTab === 'new'
          ? item.status === 'New Request'
          : activeTab === 'approved'
            ? item.status === 'Approved'
            : item.status === 'Rejected';

      const profileFilterMatches =
        (filters.gender === ALL_FILTERS || String(item.gender || '').toLowerCase().includes(filters.gender.toLowerCase())) &&
        (filters.state === ALL_FILTERS || String(item.state || '').toLowerCase().includes(filters.state.toLowerCase())) &&
        (filters.city === ALL_FILTERS || String(item.city || '').toLowerCase().includes(filters.city.toLowerCase())) &&
        maritalStatusMatchesFilter(item.maritalStatus, filters.maritalStatus) &&
        (filters.education === ALL_FILTERS || String(item.education || '').toLowerCase().includes(filters.education.toLowerCase())) &&
        (filters.height === ALL_FILTERS || String(item.height || '').toLowerCase().includes(filters.height.toLowerCase())) &&
        (filters.occupation === ALL_FILTERS || String(item.occupation || '').toLowerCase().includes(filters.occupation.toLowerCase())) &&
        (filters.familyType === ALL_FILTERS || String(item.familyType || '').toLowerCase().includes(filters.familyType.toLowerCase())) &&
        (filters.caste === ALL_FILTERS || String(item.caste || '').toLowerCase().includes(filters.caste.toLowerCase())) &&
        (filters.minAge === ALL_FILTERS || item.age === null || item.age >= Number(filters.minAge)) &&
        (filters.maxAge === ALL_FILTERS || item.age === null || item.age <= Number(filters.maxAge));

      const periodMatches = matchesCreatedPeriod(item.createdAt, activePeriodFilter, customCreatedFrom, customCreatedTo);

      const searchMatches =
        !term ||
        `${item.name} ${item.profession} ${item.ageLocation} ${item.city} ${item.note ?? ''} ${item.rejectionReason ?? ''}`
          .toLowerCase()
          .includes(term);

      return tabMatches && profileFilterMatches && periodMatches && searchMatches;
    });
  }, [activePeriodFilter, activeTab, customCreatedFrom, customCreatedTo, effectiveSearch, filters, reviewProfiles]);

  const reviewCounts = useMemo(
    () => reviewTotals,
    [reviewTotals],
  );

  const quickInsightItems = useMemo(
    () => [
      {
        id: 'new',
        label: t('insights.newRequests'),
        value: String(reviewTotals.new),
        icon: 'schedule' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle ?? '#eef2f7',
      },
      {
        id: 'approved',
        label: t('insights.approved'),
        value: String(reviewTotals.approved),
        icon: 'verified' as const,
        iconColor: colors.status.success,
        iconBackgroundColor: 'rgba(0,80,75,0.1)',
      },
      {
        id: 'rejected',
        label: t('insights.rejected'),
        value: String(reviewTotals.rejected),
        icon: 'cancel' as const,
        iconColor: colors.status.error,
        iconBackgroundColor: colors.status.errorLight,
      },
    ],
    [reviewTotals, t],
  );

  const activeFilterCount =
    Object.values(filters).filter((value) => value !== ALL_FILTERS).length +
    (activePeriodFilter !== 'all' ? 1 : 0);

  const statusChips = [
    {
      key: 'filters',
      label: activeFilterCount > 0
        ? `${t('filters.filters')} (${activeFilterCount})`
        : t('filters.filters'),
      icon: 'tune' as const,
    },
    { key: 'new', label: withCount(t('tabs.newRequests'), reviewCounts.new), icon: 'schedule' as const },
    { key: 'approved', label: withCount(t('tabs.approved'), reviewCounts.approved), icon: 'verified' as const },
    { key: 'rejected', label: withCount(t('tabs.rejected'), reviewCounts.rejected), icon: 'cancel' as const },
  ];

  const filterSections = [
    {
      title: 'Gender',
      activeKey: filters.gender,
      icon: 'wc' as const,
      items: [
        { key: ALL_FILTERS, label: 'All genders' },
        { key: 'Female', label: 'Female' },
        { key: 'Male', label: 'Male' },
        { key: 'Other', label: 'Other' },
      ],
      onSelect: (key: string) => setFilters((current) => ({ ...current, gender: key })),
    },
    {
      title: 'Height',
      activeKey: filters.height,
      icon: 'height' as const,
      items: heightFilterOptions,
      onSelect: (key: string) => setFilters((current) => ({ ...current, height: key })),
    },
    {
      title: 'Age from DOB',
      activeKey: filters.minAge,
      icon: 'cake' as const,
      items: ageFilterOptions,
      onSelect: (key: string) => setFilters((current) => ({ ...current, minAge: key })),
    },
    {
      title: 'Max Age',
      activeKey: filters.maxAge,
      icon: 'event' as const,
      items: maxAgeFilterOptions,
      onSelect: (key: string) => setFilters((current) => ({ ...current, maxAge: key })),
    },
    {
      title: 'State',
      activeKey: filters.state,
      icon: 'map' as const,
      items: selectOptionsToFilterOptions(stateOptions, 'All states'),
      onSelect: (key: string) => setFilters((current) => ({ ...current, state: key, city: ALL_FILTERS })),
    },
    {
      title: 'City',
      activeKey: filters.city,
      icon: 'location-city' as const,
      items: selectOptionsToFilterOptions(cityOptions, filters.state === ALL_FILTERS ? 'Select state first' : 'All cities'),
      onSelect: (key: string) => setFilters((current) => ({ ...current, city: key })),
    },
    {
      title: 'Status',
      activeKey: filters.maritalStatus,
      icon: 'favorite-border' as const,
      items: [
        { key: ALL_FILTERS, label: 'All marital status' },
        { key: 'Never Married', label: 'Never Married' },
        { key: 'Divorced', label: 'Divorced' },
        { key: 'Widowed', label: 'Widowed' },
        { key: 'Separated', label: 'Separated' },
      ],
      onSelect: (key: string) => setFilters((current) => ({ ...current, maritalStatus: key })),
    },
    {
      title: 'Highest Education',
      activeKey: filters.education,
      icon: 'school' as const,
      items: educationFilterOptions,
      onSelect: (key: string) => setFilters((current) => ({ ...current, education: key })),
    },
    {
      title: 'Profession',
      activeKey: filters.occupation,
      icon: 'work' as const,
      items: uniqueOptions(reviewProfiles.map((profile) => profile.occupation), 'All professions'),
      onSelect: (key: string) => setFilters((current) => ({ ...current, occupation: key })),
    },
    {
      title: 'Family',
      activeKey: filters.familyType,
      icon: 'family-restroom' as const,
      items: familyTypeFilterOptions,
      onSelect: (key: string) => setFilters((current) => ({ ...current, familyType: key })),
    },
    {
      title: 'Caste',
      activeKey: filters.caste,
      icon: 'groups' as const,
      items: uniqueOptions(reviewProfiles.map((profile) => profile.caste), 'All castes'),
      onSelect: (key: string) => setFilters((current) => ({ ...current, caste: key })),
    },
    {
      title: t('filters.created'),
      activeKey: activePeriodFilter,
      icon: 'date-range' as const,
      items: [
        { key: 'all', label: t('filters.allPeriods') },
        { key: 'today', label: t('filters.today') },
        { key: 'last7Days', label: t('filters.last7Days') },
        { key: 'thisMonth', label: t('filters.thisMonth') },
        { key: 'older', label: t('filters.older') },
        { key: 'custom', label: t('filters.custom') },
      ],
      onSelect: (key: string) => setActivePeriodFilter(key as MatrimonyPeriodFilterKey),
      renderContent: () => activePeriodFilter === 'custom' ? (
        <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
          <DateField
            label={t('filters.fromDate')}
            labelVariant="default"
            variant="registration"
            value={customCreatedFrom ?? undefined}
            onChange={setCustomCreatedFrom}
            maximumDate={customCreatedTo ?? new Date()}
          />
          <DateField
            label={t('filters.toDate')}
            labelVariant="default"
            variant="registration"
            value={customCreatedTo ?? undefined}
            onChange={setCustomCreatedTo}
            minimumDate={customCreatedFrom ?? undefined}
            maximumDate={new Date()}
          />
        </View>
      ) : null,
    },
  ];

  const onCardReject = (profileId: string, name: string) => {
    setRejectingName(name);
    setRejectingProfileId(profileId);
    setSelectedReason('inappropriate');
    setRejectPopupVisible(true);
  };

  const reviewProfile = async (profileId: string, action: 'approve' | 'reject', remarks?: string) => {
    try {
      await matrimonyFeedService.reviewProfile(profileId, action, remarks);
      setReviewProfiles((current) =>
        current.map((item) =>
          item.id === profileId
            ? { ...item, status: action === 'approve' ? 'Approved' : 'Rejected', rejectionReason: action === 'reject' ? remarks : undefined }
            : item,
        ),
      );
      setFeedbackDialog({
        visible: true,
        variant: 'success',
        title: action === 'approve' ? 'Approved' : 'Rejected',
        description: 'Matrimony profile updated.',
      });
    } catch (error) {
      setFeedbackDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to update profile',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const visibleCount = filteredReviews.length;
  const activeSummaryLabel =
    activeTab === 'new'
      ? t('summary.pending').replace('{count}', String(reviewCounts.new))
      : activeTab === 'approved'
        ? t('tabs.approved').concat(` (${reviewCounts.approved})`)
        : t('tabs.rejected').concat(` (${reviewCounts.rejected})`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <AppHeaderSearch
          title={t('title')}
          placeholder={t('search.placeholder')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchInHeader}
          onSearchPress={() => setSearchInHeader(true)}
          onCloseSearch={() => {
            setSearch('');
            setSearchInHeader(false);
          }}
          onBackPress={navigateBack}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 104 }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshingProfiles}
              onRefresh={() => {
                loadReviewProfiles({ page: 1, refresh: true });
              }}
            />
          )}
          onScroll={({ nativeEvent }) => {
            const distanceFromBottom = nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height - nativeEvent.contentOffset.y;
            if (distanceFromBottom > 240 || loadingMoreProfiles || !hasNextProfilePage) {
              return;
            }
            loadReviewProfiles({ page: profilePage + 1, append: true });
          }}
          scrollEventThrottle={16}>
          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], gap: spacing[5] }}>
            <AdminQuickInsightsSection
              title={t('insights.title')}
              periodLabel={t('insights.periodLabel')}
              actionLabel={t('insights.viewAnalytics')}
              onActionPress={() => router.push('/admin/matrimony-analytics' as never)}
              items={quickInsightItems}
            />

            <FilterChips
              scrollable
              showIcons
              activeKey={activeTab}
              items={statusChips}
              onPress={(key) => {
                if (key === 'filters') {
                  setFilterVisible(true);
                  return;
                }
                setActiveTab(key as MatrimonyTabKey);
              }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                {visibleCount} {visibleCount === 1 ? 'Request' : 'Requests'}
              </Text>
              <Text variant="caption" style={{ color: colors.text.muted }}>
                {activeSummaryLabel}
              </Text>
            </View>

            <View style={{ gap: spacing[3] }}>
              {loadingProfiles ? (
                <MatrimonyApprovalListSkeleton />
              ) : filteredReviews.length ? (
                filteredReviews.map((item) => {
                  const statusStyle = getStatusStyle(item.status);
                  const isNewRequest = item.status === 'New Request';

                  return (
                    <View
                      key={`${item.status}:${item.id}`}
                      style={{
                        borderRadius: radius.xl,
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderColor: colors.border.DEFAULT,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 1,
                      }}>
                      {(() => {
                        const featuredImage = selectedReviewImages[item.id] || item.image;
                        return (
                          <View style={{ position: 'relative' }}>
                            <View style={{ aspectRatio: 4 / 5, backgroundColor: colors.background.muted, overflow: 'hidden' }}>
                              <Image source={{ uri: featuredImage }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View
                              style={{
                                position: 'absolute',
                                top: spacing[3],
                                left: spacing[3],
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: spacing[1],
                                paddingHorizontal: spacing[2],
                                paddingVertical: 6,
                                borderRadius: radius.full,
                                backgroundColor: statusStyle.backgroundColor,
                              }}>
                              <MaterialIcons name={statusStyle.icon} size={14} color={statusStyle.color} />
                              <Text variant="caption" style={{ color: statusStyle.color, fontFamily: typography.fontFamily.bold }}>
                                {item.status}
                              </Text>
                            </View>
                            {item.photoUrls.length > 1 ? (
                              <View
                                style={{
                                  position: 'absolute',
                                  right: spacing[3],
                                  bottom: spacing[3],
                                  paddingHorizontal: spacing[2],
                                  paddingVertical: 6,
                                  borderRadius: radius.full,
                                  backgroundColor: 'rgba(15,23,42,0.72)',
                                }}>
                                <Text variant="caption" style={{ color: '#ffffff', fontFamily: typography.fontFamily.bold }}>
                                  {`${item.photoUrls.length} Photos`}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        );
                      })()}

                      <View style={{ padding: spacing[4] }}>
                        {item.photoUrls.length > 1 ? (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2], marginBottom: spacing[3] }}>
                            {item.photoUrls.map((photoUrl, index) => (
                              <TouchableOpacity
                                key={`${item.id}-thumb-${index}`}
                                accessibilityRole="button"
                                activeOpacity={0.85}
                                onPress={() => {
                                  setSelectedReviewImages((current) => ({
                                    ...current,
                                    [item.id]: photoUrl,
                                  }));
                                }}
                                style={{
                                  width: 54,
                                  height: 54,
                                  borderRadius: radius.lg,
                                  overflow: 'hidden',
                                  backgroundColor: colors.background.muted,
                                  borderWidth: (selectedReviewImages[item.id] || item.image) === photoUrl ? 2 : 1,
                                  borderColor: (selectedReviewImages[item.id] || item.image) === photoUrl ? colors.primary.DEFAULT : colors.primary.borderLight,
                                }}>
                                <Image source={{ uri: photoUrl }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        ) : null}
                        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                          {item.name}
                        </Text>
                        <Text variant="caption" style={{ color: colors.text.muted, marginTop: spacing[1] }}>
                          {item.profession}
                        </Text>
                        <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                          {item.ageLocation}
                        </Text>
                        <Text variant="caption" style={{ color: colors.text.muted, marginTop: spacing[1] }}>
                          {formatRelativeLabel(item.submittedAt)}
                        </Text>
                        {item.note ? (
                          <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing[1] }}>
                            {item.note}
                          </Text>
                        ) : null}
                        {isNewRequest ? (
                          <View
                            style={{
                              marginTop: spacing[2],
                              gap: spacing[1],
                              padding: spacing[3],
                              borderRadius: radius.lg,
                              backgroundColor: colors.background.muted,
                              borderWidth: 1,
                              borderColor: colors.primary.borderLight,
                            }}>
                            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                              {item.requestType}
                            </Text>
                            {item.changeSummary?.length ? (
                              <Text variant="caption" style={{ color: colors.text.secondary }}>
                                Changed: {item.changeSummary.join(', ')}
                              </Text>
                            ) : null}
                          </View>
                        ) : null}
                        {item.rejectionReason ? (
                          <Text variant="caption" style={{ color: colors.status.error, marginTop: spacing[1] }}>
                            {item.rejectionReason}
                          </Text>
                        ) : null}

                        <TouchableOpacity
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => {
                            const detailBasePath = pathname.startsWith('/admin/')
                              ? '/admin/matrimony-profiles'
                              : '/matrimony/approve-profiles';
                            router.push(`${detailBasePath}/${item.id}` as never);
                          }}
                          style={{
                            marginTop: spacing[3],
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: colors.primary.borderLight,
                            paddingVertical: spacing[2],
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: spacing[2],
                          }}>
                          <MaterialIcons name="open-in-new" size={16} color={colors.primary.DEFAULT} />
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                            {t('actions.viewDetails')}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {isNewRequest ? (
                        <View style={{ flexDirection: 'row', gap: spacing[3], paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}>
                          <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.85}
                            onPress={() => onCardReject(item.id, item.name)}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(186,26,26,0.08)',
                              borderRadius: radius.lg,
                              paddingVertical: spacing[3],
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              gap: spacing[2],
                            }}>
                            <MaterialIcons name="close" size={16} color={colors.status.error} />
                            <Text variant="caption" color={colors.status.error} style={{ fontFamily: typography.fontFamily.bold }}>
                              {t('actions.reject')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            accessibilityRole="button"
                            activeOpacity={0.85}
                            onPress={() => void reviewProfile(item.id, 'approve')}
                            style={{
                              flex: 1,
                              backgroundColor: colors.status.success,
                              borderRadius: radius.lg,
                              paddingVertical: spacing[3],
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              gap: spacing[2],
                            }}>
                            <MaterialIcons name="check" size={16} color="#ffffff" />
                            <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                              {t('actions.approve')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: colors.border.DEFAULT,
                    backgroundColor: colors.background.surface,
                    padding: spacing[5],
                    alignItems: 'center',
                    gap: spacing[2],
                  }}>
                  <MaterialIcons name="search-off" size={24} color={colors.text.muted} />
                  <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                    No requests found
                  </Text>
                  <Text variant="caption" style={{ color: colors.text.muted, textAlign: 'center' }}>
                    {profileLoadError || 'Try a different search term or clear the filters.'}
                  </Text>
                </View>
              )}
              {loadingMoreProfiles ? (
                <View style={{ paddingVertical: spacing[3], alignItems: 'center' }}>
                  <ActivityIndicator color={colors.primary.DEFAULT} />
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <FilterSheet
          visible={filterVisible}
          title={t('filters.filters')}
          subtitle={t('filters.subtitle')}
          sections={filterSections}
          onClose={() => setFilterVisible(false)}
          onApply={() => setFilterVisible(false)}
          onReset={() => {
            setFilters(emptyFilters);
            setActivePeriodFilter('all');
            setCustomCreatedFrom(null);
            setCustomCreatedTo(null);
          }}
          applyLabel={t('filters.apply')}
          resetLabel={t('filters.reset')}
        />

        <SelectionPopup
          visible={rejectPopupVisible}
          title={`Rejecting: ${rejectingName}`}
          subtitle={t('reject.subtitle')}
          options={rejectionOptions}
          selectedKey={selectedReason}
          onSelect={setSelectedReason}
          onClose={() => setRejectPopupVisible(false)}
          onConfirm={() => {
            const reason = rejectionOptions.find((option) => option.key === selectedReason)?.label || 'Profile rejected.';
            setRejectPopupVisible(false);
            if (rejectingProfileId) {
              void reviewProfile(rejectingProfileId, 'reject', reason);
            }
          }}
          confirmLabel={t('reject.confirm')}
        />
        <Dialog
          visible={feedbackDialog.visible}
          variant={feedbackDialog.variant}
          title={feedbackDialog.title}
          description={feedbackDialog.description}
          onConfirm={() => setFeedbackDialog((current) => ({ ...current, visible: false }))}
          onCancel={() => setFeedbackDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </SafeAreaView>
  );
}
