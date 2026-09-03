import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Share, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Button, DetailPageSkeleton, Dialog, LocationMapPreview, Text, type DialogVariant } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { EventAddOnCard, EventMetaCard } from './event-shared-blocks';
import { eventService, type EventRecord } from '../services/event-service';
import { buildEventSharePayload } from '../services/event-share';

type RegistrationAddOn = {
  key: string;
  title: string;
  amount: number;
  quantity: number;
  selected: boolean;
};

function normalizeCoordinate(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

export function EventRegistrationContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('events.event-registration');
  const { language } = useAppPreferences();
  const { session } = useSession();
  const params = useLocalSearchParams<{ eventId?: string | string[]; returnTo?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const listFallbackRoute = isAdminLikeSession(session) ? '/admin/manage-events' : '/member/events';
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [addOns, setAddOns] = useState<RegistrationAddOn[]>([]);
  const [attendees, setAttendees] = useState(1);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
    action?: 'my-events' | null;
  }>({ visible: false, variant: 'info', title: '', action: null });

  const totalAmount = useMemo(
    () =>
      Number(event?.fee || 0) * attendees + addOns.reduce((sum, item) => {
        if (!item.selected) {
          return sum;
        }

        return sum + item.amount * item.quantity;
      }, 0),
    [addOns, attendees, event?.fee],
  );
  const hasPayableAmount = totalAmount > 0;
  const eventLatitude = normalizeCoordinate(event?.lat);
  const eventLongitude = normalizeCoordinate(event?.lng);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    async function loadEvent() {
      const resolvedEventId = eventId || (await eventService.loadEventOverview()).eventId;
      if (!resolvedEventId) {
        return null;
      }

      const [record, registrations] = await Promise.all([
        eventService.loadEvent(resolvedEventId),
        eventService.loadMyEvents(),
      ]);

      return {
        record,
        registered: registrations.some((registration) => registration.id === resolvedEventId),
      };
    }

    loadEvent()
      .then((result) => {
        if (!active) return;
        const record = result?.record ?? null;
        setEvent(record);
        setHasRegistered(Boolean(result?.registered));
        setAddOns(
          (record?.addOns || []).map((item) => ({
            key: item.id,
            title: item.title,
            amount: Number(item.amount || 0),
            quantity: 1,
            selected: false,
          })),
        );
      })
      .catch(() => {
        if (active) {
          setEvent(null);
          setHasRegistered(false);
          setAddOns([]);
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

  const updateAddOn = (key: string, updater: (current: RegistrationAddOn) => RegistrationAddOn) => {
    setAddOns((current) => current.map((item) => (item.key === key ? updater(item) : item)));
  };

  const formatDate = (value?: string | null) => {
    if (!value) return 'Date to be announced';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Date to be announced';
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
  };

  const formatTime = (value?: string | null) => {
    if (!value) return 'Time to be announced';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Time to be announced';
    return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(parsed);
  };

  const formatDateTimeRange = (start?: string | null, end?: string | null) => {
    if (!start) {
      return 'Time to be announced';
    }

    const startLabel = `${formatDate(start)} • ${formatTime(start)}`;
    if (!end) {
      return startLabel;
    }

    return `${startLabel}\nEnds: ${formatDate(end)} • ${formatTime(end)}`;
  };

  async function handleRegister() {
    if (!event) {
      setDialog({
        visible: true,
        variant: 'warning',
        title: 'Event unavailable',
        description: 'This event is not available for registration.',
        action: null,
      });
      return;
    }

    const selectedAddOns = addOns.filter((item) => item.selected);
    const addOnSummary = selectedAddOns.map((item) => `${item.title} x${item.quantity}`).join(', ');

    try {
      setIsSubmitting(true);
      if (hasPayableAmount) {
        const order = await eventService.createEventPaymentOrder(event.id, {
          attendees,
          addOn: addOnSummary || null,
          remarks: addOnSummary || null,
        });
        const payment = await eventService.openRazorpayCheckout(order);
        await eventService.verifyEventPayment(event.id, {
          remarks: addOnSummary || null,
          razorpay: payment,
        });
      } else {
        await eventService.registerForEvent(event.id, {
          attendees,
          addOn: addOnSummary || null,
          amountPaid: 0,
          remarks: addOnSummary || null,
        });
      }
      setHasRegistered(true);
      setDialog({
        visible: true,
        variant: 'success',
        title: 'Registration confirmed',
        description: 'Your event registration has been saved.',
        action: 'my-events',
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Unable to register for this event.',
        action: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleShare = async () => {
    try {
      await Share.share(buildEventSharePayload(event, t('meta.eventTitle')));
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Share failed',
        description: error instanceof Error ? error.message : 'Unable to share this event.',
        action: null,
      });
    }
  };

  const loadingView = (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
      <DetailPageSkeleton heroHeight={220} sections={3} />
    </ScrollView>
  );

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader title={t('title')} variant="back" rightIcon="share" onRightPress={handleShare} />

        {isLoading ? loadingView : <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
          {Number.isFinite(eventLatitude) && Number.isFinite(eventLongitude) ? (
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
              <LocationMapPreview
                latitude={eventLatitude}
                longitude={eventLongitude}
                label={event?.venueName || event?.title || t('meta.location')}
                address={translateLocationText([event?.address, event?.city, event?.state, event?.pincode].filter(Boolean).join(', '), language) || undefined}
                height={220}
                locationUrl={event?.locationUrl}
                googlePlaceId={event?.googlePlaceId}
              />
            </View>
          ) : null}
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <View
              style={{
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                padding: spacing[4],
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  borderRadius: radius.full,
                  backgroundColor: 'rgba(24,168,117,0.08)',
                  alignSelf: 'flex-start',
                  paddingHorizontal: spacing[3],
                  paddingVertical: 6,
                }}>
                <MaterialIcons name="location-on" size={16} color={colors.primary.DEFAULT} />
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                  {translateLocationText([event?.venueName, event?.city].filter(Boolean).join(', '), language) || t('meta.location')}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <View
              style={{
                alignSelf: 'flex-start',
                borderRadius: radius.full,
                backgroundColor: 'rgba(24,168,117,0.1)',
                paddingHorizontal: spacing[3],
                paddingVertical: 6,
                marginBottom: spacing[2],
              }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                {t('meta.communityEvent')}
              </Text>
            </View>
            <Text variant="h1" style={{ fontSize: 32, lineHeight: 38, fontFamily: typography.fontFamily.bold }}>
              {event?.title || t('meta.eventTitle')}
            </Text>
            <Text variant="body" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium }}>
              {t('meta.organizer')}
            </Text>
          </View>

          <View style={{ marginTop: spacing[6], gap: spacing[4], paddingHorizontal: spacing[4] }}>
            <EventMetaCard
              icon="calendar-today"
              title={formatDate(event?.startAt)}
              subtitle={formatDateTimeRange(event?.startAt, event?.endAt)}
            />
            <EventMetaCard
              icon="map"
              title={event?.venueName || t('event.venue')}
              subtitle={translateLocationText([event?.address, event?.city, event?.state, event?.pincode].filter(Boolean).join(', '), language) || t('event.address')}
            />
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[8] }}>
            <Text variant="h4" style={{ marginBottom: spacing[3], fontFamily: typography.fontFamily.bold }}>
              {t('sections.about')}
            </Text>
            <Text variant="body" color="#475569" style={{ lineHeight: 24 }}>
              {event?.description || t('sections.aboutDescription')}
            </Text>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}>
            <View style={{ borderRadius: 16, borderWidth: 1, borderColor: 'rgba(24,168,117,0.1)', backgroundColor: '#ffffff', padding: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>Attendees</Text>
                <Text variant="caption" color="#64748b">Select number of people</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Button variant="outline" size="sm" onPress={() => setAttendees((current) => Math.max(1, current - 1))}>-</Button>
                <Text variant="h4" style={{ minWidth: 24, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>{attendees}</Text>
                <Button variant="outline" size="sm" onPress={() => setAttendees((current) => Math.min(event?.maxAttendees || 999, current + 1))}>+</Button>
              </View>
            </View>
          </View>

          {addOns.length ? (
            <View
            style={{
              marginHorizontal: spacing[4],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(24,168,117,0.1)',
              backgroundColor: 'rgba(24,168,117,0.05)',
              padding: spacing[4],
              gap: spacing[4],
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <MaterialIcons name="add-circle" size={22} color={colors.primary.DEFAULT} />
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('sections.addOns')}
              </Text>
            </View>
            {addOns.map((item) => (
              <EventAddOnCard
                key={item.key}
                title={item.title}
                subtitle={`₹${item.amount.toLocaleString('en-IN')}`}
                quantity={item.quantity}
                selected={item.selected}
                onToggle={() => updateAddOn(item.key, (current) => ({ ...current, selected: !current.selected }))}
                onIncrement={() => updateAddOn(item.key, (current) => ({ ...current, quantity: current.quantity + 1, selected: true }))}
                onDecrement={() =>
                  updateAddOn(item.key, (current) => ({
                    ...current,
                    quantity: Math.max(1, current.quantity - 1),
                  }))
                }
              />
            ))}
            </View>
          ) : null}
        </ScrollView>}

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(24,168,117,0.1)',
            padding: spacing[4],
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
            {hasPayableAmount ? (
              <View>
                <Text
                  variant="caption"
                  color="#64748b"
                  style={{ fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Amount
                </Text>
                <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold }}>
                  ₹{totalAmount}
                </Text>
              </View>
            ) : <View />}
            <View style={{ flexShrink: 1 }}>
              <Button
                disabled={!event || isSubmitting || hasRegistered}
                loading={isSubmitting}
                onPress={handleRegister}
                rightIcon={<MaterialIcons name="chevron-right" size={18} color="#ffffff" />}>
                {hasRegistered ? t('actions.registered') : hasPayableAmount ? t('actions.payRegister') : t('actions.register')}
              </Button>
            </View>
          </View>
        </View>
        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => {
            const action = dialog.action;
            setDialog((current) => ({ ...current, visible: false }));
            if (action === 'my-events') {
              navigateBack(returnTo || listFallbackRoute);
            }
          }}
          onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </AppSafeAreaView>
  );
}
