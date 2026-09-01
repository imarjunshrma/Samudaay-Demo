import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, SearchInput, SelectField, Text } from '@/src/components';
import { InfiniteScrollList } from '@/src/components/lists/InfiniteScrollList/InfiniteScrollList';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationLabel, translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';
import { AdminDirectoryCard } from './admin-directory-blocks';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';

const PAGE_SIZE = 12;
type ManageDirectoryUserType = 'member' | 'community_member';
type ManageDirectoryPresentation = 'top-level' | 'inner';
type DirectoryListItem = DirectoryMemberItem | { id: string; __skeleton: true };

function DirectoryMemberSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border.light,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
        <View style={{ position: 'relative', width: 64, height: 64 }}>
          <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary.muted, borderWidth: 2, borderColor: colors.primary.border }} />
          <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: radius.full, backgroundColor: colors.background.elevated, borderWidth: 2, borderColor: colors.background.surface }} />
        </View>
        <View style={{ flex: 1, gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
            <SkeletonBlock width="42%" height={16} radiusSize={radius.sm} />
            <View style={{ flexDirection: 'row', gap: spacing[1] }}>
              <SkeletonBlock width={28} height={28} radiusSize={radius.full} />
              <SkeletonBlock width={28} height={28} radiusSize={radius.full} />
              <SkeletonBlock width={28} height={28} radiusSize={radius.full} />
            </View>
          </View>
          <SkeletonBlock width="56%" height={12} radiusSize={radius.sm} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <SkeletonBlock width={14} height={14} radiusSize={radius.sm} />
            <SkeletonBlock width="68%" height={12} radiusSize={radius.sm} />
          </View>
        </View>
      </View>
    </View>
  );
}

