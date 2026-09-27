import { useCallback, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, DetailPageSkeleton, ListRowSkeleton, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import {
  AdminAnalyticsAnnualSummaryCard,
  AdminAnalyticsEventCard,
  AdminAnalyticsHero,
  AdminAnalyticsMatrimonyCard,
  AdminAnalyticsPeopleCard,
  AdminAnalyticsTransactionCard,
  AdminAnalyticsTransactionsCard,
} from './admin-analytics-blocks';
import { analyticsService, type TenantAnalytics } from '@/src/features/finance/services';

function getRouteParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function buildAnalyticsReturnPath(returnTo?: string) {
  if (!returnTo) {
    return '/admin/analytics';
  }

  return `/admin/analytics?returnTo=${encodeURIComponent(returnTo)}`;
}

export function AdminAnalyticsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const t = useTranslations('admin.analytics');
  const returnTo = getRouteParamValue(params.returnTo);
  const analyticsReturnPath = buildAnalyticsReturnPath(returnTo);
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadAnalytics = useCallback(async () => {
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    try {
      const result = await analyticsService.loadTenantAnalytics();
      setAnalytics(result);
    } catch {
      setAnalytics(null);
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void loadAnalytics().finally(() => {
        if (!active) {
          return;
        }
      });

      return () => {
        active = false;
      };
    }, [loadAnalytics]),
  );

  const loadingView = (
    <View style={{ paddingHorizontal: spacing[4], gap: spacing[6], width: '100%', maxWidth: 448, alignSelf: 'center' }}>
      <DetailPageSkeleton heroHeight={0} sections={4} />
      <View style={{ gap: spacing[3] }}>
        {Array.from({ length: 6 }, (_, i) => (
          <ListRowSkeleton key={i} minHeight={76} />
        ))}
      </View>
    </View>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          subtitle={t('subtitle')}
          onLeftPress={navigateBack}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: spacing[4], paddingBottom: 80, flexGrow: 1 }}>
          {isLoading && !analytics ? loadingView : (
          <View style={{ paddingHorizontal: spacing[4], gap: spacing[6], width: '100%', maxWidth: 448, alignSelf: 'center' }}>
            <AdminAnalyticsHero analytics={analytics} />

            <View style={{ gap: spacing[4] }}>
              <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                Module Analytics
              </Text>
              <View style={{ gap: spacing[4] }}>
                <AdminAnalyticsPeopleCard analyticsReturnPath={analyticsReturnPath} />
                <AdminAnalyticsEventCard analytics={analytics} analyticsReturnPath={analyticsReturnPath} />
                <AdminAnalyticsTransactionCard analytics={analytics} analyticsReturnPath={analyticsReturnPath} />
                <AdminAnalyticsMatrimonyCard analyticsReturnPath={analyticsReturnPath} />
                <AdminAnalyticsTransactionsCard analytics={analytics} analyticsReturnPath={analyticsReturnPath} />
                <AdminAnalyticsAnnualSummaryCard analytics={analytics} analyticsReturnPath={analyticsReturnPath} />
              </View>
            </View>

            <View style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  Related Modules
                </Text>
                <View style={{ height: 1, flex: 1, marginLeft: spacing[4], backgroundColor: colors.border.muted }} />
              </View>
              {[
                { title: 'Contribution Analytics', subtitle: 'Welfare fund trends and contributor growth', icon: 'volunteer-activism', href: '/admin/donation-analytics' },
                { title: 'Registration Analytics', subtitle: 'KYC skip and yearly app payment settings', icon: 'app-registration', href: '/admin/registration-analytics' },
                { title: 'Publication Analytics', subtitle: 'Archive performance and generation activity', icon: 'newspaper', href: '/admin/publication-analytics' },
                { title: 'Advertisement Analytics', subtitle: 'Promotion visibility and reach', icon: 'campaign', href: '/admin/advertisement-analytics' },
                { title: 'Notification Analytics', subtitle: 'Broadcast delivery and engagement', icon: 'notifications', href: '/admin/notification-analytics' },
                { title: 'Role Analytics', subtitle: 'Access distribution and assignments', icon: 'person-pin', href: '/admin/role-analytics' },
                { title: 'Chat Analytics', subtitle: 'Community conversations and activity', icon: 'forum', href: '/admin/chat-analytics' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.title}
                  accessibilityRole="button"
                  activeOpacity={0.85}
                  onPress={() => router.push(item.href as never)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: spacing[4],
                  borderRadius: radius.xl,
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.lg,
                      backgroundColor: colors.primary.subtle,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={22} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                      {item.title}
                    </Text>
                    <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          )}
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
