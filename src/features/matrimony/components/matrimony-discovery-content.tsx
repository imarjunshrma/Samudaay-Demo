import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Button, Dialog, FilterChips, FilterSheet, InfiniteScrollList, Text, type DialogVariant, type FilterSheetSection } from '@/src/components';
import { SearchInput } from '@/src/components/forms/SearchInput/SearchInput';
import { colors, radius, spacing, typography } from '@/src/theme';
import { useMatrimonyDiscoveryProfiles, type MatrimonyDiscoveryFilters } from '@/src/features/matrimony/hooks/use-matrimony-discovery';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useDebounce } from '@/src/hooks';
import { COMMUNITY_SELECTION_ENABLED } from '@/src/core/config/community';
import { useTranslations } from '@/src/i18n/use-translations';
import { DiscoveryCard } from './matrimony-blocks';
import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyProfileRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';
import { MatrimonyModuleTabs, type MatrimonyModuleTabKey } from './matrimony-module-tabs';
import { MatrimonyDiscoverySkeleton } from './matrimony-loading-states';
import { MatrimonySharedHeader } from './matrimony-shared-header';

const ALL_FILTERS = 'all';

type MatrimonyDiscoveryFilterKey = keyof MatrimonyDiscoveryFilters;

const emptyFilters: Record<MatrimonyDiscoveryFilterKey, string> = {
  gender: ALL_FILTERS,
  country: ALL_FILTERS,
  state: ALL_FILTERS,
  city: ALL_FILTERS,
  nativeCity: ALL_FILTERS,
  maritalStatus: ALL_FILTERS,
  education: ALL_FILTERS,
  height: ALL_FILTERS,
  occupation: ALL_FILTERS,
  familyType: ALL_FILTERS,
  caste: ALL_FILTERS,
  minAge: ALL_FILTERS,
  maxAge: ALL_FILTERS,
  community: ALL_FILTERS,
  createdRange: ALL_FILTERS,
  updatedRange: ALL_FILTERS,
  sort: ALL_FILTERS,
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

const profileDateFilterOptions = [
  { key: ALL_FILTERS, label: 'Any time' },
  { key: 'today', label: 'Today' },
  { key: 'last7Days', label: 'Last 7 days' },
  { key: 'thisMonth', label: 'This month' },
  { key: 'last30Days', label: 'Last 30 days' },
  { key: 'older', label: 'Older than 30 days' },
];

const sortFilterOptions = [
  { key: ALL_FILTERS, label: 'Newest profiles' },
  { key: 'oldest', label: 'Oldest profiles' },
  { key: 'az', label: 'Name A to Z' },
  { key: 'za', label: 'Name Z to A' },
];

const filterLabels: Record<MatrimonyDiscoveryFilterKey, string> = {
  gender: 'Gender',
  country: 'Country',
  state: 'State',
  city: 'City',
  nativeCity: 'Mud Gam',
  maritalStatus: 'Marital status',
  education: 'Highest education',
  height: 'Height',
  occupation: 'Profession',
  familyType: 'Family type',
  caste: 'Caste',
  minAge: 'Min age',
  maxAge: 'Max age',
  community: 'Community',
  createdRange: 'Created',
  updatedRange: 'Updated',
  sort: 'Sort',
};

function normalizeOption(value?: string | null) {
  return String(value ?? '').trim();
}

function uniqueOptions(values: (string | null | undefined)[], allLabel: string) {
  const options = Array.from(new Set(values.map(normalizeOption).filter(Boolean))).sort((left, right) => left.localeCompare(right));
  return [{ key: ALL_FILTERS, label: allLabel }, ...options.map((value) => ({ key: value, label: value }))];
}

function selectOptionsToFilterOptions(options: { label: string; value: string }[], allLabel: string) {
  return [{ key: ALL_FILTERS, label: allLabel }, ...options.map((option) => ({ key: option.value, label: option.label }))];
}

function resolveFilterValueLabel(key: MatrimonyDiscoveryFilterKey, value: string) {
  const optionSources: Partial<Record<MatrimonyDiscoveryFilterKey, { key: string; label: string }[]>> = {
    createdRange: profileDateFilterOptions,
    updatedRange: profileDateFilterOptions,
    sort: sortFilterOptions,
  };
  return optionSources[key]?.find((option) => option.key === value)?.label || value;
}

function compactFilters(filters: Record<MatrimonyDiscoveryFilterKey, string>): MatrimonyDiscoveryFilters {
  return Object.entries(filters).reduce<MatrimonyDiscoveryFilters>((next, [key, value]) => {
    if (value && value !== ALL_FILTERS) {
      next[key as MatrimonyDiscoveryFilterKey] = value;
    }
    return next;
  }, {});
}

export function MatrimonyDiscoveryContent({
  onTabPress,
}: {
  onTabPress?: (key: MatrimonyModuleTabKey) => boolean | void;
} = {}) {
  const router = useRouter();
  const t = useTranslations('matrimony.discovery');
  const { profiles, loading, searching, loadingMore, refreshing, hasNextPage, page, error, reload, removeProfile, updateProfileConnection, getQueryKey } = useMatrimonyDiscoveryProfiles();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const effectiveSearch = search.trim() ? debouncedSearch : '';
  const [filters, setFilters] = useState<Record<MatrimonyDiscoveryFilterKey, string>>(emptyFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const { stateOptions, cityOptions } = useCountryStateCityOptions({
    countryName: 'India',
    stateName: filters.state === ALL_FILTERS ? '' : filters.state,
  });
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
    confirmLabel?: string;
    action?: 'create-profile' | 'purchase-subscription' | null;
    purchaseType?: 'PROFILE_CREATION' | 'VIEWER_ONLY' | null;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    action: null,
  });
  const [myProfile, setMyProfile] = useState<MatrimonyProfileRecord | null>(matrimonyScreenCache.myProfile);
  const [myProfileLoaded, setMyProfileLoaded] = useState(matrimonyScreenCache.profileLoaded);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(matrimonyScreenCache.access);
  const discoveryBlockedByApproval = myProfileLoaded && myProfile?.status === 'PENDING_APPROVAL';
  const discoveryBlockedBySubscription = access?.canView === false;
  const appliedFilterCount = Object.values(filters).filter((value) => value !== ALL_FILTERS).length;
  const activeFilterParams = useMemo(() => compactFilters(filters), [filters]);
  const activeQueryKey = useMemo(() => getQueryKey(effectiveSearch, activeFilterParams), [activeFilterParams, effectiveSearch, getQueryKey]);
  const didRunQueryEffectRef = useRef(false);

  const filterSections = useMemo<FilterSheetSection[]>(() => [
    {
      title: 'Sort',
      activeKey: filters.sort,
      icon: 'sort-by-alpha',
      items: sortFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, sort: key })),
    },
    {
      title: 'Profile created',
      activeKey: filters.createdRange,
      icon: 'event',
      items: profileDateFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, createdRange: key })),
    },
    {
      title: 'Profile updated',
      activeKey: filters.updatedRange,
      icon: 'update',
      items: profileDateFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, updatedRange: key })),
    },
    {
      title: 'Gender',
      activeKey: filters.gender,
      icon: 'wc',
      items: [
        { key: ALL_FILTERS, label: 'All genders' },
        { key: 'Female', label: 'Female' },
        { key: 'Male', label: 'Male' },
        { key: 'Other', label: 'Other' },
      ],
      onSelect: (key) => setFilters((current) => ({ ...current, gender: key })),
    },
    {
      title: 'Height',
      activeKey: filters.height,
      icon: 'height',
      items: heightFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, height: key })),
    },
    {
      title: 'Age from DOB',
      activeKey: filters.minAge,
      icon: 'cake',
      items: ageFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, minAge: key })),
    },
    {
      title: 'Max Age',
      activeKey: filters.maxAge,
      icon: 'event',
      items: maxAgeFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, maxAge: key })),
    },
    {
      title: 'State',
      activeKey: filters.state,
      icon: 'map',
      items: selectOptionsToFilterOptions(stateOptions, 'All states'),
      onSelect: (key) => setFilters((current) => ({ ...current, state: key, city: ALL_FILTERS })),
    },
    {
      title: 'City',
      activeKey: filters.city,
      icon: 'location-city',
      items: selectOptionsToFilterOptions(cityOptions, filters.state === ALL_FILTERS ? 'Select state first' : 'All cities'),
      onSelect: (key) => setFilters((current) => ({ ...current, city: key })),
    },
    ...(COMMUNITY_SELECTION_ENABLED ? [{
      title: 'Mud Gam (Native City)',
      activeKey: filters.nativeCity,
      icon: 'home-work' as const,
      items: uniqueOptions(profiles.map((profile) => profile.nativeCity), 'All native cities'),
      onSelect: (key: string) => setFilters((current) => ({ ...current, nativeCity: key })),
    }] : []),
    {
      title: 'Status',
      activeKey: filters.maritalStatus,
      icon: 'favorite-border',
      items: [
        { key: ALL_FILTERS, label: 'All marital status' },
        { key: 'Never Married', label: 'Never Married' },
        { key: 'Divorced', label: 'Divorced' },
        { key: 'Widowed', label: 'Widowed' },
        { key: 'Separated', label: 'Separated' },
      ],
      onSelect: (key) => setFilters((current) => ({ ...current, maritalStatus: key })),
    },
    {
      title: 'Highest Education',
      activeKey: filters.education,
      icon: 'school',
      items: educationFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, education: key })),
    },
    {
      title: 'Profession',
      activeKey: filters.occupation,
      icon: 'work',
      items: uniqueOptions(profiles.map((profile) => profile.profession), 'All professions'),
      onSelect: (key) => setFilters((current) => ({ ...current, occupation: key })),
    },
    {
      title: 'Family',
      activeKey: filters.familyType,
      icon: 'family-restroom',
      items: familyTypeFilterOptions,
      onSelect: (key) => setFilters((current) => ({ ...current, familyType: key })),
    },
    {
      title: 'Caste',
      activeKey: filters.caste,
      icon: 'groups',
      items: uniqueOptions(profiles.map((profile) => profile.caste), 'All castes'),
      onSelect: (key) => setFilters((current) => ({ ...current, caste: key })),
    },
  ], [cityOptions, filters, profiles, stateOptions]);

  const appliedFilterChips = useMemo(
    () =>
      (Object.entries(filters) as [MatrimonyDiscoveryFilterKey, string][])
        .filter(([, value]) => value !== ALL_FILTERS)
        .map(([key, value]) => ({
          key,
          label: `${filterLabels[key]}: ${resolveFilterValueLabel(key, value)}`,
          icon: 'close' as const,
        })),
    [filters],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([
        matrimonyFeedService.loadAccess().catch(() => null),
        matrimonyFeedService.loadMyProfile(),
      ])
        .then(([accessResult, profile]) => {
          if (!active) return;
          matrimonyScreenCache.access = accessResult;
          matrimonyScreenCache.myProfile = profile;
          matrimonyScreenCache.profileLoaded = true;
          if (accessResult?.canView === false) {
            matrimonyScreenCache.discoveryProfiles = [];
            matrimonyScreenCache.discoveryLoaded = true;
            matrimonyScreenCache.discoveryError = accessResult.reason || t('dialogs.subscriptionRequired.description');
            matrimonyScreenCache.discoveryPage = 1;
            matrimonyScreenCache.discoveryHasNextPage = false;
          } else {
            matrimonyScreenCache.discoveryError = null;
          }
          setAccess(accessResult);
          setMyProfile(profile);
        })
        .finally(() => {
          if (active) {
            matrimonyScreenCache.profileLoaded = true;
            setMyProfileLoaded(true);
          }
        });

      return () => {
        active = false;
      };
    }, [t]),
  );

  function openCreateProfileDialog() {
    setDialog({
      visible: true,
      variant: 'confirm',
      title: t('dialogs.createProfileRequired.title'),
      description: t('dialogs.createProfileRequired.description'),
      confirmLabel: t('dialogs.createProfileRequired.confirm'),
      action: 'create-profile',
      purchaseType: null,
    });
  }

  function openProfileNotApprovedDialog(profile: MatrimonyProfileRecord) {
    const status = String(profile.status || '').replace(/_/g, ' ');
    setDialog({
      visible: true,
      variant: 'warning',
      title: t('dialogs.notApproved.title'),
      description: t('dialogs.notApproved.description').replace('{status}', status),
      confirmLabel: t('dialogs.ok'),
      action: null,
      purchaseType: null,
    });
  }

  function openSubscriptionRequiredDialog(message?: string | null, purchaseType: 'PROFILE_CREATION' | 'VIEWER_ONLY' = 'PROFILE_CREATION') {
    setDialog({
      visible: true,
      variant: 'confirm',
      title: t('dialogs.subscriptionRequired.title'),
      description: message || t('dialogs.subscriptionRequired.description'),
      confirmLabel: 'Purchase now',
      action: 'purchase-subscription',
      purchaseType,
    });
  }

  function ensureProfileForMatrimonyAction() {
    if (access && access.canSendRequest === false) {
      const isViewerOnly = access.subscription?.type === 'VIEWER_ONLY';
      openSubscriptionRequiredDialog(
        isViewerOnly
          ? t('dialogs.subscriptionRequired.viewerOnlyDescription')
          : access.reason || t('dialogs.subscriptionRequired.actionDescription'),
        'PROFILE_CREATION',
      );
      return false;
    }

    if (!myProfileLoaded || !myProfile) {
      openCreateProfileDialog();
      return false;
    }

    if (!['APPROVED', 'ACTIVE'].includes(myProfile.status)) {
      openProfileNotApprovedDialog(myProfile);
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (!didRunQueryEffectRef.current) {
      didRunQueryEffectRef.current = true;
      if (matrimonyScreenCache.discoveryLoaded && matrimonyScreenCache.discoveryQueryKey === activeQueryKey) {
        return undefined;
      }
    }

    void reload({ page: 1, search: effectiveSearch, filters: activeFilterParams, preserveVisibleState: true });
    return undefined;
  }, [activeFilterParams, activeQueryKey, effectiveSearch, reload]);

  function getDiscoveryCardState(profile: (typeof profiles)[number]) {
    const connection = profile.connection;
    if (connection?.status === 'PENDING') {
      if (connection.direction === 'sent') {
        return {
          ctaLabel: 'Cancel Request',
          statusLabel: 'Request Pending',
          secondaryCtaLabel: undefined,
        };
      }

      return {
        ctaLabel: 'Open Requests',
        statusLabel: 'Request Received',
        secondaryCtaLabel: undefined,
      };
    }

    if (connection?.status === 'REJECTED' && connection.direction === 'sent') {
      return {
        ctaLabel: 'Resend Request',
        statusLabel: 'Request Cancelled',
        secondaryCtaLabel: undefined,
      };
    }

    return {
      ctaLabel: t('actions.sendRequest'),
      statusLabel: undefined,
      secondaryCtaLabel: undefined,
    };
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <MatrimonySharedHeader title={t('title')} onProfilePress={() => onTabPress?.('profile')} />

        {!discoveryBlockedBySubscription ? (
          <MatrimonyModuleTabs activeKey="discovery" onTabPress={onTabPress} />
        ) : null}

        {discoveryBlockedBySubscription ? (
          <View style={{ flex: 1, padding: spacing[4], justifyContent: 'center' }}>
            <View
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                padding: spacing[5],
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                gap: spacing[4],
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: radius.full,
                  backgroundColor: colors.primary.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text variant="h2" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  🔒
                </Text>
              </View>
              <View style={{ gap: spacing[2], alignItems: 'center' }}>
                <Text variant="h3" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, textAlign: 'center' }}>
                  {t('dialogs.subscriptionRequired.title')}
                </Text>
                <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22, textAlign: 'center' }}>
                  {access?.reason || t('dialogs.subscriptionRequired.description')}
                </Text>
              </View>
              <Button
                fullWidth
                rounded
                onPress={() =>
                  router.push({
                    pathname: '/matrimony/subscribe',
                    params: { returnTo: '/member/matrimony' },
                  } as never)
                }>
                Purchase subscription
              </Button>
            </View>
          </View>
        ) : (

          <InfiniteScrollList
            data={profiles}
            keyExtractor={(item) => item.id}
            loadingInitial={loading && !profiles.length}
            loadingSearch={searching}
            loadingMore={loadingMore}
            refreshing={refreshing}
            hasNextPage={hasNextPage}
            onRefresh={() => {
              void reload({ page: 1, refresh: true, search: effectiveSearch, filters: activeFilterParams });
            }}
            onLoadMore={() => {
              if (loadingMore || !hasNextPage) return;
              void reload({ page: page + 1, append: true, search: effectiveSearch, filters: activeFilterParams });
            }}
            contentContainerStyle={{ paddingBottom: spacing[4], paddingHorizontal: spacing[4] }}
            ListHeaderComponent={(
              <View style={{ paddingVertical: spacing[3], backgroundColor: colors.background.DEFAULT, gap: spacing[3] }}>
                <SearchInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t('search.placeholder')}
                />
                <FilterChips
                  scrollable
                  showIcons
                  activeKey={ALL_FILTERS}
                  items={[
                    {
                      key: 'filters',
                      label: appliedFilterCount > 0 ? `Filters (${appliedFilterCount})` : 'Filters',
                      icon: 'tune',
                    },
                    { key: ALL_FILTERS, label: 'All profiles', icon: 'apps' },
                    ...appliedFilterChips,
                  ]}
                  onPress={(key) => {
                    if (key === 'filters') {
                      setFilterVisible(true);
                      return;
                    }
                    if (key === ALL_FILTERS) {
                      setFilters(emptyFilters);
                      return;
                    }
                    setFilters((current) => ({ ...current, [key]: ALL_FILTERS }));
                  }}
                />
                <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('sections.profiles')}
                </Text>
                {discoveryBlockedByApproval ? (
                  <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
                    <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('approval.title')}
                    </Text>
                    <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing[1], lineHeight: 22 }}>
                      {t('approval.description')}
                    </Text>
                  </View>
                ) : error ? (
                  <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
                    <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('errors.accessUnavailableTitle')}
                    </Text>
                    <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing[1], lineHeight: 22 }}>
                      {error}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
            renderSkeletonItem={() => <MatrimonyDiscoverySkeleton />}
            renderItem={({ item: profile }) => (
              <DiscoveryCard
                name={profile.name}
                subtitle={profile.subtitle}
                image={profile.image}
                education={profile.education}
                profession={profile.profession}
                location={profile.location}
                showOnlineStatus={profile.showOnlineStatus}
                locked={profile.locked}
                ageHeight={profile.ageHeight || t('fallback.notSpecified')}
                ctaLabel={getDiscoveryCardState(profile).ctaLabel}
                statusLabel={getDiscoveryCardState(profile).statusLabel}
                secondaryCtaLabel={getDiscoveryCardState(profile).secondaryCtaLabel}
                ctaDisabled={false}
                onPress={() =>
                  router.push({
                    pathname: '/matrimony/profile/[profileId]',
                    params: { profileId: profile.id },
                  } as never)
                }
                onConnect={async () => {
                  if (profile.connection?.status === 'PENDING') {
                    if (profile.connection.direction === 'sent') {
                      try {
                        const updated = await matrimonyFeedService.reviewConnectionRequest(profile.connection.id, 'cancel');
                        updateProfileConnection(profile.id, {
                          id: updated.id,
                          status: updated.status,
                          chatId: updated.chatId || null,
                          direction: updated.direction,
                        });
                        setDialog({
                          visible: true,
                          variant: 'success',
                          title: 'Request cancelled',
                          description: `You can resend a request to ${profile.name} anytime.`,
                        });
                      } catch (requestError) {
                        setDialog({
                          visible: true,
                          variant: 'error',
                          title: t('dialogs.requestFailed.title'),
                          description: requestError instanceof Error ? requestError.message : t('dialogs.requestFailed.description'),
                        });
                      }
                      return;
                    }

                    const handled = onTabPress?.('requests');
                    if (handled !== true) {
                      router.push({ pathname: '/member/matrimony', params: { tab: 'requests' } } as never);
                    }
                    return;
                  }

                  if (!ensureProfileForMatrimonyAction()) {
                    return;
                  }
                  try {
                    const created = await matrimonyFeedService.sendConnectionRequest(profile.id);
                    updateProfileConnection(profile.id, {
                      id: created.id,
                      status: created.status,
                      chatId: created.chatId || null,
                      direction: created.direction,
                    });
                    setDialog({
                      visible: true,
                      variant: 'success',
                      title: t('dialogs.requestSent.title'),
                      description: t('dialogs.requestSent.description').replace('{name}', profile.name),
                    });
                  } catch (requestError) {
                    const message = requestError instanceof Error ? requestError.message : t('dialogs.requestFailed.description');
                    if (/already connected/i.test(message)) {
                      removeProfile(profile.id);
                    }
                    setDialog({
                      visible: true,
                      variant: 'error',
                      title: t('dialogs.requestFailed.title'),
                      description: message,
                    });
                  }
                }}
                onSecondaryAction={undefined}
                onChat={() => {
                  setDialog({
                    visible: true,
                    variant: 'info',
                    title: t('dialogs.chatLocked.title'),
                    description: t('dialogs.chatLocked.description'),
                  });
                }}
              />
            )}
            emptyTitle={t('sections.profiles')}
            emptyDescription={t('sections.profilesEmpty')}
          />
        )}

        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          confirmLabel={dialog.confirmLabel}
          onConfirm={() => {
            const action = dialog.action;
            const purchaseType = dialog.purchaseType;
            setDialog((current) => ({ ...current, visible: false }));
            if (action === 'create-profile') {
              router.push('/matrimony/create-profile' as never);
              return;
            }
            if (action === 'purchase-subscription') {
              router.push({
                pathname: '/matrimony/subscribe',
                params: { type: purchaseType || 'PROFILE_CREATION', returnTo: '/member/matrimony' },
              } as never);
            }
          }}
          onCancel={dialog.action ? () => setDialog((current) => ({ ...current, visible: false })) : undefined}
        />
        <FilterSheet
          visible={filterVisible}
          title="Matrimony filters"
          subtitle="Filter profiles by personal, location, education, work, and family details."
          sections={filterSections}
          onClose={() => setFilterVisible(false)}
          onApply={() => {
            setFilterVisible(false);
            void reload({ page: 1, search: effectiveSearch, filters: activeFilterParams });
          }}
          onReset={() => setFilters(emptyFilters)}
          applyLabel="Apply filters"
          resetLabel="Clear all"
        />
      </View>
    </SafeAreaView>
  );
}
