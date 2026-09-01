import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ArchiveIssueCard, Card, Dialog, FilterChips, FilterSheet, InfiniteScrollList, Text } from '@/src/components';
import { AppHeaderSearch } from '@/src/components/layout/AppHeader';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import type { DialogVariant } from '@/src/components/feedback/Dialog/Dialog';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { usePublicationArchiveFeed } from '../hooks/use-publication-archive-feed';
import {
  type PublicationArchiveMonthFilter,
  type PublicationArchiveYearFilter,
} from './publication-archive-groups';
import { publicationFeedService, type PublicationRecord } from '../services/publication-feed-service';

function getEffectivePermissions(rawPermissions: string[] = [], communityPermissions: string[] = []) {
  return new Set([...(rawPermissions ?? []), ...(communityPermissions ?? [])]);
}

function hasPublicationManagePermission(permissionSet: Set<string>) {
  return permissionSet.has('publication.manage') || permissionSet.has('publications.manage');
}

type PopupState = {
  visible: boolean;
  variant: Exclude<DialogVariant, 'confirm'>;
  title: string;
  description?: string;
};

function getManageAction(item: PublicationRecord): 'generate' | 'publish' | 'archive' | null {
  if (!item.canManage) {
    return null;
  }
  if (item.status === 'DRAFT' && item.publicationType === 'SYSTEM_GENERATED') {
    return 'generate';
  }
  if (item.status === 'DRAFT' && item.publicationType === 'MANUAL_UPLOAD' && item.fileUrl) {
    return 'publish';
  }
  if (item.status === 'GENERATED') {
    return 'publish';
  }
  if (item.status === 'PUBLISHED') {
    return 'archive';
  }
  return null;
}

function getManageActionSuccessLabel(action: 'generate' | 'publish' | 'archive') {
  if (action === 'generate') {
    return 'Publication generated successfully.';
  }
  if (action === 'publish') {
    return 'Publication published successfully.';
  }
  return 'Publication archived successfully.';
}

function getManageActionLabel(item: PublicationRecord) {
  const action = getManageAction(item);
  if (action === 'generate') return 'Generate';
  if (action === 'publish') return 'Publish';
  if (action === 'archive') return 'Archive';
  return null;
}

function buildPdfViewerRoute(config: { title: string; url: string; headers?: Record<string, string> }) {
  return {
    pathname: '/pdf-viewer',
    params: {
      title: config.title,
      url: config.url,
      ...(config.headers ? { headers: JSON.stringify(config.headers) } : {}),
    },
  } as const;
}

