import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppHeader, Button, Dialog, StickySummaryActionBar, Text, TextField, type DialogVariant } from '@/src/components';
import { SkeletonBlock, SkeletonCard } from '@/src/components/ui/skeleton';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, spacing } from '@/src/theme';
import { EventDetailBody, EventFloatingAction } from './event-shared-blocks';
import { eventService, type EventPassRecord, type EventRecord, type EventReviewRecord } from '../services/event-service';
import { buildEventSharePayload } from '../services/event-share';

type SecondaryAddOn = {
  key: string;
  title: string;
  subtitle: string;
  selected: boolean;
  quantity: number;
};

function normalizeCoordinate(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function EventGalleryDetailSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
      <SkeletonBlock width="100%" height={220} radiusSize={0} />
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <SkeletonBlock width="35%" height={20} radiusSize={999} />
        <SkeletonBlock width="75%" height={36} radiusSize={8} />
        <SkeletonBlock width="50%" height={16} radiusSize={999} />
      </View>
      <View style={{ paddingHorizontal: spacing[4], gap: spacing[3] }}>
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </View>
      <View style={{ padding: spacing[4], gap: spacing[2] }}>
        <SkeletonBlock width="30%" height={20} radiusSize={8} />
        <SkeletonCard lines={4} />
      </View>
      <View style={{ marginHorizontal: spacing[4], marginBottom: spacing[8], borderRadius: 20, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: spacing[1] }}>
            <SkeletonBlock width={120} height={24} radiusSize={8} />
            <SkeletonBlock width={92} height={12} radiusSize={8} />
          </View>
          <SkeletonBlock width={52} height={18} radiusSize={8} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonBlock key={index} width={28} height={28} radiusSize={14} />
          ))}
        </View>
        <SkeletonBlock width="100%" height={96} radiusSize={12} />
        <SkeletonBlock width="100%" height={48} radiusSize={24} />
      </View>
    </ScrollView>
  );
}

