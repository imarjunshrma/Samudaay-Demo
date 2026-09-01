import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppHeaderSearch, AppSafeAreaView, AppSkeletonBlock, Card, FilterSheet, Text } from '@/src/components';
import { EmptyState } from '@/src/components/feedback';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useDebounce } from '@/src/hooks';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { adminUserService, type AdminFamilyRegistryItem } from '../services/admin-user-service';

type StatusFilterKey = 'all' | 'active' | 'blocked';
type FamilySizeFilterKey = 'all' | 'single' | 'small' | 'large';
type RelationFilterKey = 'all' | 'children' | 'parents' | 'spouse';
type AadhaarFilterKey = 'all' | 'with' | 'without';
const CHILD_LIKE_RELATIONS = new Set(['CHILD', 'SON', 'DAUGHTER', 'DAUGHTER_IN_LAW', 'GRAND_SON', 'GRAND_DAUGHTER']);
const PAGE_SIZE = 20;

function DetailLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: colors.text.muted, fontSize: 11, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: typography.fontFamily.medium }}>
        {value || '-'}
      </Text>
    </View>
  );
}

function getStatusFilterLabel(filter: StatusFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'active':
      return t('filters.active');
    case 'blocked':
      return t('filters.blocked');
    default:
      return t('filters.allStatus');
  }
}

function getFamilySizeFilterLabel(filter: FamilySizeFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'single':
      return t('filters.singleMember');
    case 'small':
      return t('filters.smallFamily');
    case 'large':
      return t('filters.largeFamily');
    default:
      return t('filters.anySize');
  }
}

function getAadhaarFilterLabel(filter: AadhaarFilterKey, t: (key: string) => string) {
  switch (filter) {
    case 'with':
      return t('filters.withAadhaar');
    case 'without':
      return t('filters.withoutAadhaar');
    default:
      return t('filters.anyAadhaar');
  }
}

