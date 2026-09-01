import { useCallback, useRef, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, InfiniteScrollList, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import {
  AdminTrusteeRow,
} from './admin-directory-blocks';

const USER_TYPE_KEYS = new Set(['user', 'member', 'community_member', 'trustee', 'admin']);
const PAGE_SIZE = 12;

function getNonTrusteeAssignment(item: DirectoryMemberItem) {
  const roles = item.roles ?? [];
  const currentUserType = String(item.userType || 'user').toLowerCase();
  const userType = currentUserType === 'admin' || currentUserType === 'member' || currentUserType === 'community_member' ? currentUserType : 'user';
  const roleKeys = roles.filter((roleKey) => roleKey !== 'trustee' && !USER_TYPE_KEYS.has(roleKey));

  return { userType, roleKeys };
}

export function ManageTrusteesContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const { hasPermission } = useSession();
  const t = useTranslations('admin.manage-trustees');
  const [items, setItems] = useState<DirectoryMemberItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canViewPhone = hasPermission('phone.view');
  const pageRef = useRef(1);
  const hasNextPageRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const loadTrustees = useCallback(async (mode: 'reset' | 'append' = 'reset') => {
    if (mode === 'append') {
      if (isLoadingMoreRef.current || !hasNextPageRef.current) {
        return;
      }
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
    } else if (mode === 'reset') {
      setIsLoading(true);
    }

    const nextPage = mode === 'append' ? pageRef.current + 1 : 1;

    try {
      const result = await directoryService.loadMembersPage({
        userType: 'trustee',
        page: nextPage,
        limit: PAGE_SIZE,
      });

      setItems((current) => (mode === 'append'
        ? [...current, ...result.items.filter((item) => !current.some((existing) => existing.id === item.id))]
        : result.items));
      const resolvedPage = result.pagination?.page ?? nextPage;
      const resolvedHasNextPage = Boolean(result.pagination?.hasNextPage);
      pageRef.current = resolvedPage;
      hasNextPageRef.current = resolvedHasNextPage;
      setHasNextPage(resolvedHasNextPage);
      setError(null);
    } catch (loadError) {
      if (mode !== 'append') {
        setItems([]);
      }
      setError(loadError instanceof Error ? loadError.message : t('errors.remove'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
      setIsRefreshing(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      void loadTrustees('reset');
    }, [loadTrustees]),
  );

  const removeTrustee = async (item: DirectoryMemberItem) => {
    const performDelete = async () => {
      setDeletingId(item.id);
      setError(null);
      try {
        await directoryService.assignMemberRoles(item.id, getNonTrusteeAssignment(item));
        await loadTrustees('reset');
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : t('errors.remove'));
      } finally {
        setDeletingId(null);
      }
    };

    Alert.alert(
      t('remove.title'),
      t('remove.description').replace('{name}', item.title),
      [
        { text: t('remove.cancel'), style: 'cancel' },
        { text: t('remove.confirm'), style: 'destructive', onPress: () => void performDelete() },
      ],
    );
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          onLeftPress={navigateBack}
        />

        <InfiniteScrollList
          data={items}
          keyExtractor={(item) => item.id}
          loadingInitial={isLoading}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            void loadTrustees('reset');
          }}
          loadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onLoadMore={() => {
            void loadTrustees('append');
          }}
          preserveHeaderOnInitialLoad
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 80, paddingHorizontal: spacing[4], flexGrow: 1 }}
          ListHeaderComponent={(
            <View style={{ gap: spacing[4], marginBottom: spacing[2] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing[4] }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 24, lineHeight: 28 }}>
                    {t('heading')}
                  </Text>
                  <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: 4 }}>
                    {t('subtitle')}
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                  <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('badge')}
                  </Text>
                </View>
              </View>

              {error ? (
                <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: '#fecaca', backgroundColor: '#fef2f2', padding: spacing[3] }}>
                  <Text style={{ color: '#b91c1c', fontFamily: typography.fontFamily.semibold }}>
                    {error}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          renderSkeletonItem={() => (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <SkeletonListItem />
            </View>
          )}
          renderItem={({ item }) => (
            <AdminTrusteeRow
              name={item.title}
              role={item.subtitle}
              meta={item.meta || (canViewPhone ? item.phone : null) || item.email || t('meta')}
              onEdit={() => router.push(`/admin/manage-trustees/${item.id}` as never)}
              onDelete={() => {
                if (!deletingId) {
                  void removeTrustee(item);
                }
              }}
            />
          )}
          emptyTitle={t('heading')}
          emptyDescription={t('empty')}
        />

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => router.push('/admin/manage-trustees/add' as never)}
          style={{
            position: 'absolute',
            right: spacing[4],
            bottom: 88,
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
          }}>
          <Text style={{ color: colors.text.inverse, fontSize: 28, lineHeight: 28 }}>+</Text>
        </TouchableOpacity>
      </View>
    </AppSafeAreaView>
  );
}
