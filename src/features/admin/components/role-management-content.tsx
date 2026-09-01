import { View } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Dialog, InfiniteScrollList, Text } from '@/src/components';
import { EmptyState } from '@/src/components/feedback';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getPaginationTotal } from '@/src/utils/pagination';
import { roleManagementService, type RoleCatalogItem, type RoleCatalogResponse } from '../services/role-management-service';
import {
  AdminRoleAddButton,
  AdminRoleCard,
  AdminRoleTextBlock,
} from './admin-role-blocks';

const PAGE_SIZE = 12;
type RoleListItem = RoleCatalogItem | { id: string; __skeleton: true };

function roleIcon(role: RoleCatalogItem) {
  const modules = new Set(role.permissions.map((permission) => permission.module));
  if (modules.has('roles') || modules.has('users')) return 'admin-panel-settings';
  if (modules.has('events')) return 'event-available';
  if (modules.has('donations')) return 'volunteer-activism';
  if (modules.has('advertisements')) return 'campaign';
  if (modules.has('birthdays')) return 'cake';
  if (modules.has('matrimony')) return 'favorite';
  if (modules.has('publications')) return 'newspaper';
  if (modules.has('communication')) return 'forum';
  if (modules.has('registration')) return 'verified';
  if (modules.has('expenses')) return 'receipt-long';
  return 'badge';
}

function roleDescription(role: RoleCatalogItem) {
  return role.description || '';
}

function mergeRolesById(...roleGroups: RoleCatalogItem[][]) {
  const rolesById = new Map<string, RoleCatalogItem>();
  roleGroups.forEach((roles) => {
    roles.forEach((role) => {
      rolesById.set(role.id, role);
    });
  });
  return Array.from(rolesById.values());
}

function RoleCardSkeleton() {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
        <SkeletonBlock width={48} height={48} radiusSize={radius.lg} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="44%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="72%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="58%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <SkeletonBlock width="48%" height={36} radiusSize={radius.full} />
        <SkeletonBlock width="48%" height={36} radiusSize={radius.full} />
      </View>
    </View>
  );
}