function FamilyRegistryRow({
  item,
  onPress,
  t,
  language,
}: {
  item: AdminFamilyRegistryItem;
  onPress: () => void;
  t: (key: string) => string;
  language: 'en' | 'gu';
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.full,
            backgroundColor: colors.primary.subtle,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          {item.profilePic ? (
            <Image source={{ uri: item.profilePic }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {item.name}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>
            {item.email || item.phone || t('labels.noContact')}
          </Text>
          <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
            {t('labels.memberId').replace('{value}', item.memberId || '-')}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', flexShrink: 0, gap: spacing[2] }}>
          <View style={{ paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radius.full, backgroundColor: colors.primary.muted, maxWidth: 92 }}>
            <Text numberOfLines={1} style={{ color: colors.primary.DEFAULT, fontSize: 11, fontFamily: typography.fontFamily.bold }}>
              {t('labels.familyCount').replace('{count}', String(item.familyCount))}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        <DetailLine label={t('details.location')} value={translateLocationText([item.city, item.state].filter(Boolean).join(', '), language) || null} />
        <DetailLine label={t('details.status')} value={item.status || null} />
        <DetailLine label={t('details.aadhaar')} value={item.familyMembers.some((member) => member.aadhaarNumber) ? t('labels.aadhaarAvailable') : t('labels.aadhaarMissing')} />
      </View>
    </TouchableOpacity>
  );
}

export function AdminFamilyRegistryContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.family-registry');
  const { language } = useAppPreferences();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const effectiveSearch = search.trim() ? debouncedSearch : '';
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [items, setItems] = useState<AdminFamilyRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilterKey>('all');
  const [activeFamilySizeFilter, setActiveFamilySizeFilter] = useState<FamilySizeFilterKey>('all');
  const [activeRelationFilter, setActiveRelationFilter] = useState<RelationFilterKey>('all');
  const [activeAadhaarFilter, setActiveAadhaarFilter] = useState<AadhaarFilterKey>('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState<StatusFilterKey>('all');
  const [draftFamilySizeFilter, setDraftFamilySizeFilter] = useState<FamilySizeFilterKey>('all');
  const [draftRelationFilter, setDraftRelationFilter] = useState<RelationFilterKey>('all');
  const [draftAadhaarFilter, setDraftAadhaarFilter] = useState<AadhaarFilterKey>('all');
  const requestIdRef = useRef(0);

  const loadRegistry = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    const requestId = ++requestIdRef.current;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await adminUserService.loadFamilyRegistry({
        search: effectiveSearch,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setItems((current) => append ? [...current, ...result.items] : result.items);
      setPage(result.pagination.page);
      setHasNextPage(result.pagination.hasNextPage);
    } catch (loadError) {
      if (requestId === requestIdRef.current) {
        setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [effectiveSearch, t]);

  useEffect(() => {
    void loadRegistry({ nextPage: 1 });
  }, [loadRegistry]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeStatusFilter === 'active' && String(item.status || '').toUpperCase() !== 'ACTIVE') {
        return false;
      }
      if (activeStatusFilter === 'blocked' && String(item.status || '').toUpperCase() !== 'BLOCKED') {
        return false;
      }

      if (activeFamilySizeFilter === 'single' && item.familyCount !== 1) {
        return false;
      }
      if (activeFamilySizeFilter === 'small' && (item.familyCount < 2 || item.familyCount > 4)) {
        return false;
      }
      if (activeFamilySizeFilter === 'large' && item.familyCount < 5) {
        return false;
      }

      const relations = new Set(item.familyMembers.map((member) => String(member.relation || '').trim().toUpperCase()));
      if (activeRelationFilter === 'children' && !Array.from(relations).some((relation) => CHILD_LIKE_RELATIONS.has(relation))) {
        return false;
      }
      if (activeRelationFilter === 'parents' && !relations.has('FATHER') && !relations.has('MOTHER')) {
        return false;
      }
      if (activeRelationFilter === 'spouse' && !relations.has('SPOUSE')) {
        return false;
      }

      const hasAadhaar = item.familyMembers.some((member) => Boolean(member.aadhaarNumber));
      if (activeAadhaarFilter === 'with' && !hasAadhaar) {
        return false;
      }
      if (activeAadhaarFilter === 'without' && hasAadhaar) {
        return false;
      }

      return true;
    });
  }, [activeAadhaarFilter, activeFamilySizeFilter, activeRelationFilter, activeStatusFilter, items]);

  const ownerCount = filteredItems.length;
  const totalFamilyMembers = useMemo(
    () => filteredItems.reduce((sum, item) => sum + item.familyCount, 0),
    [filteredItems],
  );

  const appliedFilterCount = useMemo(
    () => [activeStatusFilter, activeFamilySizeFilter, activeRelationFilter, activeAadhaarFilter].filter((value) => value !== 'all').length,
    [activeAadhaarFilter, activeFamilySizeFilter, activeRelationFilter, activeStatusFilter],
  );

  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeStatusFilter !== 'all') {
      filters.push({
        key: `status-${activeStatusFilter}`,
        label: getStatusFilterLabel(activeStatusFilter, t),
        onRemove: () => setActiveStatusFilter('all'),
      });
    }

    if (activeFamilySizeFilter !== 'all') {
      filters.push({
        key: `size-${activeFamilySizeFilter}`,
        label: getFamilySizeFilterLabel(activeFamilySizeFilter, t),
        onRemove: () => setActiveFamilySizeFilter('all'),
      });
    }

    if (activeRelationFilter !== 'all') {
      filters.push({
        key: `relation-${activeRelationFilter}`,
        label: t(`filters.${activeRelationFilter}`),
        onRemove: () => setActiveRelationFilter('all'),
      });
    }

    if (activeAadhaarFilter !== 'all') {
      filters.push({
        key: `aadhaar-${activeAadhaarFilter}`,
        label: getAadhaarFilterLabel(activeAadhaarFilter, t),
        onRemove: () => setActiveAadhaarFilter('all'),
      });
    }

    return filters;
  }, [activeAadhaarFilter, activeFamilySizeFilter, activeRelationFilter, activeStatusFilter, t]);

  const openFilters = useCallback(() => {
    setDraftStatusFilter(activeStatusFilter);
    setDraftFamilySizeFilter(activeFamilySizeFilter);
    setDraftRelationFilter(activeRelationFilter);
    setDraftAadhaarFilter(activeAadhaarFilter);
    setFilterVisible(true);
  }, [activeAadhaarFilter, activeFamilySizeFilter, activeRelationFilter, activeStatusFilter]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeaderSearch
          title={t('title')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchInHeader}
          onSearchPress={() => setSearchInHeader(true)}
          onCloseSearch={() => {
            setSearch('');
            setSearchInHeader(false);
          }}
          onBackPress={navigateBack}
          placeholder={t('search.placeholder')}
        />

        <FlatList
          data={loading || error ? [] : filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[8], gap: spacing[4] }}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (loading || loadingMore || !hasNextPage) {
              return;
            }
            void loadRegistry({ nextPage: page + 1, append: true });
          }}
          ListHeaderComponent={(
            <>
          <Card variant="elevated" padding="lg">
            <View style={{ gap: spacing[2] }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {t('summary.badge')}
              </Text>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
                {t('summary.title')}
              </Text>
              <Text variant="body" color={colors.text.secondary}>
                {t('summary.description')}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing[3], marginTop: spacing[4] }}>
              <View style={{ flex: 1, borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4] }}>
                <Text variant="caption" color={colors.text.muted}>{t('summary.owners')}</Text>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
                  {ownerCount}
                </Text>
              </View>
              <View style={{ flex: 1, borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4] }}>
                <Text variant="caption" color={colors.text.muted}>{t('summary.members')}</Text>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
                  {totalFamilyMembers}
                </Text>
              </View>
            </View>
          </Card>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ marginTop: spacing[2] }} contentContainerStyle={{ gap: spacing[2], paddingRight: spacing[4] }}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.88}
              onPress={openFilters}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1],
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              }}>
              <MaterialIcons name="tune" size={16} color={colors.primary.DEFAULT} />
              <Text numberOfLines={1} style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold, fontSize: 12 }}>
                {appliedFilterCount > 0
                  ? t('actions.filtersWithCount').replace('{count}', String(appliedFilterCount))
                  : t('actions.filters')}
              </Text>
            </TouchableOpacity>
            {[
              { key: 'all', label: t('filters.allStatus') },
              { key: 'active', label: t('filters.active') },
              { key: 'blocked', label: t('filters.blocked') },
            ].map((item) => {
              const active = item.key === activeStatusFilter;
              return (
                <TouchableOpacity
                  key={item.key}
                  accessibilityRole="button"
                  activeOpacity={0.88}
                  onPress={() => setActiveStatusFilter(item.key as StatusFilterKey)}
                  style={{
                    borderWidth: 1,
                    borderRadius: radius.full,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[2],
                    borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                    backgroundColor: active ? colors.primary.muted : colors.background.surface,
                  }}>
                  <Text variant="caption" color={active ? colors.primary.DEFAULT : colors.text.primary}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {appliedFilters.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
              {appliedFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  accessibilityRole="button"
                  activeOpacity={0.85}
                  onPress={filter.onRemove}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[1],
                    borderRadius: radius.full,
                    backgroundColor: colors.primary.subtle,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[2],
                  }}>
                  <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
                    {filter.label}
                  </Text>
                  <MaterialIcons name="close" size={14} color={colors.primary.DEFAULT} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
            </>
          )}
          ListEmptyComponent={loading ? (
            <View style={{ gap: spacing[3] }}>
              {Array.from({ length: 4 }, (_, index) => (
                <AppSkeletonBlock key={index} height={112} />
              ))}
            </View>
          ) : error ? (
            <Card variant="default" padding="lg">
              <Text variant="body" color={colors.status.error}>
                {error}
              </Text>
            </Card>
          ) : (
            <EmptyState
              icon="family-restroom"
              title={t('empty.title')}
              description={t('empty.description')}
            />
          )}
          renderItem={({ item }) => (
            <FamilyRegistryRow
              item={item}
              t={t}
              language={language}
              onPress={() => router.push({ pathname: '/admin/family-registry/[userId]', params: { userId: item.id } })}
            />
          )}
          ListFooterComponent={loadingMore ? (
            <View style={{ paddingVertical: spacing[3], alignItems: 'center' }}>
              <ActivityIndicator color={colors.primary.DEFAULT} />
            </View>
          ) : null}
        />

        <FilterSheet
          visible={filterVisible}
          title={t('filters.sheetTitle')}
          subtitle={t('filters.sheetDescription')}
          sections={[
            {
              title: t('filters.statusLabel'),
              icon: 'verified-user',
              activeKey: draftStatusFilter,
              items: [
                { label: t('filters.allStatus'), key: 'all' },
                { label: t('filters.active'), key: 'active' },
                { label: t('filters.blocked'), key: 'blocked' },
              ],
              onSelect: (value) => setDraftStatusFilter(value as StatusFilterKey),
            },
            {
              title: t('filters.familySizeLabel'),
              icon: 'groups',
              activeKey: draftFamilySizeFilter,
              items: [
                { label: t('filters.anySize'), key: 'all' },
                { label: t('filters.singleMember'), key: 'single' },
                { label: t('filters.smallFamily'), key: 'small' },
                { label: t('filters.largeFamily'), key: 'large' },
              ],
              onSelect: (value) => setDraftFamilySizeFilter(value as FamilySizeFilterKey),
            },
            {
              title: t('filters.relationLabel'),
              icon: 'family-restroom',
              activeKey: draftRelationFilter,
              items: [
                { label: t('filters.anyRelation'), key: 'all' },
                { label: t('filters.children'), key: 'children' },
                { label: t('filters.parents'), key: 'parents' },
                { label: t('filters.spouse'), key: 'spouse' },
              ],
              onSelect: (value) => setDraftRelationFilter(value as RelationFilterKey),
            },
            {
              title: t('filters.aadhaarLabel'),
              icon: 'badge',
              activeKey: draftAadhaarFilter,
              items: [
                { label: t('filters.anyAadhaar'), key: 'all' },
                { label: t('filters.withAadhaar'), key: 'with' },
                { label: t('filters.withoutAadhaar'), key: 'without' },
              ],
              onSelect: (value) => setDraftAadhaarFilter(value as AadhaarFilterKey),
            },
          ]}
          onClose={() => {
            setDraftStatusFilter(activeStatusFilter);
            setDraftFamilySizeFilter(activeFamilySizeFilter);
            setDraftRelationFilter(activeRelationFilter);
            setDraftAadhaarFilter(activeAadhaarFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveStatusFilter(draftStatusFilter);
            setActiveFamilySizeFilter(draftFamilySizeFilter);
            setActiveRelationFilter(draftRelationFilter);
            setActiveAadhaarFilter(draftAadhaarFilter);
            setFilterVisible(false);
          }}
          applyLabel={t('actions.applyFilters')}
          resetLabel={t('actions.clearFilters')}
          onReset={() => {
            setDraftStatusFilter('all');
            setDraftFamilySizeFilter('all');
            setDraftRelationFilter('all');
            setDraftAadhaarFilter('all');
          }}
        />
      </View>
    </AppSafeAreaView>
  );
}
