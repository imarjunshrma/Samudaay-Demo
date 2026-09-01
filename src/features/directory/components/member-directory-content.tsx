import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, MemberListItem, SearchInput, Text } from '@/src/components';
import { SkeletonAvatar, SkeletonBlock } from '@/src/components/ui/skeleton';
import { InfiniteScrollList } from '@/src/components/lists/InfiniteScrollList/InfiniteScrollList';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationLabel, translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';
import { directoryService, type DirectoryMemberItem } from '../services/directory-service';

const PAGE_SIZE = 12;

type MemberDirectoryUserType = 'member' | 'community_member';
type MemberDirectoryPresentation = 'top-level' | 'inner';

type ChipFilterProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  width?: number;
};

function ChipFilter({ label, value, options, onSelect, width = 116 }: ChipFilterProps) {
  const active = value !== 'all';

  return (
    <Dropdown
      data={options}
      value={value}
      labelField="label"
      valueField="value"
      onChange={(item) => onSelect(item.value)}
      placeholder={label}
      style={{
        width,
        minHeight: 46,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
        backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
      }}
      placeholderStyle={{
        color: active ? colors.text.inverse : colors.text.primary,
        fontSize: 16,
        fontFamily: typography.fontFamily.medium,
      }}
      selectedTextStyle={{
        color: active ? colors.text.inverse : colors.text.primary,
        fontSize: 16,
        fontFamily: typography.fontFamily.medium,
      }}
      containerStyle={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
      }}
      itemTextStyle={{
        color: colors.text.primary,
        fontSize: 15,
      }}
      activeColor={colors.primary.subtle}
      maxHeight={280}
      search={false}
      renderRightIcon={() => (
        <Text
          variant="caption"
          style={{
            color: active ? colors.text.inverse : colors.text.primary,
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            marginLeft: spacing[2],
          }}>
          ▾
        </Text>
      )}
      renderItem={(item) => {
        const itemActive = item.value === value;
        return (
          <View
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[3],
              backgroundColor: itemActive ? colors.primary.subtle : colors.background.surface,
            }}>
            <Text variant="body" color={itemActive ? colors.primary.DEFAULT : colors.text.primary}>
              {item.label}
            </Text>
          </View>
        );
      }}
    />
  );
}

