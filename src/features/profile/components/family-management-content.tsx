import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, InfiniteScrollList, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { profileService } from '../services/profile-service';
import { FamilyMemberCard, FamilySummaryCard } from './family-management-blocks';

const PAGE_SIZE = 12;

function parseRelation(rawSubtitle: string) {
  return rawSubtitle.split('•')[0]?.trim() || 'Other';
}

function parseAge(rawSubtitle: string, rawMeta: string) {
  const ageMatch = rawSubtitle.match(/(\d{1,3})\s*Years?/i);
  if (ageMatch?.[1]) {
    return `${ageMatch[1]} Years`;
  }

  const date = new Date(rawMeta);
  if (!Number.isNaN(date.getTime())) {
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
      age -= 1;
    }
    if (age >= 0) {
      return `${age} Years`;
    }
  }

  return '';
}

function FamilyMemberSkeleton() {
  return (
    <View
      style={{
        marginHorizontal: spacing[4],
        borderRadius: 24,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary.subtle,
          }}
        />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <View style={{ width: '48%', height: 16, borderRadius: 8, backgroundColor: colors.background.elevated }} />
          <View style={{ width: '32%', height: 12, borderRadius: 8, backgroundColor: colors.background.elevated }} />
          <View style={{ width: '58%', height: 12, borderRadius: 8, backgroundColor: colors.background.elevated }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
        <View style={{ width: 132, height: 32, borderRadius: 16, backgroundColor: colors.background.elevated }} />
        <View style={{ width: '32%', height: 36, borderRadius: 18, backgroundColor: colors.background.elevated }} />
        <View style={{ width: '32%', height: 36, borderRadius: 18, backgroundColor: colors.background.elevated }} />
      </View>
    </View>
  );
}

export function FamilyManagementContent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const t = useTranslations('profile.family-management');
  const [familyMembers, setFamilyMembers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;

  const loadFirstPage = React.useCallback(async () => {
    const response = await profileService.loadFamilyMembersPage({ page: 1, limit: PAGE_SIZE });
    setFamilyMembers(response.items);
    setHasNextPage(Boolean(response.pagination?.hasNextPage));
    setPage(response.pagination?.page ?? 1);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      setIsLoading(true);

      profileService.loadFamilyMembersPage({ page: 1, limit: PAGE_SIZE }).then((response) => {
        if (!active) return;
        setFamilyMembers(response.items);
        setHasNextPage(Boolean(response.pagination?.hasNextPage));
        setPage(response.pagination?.page ?? 1);
      }).finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    loadFirstPage().finally(() => setIsRefreshing(false));
  }, [loadFirstPage]);

  const handleLoadMore = React.useCallback(() => {
    if (isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    profileService.loadFamilyMembersPage({ page: page + 1, limit: PAGE_SIZE }).then((response) => {
      setFamilyMembers((current) => [...current, ...response.items]);
      setHasNextPage(Boolean(response.pagination?.hasNextPage));
      setPage(response.pagination?.page ?? page + 1);
    }).finally(() => setIsLoadingMore(false));
  }, [hasNextPage, isLoadingMore, page]);

  function buildFamilyAddRoute() {
    return {
      pathname: '/profile/family-management/add' as const,
      params: {
        ...(returnTo ? { returnTo } : {}),
      },
    } as const;
  }

  function buildFamilyEditRoute(memberId: string) {
    return {
      pathname: '/profile/family-management/[memberId]' as const,
      params: {
        memberId,
        ...(returnTo ? { returnTo } : {}),
      },
    } as const;
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back"
          rightSlot={<View style={{ width: 40, height: 40 }} />}
        />

        <InfiniteScrollList
          data={familyMembers}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={hasNextPage}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          contentContainerStyle={{ paddingBottom: spacing[8] }}
          renderSkeletonItem={() => <FamilyMemberSkeleton />}
          ListHeaderComponent={familyMembers.length > 0 ? (
            <>
              <View style={{ padding: spacing[4] }}>
                <FamilySummaryCard
                  totalMembers={String(familyMembers.length).padStart(2, '0')}
                  onAddMember={() => router.push(buildFamilyAddRoute())}
                />
              </View>

              <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }}>
                <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('sections.yourFamily')}
                </Text>
              </View>
            </>
          ) : null}
          emptyTitle={t('empty.title')}
          emptyDescription={t('empty.description')}
          renderItem={({ item: member }) => (
            <View style={{ paddingHorizontal: spacing[4] }}>
              <FamilyMemberCard
                name={member.title}
                relation={parseRelation(member.subtitle)}
                age={parseAge(member.subtitle, member.meta ?? '')}
                detail={member.bloodGroup ? `${t('fields.bloodGroup')}: ${member.bloodGroup}` : ''}
                image={member.image ?? ''}
                onUploadMarksheet={
                  ['child', 'son', 'daughter', 'daughter_in_law', 'daughter in law', 'daughter-in-law', 'grand_son', 'grand son', 'grand-son', 'grand_daughter', 'grand daughter', 'grand-daughter'].includes(parseRelation(member.subtitle).trim().toLowerCase())
                    ? () => router.push({ pathname: '/forms/upload-marksheet', params: { familyMemberId: member.id, ...(returnTo ? { returnTo: '/profile/family-management' } : {}) } } as never)
                    : undefined
                }
                onEdit={() => router.push(buildFamilyEditRoute(member.id) as never)}
                onDelete={async () => {
                  await profileService.deleteFamilyMember(member.id);
                  await loadFirstPage();
                }}
              />
            </View>
          )}
        />

        <View style={{ position: 'absolute', right: spacing[4], bottom: spacing[4], zIndex: 50 }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('empty.action')}
            activeOpacity={0.88}
            onPress={() => router.push(buildFamilyAddRoute())}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary.DEFAULT,
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}>
            <MaterialIcons name="add" size={30} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeAreaView>
  );
}
