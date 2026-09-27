import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { AppSafeAreaView, Card, CardGridSkeleton, DetailPageSkeleton, Text } from '@/src/components';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { canAccessAdminNavKey } from '@/src/core/navigation/admin-shell';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { adminService, type TenantSummary } from '../services/admin-service';
import {
  AdminDashboardHero,
  AdminDashboardManagementGrid,
  AdminDashboardTopBar,
} from './admin-dashboard-blocks';

function AdminDashboardSkeleton() {
  return (
    <View style={{ paddingHorizontal: spacing[4], gap: spacing[8] }}>
      <DetailPageSkeleton heroHeight={0} sections={1} />
      <CardGridSkeleton columns={2} cards={8} cardMinHeight={114} />
    </View>
  );
}

export function AdminDashboardContent() {
  const router = useRouter();
  const navigation = useNavigation();
  const t = useTranslations('admin.dashboard');
  const { tenantName } = useLocalizedBrandText();
  const { session } = useSession();
  const [summary, setSummary] = useState<TenantSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let active = true;
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);

    adminService
      .loadTenantSummary()
      .then((result) => {
        if (!active) return;
        setSummary(result);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : t('errors.loadFailed'));
      })
      .finally(() => {
        if (!active) return;
        hasLoadedRef.current = true;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const managementItems = [
    { key: 'donations', title: t('cards.donation'), subtitle: t('cards.donation.subtitle'), icon: 'volunteer-activism' as const, onPress: () => router.push('/admin/manage-donations' as never) },
    { key: 'events', title: t('cards.event'), subtitle: t('cards.event.subtitle'), icon: 'calendar-today' as const, onPress: () => router.push('/admin/manage-events' as never) },
    { key: 'registration', title: t('cards.kyc'), subtitle: t('cards.kyc.subtitle'), icon: 'verified' as const, highlight: true, onPress: () => router.push('/admin/kyc-approvals' as never) },
    { key: 'profile-requests', title: t('cards.profileRequests'), subtitle: t('cards.profileRequests.subtitle'), icon: 'manage-accounts' as const, onPress: () => router.push('/admin/profile-requests' as never) },
    { key: 'matrimony-profiles', title: t('cards.matrimony'), subtitle: t('cards.matrimony.subtitle'), icon: 'favorite' as const, onPress: () => router.push('/admin/matrimony-profiles' as never) },
    { key: 'invoices', title: t('cards.expense'), subtitle: t('cards.expense.subtitle'), icon: 'receipt-long' as const, onPress: () => router.push('/admin/invoices' as never) },
    { key: 'invoices', title: t('cards.myExpenses'), subtitle: t('cards.myExpenses.subtitle'), icon: 'list-alt' as const, onPress: () => router.push('/admin/my-expenses' as never) },
    { key: 'clients', title: t('cards.users'), subtitle: t('cards.users.subtitle'), icon: 'person' as const, onPress: () => router.push('/admin/users' as never) },
    { key: 'family-registry', title: t('cards.familyRegistry'), subtitle: t('cards.familyRegistry.subtitle'), icon: 'family-restroom' as const, onPress: () => router.push('/admin/family-registry' as never) },
    { key: 'publications', title: t('cards.publication'), subtitle: t('cards.publication.subtitle'), icon: 'newspaper' as const, onPress: () => router.push('/publications/archive' as never) },
    { key: 'advertisements', title: t('cards.advertisements'), subtitle: t('cards.advertisements.subtitle'), icon: 'campaign' as const, onPress: () => router.push('/admin/advertisements' as never) },
    { key: 'notifications', title: t('cards.notifications'), subtitle: t('cards.notifications.subtitle'), icon: 'notifications' as const, onPress: () => router.push('/admin/notifications' as never) },
    { key: 'notifications', title: t('cards.birthdays'), subtitle: t('cards.birthdays.subtitle'), icon: 'cake' as const, onPress: () => router.push('/admin/birthday-reminders' as never) },
    { key: 'marksheet-reports', title: t('cards.marksheets'), subtitle: t('cards.marksheets.subtitle'), icon: 'school' as const, onPress: () => router.push('/admin/marksheet-reports' as never) },
    { key: 'roles', title: t('cards.roles'), subtitle: t('cards.roles.subtitle'), icon: 'person-pin' as const, onPress: () => router.push('/admin/roles' as never) },
    { key: 'roles', title: t('cards.permissions'), subtitle: t('cards.permissions.subtitle'), icon: 'lock-open' as const, onPress: () => router.push('/admin/permissions' as never) },
    { key: 'chats', title: t('cards.chats'), subtitle: t('cards.chats.subtitle'), icon: 'forum' as const, onPress: () => router.push('/admin/community-chats' as never) },
    { key: 'analytics', title: t('cards.analytics'), subtitle: t('cards.analytics.subtitle'), icon: 'trending-up' as const, onPress: () => router.push('/admin/analytics' as never) },
  ].filter((item) => {
    if (Platform.OS === 'ios' && item.key === 'donations') {
      return false;
    }

    return canAccessAdminNavKey(item.key, session);
  });

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AdminDashboardTopBar
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing[4], flexGrow: 1 }}>
        {isLoading ? (
          <AdminDashboardSkeleton />
        ) : (
        <View style={{ paddingHorizontal: spacing[4], gap: spacing[8] }}>
          <View style={{ gap: spacing[6] }}>
            <AdminDashboardHero
              title={tenantName || summary?.tenant.name || t('title.hero')}
            />
            {error && !isLoading ? (
              <Card variant="elevated" padding="lg">
                <Text variant="body" color={colors.text.muted}>
                  {error}
                </Text>
              </Card>
            ) : null}
          </View>

          <View style={{ gap: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('section.management')}
              </Text>
              <View style={{ height: 1, flex: 1, marginLeft: spacing[4], backgroundColor: colors.border.muted }} />
            </View>
            <AdminDashboardManagementGrid
              items={managementItems}
              onItemPress={(item) => item.onPress?.()}
            />
          </View>
        </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}