export function EventGalleryDetailContent() {
  const router = useRouter();
  const { session } = useSession();
  const t = useTranslations('events.event-gallery-detail');
  const { language } = useAppPreferences();
  const params = useLocalSearchParams<{ eventId?: string | string[]; returnTo?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [registeredPass, setRegisteredPass] = useState<EventPassRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addOns, setAddOns] = useState<SecondaryAddOn[]>([]);
  const [reviews, setReviews] = useState<EventReviewRecord[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({ visible: false, variant: 'info', title: '' });

  const totalAmount = useMemo(
    () => {
      if (registeredPass) {
        return Number(registeredPass.amountPaid || 0);
      }

      return Number(event?.fee || 0) + addOns.reduce((sum, item) => {
        if (!item.selected) {
          return sum;
        }
        const amount = Number(item.subtitle.replace(/[^\d]/g, '')) || 0;
        return sum + amount * item.quantity;
      }, 0);
    },
    [addOns, event?.fee, registeredPass],
  );

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    async function loadEvent() {
      const resolvedEventId = eventId || (await eventService.loadEventOverview()).eventId;
      if (!resolvedEventId) {
        return null;
      }

      const [eventRecord, reviewRecords, myPasses] = await Promise.all([
        eventService.loadEvent(resolvedEventId),
        eventService.loadEventReviews(resolvedEventId),
        eventService.loadMyEventPasses(),
      ]);

      return { eventRecord, reviewRecords, myPasses };
    }

    loadEvent()
      .then((result) => {
        if (!active) return;
        const record = result?.eventRecord || null;
        const currentPass = record ? result?.myPasses?.find((item) => item.eventId === record.id) || null : null;
        setEvent(record);
        setRegisteredPass(currentPass);
        setReviews(result?.reviewRecords || []);
        if (record?.addOns?.length) {
          const selectedByTitle = new Map(
            String(currentPass?.addOns || '')
              .split(',')
              .map((part) => part.trim())
              .filter(Boolean)
              .map((part) => {
                const match = part.match(/^(.*?)\s*x\s*(\d+)$/i);
                const title = (match ? match[1] : part).trim().toLowerCase();
                const quantity = match ? Number.parseInt(match[2], 10) : 1;
                return [title, Number.isFinite(quantity) && quantity > 0 ? quantity : 1] as const;
              }),
          );
          setAddOns(
            record.addOns.map((item) => ({
              key: item.id,
              title: item.title,
              subtitle: `₹${Number(item.amount || 0).toLocaleString('en-IN')}`,
              selected: selectedByTitle.has(item.title.toLowerCase()),
              quantity: selectedByTitle.get(item.title.toLowerCase()) || 1,
            })),
          );
        } else {
          setAddOns([]);
        }
      })
      .catch(() => {
        if (active) {
          setEvent(null);
          setRegisteredPass(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  const updateAddOn = (key: string, updater: (current: SecondaryAddOn) => SecondaryAddOn) => {
    if (registeredPass) {
      return;
    }
    setAddOns((current) => current.map((item) => (item.key === key ? updater(item) : item)));
  };

  const formatDate = (value?: string | null) => {
    if (!value) return t('fallback.date');
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return t('fallback.date');
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
  };

  const formatTime = (value?: string | null) => {
    if (!value) return t('fallback.time');
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return t('fallback.time');
    return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(parsed);
  };

  const formatDateTimeRange = (start?: string | null, end?: string | null) => {
    if (!start) {
      return t('fallback.time');
    }

    const startLabel = `${formatDate(start)} • ${formatTime(start)}`;
    if (!end) {
      return startLabel;
    }

    return `${startLabel}\nEnds: ${formatDate(end)} • ${formatTime(end)}`;
  };

  const eventLocation = {
    latitude: normalizeCoordinate(event?.lat),
    longitude: normalizeCoordinate(event?.lng),
    label: event?.venueName || translateLocationText(event?.city || '', language) || t('fallback.locationLabel'),
    address: translateLocationText([event?.address, event?.city, event?.state, event?.pincode].filter(Boolean).join(', '), language) || t('fallback.locationAddress'),
  };
  const youtubeUrl = String(event?.youtubeUrl || '').trim();
  const hasYoutubeLiveStream = youtubeUrl.length > 0;
  const effectivePermissions = useMemo(
    () => Array.from(new Set([...(session?.user.permissions ?? []), ...(session?.user.communityPermissions ?? [])])),
    [session],
  );
  const canManageEventChat = useMemo(
    () =>
      ['admin', 'trustee'].includes(String(session?.user.role || '').toLowerCase()) ||
      effectivePermissions.includes('events.manage') ||
      effectivePermissions.includes('event.manage') ||
      effectivePermissions.includes('communication.manage') ||
      effectivePermissions.includes('chats.manage') ||
      effectivePermissions.includes('chat.manage'),
    [effectivePermissions, session],
  );
  const canAccessEventChat = Boolean(registeredPass || canManageEventChat);
  const shouldShowLiveAction = hasYoutubeLiveStream && canAccessEventChat;
  const canSubmitReview = Boolean(registeredPass);

  const handleShare = async () => {
    try {
      await Share.share(buildEventSharePayload(event, t('title')));
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('errors.shareTitle'),
        description: error instanceof Error ? error.message : t('errors.shareDescription'),
      });
    }
  };

  const handleSaveReview = async () => {
    if (!event) {
      return;
    }

    try {
      setIsSavingReview(true);
      const saved = await eventService.saveEventReview(event.id, {
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });
      setReviews((current) => [saved, ...current.filter((review) => review.id !== saved.id)]);
      setReviewComment('');
      setDialog({
        visible: true,
        variant: 'success',
        title: t('reviews.savedTitle'),
        description: t('reviews.savedDescription'),
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('reviews.failedTitle'),
        description: error instanceof Error ? error.message : t('reviews.failedDescription'),
      });
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleLiveActionPress = async () => {
    if (hasYoutubeLiveStream && canAccessEventChat) {
      router.push({
        pathname: '/events/event-live-chat',
        params: {
          eventId: event?.id || '',
          ...(returnTo ? { returnTo } : {}),
        },
      } as never);
    }
  };

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader title={t('title')} variant="back" rightIcon="share" onRightPress={handleShare} />
        {isLoading ? (
          <EventGalleryDetailSkeleton />
        ) : !event ? (
          <View style={{ padding: spacing[4] }}>
            <Text variant="body" color={colors.text.secondary}>{t('empty')}</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
            <EventDetailBody
              location={eventLocation}
              title={event.title}
              subtitle={event.venueName || translateLocationText(event.city || '', language) || undefined}
              dateTitle={formatDate(event.startAt)}
              dateSubtitle={formatDateTimeRange(event.startAt, event.endAt)}
              locationTitle={event.venueName || translateLocationText(event.city || '', language) || undefined}
              locationSubtitle={eventLocation.address}
              aboutDescription={event.description || undefined}
              addOns={addOns}
              onToggle={(key) => updateAddOn(key, (current) => ({ ...current, selected: !current.selected }))}
              onIncrement={(key) => updateAddOn(key, (current) => ({ ...current, quantity: current.quantity + 1, selected: true }))}
              onDecrement={(key) => updateAddOn(key, (current) => ({ ...current, quantity: Math.max(1, current.quantity - 1) }))}
            />

            {event.reviewEnabled ? (
              <View style={{ marginHorizontal: spacing[4], marginBottom: spacing[8], borderRadius: 20, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[4] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text variant="h4">{t('reviews.title')}</Text>
                    <Text variant="caption" color={colors.text.secondary}>
                      {reviews.length
                        ? t('reviews.count').replace('{count}', String(reviews.length))
                        : t('reviews.none')}
                    </Text>
                  </View>
                  <Text variant="body" color={colors.primary.DEFAULT}>
                    {(event.reviewSummary?.averageRating || 0).toFixed(1)} / 5
                  </Text>
                </View>
                {canSubmitReview ? (
                  <>
                    <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Pressable key={rating} accessibilityRole="button" onPress={() => setReviewRating(rating)}>
                          <MaterialIcons name={rating <= reviewRating ? 'star' : 'star-border'} size={28} color={colors.primary.DEFAULT} />
                        </Pressable>
                      ))}
                    </View>
                    <TextField
                      placeholder={t('reviews.placeholder')}
                      value={reviewComment}
                      onChangeText={setReviewComment}
                      variant="registration"
                      multiline
                      numberOfLines={3}
                    />
                    <Button fullWidth loading={isSavingReview} disabled={isSavingReview} onPress={() => void handleSaveReview()}>
                      {t('reviews.saveAction')}
                    </Button>
                  </>
                ) : null}
                {reviews.slice(0, 3).map((review) => (
                  <View key={review.id} style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: spacing[3], gap: spacing[1] }}>
                    <Text variant="body" style={{ fontWeight: '700' }}>{review.user?.name || t('reviews.memberFallback')} · {review.rating}/5</Text>
                    {review.comment ? <Text variant="body" color={colors.text.secondary}>{review.comment}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        )}

        {shouldShowLiveAction ? (
          <View style={{ position: 'absolute', right: spacing[4], bottom: 104 }}>
            <EventFloatingAction
              icon="play-circle-filled"
              label={t('actions.openLiveStream')}
              onPress={() => void handleLiveActionPress()}
            />
          </View>
        ) : null}

        {isLoading ? (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.background.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border.light,
              padding: spacing[4],
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
              <View style={{ gap: spacing[1], flex: 1 }}>
                <SkeletonBlock width={92} height={12} radiusSize={8} />
                <SkeletonBlock width={72} height={24} radiusSize={8} />
              </View>
              <SkeletonBlock width={144} height={48} radiusSize={24} />
            </View>
          </View>
        ) : (
          <StickySummaryActionBar
            label={t('labels.totalAmount')}
            value={`₹${totalAmount}`}
            buttonLabel={t('actions.viewPhotos')}
            buttonIcon={<MaterialIcons name="photo-library" size={18} color="#ffffff" />}
            onButtonPress={() =>
              router.push({
                pathname: '/events/event-photo-gallery',
                params: {
                  eventId: event?.id || '',
                  ...(returnTo ? { returnTo } : {}),
                },
              } as never)
            }
          />
        )}
        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => setDialog((current) => ({ ...current, visible: false }))}
          onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </SafeAreaViewNative>
  );
}
