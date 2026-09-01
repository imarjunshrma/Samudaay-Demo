import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  AppHeaderSearch,
  EntityActionCard,
  FilterChips,
  type FilterSheetSection,
  FilterSheet,
  InfiniteScrollList,
  Text,
} from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { bloodGroupOptions } from '@/src/constants/blood-groups';
import { SkeletonBlock, SkeletonAvatar } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { roleManagementService, type RoleCatalogItem } from '@/src/features/admin/services/role-management-service';
import { directoryService, type DirectoryMemberItem, type DirectoryMemberTypeSummary } from '@/src/features/directory/services/directory-service';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationLabel, translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';

type CommunityDirectoryMode = 'admin' | 'member';
type UserTypeFilter = 'all' | 'user' | 'member' | 'community_member' | 'trustee' | 'admin';
const PAGE_SIZE = 12;

const SYSTEM_ROLE_KEYS = new Set(['user', 'member', 'community_member', 'trustee', 'admin']);
const EMPTY_MEMBER_TYPE_SUMMARY: DirectoryMemberTypeSummary = {
  user: 0,
  member: 0,
  community_member: 0,
  trustee: 0,
  admin: 0,
};

function getNormalizedUserType(member: DirectoryMemberItem): UserTypeFilter {
  const value = String(member.userType || '').trim().toLowerCase();
  if (value === 'user' || value === 'member' || value === 'community_member' || value === 'trustee' || value === 'admin') {
    return value;
  }
  return 'user';
}

function getUserTypeTranslationKey(userType: UserTypeFilter) {
  return userType === 'admin'
    ? 'filters.admin'
    : userType === 'trustee'
      ? 'filters.trustee'
      : userType === 'community_member'
        ? 'filters.communityMember'
        : userType === 'member'
        ? 'filters.member'
        : 'filters.user';
}

function formatRoleLabel(roleKey: string, catalog: Map<string, RoleCatalogItem>) {
  const catalogRole = catalog.get(roleKey);
  if (catalogRole?.name) {
    return catalogRole.name;
  }

  return roleKey
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMemberRoleLabels(
  member: DirectoryMemberItem,
  catalog: Map<string, RoleCatalogItem>,
  t: ReturnType<typeof useTranslations>,
) {
  const labels = new Set<string>();
  const normalizedUserType = getNormalizedUserType(member);

  labels.add(t(getUserTypeTranslationKey(normalizedUserType)));

  (member.roles ?? [])
    .filter((roleKey) => !SYSTEM_ROLE_KEYS.has(String(roleKey).toLowerCase()))
    .forEach((roleKey) => labels.add(formatRoleLabel(roleKey, catalog)));

  return Array.from(labels);
}

function getMemberCustomRoleKeys(member: DirectoryMemberItem) {
  return (member.roles ?? [])
    .map((roleKey) => String(roleKey).toLowerCase())
    .filter((roleKey) => !SYSTEM_ROLE_KEYS.has(roleKey));
}

function getUserTypeLabel(
  member: DirectoryMemberItem,
  t: ReturnType<typeof useTranslations>,
) {
  const userType = getNormalizedUserType(member);
  return t(getUserTypeTranslationKey(userType));
}

function CommunityDirectoryCard({
  item,
  roleLabels,
  onPress,
  language,
  canViewPhone,
}: {
  item: DirectoryMemberItem;
  roleLabels: string[];
  onPress: () => void;
  language: 'en' | 'gu';
  canViewPhone: boolean;
}) {
  const userType = getNormalizedUserType(item);
  const t = useTranslations('directory.community-directory');
  const userTypeLabel = getUserTypeLabel(item, t);

  const accentColor =
    userType === 'admin'
      ? '#7c3aed'
      : userType === 'trustee'
        ? '#0f766e'
        : userType === 'member' || userType === 'community_member'
          ? colors.primary.DEFAULT
          : '#64748b';

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <EntityActionCard
        accentColor={accentColor}
        leading={(
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              backgroundColor: colors.primary.subtle,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <MaterialIcons name="person" size={26} color={accentColor} />
            )}
          </View>
        )}
        title={item.title}
        subtitle={roleLabels.join(' • ')}
        detail={item.email || (canViewPhone ? item.phone : null) || item.memberId || item.meta || ''}
        titleSuffix={(
          <View
            style={{
              borderRadius: radius.full,
              backgroundColor: colors.primary.muted,
              paddingHorizontal: spacing[2],
              paddingVertical: 4,
            }}>
            <Text
              variant="caption"
              style={{
                color: accentColor,
                fontFamily: typography.fontFamily.bold,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
              {userTypeLabel}
            </Text>
          </View>
        )}
        headerRight={(
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background.muted,
            }}>
            <MaterialIcons name="chevron-right" size={20} color={colors.text.muted} />
          </View>
        )}
        metaItems={[
          ...(item.memberId
            ? [{ key: 'memberId', label: item.memberId, icon: <MaterialIcons name="badge" size={14} color={colors.text.muted} /> }]
            : []),
          ...(canViewPhone && item.phone
            ? [{ key: 'phone', label: item.phone, icon: <MaterialIcons name="call" size={14} color={colors.text.muted} /> }]
            : []),
          ...([item.city, item.state].filter(Boolean).length
            ? [{
                key: 'location',
                label: translateLocationText([item.city, item.state].filter(Boolean).join(', '), language),
                icon: <MaterialIcons name="place" size={14} color={colors.text.muted} />,
              }]
            : []),
          ...(item.status
            ? [{ key: 'status', label: item.status, icon: <MaterialIcons name="verified-user" size={14} color={colors.text.muted} /> }]
            : []),
          ...(item.bloodGroup
            ? [{ key: 'bloodGroup', label: `${t('details.bloodGroup')}: ${item.bloodGroup}`, icon: <MaterialIcons name="bloodtype" size={14} color="#dc2626" /> }]
            : []),
          ...(item.familyMembers ?? []).map((familyMember) => ({
            key: `family-${familyMember.id}`,
            label: `${familyMember.name}${familyMember.relation ? ` (${familyMember.relation})` : ''}${familyMember.bloodGroup ? ` • ${t('details.bloodGroup')}: ${familyMember.bloodGroup}` : ''}`,
            icon: <MaterialIcons name="family-restroom" size={14} color={colors.primary.DEFAULT} />,
          })),
        ]}
      />
    </Pressable>
  );
}

