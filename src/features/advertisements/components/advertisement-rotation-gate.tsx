import { usePathname } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Text } from '@/src/components';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { promotionService, type PromotionRecord } from '@/src/features/admin/services/promotion-service';
import { storageService } from '@/src/services/storage.service';
import { apiConfig } from '@/src/constants';

const DEFAULT_INTERVAL_SECONDS = 300;
const DEFAULT_DURATION_SECONDS = 10;
const INITIAL_TRIGGER_DELAY_SECONDS = 8;
const ADVERTISEMENT_USER_COUNT_PREFIX = 'stitch-community-advertisement-user-count';
const MIN_SESSION_GAP_SECONDS = 120;
const MAX_SESSION_GAP_SECONDS = 600;

function isExcludedPath(pathname: string) {
  return (
    pathname.startsWith('/admin')
    || pathname.includes('payment')
    || pathname.includes('donation-management')
    || pathname.includes('event-registration')
    || pathname.includes('register')
    || pathname.includes('verification')
    || pathname.includes('registration-kyc')
    || pathname.includes('pending-approval')
  );
}

function getYoutubeThumbnail(url?: string | null) {
  const value = String(url || '').trim();
  if (!value) {
    return null;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/i,
    /[?&]v=([\w-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }

  return null;
}

function normalizeMediaUrl(url?: string | null) {
  const value = String(url || '').trim();
  if (!value) {
    return null;
  }

  if (/^(file:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (apiConfig.isConfigured && parsed.pathname.startsWith('/public/')) {
        const apiBase = new URL(apiConfig.baseUrl);
        return `${apiBase.origin}${parsed.pathname}${parsed.search || ''}${parsed.hash || ''}`;
      }
    } catch {
      return value;
    }
    return value;
  }

  return `${apiConfig.baseUrl}${value.startsWith('/') ? value : `/${value}`}`;
}

function getAdvertisementPreviewCandidates(ad?: PromotionRecord | null) {
  const directImage = normalizeMediaUrl(ad?.imageUrl);
  const videoImage = ad?.contentType === 'VIDEO' ? getYoutubeThumbnail(ad?.videoUrl) : null;

  return [directImage, videoImage].filter((value, index, items): value is string => Boolean(value) && items.indexOf(value) === index);
}

function getAdvertisementRankingScore(item: PromotionRecord, displayCounts: Record<string, number>) {
  const amountScore = Math.max(Number(item.amount || 0), 0);
  const priorityScore = Math.max(Number(item.priorityWeight || (item.pricingType === 'PAID' ? 2 : 1)), 1);
  const displayPenalty = displayCounts[item.id] || 0;
  const clickScore = Math.max(Number(item.clickCount || 0), 0);
  const impressionPenalty = Math.max(Number(item.impressionCount || 0), 0);
  const freshnessScore = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

  return (
    amountScore * 1000000
    + priorityScore * 10000
    + clickScore * 100
    + Math.floor(freshnessScore / 1000)
    - impressionPenalty
    - displayPenalty * 100000000
  );
}

function chooseNextAdvertisement(items: PromotionRecord[], displayCounts: Record<string, number>) {
  if (!items.length) {
    return null;
  }

  const unseen = items.filter((item) => !displayCounts[item.id]);
  const pool = unseen.length ? unseen : items;

  return pool
    .slice()
    .sort((left, right) => getAdvertisementRankingScore(right, displayCounts) - getAdvertisementRankingScore(left, displayCounts))[0] ?? null;
}

function getNextTriggerDelaySeconds(ad?: PromotionRecord | null) {
  const configured = Number(ad?.displayIntervalSeconds || DEFAULT_INTERVAL_SECONDS);
  const safeConfigured = Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_INTERVAL_SECONDS;
  return Math.min(MAX_SESSION_GAP_SECONDS, Math.max(MIN_SESSION_GAP_SECONDS, safeConfigured));
}

function getAdvertisementUserCountKey(adId: string, userId: string, tenantId: string) {
  return `${ADVERTISEMENT_USER_COUNT_PREFIX}.${tenantId}.${userId}.${adId}`;
}

export function AdvertisementRotationGate() {
  const pathname = usePathname();
  const { height: windowHeight } = useWindowDimensions();
  const { status, session } = useSession();
  const t = useTranslations();
  const [visible, setVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState<PromotionRecord | null>(null);
  const [skipVisible, setSkipVisible] = useState(false);
  const pendingTriggerRef = useRef(false);
  const displayCountsRef = useRef<Record<string, number>>({});
  const nextTriggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStatusRef = useRef(status);
  const externalLinkOpenRef = useRef(false);
  const [mediaCandidateIndex, setMediaCandidateIndex] = useState(0);

  const shouldRun = status === 'signedIn' && session?.user.role !== 'admin';
  const blocked = useMemo(() => isExcludedPath(pathname), [pathname]);
  const previewImageCandidates = useMemo(() => getAdvertisementPreviewCandidates(currentAd), [currentAd]);
  const previewImage = previewImageCandidates[mediaCandidateIndex] || null;
  const popupMaxHeight = Math.round(windowHeight * 0.8);
  const imageHeight = Math.round(popupMaxHeight * 0.66);
  const contentMaxHeight = Math.max(Math.round(popupMaxHeight - imageHeight), 160);

  const readStoredUserCount = async (adId: string) => {
    if (!session?.user.id || !session.user.tenantId) {
      return 0;
    }

    const stored = await storageService.getItem(
      getAdvertisementUserCountKey(adId, session.user.id, session.user.tenantId),
    );
    const count = Number(stored || 0);
    return Number.isFinite(count) && count > 0 ? count : 0;
  };

  const incrementStoredUserCount = async (adId: string) => {
    if (!session?.user.id || !session.user.tenantId) {
      return;
    }

    const key = getAdvertisementUserCountKey(adId, session.user.id, session.user.tenantId);
    const next = (await readStoredUserCount(adId)) + 1;
    await storageService.setItem(key, String(next));
  };

  const clearTimers = () => {
    if (nextTriggerTimerRef.current) {
      clearTimeout(nextTriggerTimerRef.current);
      nextTriggerTimerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
      skipTimerRef.current = null;
    }
  };

  const scheduleNextTrigger = (seconds = DEFAULT_INTERVAL_SECONDS) => {
    if (!shouldRun || externalLinkOpenRef.current) {
      return;
    }

    if (nextTriggerTimerRef.current) {
      clearTimeout(nextTriggerTimerRef.current);
    }

    nextTriggerTimerRef.current = setTimeout(() => {
      pendingTriggerRef.current = true;
      if (!blocked && !visible) {
        void triggerAdvertisement();
      }
    }, Math.max(seconds, 1) * 1000);
  };

  async function triggerAdvertisement() {
    if (!shouldRun) {
      return;
    }
    if (blocked || visible) {
      pendingTriggerRef.current = true;
      return;
    }

    if (externalLinkOpenRef.current) {
      pendingTriggerRef.current = true;
      return;
    }

    const items = await promotionService.loadActivePromotions();
    const eligibility = await Promise.all(
      items.map(async (item) => {
        const maxShowsPerUser = Number(item.maxAdsPerSession || 0);
        if (!maxShowsPerUser) {
          return item;
        }

        const localCount = await readStoredUserCount(item.id);
        return localCount < maxShowsPerUser ? item : null;
      }),
    );
    const eligible = eligibility.filter(Boolean) as PromotionRecord[];
    const nextAd = chooseNextAdvertisement(eligible, displayCountsRef.current);

    if (!nextAd) {
      pendingTriggerRef.current = false;
      scheduleNextTrigger(getNextTriggerDelaySeconds());
      return;
    }

    pendingTriggerRef.current = false;
    displayCountsRef.current[nextAd.id] = (displayCountsRef.current[nextAd.id] || 0) + 1;
    void incrementStoredUserCount(nextAd.id).catch(() => undefined);
    setCurrentAd(nextAd);
    setMediaCandidateIndex(0);
    setVisible(true);
    setSkipVisible(nextAd.skipEnabled === false ? false : Number(nextAd.skipAfterSeconds || 3) <= 0);
    clearTimers();

    void promotionService.recordImpression(nextAd.id).catch(() => undefined);

    if (nextAd.skipEnabled !== false && Number(nextAd.skipAfterSeconds || 3) > 0) {
      skipTimerRef.current = setTimeout(() => {
        setSkipVisible(true);
      }, Number(nextAd.skipAfterSeconds || 3) * 1000);
    }

    autoCloseTimerRef.current = setTimeout(() => {
      setVisible(false);
      setCurrentAd(null);
      scheduleNextTrigger(getNextTriggerDelaySeconds(nextAd));
    }, Number(nextAd.displayDurationSeconds || DEFAULT_DURATION_SECONDS) * 1000);
  }

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = status;

    if (!shouldRun) {
      clearTimers();
      setVisible(false);
      setCurrentAd(null);
      pendingTriggerRef.current = false;
      displayCountsRef.current = {};
      return;
    }

    if (previousStatus !== 'signedIn' && status === 'signedIn') {
      pendingTriggerRef.current = false;
      scheduleNextTrigger(INITIAL_TRIGGER_DELAY_SECONDS);
      return;
    }

    scheduleNextTrigger(getNextTriggerDelaySeconds());

    return () => {
      clearTimers();
    };
  }, [shouldRun, status]);

  useEffect(() => {
    if (!shouldRun) {
      return;
    }

    if (!blocked && pendingTriggerRef.current && !visible) {
      void triggerAdvertisement();
    }
  }, [blocked, shouldRun, visible]);

  const handleClose = () => {
    if (!currentAd) {
      setVisible(false);
      return;
    }

    clearTimers();
    setVisible(false);
    setCurrentAd(null);
    scheduleNextTrigger(getNextTriggerDelaySeconds(currentAd));
  };

  const handlePrimaryAction = async () => {
    if (!currentAd) {
      return;
    }

    const selectedAd = currentAd;
    const targetUrl = currentAd.redirectUrl || currentAd.videoUrl;
    if (!targetUrl) {
      handleClose();
      return;
    }

    void promotionService.recordClick(selectedAd.id).catch(() => undefined);
    externalLinkOpenRef.current = true;
    pendingTriggerRef.current = false;
    clearTimers();
    setVisible(false);
    setCurrentAd(null);
    try {
      await WebBrowser.openBrowserAsync(targetUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch {
      // Ignore browser failures; the ad has already been dismissed.
    } finally {
      externalLinkOpenRef.current = false;
      scheduleNextTrigger(getNextTriggerDelaySeconds(selectedAd));
    }
  };

  if (!visible || !currentAd) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.72)', justifyContent: 'center', padding: spacing[4] }}>
        <View style={{ maxHeight: popupMaxHeight, borderRadius: radius.xl, backgroundColor: colors.background.surface, overflow: 'hidden' }}>
          <View style={{ height: imageHeight, backgroundColor: colors.background.surfaceAlt, position: 'relative' }}>
            {previewImage ? (
              <Image
                source={{ uri: previewImage }}
                style={{ width: '100%', height: imageHeight }}
                resizeMode="cover"
                onError={() => {
                  setMediaCandidateIndex((current) => (
                    current + 1 < previewImageCandidates.length ? current + 1 : current
                  ));
                }}
              />
            ) : (
              <View style={{ height: imageHeight, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.subtle }}>
                <MaterialIcons name="campaign" size={48} color={colors.primary.DEFAULT} />
              </View>
            )}

            <View style={{ position: 'absolute', top: spacing[4], left: spacing[4], zIndex: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], borderRadius: radius.md, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                <MaterialIcons name="campaign" size={10} color={colors.text.inverse} />
                <Text variant="caption" color={colors.text.inverse} style={{ fontSize: 10, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t('advertisements.rotation.sponsored')}
                </Text>
              </View>
            </View>

            {skipVisible ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close advertisement"
                onPress={handleClose}
                style={{
                  position: 'absolute',
                  top: spacing[3],
                  right: spacing[3],
                  zIndex: 2,
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.28)',
                }}>
                <MaterialIcons name="close" size={18} color={colors.text.inverse} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: contentMaxHeight }}
            contentContainerStyle={{ padding: spacing[4], gap: spacing[3] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing[3] }}>
              <View style={{ flex: 1, gap: spacing[1] }}>
                <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {currentAd.title}
                </Text>
                <Text variant="caption" style={{ color: colors.primary.DEFAULT, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {String(currentAd.category || '').replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            {currentAd.description ? (
              <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
                {currentAd.description}
              </Text>
            ) : null}

            {currentAd.redirectUrl || currentAd.videoUrl ? (
              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Button fullWidth onPress={() => void handlePrimaryAction()}>
                    {currentAd.videoUrl ? t('advertisements.rotation.openVideo') : t('advertisements.rotation.learnMore')}
                  </Button>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
