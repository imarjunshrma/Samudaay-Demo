import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';

import { colors, radius, spacing, typography } from '@/src/theme';

import { AdminAnalyticsCardShell } from './admin-analytics-card-shell';
import { matrimonyFeedService } from '@/src/features/matrimony/services/matrimony-feed-service';

export function AdminAnalyticsMatrimonyCard({ analyticsReturnPath = '/admin/analytics' }: { analyticsReturnPath?: string }) {
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      matrimonyFeedService
        .loadAnalytics()
        .then((analytics) => {
          if (active) {
            setPendingCount(analytics.metrics.pendingReviewProfiles ?? 0);
          }
        })
        .catch(() => {
          if (active) {
            setPendingCount(0);
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <AdminAnalyticsCardShell backgroundColor={colors.background.surface} borderColor={colors.primary.borderLight}>
      <View style={{ minHeight: 220, gap: spacing[4] }}>
        <View style={{ gap: spacing[3] }}>
          <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] }}>
            <MaterialIcons name="favorite" size={24} color={colors.text.inverse} />
          </View>
          <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, marginBottom: spacing[1] }}>
            Matrimony Analytics
          </Text>
          <Text variant="body" style={{ color: colors.text.secondary }}>
            Review pending profiles, approvals, and matrimony activity from the admin queue.
          </Text>
        </View>

        <View style={{ gap: spacing[3], paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
          <View style={{ alignSelf: 'flex-start', borderRadius: radius.lg, backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
            {pendingCount === null ? (
              <SkeletonBlock width={108} height={14} radiusSize={radius.sm} />
            ) : (
              <Text variant="caption" style={{ color: colors.primary.dark, fontFamily: typography.fontFamily.bold }}>
                {`${pendingCount} pending ${pendingCount === 1 ? 'review' : 'reviews'}`}
              </Text>
            )}
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                {
                  pathname: '/admin/matrimony-analytics',
                  params: { returnTo: analyticsReturnPath },
                } as never,
              )
            }
            style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
              View Collection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AdminAnalyticsCardShell>
  );
}