function ManageDirectoryHeaderSkeleton() {
  return (
    <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
      <View
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          backgroundColor: colors.background.surface,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          gap: spacing[2],
        }}>
        <SkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="100%" height={18} radiusSize={radius.sm} />
      </View>

      <View style={{ gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <SkeletonBlock width="48%" height={74} radiusSize={radius.lg} />
          <SkeletonBlock width="48%" height={74} radiusSize={radius.lg} />
        </View>
        <SkeletonBlock width="100%" height={74} radiusSize={radius.lg} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonBlock width="34%" height={18} radiusSize={radius.sm} />
        <SkeletonBlock width={92} height={28} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function ManageDirectoryContent({
  userType = 'member',
  presentation = 'top-level',
}: {
  userType?: ManageDirectoryUserType;
  presentation?: ManageDirectoryPresentation;
} = {}) {
  const router = useRouter();
  const navigation = useNavigation();
  const navigateBack = useBackNavigation();
  const fabBottom = useBottomSafeSpacing(88);
  const t = useTranslations('admin.manage-directory');
  const { language } = useAppPreferences();
  const { hasPermission } = useSession();
  const isCommunityMemberDirectory = userType === 'community_member';
  const isInnerPage = presentation === 'inner';
  const canViewPhone = hasPermission('phone.view');
  const [items, setItems] = useState<DirectoryMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState<{ states: string[]; cities: string[]; pincodes: string[] }>({ states: [], cities: [], pincodes: [] });
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPincode, setSelectedPincode] = useState('all');
  const hasLoadedRef = useRef(false);
  const hasFocusedOnceRef = useRef(false);
  const hasQueryInitializedRef = useRef(false);
  const loadMembersRef = useRef<null | ((args: { page: number; append?: boolean; refresh?: boolean; showLoading?: boolean }) => Promise<void>)>(null);

  const loadMembers = useCallback(async ({
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
    } else if (showLoading) {
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      } else {
        setIsSearchLoading(true);
      }
    }

    try {
      const result = await directoryService.loadMembersPage({
        page,
        limit: PAGE_SIZE,
        q: search,
        userType,
        state: selectedState !== 'all' ? selectedState : undefined,
        city: selectedCity !== 'all' ? selectedCity : undefined,
        pincode: selectedPincode !== 'all' ? selectedPincode : undefined,
      });
      setItems((previous) => (append ? [...previous, ...result.items] : result.items));
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      setCurrentPage(result.pagination?.page ?? page);
      setTotalCount(getPaginationTotal(result.pagination, append ? (page - 1) * PAGE_SIZE + result.items.length : result.items.length));
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
      setIsSearchLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [search, selectedCity, selectedPincode, selectedState, userType]);

  useEffect(() => {
    loadMembersRef.current = loadMembers;
  }, [loadMembers]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      directoryService.loadFilterOptions({ userType }).then((result) => {
        if (!active) return;
        setFilterOptions({
          states: result.states,
          cities: result.cities,
          pincodes: result.pincodes,
        });
      }).catch(() => undefined);

      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
      } else {
        void loadMembersRef.current?.({ page: 1, showLoading: false }).catch(() => {
          if (!active) {
            return;
          }
          setItems([]);
          setIsLoading(false);
        });
      }

      return () => {
        active = false;
      };
    }, [userType]),
  );

  useEffect(() => {
    if (!hasQueryInitializedRef.current) {
      hasQueryInitializedRef.current = true;
      void loadMembers({ page: 1 });
      return () => undefined;
    }

    const timer = setTimeout(() => {
      void loadMembers({ page: 1 });
    }, search.trim() ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadMembers, search, selectedCity, selectedPincode, selectedState]);

  const showInitialSkeleton = isLoading && !items.length;
  const listData = useMemo<DirectoryListItem[]>(
    () => (showInitialSkeleton
      ? Array.from({ length: 4 }, (_, index) => ({ id: `skeleton-${index}`, __skeleton: true as const }))
      : items),
    [items, showInitialSkeleton],
  );

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader
        variant={isInnerPage ? 'back-inline' : 'menu-notification'}
        title={isCommunityMemberDirectory ? t('title.communityMembers') : t('title')}
        onLeftPress={isInnerPage ? () => navigateBack('/admin/people') : () => navigation.dispatch(DrawerActions.openDrawer())}
        onRightPress={isInnerPage ? undefined : () => router.push('/admin/notification-inbox' as never)}
      />

      <View style={{ flex: 1 }}>
        <InfiniteScrollList
          data={listData}
          keyExtractor={(member) => member.id}
          hasNextPage={showInitialSkeleton ? false : hasNextPage}
          loadingSearch={isSearchLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          onRefresh={() => {
            void loadMembers({ page: 1, refresh: true, showLoading: false });
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) {
              return;
            }
            void loadMembers({ page: currentPage + 1, append: true, showLoading: false });
          }}
          hideLoadMoreText
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: spacing[4], paddingHorizontal: spacing[4] }}
          ListHeaderComponent={(
            showInitialSkeleton ? <ManageDirectoryHeaderSkeleton /> : (
              <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
                <SearchInput value={search} onChangeText={setSearch} placeholder={t('search.placeholder')} />

                <View style={{ gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                    <View style={{ flex: 1 }}>
                      <SelectField
                        variant="dropdown"
                        label={t('filters.state')}
                        labelVariant="default"
                        placeholder={t('filters.state')}
                        value={selectedState}
                        onSelect={setSelectedState}
                        options={[
                          { label: t('filters.allStates'), value: 'all' },
                          ...filterOptions.states.map((state) => ({ label: translateLocationLabel(state, language), value: state })),
                        ]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <SelectField
                        variant="dropdown"
                        label={t('filters.city')}
                        labelVariant="default"
                        placeholder={t('filters.city')}
                        value={selectedCity}
                        onSelect={setSelectedCity}
                        options={[
                          { label: t('filters.allCities'), value: 'all' },
                          ...filterOptions.cities.map((city) => ({ label: translateLocationLabel(city, language), value: city })),
                        ]}
                      />
                    </View>
                  </View>

                  <SelectField
                    variant="dropdown"
                    label={t('filters.pincode')}
                    labelVariant="default"
                    placeholder={t('filters.pincode')}
                    value={selectedPincode}
                    onSelect={setSelectedPincode}
                    options={[
                      { label: t('filters.allPincodes'), value: 'all' },
                      ...filterOptions.pincodes.map((pincode) => ({ label: pincode, value: pincode })),
                    ]}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                    {isCommunityMemberDirectory ? t('sections.communityMembers') : t('sections.members')}
                  </Text>
                  <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                    <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {String(totalCount).padStart(2, '0')} {t('total.suffix')}
                    </Text>
                  </View>
                </View>
              </View>
            )
          )}
          renderItem={({ item }) => (
            '__skeleton' in item ? <DirectoryMemberSkeleton /> : (
              <AdminDirectoryCard
                name={item.title}
                location={translateLocationText(`${item.city}, ${item.state} • ${item.pincode}`, language)}
                phone={canViewPhone ? item.phone : undefined}
                role={item.subtitle}
                avatar={item.avatarUrl || undefined}
                statusTone={item.online ? 'active' : 'inactive'}
                onAssignPermissions={() => router.push(`/admin/permissions?memberId=${encodeURIComponent(item.id)}` as never)}
                onEdit={() => router.push(`/admin/manage-directory/${item.id}` as never)}
                onDelete={() => {
                  Alert.alert(
                    t('dialog.removeTitle'),
                    t('dialog.removeMessage').replace('{name}', item.title),
                    [
                      { text: t('actions.cancel'), style: 'cancel' },
                      {
                        text: t('actions.remove'),
                        style: 'destructive',
                        onPress: () => {
                          directoryService.deleteMember(item.id)
                            .then(() => loadMembers({ page: 1 }))
                            .catch(() => {
                              Alert.alert(t('errors.removeFailed'), t('errors.tryAgain'));
                            });
                        },
                      },
                    ],
                  );
                }}
              />
            )
          )}
          emptyTitle={isCommunityMemberDirectory ? t('empty.communityMembersTitle') : t('empty.title')}
          emptyDescription={t('empty.description')}
        />

        {/* FAB — floats above the bottom bar */}
        <View style={{ position: 'absolute', right: spacing[4], bottom: fabBottom, zIndex: 30 }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={() => router.push('/admin/manage-directory/add' as never)} style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.text.inverse, fontSize: 28, lineHeight: 28 }}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeAreaView>
  );
}