function CommunityDirectoryCardSkeleton() {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <SkeletonAvatar size={56} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="48%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="74%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="38%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
        <SkeletonBlock width={88} height={12} radiusSize={radius.sm} />
        <SkeletonBlock width={104} height={12} radiusSize={radius.sm} />
        <SkeletonBlock width={92} height={12} radiusSize={radius.sm} />
      </View>
    </View>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onRemove}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.primary.border,
        backgroundColor: colors.primary.subtle,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
      }}>
      <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
        {label}
      </Text>
      <MaterialIcons name="close" size={14} color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  );
}

function DetailLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ gap: 4 }}>
      <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.medium }}>
        {label}
      </Text>
      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
        {value?.trim() ? value : '—'}
      </Text>
    </View>
  );
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export function CommunityDirectoryContent({ mode }: { mode: CommunityDirectoryMode }) {
  const t = useTranslations('directory.community-directory');
  const { language } = useAppPreferences();
  const { hasPermission } = useSession();
  const navigateBack = useBackNavigation();
  const [items, setItems] = useState<DirectoryMemberItem[]>([]);
  const [roles, setRoles] = useState<RoleCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [memberTypeSummary, setMemberTypeSummary] = useState<DirectoryMemberTypeSummary | null>(null);
  const [directoryFilterOptions, setDirectoryFilterOptions] = useState<{
    states: string[];
    cities: string[];
    citiesByState: Record<string, string[]>;
    roles: string[];
    bloodGroups: string[];
  }>({
    states: [],
    cities: [],
    citiesByState: {},
    roles: [],
    bloodGroups: [],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserTypeFilter>('all');
  const [draftUserType, setDraftUserType] = useState<UserTypeFilter>('all');
  const [selectedRoleKey, setSelectedRoleKey] = useState('all');
  const [selectedPermissionKey, setSelectedPermissionKey] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [draftRoleKey, setDraftRoleKey] = useState('all');
  const [draftPermissionKey, setDraftPermissionKey] = useState('all');
  const [draftState, setDraftState] = useState('all');
  const [draftCity, setDraftCity] = useState('all');
  const [draftBloodGroup, setDraftBloodGroup] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DirectoryMemberItem | null>(null);
  const hasLoadedRef = useRef(false);
  const hasFocusedOnceRef = useRef(false);
  const hasQueryInitializedRef = useRef(false);
  const loadCommunityRef = useRef<null | ((args: { page: number; append?: boolean; refresh?: boolean; showLoading?: boolean }) => Promise<void>)>(null);
  const loadFilterOptionsRef = useRef<null | (() => Promise<void>)>(null);

  const isAdminMode = mode === 'admin';
  const canViewPhone = hasPermission('phone.view');

  const loadCommunity = useCallback(async ({
    page,
    append = false,
    refresh = false,
    showLoading = true,
  }: {
    page: number;
    append?: boolean;
    refresh?: boolean;
    showLoading?: boolean;
  }) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (append) {
      setIsLoadingMore(true);
    } else if (!hasLoadedRef.current || showLoading) {
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      } else {
        setIsSearchLoading(true);
      }
    }
    try {
      const [members, catalog] = await Promise.all([
        directoryService.loadMembersPage({
          page,
          limit: PAGE_SIZE,
          q: search,
          userType: selectedUserType,
          role: selectedRoleKey !== 'all' ? selectedRoleKey : undefined,
          permission: selectedPermissionKey !== 'all' ? selectedPermissionKey : undefined,
          state: selectedState !== 'all' ? selectedState : undefined,
          city: selectedCity !== 'all' ? selectedCity : undefined,
          bloodGroup: selectedBloodGroup !== 'all' ? selectedBloodGroup : undefined,
        }),
        isAdminMode && !roles.length
          ? roleManagementService.loadCatalog().catch(() => null)
          : roles.length
          ? Promise.resolve<{ roles: RoleCatalogItem[]; permissions: never[] } | null>({ roles, permissions: [] })
          : Promise.resolve<{ roles: RoleCatalogItem[]; permissions: never[] } | null>(null),
      ]);
      setItems((previous) => (append ? [...previous, ...members.items] : members.items));
      setTotalCount((previous) => getPaginationTotal(members.pagination, append ? previous + members.items.length : members.items.length));
      if (members.pagination?.summary) {
        setMemberTypeSummary({ ...EMPTY_MEMBER_TYPE_SUMMARY, ...members.pagination.summary });
      } else if (!append) {
        setMemberTypeSummary(null);
      }
      if (catalog?.roles?.length) {
        setRoles((current) => {
          if (
            current.length === catalog.roles.length
            && current.every((role, index) => role.id === catalog.roles[index]?.id)
          ) {
            return current;
          }
          return catalog.roles;
        });
      }
      setHasNextPage(Boolean(members.pagination?.hasNextPage));
      setCurrentPage(members.pagination?.page ?? page);
      setErrorMessage(null);
    } catch (error) {
      if (!append) {
        setItems([]);
      }
      setErrorMessage(error instanceof Error ? error.message : t('errors.load'));
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
      setIsSearchLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [isAdminMode, roles, search, selectedBloodGroup, selectedCity, selectedPermissionKey, selectedRoleKey, selectedState, selectedUserType, t]);

  useEffect(() => {
    loadCommunityRef.current = loadCommunity;
  }, [loadCommunity]);

  const loadFilterOptions = useCallback(async () => {
    const result = await directoryService.loadFilterOptions({ userType: selectedUserType });
    setDirectoryFilterOptions({
      states: result.states,
      cities: result.cities,
      citiesByState: result.citiesByState ?? {},
      roles: result.roles,
      bloodGroups: result.bloodGroups,
    });
  }, [selectedUserType]);

  useEffect(() => {
    loadFilterOptionsRef.current = loadFilterOptions;
  }, [loadFilterOptions]);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return () => undefined;
      }

      void loadCommunityRef.current?.({ page: 1, showLoading: false }).catch(() => undefined);
      void loadFilterOptionsRef.current?.().catch(() => undefined);
      return () => undefined;
    }, []),
  );

  const roleCatalog = useMemo(
    () => new Map(roles.map((role) => [String(role.key).toLowerCase(), role])),
    [roles],
  );

  const permissionOptions = useMemo(() => {
    const permissionMap = new Map<string, string>();
    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (!permissionMap.has(permission.key)) {
          permissionMap.set(permission.key, permission.name || permission.key);
        }
      });
    });

    return [
      { label: t('filters.allPermissions'), value: 'all' },
      ...Array.from(permissionMap.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([key, label]) => ({ label, value: key })),
    ];
  }, [roles, t]);

  const roleOptions = useMemo(
    () => [
      { label: t('filters.allRoles'), value: 'all' },
      ...directoryFilterOptions.roles
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((roleKey) => ({ label: formatRoleLabel(roleKey, roleCatalog), value: roleKey })),
    ],
    [directoryFilterOptions.roles, roleCatalog, t],
  );

  const stateOptions = useMemo(
    () => [
      { label: t('filters.allStates'), value: 'all' },
      ...Array.from(new Set([
        ...directoryFilterOptions.states,
        ...items.map((item) => item.state).filter(Boolean),
      ]))
        .map((state) => ({ label: translateLocationLabel(state, language), value: state })),
    ],
    [directoryFilterOptions.states, items, language, t],
  );

  const cityOptions = useMemo(() => {
    const matchingItems = draftState === 'all'
      ? (
          directoryFilterOptions.cities.length
            ? directoryFilterOptions.cities
            : items.map((item) => item.city).filter(Boolean)
        )
      : (
          directoryFilterOptions.citiesByState[draftState]?.length
            ? directoryFilterOptions.citiesByState[draftState]
            : items.filter((item) => item.state === draftState).map((item) => item.city).filter(Boolean)
        );
    return [
      { label: t('filters.allCities'), value: 'all' },
      ...Array.from(new Set(matchingItems))
        .map((city) => ({ label: translateLocationLabel(city, language), value: city })),
    ];
  }, [directoryFilterOptions.cities, directoryFilterOptions.citiesByState, draftState, items, language, t]);

  const bloodGroupFilterOptions = useMemo(
    () => [
      { label: t('filters.allBloodGroups'), value: 'all' },
      ...Array.from(new Set([
        ...bloodGroupOptions.map((option) => option.value),
        ...directoryFilterOptions.bloodGroups,
        ...items.map((item) => item.bloodGroup).filter(Boolean) as string[],
        ...items.flatMap((item) => (item.familyMembers ?? []).map((member) => member.bloodGroup).filter(Boolean)) as string[],
      ])).map((value) => ({ label: value, value })),
    ],
    [directoryFilterOptions.bloodGroups, items, t],
  );

  const filteredItems = items;
  const rosterTitle = isAdminMode ? t('sections.peopleAdmin') : t('sections.people');
  const filterSheetTitle = isAdminMode ? t('filters.peopleTitle') : t('filters.filtersGroup');
  const filterSheetSubtitle = isAdminMode ? t('filters.peopleSubtitleAdmin') : t('filters.subtitle');
  const emptyTitle = isAdminMode ? t('empty.peopleTitle') : t('empty.title');
  const detailTitle = isAdminMode ? t('details.peopleTitle') : t('details.title');

  const adminInsightItems = useMemo(() => {
    const fallbackCounts = filteredItems.reduce((counts, item) => {
      const userType = getNormalizedUserType(item);
      if (userType !== 'all') {
        counts[userType] += 1;
      }
      return counts;
    }, { ...EMPTY_MEMBER_TYPE_SUMMARY });
    const summary = memberTypeSummary ?? fallbackCounts;
    const users = summary.user;
    const members = summary.member;
    const communityMembers = summary.community_member;
    const trustees = summary.trustee;
    const admins = summary.admin;

    return [
      {
        key: 'users',
        label: t('stats.users'),
        value: formatCompactNumber(users),
        icon: 'person-outline' as const,
        tone: '#64748b',
        bg: '#f1f5f9',
      },
      {
        key: 'members',
        label: t('stats.members'),
        value: formatCompactNumber(members),
        icon: 'groups' as const,
        tone: colors.primary.DEFAULT,
        bg: colors.primary.subtle,
      },
      {
        key: 'communityMembers',
        label: t('stats.communityMembers'),
        value: formatCompactNumber(communityMembers),
        icon: 'groups' as const,
        tone: colors.primary.DEFAULT,
        bg: colors.primary.subtle,
      },
      {
        key: 'trustees',
        label: t('stats.trustees'),
        value: formatCompactNumber(trustees),
        icon: 'verified-user' as const,
        tone: '#0f766e',
        bg: '#ccfbf1',
      },
      {
        key: 'admins',
        label: t('stats.admins'),
        value: formatCompactNumber(admins),
        icon: 'shield' as const,
        tone: '#7c3aed',
        bg: '#ede9fe',
      },
    ];
  }, [filteredItems, memberTypeSummary, t, totalCount]);

  const appliedFilterCount =
    (selectedUserType !== 'all' ? 1 : 0) +
    (selectedRoleKey !== 'all' ? 1 : 0) +
    (selectedPermissionKey !== 'all' ? 1 : 0) +
    (selectedState !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0) +
    (selectedBloodGroup !== 'all' ? 1 : 0);

  const appliedFilters = useMemo(() => {
    const resolvedRoleLabel = roleOptions.find((option) => option.value === selectedRoleKey)?.label ?? selectedRoleKey;
    const resolvedPermissionLabel =
      permissionOptions.find((option) => option.value === selectedPermissionKey)?.label ?? selectedPermissionKey;

    return [
      ...(selectedRoleKey !== 'all'
        ? [{ key: 'role', label: `${t('filters.role')}: ${resolvedRoleLabel}`, onRemove: () => setSelectedRoleKey('all') }]
        : []),
      ...(isAdminMode && selectedPermissionKey !== 'all'
        ? [{
            key: 'permission',
            label: `${t('filters.permission')}: ${resolvedPermissionLabel}`,
            onRemove: () => setSelectedPermissionKey('all'),
          }]
        : []),
      ...(selectedState !== 'all'
        ? [{ key: 'state', label: `${t('filters.state')}: ${selectedState}`, onRemove: () => setSelectedState('all') }]
        : []),
      ...(selectedCity !== 'all'
        ? [{ key: 'city', label: `${t('filters.city')}: ${selectedCity}`, onRemove: () => setSelectedCity('all') }]
        : []),
      ...(selectedBloodGroup !== 'all'
        ? [{ key: 'bloodGroup', label: `${t('filters.bloodGroup')}: ${selectedBloodGroup}`, onRemove: () => setSelectedBloodGroup('all') }]
        : []),
    ];
  }, [isAdminMode, permissionOptions, roleOptions, selectedBloodGroup, selectedCity, selectedPermissionKey, selectedRoleKey, selectedState, t]);

  const openFilters = useCallback(() => {
    setDraftUserType(selectedUserType);
    setDraftRoleKey(selectedRoleKey);
    setDraftPermissionKey(selectedPermissionKey);
    setDraftState(selectedState);
    setDraftCity(selectedCity);
    setDraftBloodGroup(selectedBloodGroup);
    setFilterVisible(true);
  }, [selectedBloodGroup, selectedCity, selectedPermissionKey, selectedRoleKey, selectedState, selectedUserType]);

  const clearAllFilters = useCallback(() => {
    setSelectedUserType('all');
    setDraftUserType('all');
    setSelectedRoleKey('all');
    setSelectedPermissionKey('all');
    setSelectedState('all');
    setSelectedCity('all');
    setSelectedBloodGroup('all');
    setDraftRoleKey('all');
    setDraftPermissionKey('all');
    setDraftState('all');
    setDraftCity('all');
    setDraftBloodGroup('all');
  }, []);

  useEffect(() => {
    loadFilterOptions().catch(() => undefined);
  }, [loadFilterOptions]);

  useEffect(() => {
    if (!hasQueryInitializedRef.current) {
      hasQueryInitializedRef.current = true;
      void loadCommunity({ page: 1 });
      return () => undefined;
    }

    const timer = setTimeout(() => {
      void loadCommunity({ page: 1 });
    }, search.trim() ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadCommunity, search, selectedBloodGroup, selectedCity, selectedPermissionKey, selectedRoleKey, selectedState, selectedUserType]);

  const selectedMemberRoleLabels = useMemo(
    () => (selectedMember ? getMemberRoleLabels(selectedMember, roleCatalog, t) : []),
    [roleCatalog, selectedMember, t],
  );

  const selectedMemberPermissions = useMemo(() => {
    if (!selectedMember) {
      return [];
    }

    const permissionMap = new Map<string, string>();
    getMemberCustomRoleKeys(selectedMember).forEach((roleKey) => {
      roleCatalog.get(roleKey)?.permissions.forEach((permission) => {
        permissionMap.set(permission.key, permission.name || permission.key);
      });
    });

    return Array.from(permissionMap.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [roleCatalog, selectedMember]);

  const filterSections = useMemo(() => {
    const sections: FilterSheetSection[] = [
      {
        title: t('filters.userType'),
        icon: 'groups' as const,
        activeKey: draftUserType,
        items: [
          { key: 'all', label: t('filters.allUserTypes') },
          { key: 'user', label: t('filters.user') },
          { key: 'member', label: t('filters.member') },
          { key: 'community_member', label: t('filters.communityMember') },
          { key: 'trustee', label: t('filters.trustee') },
          { key: 'admin', label: t('filters.admin') },
        ],
        onSelect: (key: string) => {
          setDraftUserType(key as UserTypeFilter);
        },
      },
    ];

    if (roleOptions.length > 1) {
      sections.push({
        title: t('filters.role'),
        icon: 'badge' as const,
        activeKey: draftRoleKey,
        items: roleOptions.map((option) => ({ key: option.value, label: option.label })),
        onSelect: (key: string) => setDraftRoleKey(key),
      });
    }

    if (isAdminMode && permissionOptions.length > 1) {
      sections.push({
        title: t('filters.permission'),
        icon: 'verified-user' as const,
        activeKey: draftPermissionKey,
        items: permissionOptions.map((option) => ({ key: option.value, label: option.label })),
        onSelect: (key: string) => setDraftPermissionKey(key),
      });
    }

    sections.push(
      {
        title: t('filters.state'),
        icon: 'place' as const,
        activeKey: draftState,
        items: stateOptions.map((option) => ({ key: option.value, label: option.label })),
        onSelect: (key: string) => {
          setDraftState(key);
          setDraftCity('all');
        },
      },
      {
        title: t('filters.city'),
        icon: 'location-city' as const,
        activeKey: draftCity,
        items: cityOptions.map((option) => ({ key: option.value, label: option.label })),
        onSelect: (key: string) => setDraftCity(key),
      },
      {
        title: t('filters.bloodGroup'),
        icon: 'water-drop' as const,
        activeKey: draftBloodGroup,
        items: bloodGroupFilterOptions.map((option) => ({ key: option.value, label: option.label })),
        onSelect: (key: string) => setDraftBloodGroup(key),
      },
    );

    return sections;
  }, [
    bloodGroupFilterOptions,
    cityOptions,
    draftBloodGroup,
    draftCity,
    draftPermissionKey,
    draftRoleKey,
    draftState,
    isAdminMode,
    permissionOptions,
    roleOptions,
    draftUserType,
    stateOptions,
    t,
  ]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <AppHeaderSearch
          title={mode === 'admin' ? t('titleAdmin') : t('titleMember')}
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

        <InfiniteScrollList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading && !hasLoadedRef.current}
          loadingSearch={isSearchLoading}
          preserveHeaderOnInitialLoad
          errorMessage={!filteredItems.length ? errorMessage : null}
          onRetry={() => {
            void loadCommunity({ page: 1 });
          }}
          loadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          refreshing={isRefreshing}
          onRefresh={() => {
            void loadCommunity({ page: 1, refresh: true, showLoading: false });
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) {
              return;
            }
            void loadCommunity({ page: currentPage + 1, append: true, showLoading: false });
          }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 88 }}
          ListHeaderComponent={(
            <View style={{ gap: spacing[3], marginBottom: spacing[4] }}>
              <View
                style={{
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  backgroundColor: colors.background.surface,
                  padding: spacing[4],
                  gap: spacing[1],
                }}>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                  {isAdminMode ? t('titleAdmin') : rosterTitle}
                </Text>
                <Text style={{ color: colors.text.muted, fontSize: 13 }}>
                  {mode === 'admin' ? t('subtitleAdmin') : t('subtitleMember')}
                </Text>
              </View>

              {isAdminMode ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                  {adminInsightItems.map((item) => (
                    <View
                      key={item.key}
                      style={{
                        minWidth: '47%',
                        flex: 1,
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        borderColor: colors.primary.borderLight,
                        backgroundColor: colors.background.surface,
                        padding: spacing[4],
                        gap: spacing[2],
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: radius.lg,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: item.bg,
                        }}>
                        <MaterialIcons name={item.icon} size={20} color={item.tone} />
                      </View>
                      <Text style={{ color: colors.text.muted, fontSize: 12, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        {item.label}
                      </Text>
                      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <FilterChips
                scrollable
                showIcons
                activeKey={selectedUserType}
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('filters.filters')} (${appliedFilterCount})` : t('filters.filters'),
                    icon: 'tune',
                  },
                  { key: 'all', label: t('filters.all'), icon: 'apps' },
                  { key: 'user', label: t('filters.user'), icon: 'person-outline' },
                  { key: 'member', label: t('filters.member'), icon: 'groups' },
                  { key: 'community_member', label: t('filters.communityMember'), icon: 'groups' },
                  { key: 'trustee', label: t('filters.trustee'), icon: 'verified-user' },
                  { key: 'admin', label: t('filters.admin'), icon: 'shield' },
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setSelectedUserType(key as UserTypeFilter);
                }}
              />

              {appliedFilters.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                  {appliedFilters.map((filter) => (
                    <FilterPill key={filter.key} label={filter.label} onRemove={filter.onRemove} />
                  ))}
                </View>
              ) : null}

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                  {rosterTitle}
                </Text>
                <View
                  style={{
                    backgroundColor: colors.primary.muted,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[1],
                    borderRadius: radius.full,
                  }}>
                  <Text
                    style={{
                      color: colors.primary.DEFAULT,
                      fontFamily: typography.fontFamily.bold,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}>
                    {String(totalCount).padStart(2, '0')} {t('total.suffix')}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderSkeletonItem={() => <CommunityDirectoryCardSkeleton />}
          renderItem={({ item }) => (
            <CommunityDirectoryCard
              item={item}
              roleLabels={getMemberRoleLabels(item, roleCatalog, t)}
              onPress={() => setSelectedMember(item)}
              language={language}
              canViewPhone={canViewPhone}
            />
          )}
          emptyTitle={emptyTitle}
          emptyDescription={t('empty.description')}
        />

        <FilterSheet
          visible={filterVisible}
          title={filterSheetTitle}
          subtitle={filterSheetSubtitle}
          sections={filterSections}
          onClose={() => {
            setDraftUserType(selectedUserType);
            setDraftRoleKey(selectedRoleKey);
            setDraftPermissionKey(selectedPermissionKey);
            setDraftState(selectedState);
            setDraftCity(selectedCity);
            setDraftBloodGroup(selectedBloodGroup);
            setFilterVisible(false);
          }}
          onApply={() => {
            setSelectedUserType(draftUserType);
            setSelectedRoleKey(draftRoleKey);
            setSelectedPermissionKey(draftPermissionKey);
            setSelectedState(draftState);
            setSelectedCity(draftCity);
            setSelectedBloodGroup(draftBloodGroup);
            setFilterVisible(false);
          }}
          onReset={clearAllFilters}
          applyLabel={t('actions.apply')}
          resetLabel={t('actions.clearAll')}
        />

        <Modal visible={Boolean(selectedMember)} transparent animationType="slide" onRequestClose={() => setSelectedMember(null)}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
            <Pressable style={{ flex: 1 }} onPress={() => setSelectedMember(null)} />
            <View
              style={{
                maxHeight: '88%',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                backgroundColor: colors.background.DEFAULT,
                paddingHorizontal: spacing[4],
                paddingTop: spacing[4],
                paddingBottom: spacing[4],
                overflow: 'hidden',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
                    {detailTitle}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                    {selectedMember?.memberId || selectedMember?.id || ''}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSelectedMember(null)}
                  style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                  <MaterialIcons name="close" size={22} color={colors.text.primary} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[2] }}>
                <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                    <View style={{ width: 56, height: 56, borderRadius: radius.full, backgroundColor: colors.primary.subtle, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {selectedMember?.avatarUrl ? (
                        <Image source={{ uri: selectedMember.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <MaterialIcons name="person" size={26} color={colors.primary.DEFAULT} />
                      )}
                    </View>
                    <View style={{ flex: 1, gap: spacing[1] }}>
                      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                        {selectedMember?.title || '—'}
                      </Text>
                      <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                        {selectedMember?.status || t('details.statusActive')}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.userType')} value={selectedMember ? getUserTypeLabel(selectedMember, t) : ''} />
                    </View>
                    {canViewPhone && selectedMember?.phone ? (
                      <View style={{ minWidth: '45%', flex: 1 }}>
                        <DetailLine label={t('details.phone')} value={selectedMember.phone} />
                      </View>
                    ) : null}
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.email')} value={selectedMember?.email} />
                    </View>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.memberId')} value={selectedMember?.memberId} />
                    </View>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.city')} value={selectedMember?.city} />
                    </View>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.state')} value={selectedMember?.state} />
                    </View>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.pincode')} value={selectedMember?.pincode} />
                    </View>
                    <View style={{ minWidth: '45%', flex: 1 }}>
                      <DetailLine label={t('details.bloodGroup')} value={selectedMember?.bloodGroup} />
                    </View>
                  </View>
                </View>

                <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                    {t('details.family')}
                  </Text>
                  {(selectedMember?.familyMembers ?? []).length ? (
                    (selectedMember?.familyMembers ?? []).map((familyMember) => (
                      <View
                        key={familyMember.id}
                        style={{
                          borderRadius: radius.lg,
                          borderWidth: 1,
                          borderColor: colors.border.muted,
                          backgroundColor: colors.background.DEFAULT,
                          padding: spacing[3],
                          gap: spacing[2],
                        }}>
                        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
                          {familyMember.name}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
                          <View style={{ minWidth: '40%', flex: 1 }}>
                            <DetailLine label={t('details.relation')} value={familyMember.relation} />
                          </View>
                          <View style={{ minWidth: '40%', flex: 1 }}>
                            <DetailLine label={t('details.bloodGroup')} value={familyMember.bloodGroup} />
                          </View>
                          {canViewPhone && familyMember.phone ? (
                            <View style={{ minWidth: '40%', flex: 1 }}>
                              <DetailLine label={t('details.phone')} value={familyMember.phone} />
                            </View>
                          ) : null}
                          {familyMember.email ? (
                            <View style={{ minWidth: '40%', flex: 1 }}>
                              <DetailLine label={t('details.email')} value={familyMember.email} />
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: colors.text.muted }}>{t('details.noFamily')}</Text>
                  )}
                </View>

                <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                    {t('details.roles')}
                  </Text>
                  {selectedMemberRoleLabels.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                      {selectedMemberRoleLabels.map((label) => (
                        <View
                          key={label}
                          style={{
                            borderRadius: radius.full,
                            backgroundColor: colors.primary.subtle,
                            borderWidth: 1,
                            borderColor: colors.primary.borderLight,
                            paddingHorizontal: spacing[3],
                            paddingVertical: spacing[2],
                          }}>
                          <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
                            {label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={{ color: colors.text.muted }}>{t('details.noRoles')}</Text>
                  )}
                </View>

                <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                    {t('details.permissions')}
                  </Text>
                  {selectedMemberPermissions.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                      {selectedMemberPermissions.map((permission) => (
                        <View
                          key={permission.key}
                          style={{
                            borderRadius: radius.lg,
                            backgroundColor: colors.background.DEFAULT,
                            borderWidth: 1,
                            borderColor: colors.border.light,
                            paddingHorizontal: spacing[3],
                            paddingVertical: spacing[2],
                          }}>
                          <Text variant="caption" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
                            {permission.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={{ color: colors.text.muted }}>{t('details.noPermissions')}</Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </AppSafeAreaView>
  );
}