function RolesHeaderSkeleton() {
  return (
    <View style={{ gap: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SkeletonBlock width="34%" height={16} radiusSize={radius.sm} />
        <SkeletonBlock width={96} height={28} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function RoleManagementContent() {
  const router = useRouter();
  const { safeBack } = useSafeNavigation();
  const t = useTranslations('admin.roles');
  const [catalog, setCatalog] = useState<RoleCatalogResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rolePendingDelete, setRolePendingDelete] = useState<RoleCatalogItem | null>(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const hasLoadedRef = useRef(false);
  const pageRef = useRef(1);

  const loadFirstPage = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent || !hasLoadedRef.current) {
      setIsLoading(true);
    }
    setLoadError(null);

    const result = await roleManagementService.loadRolesPage({ page: 1, limit: PAGE_SIZE, force: true });
    setCatalog({ roles: result.roles, permissions: result.permissions });
    setHasNextPage(Boolean(result.pagination?.hasNextPage));
    setPage(result.pagination?.page ?? 1);
    pageRef.current = result.pagination?.page ?? 1;
    setTotalRoles(getPaginationTotal(result.pagination, result.roles.length));
    hasLoadedRef.current = true;
    return result;
  }, []);

  const loadPagesThrough = useCallback(async (targetPage: number, options?: { silent?: boolean }) => {
    const safeTargetPage = Math.max(1, targetPage);
    if (!options?.silent || !hasLoadedRef.current) {
      setIsLoading(true);
    }
    setLoadError(null);

    const pageNumbers = Array.from({ length: safeTargetPage }, (_, index) => index + 1);
    const results = await Promise.all(
      pageNumbers.map((pageNumber) => roleManagementService.loadRolesPage({ page: pageNumber, limit: PAGE_SIZE, force: true })),
    );
    const lastResult = results[results.length - 1];
    const roles = mergeRolesById(...results.map((result) => result.roles));

    setCatalog({
      roles,
      permissions: lastResult?.permissions ?? [],
    });
    setHasNextPage(Boolean(lastResult?.pagination?.hasNextPage));
    setPage(lastResult?.pagination?.page ?? safeTargetPage);
    pageRef.current = lastResult?.pagination?.page ?? safeTargetPage;
    setTotalRoles(getPaginationTotal(lastResult?.pagination, roles.length));
    hasLoadedRef.current = true;
    return lastResult;
  }, []);

  useEffect(() => {
    let active = true;
    loadFirstPage()
      .then((result) => {
        if (!active) {
          return;
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : t('loading'));
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadFirstPage, t]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) {
        return undefined;
      }

      let active = true;
      loadPagesThrough(pageRef.current, { silent: true })
        .catch((error) => {
          if (!active) {
            return;
          }
          setLoadError(error instanceof Error ? error.message : t('loading'));
        })
        .finally(() => {
          if (!active) {
            return;
          }
          setIsLoading(false);
        });

      return () => {
        active = false;
      };
    }, [loadPagesThrough, t]),
  );

  const roles = useMemo(() => catalog?.roles ?? [], [catalog]);
  const roleCount = totalRoles || roles.length;
  const showInitialSkeleton = isLoading && !roles.length;
  const listData = useMemo<RoleListItem[]>(
    () => (showInitialSkeleton
      ? Array.from({ length: 4 }, (_, index) => ({ id: `skeleton-${index}`, __skeleton: true as const }))
      : roles),
    [roles, showInitialSkeleton],
  );

  const handleDeleteRole = async () => {
    if (!rolePendingDelete) {
      return;
    }

    const pendingDeleteRoleId = rolePendingDelete.id;

    setIsDeletingRole(true);
    try {
      setRolePendingDelete(null);
      await roleManagementService.deleteRole(pendingDeleteRoleId);
      setCatalog((current) => current
        ? { ...current, roles: current.roles.filter((role) => role.id !== pendingDeleteRoleId) }
        : current);
      setTotalRoles((current) => Math.max(0, current - 1));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to delete role.');
    } finally {
      setIsDeletingRole(false);
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader variant="back-inline" title={t('title')} onLeftPress={() => safeBack('/admin/dashboard')} />

        <InfiniteScrollList
          data={listData}
          keyExtractor={(role) => role.id}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          hasNextPage={showInitialSkeleton ? false : hasNextPage}
          contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 84, flexGrow: 1, paddingHorizontal: spacing[4] }}
          onRefresh={() => {
            setIsRefreshing(true);
            loadFirstPage({ silent: true }).finally(() => setIsRefreshing(false));
          }}
          onLoadMore={() => {
            if (isLoadingMore || !hasNextPage) return;
            setIsLoadingMore(true);
            const nextPage = pageRef.current + 1;
            roleManagementService.loadRolesPage({ page: nextPage, limit: PAGE_SIZE }).then((result) => {
              setCatalog((current) => current ? { ...current, roles: mergeRolesById(current.roles, result.roles) } : { roles: result.roles, permissions: result.permissions });
              setHasNextPage(Boolean(result.pagination?.hasNextPage));
              setPage(result.pagination?.page ?? nextPage);
              pageRef.current = result.pagination?.page ?? nextPage;
              setTotalRoles((current) => getPaginationTotal(result.pagination, current));
            }).finally(() => setIsLoadingMore(false));
          }}
          ListHeaderComponent={(
            showInitialSkeleton ? <RolesHeaderSkeleton /> : (
              <View style={{ gap: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <AdminRoleTextBlock label={t('sections.existing')} />
                  <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
                    <AdminRoleTextBlock label={t('stats.active').replace('{count}', String(roleCount))} small />
                  </View>
                </View>

                {loadError && !roles.length ? (
                  <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                      {loadError}
                    </Text>
                  </View>
                ) : roles.length === 0 ? (
                  <EmptyState
                    icon="admin-panel-settings"
                    title={t('empty.title')}
                    description={t('empty.description')}
                    action={{
                      label: t('actions.add'),
                      onPress: () => router.push('/admin/roles/create' as never),
                    }}
                  />
                ) : null}
              </View>
            )
          )}
          renderItem={({ item: role }) => {
            if ('__skeleton' in role) {
              return <RoleCardSkeleton />;
            }

            return (
              <AdminRoleCard
                title={role.name}
                description={roleDescription(role)}
                icon={roleIcon(role)}
                kind={role.isSystem ? 'System' : 'Custom'}
                onEditPress={() => router.push(`/admin/roles/${encodeURIComponent(role.id)}/edit` as never)}
                onDeletePress={role.isSystem ? undefined : () => setRolePendingDelete(role)}
              />
            );
          }}
          emptyTitle={t('empty.title')}
          emptyDescription={t('empty.description')}
        />

        <AdminRoleAddButton onPress={() => router.push('/admin/roles/create' as never)} />
      </View>
      <Dialog
        visible={Boolean(rolePendingDelete)}
        variant="confirm"
        title="Delete role"
        description={rolePendingDelete ? `Delete ${rolePendingDelete.name}? This cannot be undone.` : 'Delete this role?'}
        confirmLabel={isDeletingRole ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={() => { void handleDeleteRole(); }}
        onCancel={() => {
          if (isDeletingRole) {
            return;
          }
          setRolePendingDelete(null);
        }}
      />
    </AppSafeAreaView>
  );
}