export function PublicationArchiveContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const t = useTranslations('publications.archive');
  const { session, permissions } = useSession();
  const effectivePermissions = getEffectivePermissions(permissions, session?.user.communityPermissions ?? []);
  const canManagePublications = hasPublicationManagePermission(effectivePermissions);

  const [search, setSearch] = useState('');
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [activeYear, setActiveYear] = useState<PublicationArchiveYearFilter>('all');
  const [activeMonth, setActiveMonth] = useState<PublicationArchiveMonthFilter>('all');
  const [draftYear, setDraftYear] = useState<PublicationArchiveYearFilter>('all');
  const [draftMonth, setDraftMonth] = useState<PublicationArchiveMonthFilter>('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [actionInFlight, setActionInFlight] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicationRecord | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const { items: publications, loading, loadingMore, refreshing, hasNextPage, error, refresh, refreshLatest, loadMore } = usePublicationArchiveFeed({
    year: activeYear !== 'all' ? Number(activeYear) : null,
    month: activeMonth !== 'all' ? Number(activeMonth) : null,
    search,
  });

  function showPopup(variant: Exclude<DialogVariant, 'confirm'>, title: string, description?: string) {
    setPopup({ visible: true, variant, title, description });
  }

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {
        return;
      });
      return undefined;
    }, [refresh]),
  );

  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(publications.map((item) => (item.year ? String(item.year) : null)).filter(Boolean) as string[])).sort(
      (left, right) => Number(right) - Number(left),
    );
    return years;
  }, [publications]);

  const monthOptions = useMemo(() => {
    const months = Array.from(new Set(publications.map((item) => (item.month ? String(item.month) : null)).filter(Boolean) as string[])).sort(
      (left, right) => Number(left) - Number(right),
    );
    return months;
  }, [publications]);

  const filteredPublications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return publications.filter((item) => {
      if (activeYear !== 'all' && String(item.year || '') !== activeYear) {
        return false;
      }
      if (activeMonth !== 'all' && String(item.month || '') !== activeMonth) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return [
        item.title,
        item.description,
        item.issueNo,
        item.edition,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [activeMonth, activeYear, publications, search]);

  const openFilters = () => {
    setDraftYear(activeYear);
    setDraftMonth(activeMonth);
    setFilterVisible(true);
  };

  const quickInsights = useMemo(
    () => [
      { id: 'total', label: t('insights.total'), value: String(publications.length) },
      { id: 'years', label: t('insights.years'), value: String(yearOptions.length) },
      {
        id: 'latest',
        label: t('insights.latest'),
        value: publications[0]?.issueNo || publications[0]?.edition || '0',
      },
    ],
    [publications, t, yearOptions.length],
  );

  const handleManage = useCallback(
    async (item: PublicationRecord) => {
      const action = getManageAction(item);
      if (!action) {
        return;
      }
      try {
        setActionInFlight(item.id);
        await publicationFeedService.performAction(item.id, action);
        await refresh();
        showPopup('success', 'Publication', getManageActionSuccessLabel(action));
      } catch (manageError) {
        showPopup('error', 'Publication', manageError instanceof Error ? manageError.message : 'Unable to update publication.');
      } finally {
        setActionInFlight(null);
      }
    },
    [refresh],
  );

  const handleDelete = useCallback(
    async (item: PublicationRecord) => {
      if (!item.canManage) {
        return;
      }
      try {
        setActionInFlight(item.id);
        await publicationFeedService.deletePublication(item.id);
        await refresh();
        setDeleteTarget(null);
        showPopup('success', 'Publication', 'Publication deleted successfully.');
      } catch (deleteError) {
        showPopup('error', 'Publication', deleteError instanceof Error ? deleteError.message : 'Unable to delete publication.');
      } finally {
        setActionInFlight(null);
      }
    },
    [refresh],
  );

  const emptyStateText = loading
    ? 'Loading publications...'
    : error
      ? error
      : publications.length > 0
        ? 'No publications match the selected month, year, or search.'
        : 'No publications are available yet.';

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
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

        <InfiniteScrollList
          data={filteredPublications}
          keyExtractor={(item) => item.id}
          loadingInitial={loading}
          loadingMore={loadingMore}
          refreshing={refreshing}
          hasNextPage={hasNextPage}
          errorMessage={error}
          onRetry={() => {
            void refresh();
          }}
          onRefresh={() => {
            void refreshLatest();
          }}
          onLoadMore={() => {
            void loadMore();
          }}
          contentContainerStyle={{ paddingTop: spacing[4], paddingHorizontal: spacing[4], paddingBottom: 96 }}
          emptyTitle="No publications found"
          emptyDescription={emptyStateText}
          ListHeaderComponent={(
            <View style={{ gap: spacing[4], maxWidth: 672, alignSelf: 'center', width: '100%', marginBottom: spacing[4] }}>
            <View style={{ gap: spacing[3] }}>
              <View style={{ gap: spacing[3] }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                      {t('insights.title')}
                    </Text>
                    <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.medium }}>
                      {t('insights.periodLabel')}
                    </Text>
                  </View>
                  {canManagePublications ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={() => router.push('/publications/generate' as never)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], paddingVertical: spacing[1] }}>
                      <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                        {t('actions.generateLink')}
                      </Text>
                      <MaterialIcons name="north-east" size={16} color={colors.primary.DEFAULT} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], paddingRight: spacing[4] }}>
                  {quickInsights.map((item, index) => (
                    <Card key={item.id} variant="default" padding="md">
                      <View style={{ width: 140, gap: spacing[2] }}>
                        <View style={{ width: 36, height: 36, borderRadius: radius.lg, backgroundColor: index === 0 ? colors.primary.subtle : index === 1 ? '#ecfdf5' : '#fef3c7', alignItems: 'center', justifyContent: 'center' }}>
                          <MaterialIcons
                            name={index === 0 ? 'menu-book' : index === 1 ? 'event-note' : 'description'}
                            size={18}
                            color={index === 0 ? colors.primary.DEFAULT : index === 1 ? '#047857' : '#b45309'}
                          />
                        </View>
                        <Text variant="caption" style={{ color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: typography.fontFamily.medium }}>
                          {item.label}
                        </Text>
                        <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {item.value}
                        </Text>
                      </View>
                    </Card>
                  ))}
                </ScrollView>
              </View>

              <FilterChips
                scrollable
                showIcons
                activeKey={activeYear}
                items={[
                  {
                    key: 'filters',
                    label: activeYear !== 'all' || activeMonth !== 'all' ? `${t('filters.filters')} (${[activeYear, activeMonth].filter((value) => value !== 'all').length})` : t('filters.filters'),
                    icon: 'tune',
                  },
                  { key: 'all', label: t('filters.allYears'), icon: 'view-week' },
                  ...yearOptions.map((year) => ({
                    key: year,
                    label: year,
                    icon: 'calendar-today' as const,
                  })),
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setActiveYear(key as PublicationArchiveYearFilter);
                }}
              />
            </View>
          </View>
          )}
          renderItem={({ item }) => (
            <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', marginBottom: spacing[4] }}>
              <ArchiveIssueCard
                title={item.title}
                edition={item.edition}
                image={item.coverImageUrl}
                statusLabel={item.canManage ? item.status : null}
                onPrimaryPress={() => {
                  void publicationFeedService.getPublicationReadConfig(item).then((config) => {
                    router.push(buildPdfViewerRoute(config) as never);
                  }).catch((readError) => {
                    showPopup('error', 'Publication', readError instanceof Error ? readError.message : 'Unable to open publication.');
                  });
                }}
                showSecondaryAction={false}
                manageActionLabel={getManageActionLabel(item)}
                onManagePress={() => {
                  if (actionInFlight === item.id) {
                    return;
                  }
                  void handleManage(item);
                }}
                showDeleteAction={item.canManage}
                onDeletePress={() => {
                  if (actionInFlight === item.id) {
                    return;
                  }
                  setDeleteTarget(item);
                }}
              />
            </View>
          )}
        />

        <FilterSheet
          visible={filterVisible}
          title={t('filters.filtersGroup')}
          subtitle={t('filters.subtitle')}
          sections={[
            {
              title: t('filters.year'),
              icon: 'calendar-today',
              activeKey: draftYear,
              items: [
                { key: 'all', label: t('filters.allYears') },
                ...yearOptions.map((year) => ({ key: year, label: year })),
              ],
              onSelect: (key) => setDraftYear(key as PublicationArchiveYearFilter),
            },
            {
              title: 'Month',
              icon: 'date-range',
              activeKey: draftMonth,
              items: [
                { key: 'all', label: 'All Months' },
                ...monthOptions.map((month) => ({
                  key: month,
                  label: new Date(2026, Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'long' }),
                })),
              ],
              onSelect: (key) => setDraftMonth(key as PublicationArchiveMonthFilter),
            },
          ]}
          onClose={() => {
            setDraftYear(activeYear);
            setDraftMonth(activeMonth);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveYear(draftYear);
            setActiveMonth(draftMonth);
            setFilterVisible(false);
          }}
          onReset={() => {
            setDraftYear('all');
            setDraftMonth('all');
          }}
          applyLabel={t('actions.applyFilters')}
          resetLabel={t('actions.resetFilters')}
        />

        {canManagePublications ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('actions.generateLink')}
            activeOpacity={0.9}
            onPress={() => router.push('/publications/generate' as never)}
            style={{
              position: 'absolute',
              right: spacing[4],
              bottom: spacing[4],
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: 0.25,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}>
            <MaterialIcons name="add" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
        ) : null}
        <Dialog
          visible={Boolean(popup?.visible)}
          variant={popup?.variant || 'info'}
          title={popup?.title || ''}
          description={popup?.description}
          confirmLabel={t('actions.ok')}
          onConfirm={() => setPopup(null)}
        />
        <Dialog
          visible={Boolean(deleteTarget)}
          variant="confirm"
          title="Delete publication?"
          description={deleteTarget ? `This will permanently delete "${deleteTarget.title}".` : undefined}
          confirmLabel={actionInFlight === deleteTarget?.id ? 'Deleting...' : 'Delete'}
          cancelLabel="Cancel"
          onCancel={() => {
            if (actionInFlight) {
              return;
            }
            setDeleteTarget(null);
          }}
          onConfirm={() => {
            if (!deleteTarget || actionInFlight) {
              return;
            }
            void handleDelete(deleteTarget);
          }}
        />
      </View>
    </AppSafeAreaView>
  );
}
