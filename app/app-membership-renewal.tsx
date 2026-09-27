import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { AppHeader, Button, Text } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { getDefaultRouteForSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { appMembershipService, type AppMembershipAccess } from '@/src/features/registration/services/app-membership-service';
import { colors, radius, spacing, typography } from '@/src/theme';

function formatCurrency(value: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AppMembershipRenewalRoute() {
  const { session, appViewMode, refreshSession, updateSession } = useSession();
  const [membership, setMembership] = useState<AppMembershipAccess | null>(session?.user.appMembership ?? null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const amount = membership?.amount ?? session?.user.appMembership?.amount ?? 0;
  const currency = membership?.currency ?? session?.user.appMembership?.currency ?? 'INR';

  const loadMembership = useCallback(async () => {
    setLoading(true);
    try {
      const result = await appMembershipService.loadMe();
      setMembership(result);
    } catch {
      setMembership(session?.user.appMembership ?? null);
    } finally {
      setLoading(false);
    }
  }, [session?.user.appMembership]);

  useEffect(() => {
    void loadMembership();
  }, [loadMembership]);

  async function handlePay() {
    try {
      setPaying(true);
      const order = await appMembershipService.createPaymentOrder();
      const payment = await appMembershipService.openRazorpayCheckout(order);
      const result = await appMembershipService.verifyPayment({ razorpay: payment });
      setMembership(result);
      const nextSession = session
        ? {
            ...session,
            user: {
              ...session.user,
              communityMembershipStatus: 'ACTIVE' as const,
              appMembership: result,
            },
          }
        : null;
      try {
        await updateSession((current) => ({
          ...current,
          user: {
            ...current.user,
            communityMembershipStatus: 'ACTIVE',
            appMembership: result,
          },
        }));
        await refreshSession();
      } catch (sessionError) {
        console.warn('[app-membership] payment verified, but session refresh failed', sessionError);
      }
      Alert.alert('Payment completed', 'Your yearly membership has been renewed.', [
        {
          text: 'Continue',
          onPress: () => {
            if (nextSession) {
              router.replace(getDefaultRouteForSession(nextSession, appViewMode) as never);
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Payment failed', error instanceof Error ? error.message : 'Unable to complete payment.');
    } finally {
      setPaying(false);
    }
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title="Yearly Membership Renewal" variant="plain" />
      <ScrollView contentContainerStyle={{ padding: spacing[4], paddingBottom: 80 }}>
        <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center', gap: spacing[4] }}>
          <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[3] }}>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
              Renew to continue using the app
            </Text>
            <Text style={{ color: colors.text.secondary, lineHeight: 22 }}>
              Your community has enabled yearly membership renewal. Complete payment to keep app access active.
            </Text>
          </View>

          <View style={{ borderRadius: radius.xl, backgroundColor: colors.primary.subtle, borderWidth: 2, borderColor: colors.primary.DEFAULT, padding: spacing[4], gap: spacing[3] }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 13, textTransform: 'uppercase' }}>
              Amount to pay
            </Text>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 42, lineHeight: 48 }}>
              {formatCurrency(amount, currency)}
            </Text>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.primary.border, paddingTop: spacing[3], gap: spacing[1] }}>
              <Text style={{ color: colors.text.secondary }}>
                Grace ends: {formatDate(membership?.graceEndsAt ?? session?.user.appMembership?.graceEndsAt)}
              </Text>
              <Text style={{ color: colors.text.secondary }}>
                Current status: {membership?.status ?? session?.user.appMembership?.status ?? 'PAYMENT_PENDING'}
              </Text>
            </View>
          </View>

          <Button fullWidth loading={paying} disabled={paying || loading || amount <= 0} onPress={handlePay}>
            Pay {formatCurrency(amount, currency)}
          </Button>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
