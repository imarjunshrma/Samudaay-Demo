import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeader, Button, Text } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { matrimonyFeedService, type MatrimonyAccessRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';

type SubscriptionType = 'PROFILE_CREATION' | 'VIEWER_ONLY';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function parseRequestedType(value?: string | string[]): SubscriptionType | null {
  const resolved = Array.isArray(value) ? value[0] : value;
  if (resolved === 'VIEWER_ONLY' || resolved === 'PROFILE_CREATION') {
    return resolved;
  }
  return null;
}

export function MatrimonySubscriptionContent() {
  const params = useLocalSearchParams<{ type?: string | string[]; returnTo?: string | string[] }>();
  const navigateBack = useBackNavigation();
  const { language } = useAppPreferences();
  const t = useTranslations();
  const requestedType = parseRequestedType(params.type);
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<SubscriptionType>(requestedType || 'PROFILE_CREATION');
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const loadAccess = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await matrimonyFeedService.loadAccess();
      matrimonyScreenCache.access = result;
      setAccess(result);
      const availableTypes: SubscriptionType[] = [];
      if (String(result?.settings.browseMode || '').toUpperCase() === 'PAID') {
        availableTypes.push('VIEWER_ONLY');
      }
      if (
        String(result?.settings.browseMode || '').toUpperCase() === 'PAID' ||
        String(result?.settings.interactionMode || '').toUpperCase() === 'PAID'
      ) {
        availableTypes.push('PROFILE_CREATION');
      }

      if (requestedType && availableTypes.includes(requestedType)) {
        setSelectedType(requestedType);
      } else if (String(result?.settings.interactionMode || '').toUpperCase() === 'PAID' && availableTypes.includes('PROFILE_CREATION')) {
        setSelectedType('PROFILE_CREATION');
      } else if (availableTypes.length) {
        setSelectedType(availableTypes[0]);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('matrimony.subscription.errors.load'));
    } finally {
      setLoading(false);
    }
  }, [requestedType, t]);

  useFocusEffect(
    useCallback(() => {
      void loadAccess();
    }, [loadAccess]),
  );

  const plans = useMemo(() => {
    const items: {
      type: SubscriptionType;
      price: number;
    }[] = [];
    const browseMode = String(access?.settings.browseMode || '').toUpperCase();
    const interactionMode = String(access?.settings.interactionMode || '').toUpperCase();
    const viewerPrice = Number(access?.settings.viewerPrice || 0);
    const profilePrice = Number(access?.settings.profilePrice || 0);

    if (browseMode === 'PAID') {
      items.push({
        type: 'VIEWER_ONLY',
        price: viewerPrice,
      });
    }

    if (browseMode === 'PAID' || interactionMode === 'PAID') {
      items.push({
        type: 'PROFILE_CREATION',
        price: profilePrice,
      });
    }

    return items;
  }, [access]);

  const activeSubscription = access?.subscription;
  const selectedPlan = plans.find((plan) => plan.type === selectedType) || null;
  const selectedPlanAlreadyActive = Boolean(
    activeSubscription &&
      activeSubscription.status === 'ACTIVE' &&
      ((selectedType === 'VIEWER_ONLY' && ['VIEWER_ONLY', 'PROFILE_CREATION'].includes(activeSubscription.type)) ||
        (selectedType === 'PROFILE_CREATION' && activeSubscription.type === 'PROFILE_CREATION')),
  );
  const selectedPlanDescription = selectedType === 'VIEWER_ONLY'
    ? t('matrimony.subscription.plan.viewerDescription')
    : t('matrimony.subscription.plan.profileDescription');

  async function handlePurchase() {
    if (!selectedPlan) {
      setError(t('matrimony.subscription.errors.unavailable'));
      return;
    }

    try {
      setPurchasing(true);
      setError(null);
      const order = await matrimonyFeedService.createPaymentOrder({ type: selectedPlan.type });
      const payment = await matrimonyFeedService.openRazorpayCheckout(order);
      await matrimonyFeedService.verifyPayment({ razorpay: payment });
      matrimonyScreenCache.discoveryLoaded = false;
      matrimonyScreenCache.discoveryProfiles = [];
      matrimonyScreenCache.discoveryError = null;
      matrimonyScreenCache.requestsLoaded = false;
      matrimonyScreenCache.requests = [];
      matrimonyScreenCache.requestsError = null;
      await loadAccess();
      navigateBack(returnTo || '/member/matrimony');
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : t('matrimony.subscription.errors.purchase'));
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader title={t('matrimony.subscription.title')} variant="back" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 72, gap: spacing[4] }}>
          <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[2] }}>
            <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {t('matrimony.subscription.heroTitle')}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
              {t('matrimony.subscription.heroDescription')}
            </Text>
          </View>

          {loading ? (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <Text variant="body" style={{ color: colors.text.secondary }}>
                {t('matrimony.subscription.loading')}
              </Text>
            </View>
          ) : selectedPlan ? (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[5], gap: spacing[3], alignItems: 'center' }}>
              <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22, textAlign: 'center' }}>
                {selectedPlanDescription}
              </Text>
              <Text variant="h1" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {formatCurrency(selectedPlan.price)}
              </Text>
              <Text variant="caption" style={{ color: colors.text.muted, textAlign: 'center' }}>
                {t('matrimony.subscription.validity')}
              </Text>
            </View>
          ) : (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <Text variant="body" style={{ color: colors.text.secondary }}>
                {t('matrimony.subscription.noPlan')}
              </Text>
            </View>
          )}

          {activeSubscription ? (
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[1] }}>
              <Text variant="caption" style={{ color: colors.text.muted }}>
                {t('matrimony.subscription.current')}
              </Text>
              <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {activeSubscription.type === 'VIEWER_ONLY' ? t('matrimony.subscription.type.viewerOnly') : t('matrimony.subscription.type.profileCreation')}
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary }}>
                {t('matrimony.subscription.activeUntil', {
                  date: new Date(activeSubscription.endsAt).toLocaleDateString(language === 'gu' ? 'gu-IN' : 'en-IN'),
                })}
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.status.error, padding: spacing[3] }}>
              <Text variant="body" style={{ color: colors.status.error }}>
                {error}
              </Text>
            </View>
          ) : null}

          <Button
            fullWidth
            rounded
            disabled={loading || purchasing || !selectedPlan || selectedPlanAlreadyActive}
            loading={purchasing}
            onPress={handlePurchase}>
            {selectedPlanAlreadyActive ? t('matrimony.subscription.alreadyActive') : t('matrimony.subscription.purchase')}
          </Button>
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
