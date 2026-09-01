import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppBottomBar, AppHeader, FilterChips, InfiniteScrollList, SearchInput, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { StudentCard } from './children-education-directory-blocks';
import { childrenEducationService, type ChildDirectoryItem } from '../services/children-education-service';

export function ChildrenEducationDirectoryContent() {
  const router = useRouter();
  const t = useTranslations('forms.children-education-directory');
  const [students, setStudents] = useState<ChildDirectoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnceRef = useRef(false);

  const loadStudents = useCallback(async ({ nextPage, append = false, refresh = false }: { nextPage: number; append?: boolean; refresh?: boolean }) => {
    if (append) {
      setIsLoadingMore(true);
    } else if (refresh) {
      setIsRefreshing(true);
    } else if (!hasLoadedOnceRef.current) {
      setIsLoading(true);
    } else {
      setIsSearchLoading(true);
    }

    try {
      const result = await childrenEducationService.loadChildrenPage({
        page: nextPage,
        limit: 20,
        search,
      });
      setStudents((current) => {
        if (!append) return result.items;
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setPage(result.pagination?.page ?? nextPage);
      setHasNextPage(Boolean(result.pagination?.hasNextPage));
      hasLoadedOnceRef.current = true;
      setError(null);
    } catch (loadError) {
      if (!append) {
        setStudents([]);
      }
      setError(loadError instanceof Error ? loadError.message : 'Unable to load students.');
    } finally {
      setIsLoading(false);
      setIsSearchLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadStudents({ nextPage: 1 });
    }, search.trim() ? 250 : 0);
    return () => clearTimeout(timer);
  }, [loadStudents, search]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
      <View style={{ flex: 1, backgroundColor: '#fdf9f6' }}>
        <AppHeader
          variant="brand"
          leftSlot={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <MaterialIcons name="school" size={24} color={colors.primary.DEFAULT} />
              <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {t('title')}
              </Text>
            </View>
          }
          rightSlot={
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[2], borderRadius: radius.full }}>
              <MaterialIcons name="search" size={22} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          }
        />

        <InfiniteScrollList
          data={students}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading && !hasLoadedOnceRef.current}
          loadingSearch={isSearchLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          errorMessage={error}
          onRetry={() => {
            void loadStudents({ nextPage: 1 });
          }}
          onRefresh={() => {
            void loadStudents({ nextPage: 1, refresh: true });
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            void loadStudents({ nextPage: page + 1, append: true });
          }}
          preserveHeaderOnInitialLoad
          contentContainerStyle={{ paddingTop: spacing[6], paddingHorizontal: spacing[4], paddingBottom: 160 }}
          ListHeaderComponent={(
            <View style={{ gap: spacing[8], marginBottom: spacing[8] }}>
              <View style={{ maxWidth: 560, width: '100%' }}>
                <Text variant="h1" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, lineHeight: 44 }}>
                  {t('hero.prefix')}{' '}
                  <Text variant="h1" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, lineHeight: 44 }}>
                    {t('hero.highlight')}
                  </Text>
                </Text>
                <View style={{ position: 'relative', marginTop: spacing[6] }}>
                  <SearchInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('search.placeholder')}
                  />
                  <View style={{ position: 'absolute', right: spacing[2], bottom: spacing[4] }}>
                    <MaterialIcons name="person-search" size={20} color="#827470" />
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], alignItems: 'center' }}>
                <FilterChips
                  items={[
                    { key: 'class1', label: t('filters.class1') },
                    { key: 'class2', label: t('filters.class2') },
                    { key: 'class3', label: t('filters.class3') },
                  ]}
                  activeKey="class2"
                  onPress={() => undefined}
                />
                <View style={{ width: 1, height: 32, backgroundColor: colors.primary.borderLight, marginHorizontal: spacing[2] }} />
                <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[5], paddingVertical: spacing[2], borderRadius: 999, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.surface }}>
                  <MaterialIcons name="tune" size={16} color={colors.primary.DEFAULT} />
                  <Text variant="caption" style={{ fontSize: 13, color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold }}>
                    {t('filters.button')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ width: '100%', maxWidth: 360, alignSelf: 'center' }}>
              <StudentCard {...item} />
            </View>
          )}
          emptyTitle="No students found"
          emptyDescription="Try searching by student name, parent, school or class."
        />

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <AppBottomBar
            variant="minimal"
            activeKey="students"
            items={[
              { key: 'students', icon: 'badge', label: t('bottomNav.students') },
              { key: 'reports', icon: 'analytics', label: t('bottomNav.reports') },
              { key: 'filters', icon: 'tune', label: t('bottomNav.filters') },
              { key: 'profile', icon: 'account-circle', label: t('bottomNav.profile') },
            ]}
            onChange={(key) => {
              switch (key) {
                case 'students':
                  router.push('/forms/children-education-directory' as never);
                  break;
                case 'reports':
                  router.push('/forms/marksheet-reports' as never);
                  break;
                case 'filters':
                  router.push('/forms/children-education-directory' as never);
                  break;
                case 'profile':
                  router.push('/profile/my-profile' as never);
                  break;
              }
            }}
          />
        </View>
      </View>
    </AppSafeAreaView>
  );
}