export function MemberDirectoryContent({
  userType = 'member',
  presentation = 'top-level',
}: {
  userType?: MemberDirectoryUserType;
  presentation?: MemberDirectoryPresentation;
} = {}) {
  const router = useRouter();
  const openMemberMenu = useMemberMenuAction();
  const navigateBack = useBackNavigation();
  const t = useTranslations('directory.member-directory');
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
  const requestIdRef = useRef(0);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    let active = true;
    directoryService.loadFilterOptions({ userType }).then((result) => {
      if (!active) {
        return;
      }
      setFilterOptions({
        states: result.states,
        cities: result.cities,
        pincodes: result.pincodes,
      });
    }).catch(() => undefined);

    return () => {
      active = false;
    };
  }, [userType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const loadPage = async () => {
        const isFirstLoad = !hasLoadedOnceRef.current;
        if (isFirstLoad) {
          setIsLoading(true);
        } else {
          setIsSearchLoading(true);
        }
        try {
          const response = await directoryService.loadMembersPage({
            page: 1,
            limit: PAGE_SIZE,
            q: search,
            userType,
            state: selectedState !== 'all' ? selectedState : undefined,
            city: selectedCity !== 'all' ? selectedCity : undefined,
            pincode: selectedPincode !== 'all' ? selectedPincode : undefined,
          });
          if (requestIdRef.current !== requestId) {
            return;
          }
          setItems(response.items);
          setCurrentPage(response.pagination?.page ?? 1);
          setHasNextPage(Boolean(response.pagination?.hasNextPage));
          setTotalCount(getPaginationTotal(response.pagination, response.items.length));
          hasLoadedOnceRef.current = true;
        } finally {
          if (requestIdRef.current === requestId) {
            setIsLoading(false);
            setIsSearchLoading(false);
          }
        }
      };

      void loadPage();
    }, search.trim() ? 250 : 0);

    return () => {
      clearTimeout(timer);
      requestIdRef.current += 1;
    };
  }, [search, selectedCity, selectedPincode, selectedState, userType]);

  const stateOptions = useMemo(
    () => [
      ...filterOptions.states.map((value) => ({ label: translateLocationLabel(value, language), value })),
    ],
    [filterOptions.states, language],
  );

  const cityOptions = useMemo(
    () => [
      ...filterOptions.cities.map((value) => ({ label: translateLocationLabel(value, language), value })),
    ],
    [filterOptions.cities, language],
  );

  const pincodeOptions = useMemo(
    () => [
      ...filterOptions.pincodes.map((value) => ({ label: value, value })),
    ],
    [filterOptions.pincodes],
  );

  const showHeaderSkeleton = isLoading && !items.length;

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={isCommunityMemberDirectory ? t('title.communityMembers') : t('title')}
          variant={isInnerPage ? 'back-inline' : 'menu-notification'}
          onLeftPress={isInnerPage ? () => navigateBack('/member/community-directory') : openMemberMenu}
          onRightPress={isInnerPage ? undefined : () => router.push('/member/notifications')}
        />

        <InfiniteScrollList
          data={items}
          loadingInitial={isLoading && !hasLoadedOnceRef.current}
          loadingSearch={isSearchLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            directoryService.loadMembersPage({
              page: 1,
              limit: PAGE_SIZE,
              q: search,
              userType,
              state: selectedState !== 'all' ? selectedState : undefined,
              city: selectedCity !== 'all' ? selectedCity : undefined,
              pincode: selectedPincode !== 'all' ? selectedPincode : undefined,
            }).then((response) => {
              setItems(response.items);
              setCurrentPage(response.pagination?.page ?? 1);
              setHasNextPage(Boolean(response.pagination?.hasNextPage));
              setTotalCount(getPaginationTotal(response.pagination, response.items.length));
            }).finally(() => {
              setIsRefreshing(false);
            });
          }}
          preserveHeaderOnInitialLoad
          keyExtractor={(item, index) => `${item.title}-${item.city}-${item.state}-${item.pincode}-${index}`}
          hasNextPage={hasNextPage}
          hideLoadMoreText
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) {
              return;
            }
            setIsLoadingMore(true);
            directoryService.loadMembersPage({
              page: currentPage + 1,
              limit: PAGE_SIZE,
              q: search,
              userType,
              state: selectedState !== 'all' ? selectedState : undefined,
              city: selectedCity !== 'all' ? selectedCity : undefined,
              pincode: selectedPincode !== 'all' ? selectedPincode : undefined,
            }).then((response) => {
              setItems((previous) => [...previous, ...response.items]);
              setCurrentPage(response.pagination?.page ?? currentPage + 1);
              setHasNextPage(Boolean(response.pagination?.hasNextPage));
              setTotalCount(getPaginationTotal(response.pagination, currentPage * PAGE_SIZE + response.items.length));
            }).finally(() => {
              setIsLoadingMore(false);
            });
          }}
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[4] }}
          renderSkeletonItem={() => (
            <View style={{ marginBottom: spacing[3], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <SkeletonAvatar size={56} />
                <View style={{ flex: 1, gap: spacing[2] }}>
                  <SkeletonBlock width="48%" height={16} radiusSize={radius.sm} />
                  <SkeletonBlock width="74%" height={12} radiusSize={radius.sm} />
                  <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={(
            <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
              <SearchInput
                value={search}
                onChangeText={setSearch}
                placeholder={t('search.placeholder')}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing[3], paddingRight: 0 }}>
                <ChipFilter label={t('filters.state')} value={selectedState} onSelect={setSelectedState} options={stateOptions} width={112} />
                <ChipFilter label={t('filters.city')} value={selectedCity} onSelect={setSelectedCity} options={cityOptions} width={112} />
                <ChipFilter label={t('filters.pincode')} value={selectedPincode} onSelect={setSelectedPincode} options={pincodeOptions} width={136} />
              </ScrollView>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                  {isCommunityMemberDirectory ? t('sections.communityMembers') : t('sections.members')}
                </Text>
                <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                  {showHeaderSkeleton ? (
                    <SkeletonBlock width={56} height={16} radiusSize={radius.full} />
                  ) : (
                    <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {String(totalCount).padStart(2, '0')} {t('total.suffix')}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <MemberListItem
              variant="directory"
              name={item.title}
              subtitle={item.subtitle}
              avatarUrl={item.avatarUrl ?? undefined}
              location={translateLocationText([item.city, item.state, item.pincode].filter(Boolean).join(' • '), language)}
              phone={canViewPhone ? item.phone : undefined}
              online={item.online}
            />
          )}
          emptyTitle={isCommunityMemberDirectory ? t('empty.communityMembersTitle') : t('empty.title')}
          emptyDescription={t('empty.description')}
        />
      </View>

    </AppSafeAreaView>
  );
}
