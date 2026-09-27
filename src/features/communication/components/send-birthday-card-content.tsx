import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { AppHeader, Button, Card, DateField, Dialog, FilterChips, SubmitBar, TemplateCard, Text, type DialogVariant } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { useNotifications } from '@/src/notifications';
import { colors, radius, spacing, typography } from '@/src/theme';
import { BirthdayMessageSection } from './birthday-message-section';
import { type BirthdayFeedItem, useBirthdayFeed } from '../hooks/use-communication-feeds';
import { birthdayGreetingService } from '../services/birthday-greeting-service';
import { getBirthdayGreetingTimestamp } from '../services/birthday-greeting-log-utils';
import { birthdayTemplateService, usePaginatedBirthdayTemplates } from '../services/birthday-template-service';

type BirthdayContentMode = 'user' | 'admin';
type RecipientScope = 'today' | 'week' | 'city';

function createDefaultScheduleDate() {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(9, 0, 0, 0);
  return nextDate;
}

function combineScheduleDateTime(dateValue: Date, timeValue: Date) {
  const combinedDate = new Date(dateValue);
  combinedDate.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
  return combinedDate;
}

function formatSchedulePreview(value: Date) {
  return value.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function SendBirthdayCardContent({
  mode = 'user',
}: {
  mode?: BirthdayContentMode;
}) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ templateId?: string; recipientId?: string; returnTo?: string | string[] }>();
  const t = useTranslations('communication.send-birthday-card');
  const { show } = useNotifications();
  const { session } = useSession();
  const { width: windowWidth } = useWindowDimensions();
  const { todayItems, upcomingItems } = useBirthdayFeed();
  const adminMode = mode === 'admin';
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const templateFeed = usePaginatedBirthdayTemplates({ includeInactive: adminMode, limit: adminMode ? 12 : 5 });
  const [recipientScope, setRecipientScope] = useState<RecipientScope>('today');
  const [submitting, setSubmitting] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
    navigateBackOnClose?: boolean;
  }>({ visible: false, variant: 'info', title: '', navigateBackOnClose: false });

  const visibleTemplates = templateFeed.templates;
  const requestedTemplateId = Array.isArray(params.templateId) ? params.templateId[0] : params.templateId;
  const requestedRecipientId = Array.isArray(params.recipientId) ? params.recipientId[0] : params.recipientId;
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(visibleTemplates[0]?.id);
  const selectedTemplate = visibleTemplates.find((template) => template.id === selectedTemplateId);
  const templatePendingDelete = templateToDelete ? visibleTemplates.find((template) => template.id === templateToDelete) ?? null : null;
  const allBirthdayItems = useMemo(() => [...todayItems, ...upcomingItems], [todayItems, upcomingItems]);
  const requestedRecipient = useMemo(
    () => (requestedRecipientId ? allBirthdayItems.find((item) => item.id === requestedRecipientId) : undefined),
    [allBirthdayItems, requestedRecipientId],
  );
  const targetedRecipientMode = Boolean(requestedRecipient);
  const [message, setMessage] = useState(selectedTemplate?.defaultMessage ?? '');
  const [scheduledDate, setScheduledDate] = useState<Date>(() => createDefaultScheduleDate());
  const [scheduledTime, setScheduledTime] = useState<Date>(() => createDefaultScheduleDate());

  const templateRailGap = spacing[3];
  const templateRailCardWidth = Math.min(Math.max(windowWidth * 0.34, 132), 164);
  const templateRailCardHeight = 176;
  const templatePreviewWidth = Math.min(windowWidth - spacing[12], 280);
  const templatePreviewHeight = Math.min(Math.max(templatePreviewWidth * 1.28, 220), 320);
  const templateSkeletonCount = 3;
  const submitBarInset = spacing[4];
  const scrollBottomPadding = submitBarInset + 88;

  useEffect(() => {
    if (!visibleTemplates.length) {
      setSelectedTemplateId(undefined);
      return;
    }

    const firstActiveTemplateId = visibleTemplates.find((template) => template.active)?.id;

    setSelectedTemplateId((current) =>
      current && visibleTemplates.some((template) => template.id === current)
        ? current
        : requestedTemplateId && visibleTemplates.some((template) => template.id === requestedTemplateId)
          ? requestedTemplateId
          : firstActiveTemplateId ?? visibleTemplates[0].id,
    );
  }, [requestedTemplateId, visibleTemplates]);

  useEffect(() => {
    setMessage(selectedTemplate?.defaultMessage ?? '');
  }, [selectedTemplate?.defaultMessage]);

  const cityReference = useMemo(
    () => requestedRecipient?.city ?? todayItems[0]?.city ?? allBirthdayItems[0]?.city ?? '',
    [allBirthdayItems, requestedRecipient?.city, todayItems],
  );

  const selectedRecipients = useMemo(() => {
    if (requestedRecipient) {
      return [requestedRecipient];
    }

    if (!adminMode) {
      if (todayItems[0]) {
        return [todayItems[0]];
      }

      return upcomingItems[0] ? [upcomingItems[0]] : [];
    }

    if (recipientScope === 'week') {
      return [...todayItems, ...upcomingItems];
    }

    if (recipientScope === 'city') {
      return cityReference ? allBirthdayItems.filter((item) => item.city === cityReference) : [];
    }

    return todayItems;
  }, [adminMode, allBirthdayItems, cityReference, recipientScope, requestedRecipient, todayItems, upcomingItems]);

  const recipientLabel = targetedRecipientMode
    ? selectedRecipients[0]?.name ?? ''
    : adminMode
      ? t('admin.recipients.summary').replace('{count}', String(selectedRecipients.length))
    : selectedRecipients[0]?.name ?? '';
  const canSubmit = Boolean(selectedTemplate?.active && message.trim() && selectedRecipients.length);
  const recipientSummary = selectedRecipients
    .slice(0, 3)
    .map((recipient) => recipient.name)
    .join(', ');
  const templateHeaderActionLabel = adminMode ? t('admin.actions.createTemplate') : t('templates.scrollMore');
  const scheduledDateTime = combineScheduleDateTime(scheduledDate, scheduledTime);
  const canSchedule = canSubmit && scheduledDateTime.getTime() > Date.now();
  const queueContextLabel = targetedRecipientMode
    ? selectedRecipients[0]?.name ?? t('admin.recipients.todayQueue')
    : recipientScope === 'city'
      ? t('admin.recipients.cityQueue').replace('{city}', cityReference || t('admin.recipients.cityFallback'))
      : recipientScope === 'week'
        ? t('admin.recipients.weekQueue')
        : t('admin.recipients.todayQueue');

  async function handleGreetingSubmit(status: 'Delivered' | 'Scheduled') {
    if (!selectedTemplate) {
      show('error', t('errors.noTemplateTitle'), t('errors.noTemplateDescription'));
      return;
    }

    if (!selectedRecipients.length) {
      show('error', t('errors.noRecipientsTitle'), t('errors.noRecipientsDescription'));
      return;
    }

    if (!selectedTemplate.active) {
      show('error', t('errors.noTemplateTitle'), t('errors.noTemplateDescription'));
      return;
    }

    if (!message.trim()) {
      show('error', t('errors.noMessageTitle'), t('errors.noMessageDescription'));
      return;
    }

    if (status === 'Scheduled' && scheduledDateTime.getTime() <= Date.now()) {
      show('error', t('errors.invalidScheduleTitle'), t('errors.invalidScheduleDescription'));
      return;
    }

    if (status === 'Delivered' && session?.user.id) {
      try {
        const deliveredLogs = await birthdayGreetingService.listPaginated({
          page: 1,
          limit: 250,
          status: 'Delivered',
          sort: 'latest',
        });
        const alreadyWishedRecipientIds = new Set(
          deliveredLogs.items
            .filter((log) => {
              if (!log.senderId || !log.recipientId || log.senderId !== session.user.id) {
                return false;
              }

              const sentAtTimestamp = getBirthdayGreetingTimestamp(log.sentAt);
              return sentAtTimestamp > 0 && isSameCalendarDay(new Date(sentAtTimestamp), new Date());
            })
            .map((log) => log.recipientId as string),
        );
        const remainingRecipients = selectedRecipients.filter((recipient) => !alreadyWishedRecipientIds.has(recipient.id));

        if (!remainingRecipients.length) {
          show('warning', t('errors.alreadyWishedTitle'), t('errors.alreadyWishedDescription'));
          navigateBack();
          return;
        }
      } catch {
        // Fall through to the normal send request if the duplicate-precheck cannot be loaded.
      }
    }

    try {
      setSubmitting(true);
      await birthdayGreetingService.add({
        recipient: selectedRecipients.length === 1 ? selectedRecipients[0].name : `${selectedRecipients.length} recipients`,
        template: selectedTemplate.title,
        templateId: selectedTemplate.id,
        message: message.trim(),
        recipientIds: selectedRecipients.map((recipient) => recipient.id),
        channel: status === 'Scheduled' ? 'Scheduled' : 'In-app',
        status,
        scheduledAt: status === 'Scheduled' ? scheduledDateTime.toISOString() : undefined,
      });

      setDialog({
        visible: true,
        variant: 'success',
        title: status === 'Scheduled' ? t('success.scheduledTitle') : t('success.sentTitle'),
        description:
          status === 'Scheduled'
            ? t('success.scheduledDescription').replace('{count}', String(selectedRecipients.length))
            : t('success.sentDescription').replace('{count}', String(selectedRecipients.length)),
        navigateBackOnClose: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.sendDescription');
      const alreadyWished = /already wished/i.test(errorMessage);
      setDialog({
        visible: true,
        variant: alreadyWished ? 'warning' : 'error',
        title: alreadyWished ? t('errors.alreadyWishedTitle') : t('errors.sendTitle'),
        description: errorMessage,
        navigateBackOnClose: false,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTemplate() {
    if (!templateToDelete) {
      return;
    }

    setIsDeletingTemplate(true);
    try {
      await birthdayTemplateService.remove(templateToDelete);
      setTemplateToDelete(null);
      setDialog({
        visible: true,
        variant: 'success',
        title: t('admin.delete.successTitle'),
        description: t('admin.delete.successDescription'),
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('admin.delete.errorTitle'),
        description: error instanceof Error ? error.message : t('admin.delete.error'),
      });
    } finally {
      setIsDeletingTemplate(false);
    }
  }

  function renderQueueItem(item: BirthdayFeedItem) {
    return (
      <View
        key={item.id}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.light,
          backgroundColor: colors.background.surface,
          padding: spacing[3],
        }}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            resizeMode="cover"
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              borderWidth: 2,
              borderColor: colors.primary.borderLight,
            }}
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              borderWidth: 2,
              borderColor: colors.primary.borderLight,
              backgroundColor: colors.primary.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {item.name}
          </Text>
          {item.meta ? (
            <Text variant="caption" color={colors.primary.DEFAULT}>
              {item.meta}
            </Text>
          ) : null}
          <Text variant="caption" color={colors.text.secondary}>
            {[item.date, item.city].filter(Boolean).join(' • ')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={adminMode ? t('admin.title') : t('title')}
          subtitle={adminMode ? t('admin.subtitle') : undefined}
          variant="back-inline"
          onLeftPress={() => navigateBack(returnTo || (adminMode ? '/admin/birthday-reminders' : '/member/birthday-reminders'))}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing[4],
            paddingTop: spacing[4],
            paddingBottom: scrollBottomPadding,
            gap: spacing[4],
          }}>
          {adminMode ? (
            <Card variant="elevated" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
              <View style={{ gap: spacing[3] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radius.full,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary.muted,
                    }}>
                    <MaterialIcons name="groups" size={18} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1, gap: spacing[1] }}>
                    <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('admin.recipients.title')}
                    </Text>
                    <Text variant="caption" color={colors.text.muted}>
                      {t('admin.recipients.helper').replace('{count}', String(selectedRecipients.length))}
                    </Text>
                  </View>
                </View>
                {targetedRecipientMode ? null : (
                  <FilterChips
                    items={[
                      { key: 'today', label: t('admin.recipients.today'), icon: 'cake' },
                      { key: 'week', label: t('admin.recipients.week'), icon: 'calendar-month' },
                      { key: 'city', label: t('admin.recipients.city'), icon: 'location-city' },
                    ]}
                    activeKey={recipientScope}
                    onPress={(key) => setRecipientScope(key as RecipientScope)}
                    scrollable
                    showIcons
                  />
                )}
                <View
                  style={{
                    borderRadius: radius.lg,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    padding: spacing[3],
                    gap: spacing[1],
                  }}>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                    {recipientLabel}
                  </Text>
                  <Text variant="caption" color={colors.text.secondary}>
                    {recipientSummary || t('errors.noRecipientsDescription')}
                  </Text>
                </View>
                <View style={{ gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                        {t('admin.recipients.queueTitle')}
                      </Text>
                      <Text variant="caption" color={colors.text.secondary}>
                        {queueContextLabel}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderRadius: radius.full,
                        backgroundColor: colors.primary.muted,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[1],
                      }}>
                      <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                        {selectedRecipients.length}
                      </Text>
                    </View>
                  </View>
                  {selectedRecipients.length ? (
                    <View style={{ gap: spacing[2] }}>
                      {selectedRecipients.map((item) => renderQueueItem(item))}
                    </View>
                  ) : (
                    <Card variant="muted" padding="md">
                      <Text variant="caption" color={colors.text.secondary}>
                        {t('errors.noRecipientsDescription')}
                      </Text>
                    </Card>
                  )}
                </View>
              </View>
            </Card>
          ) : null}

          <Card variant="elevated" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <View style={{ gap: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                <View style={{ flex: 1, gap: spacing[1] }}>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('templates.title')}
                  </Text>
                  <Text variant="caption" color={colors.text.muted}>
                    {templateHeaderActionLabel}
                  </Text>
                </View>
                {adminMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<MaterialIcons name="add" size={16} color={colors.primary.DEFAULT} />}
                    onPress={() =>
                      router.push({
                        pathname: '/admin/birthday-card-editor',
                        params: { mode: 'create', returnTo: '/admin/send-birthday-card' },
                      } as never)
                    }>
                    {t('admin.actions.createTemplate')}
                  </Button>
                ) : null}
              </View>

              {templateFeed.loadingInitial ? (
                <View style={{ gap: spacing[3] }}>
                  <View style={{ height: templatePreviewHeight, borderRadius: radius.xl, backgroundColor: colors.background.elevated }} />
                  <View style={{ flexDirection: 'row', gap: templateRailGap }}>
                    {Array.from({ length: templateSkeletonCount }, (_, index) => (
                      <View
                        key={`template-skeleton-${index}`}
                        style={{
                          width: templateRailCardWidth,
                          height: templateRailCardHeight,
                          borderRadius: radius.lg,
                          backgroundColor: colors.background.elevated,
                        }}
                      />
                    ))}
                  </View>
                </View>
              ) : visibleTemplates.length && selectedTemplate ? (
                <View style={{ gap: spacing[4] }}>
                  <View style={{ gap: spacing[3] }}>
                    <View style={{ alignItems: 'center' }}>
                      <TemplateCard
                        title={selectedTemplate.title}
                        image={selectedTemplate.image}
                        width={templatePreviewWidth}
                        height={templatePreviewHeight}
                        selected
                      />
                    </View>
                    <View
                      style={{
                        borderRadius: radius.lg,
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        padding: spacing[3],
                        gap: spacing[2],
                      }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                        {selectedTemplate.title}
                      </Text>
                      <Text variant="caption" color={colors.text.secondary}>
                        {selectedTemplate.category}
                      </Text>
                      {!selectedTemplate.active ? (
                        <Text variant="caption" color={colors.status.error}>
                          {t('errors.noTemplateDescription')}
                        </Text>
                      ) : null}
                    </View>
                    {adminMode ? (
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        <View style={{ flex: 1 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            leftIcon={<MaterialIcons name="edit" size={16} color={colors.primary.DEFAULT} />}
                            onPress={() =>
                              router.push({
                                pathname: '/admin/birthday-card-editor',
                                params: { templateId: selectedTemplate.id, returnTo: '/admin/send-birthday-card' },
                              } as never)
                            }>
                            {t('admin.actions.editTemplate')}
                          </Button>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            fullWidth
                            leftIcon={<MaterialIcons name="delete" size={16} color={colors.status.error} />}
                            onPress={() => setTemplateToDelete(selectedTemplate.id)}>
                            {t('admin.actions.deleteTemplate')}
                          </Button>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View style={{ gap: spacing[3] }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      decelerationRate="fast"
                      style={{ flexGrow: 0 }}
                      contentContainerStyle={{ alignItems: 'flex-start', paddingRight: spacing[1] }}>
                      {visibleTemplates.map((item, index) => (
                        <View
                          key={item.id}
                          style={{
                            width: templateRailCardWidth,
                            height: templateRailCardHeight,
                            marginRight: index === visibleTemplates.length - 1 ? 0 : templateRailGap,
                          }}>
                          <TemplateCard
                            title={item.title}
                            image={item.image}
                            selected={item.id === selectedTemplateId}
                            size="compact"
                            width={templateRailCardWidth}
                            height={templateRailCardHeight}
                            onPress={() => setSelectedTemplateId(item.id)}
                          />
                        </View>
                      ))}
                    </ScrollView>
                    {templateFeed.hasNextPage ? (
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={t('templates.loadMore')}
                        activeOpacity={0.85}
                        disabled={templateFeed.loadingMore}
                        onPress={templateFeed.loadMore}
                        style={{
                          alignSelf: 'center',
                          width: 42,
                          height: 42,
                          borderRadius: radius.full,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: colors.primary.muted,
                        }}>
                        <MaterialIcons name="keyboard-arrow-down" size={26} color={colors.primary.DEFAULT} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ) : (
                <Card variant="default" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
                  <View style={{ gap: spacing[2] }}>
                    <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('errors.noTemplateTitle')}
                    </Text>
                    <Text variant="caption" color={colors.text.muted}>
                      {t('errors.noTemplateDescription')}
                    </Text>
                  </View>
                </Card>
              )}
            </View>
          </Card>

          <Card variant="default" padding="none" style={{ overflow: 'hidden', borderColor: colors.primary.borderLight }}>
            <BirthdayMessageSection
              message={message}
              onMessageChange={setMessage}
              recipientLabel={recipientLabel}
            />
          </Card>

          <Card variant="default" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <View style={{ gap: spacing[3] }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('admin.schedule.title')}
              </Text>
              <View
                style={{
                  borderRadius: radius.lg,
                  backgroundColor: colors.background.DEFAULT,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  padding: spacing[3],
                  gap: spacing[3],
                }}>
                <Text variant="caption" color={colors.text.secondary}>
                  {t('admin.schedule.helper')}
                </Text>
                <View style={{ flexDirection: windowWidth < 390 ? 'column' : 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <DateField
                      label={t('admin.schedule.dateLabel')}
                      value={scheduledDate}
                      onChange={setScheduledDate}
                      minimumDate={new Date()}
                      variant="registration"
                      labelVariant="default"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <DateField
                      label={t('admin.schedule.timeLabel')}
                      value={scheduledTime}
                      onChange={setScheduledTime}
                      mode="time"
                      variant="registration"
                      labelVariant="default"
                    />
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: radius.lg,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.border.light,
                    padding: spacing[3],
                    gap: spacing[1],
                  }}>
                  <Text variant="caption" color={colors.text.muted}>
                    {t('admin.schedule.selectedLabel')}
                  </Text>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                    {formatSchedulePreview(scheduledDateTime)}
                  </Text>
                </View>
              </View>
              {adminMode ? (
                <>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('admin.delivery.title')}
                  </Text>
                  {[
                    [t('admin.delivery.inApp'), 'notifications-active'],
                    [t('admin.delivery.schedule'), 'schedule-send'],
                    [t('admin.delivery.rateLimit'), 'security'],
                  ].map(([label, icon]) => (
                    <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: radius.full,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: colors.primary.muted,
                        }}>
                        <MaterialIcons name={icon as ComponentProps<typeof MaterialIcons>['name']} size={17} color={colors.primary.DEFAULT} />
                      </View>
                      <Text variant="body" color={colors.text.secondary} style={{ flex: 1 }}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          </Card>
        </ScrollView>

        <View
          style={{
            padding: spacing[4],
            paddingBottom: submitBarInset,
            borderTopWidth: 1,
            borderTopColor: colors.primary.borderLight,
            backgroundColor: colors.background.DEFAULT,
          }}>
          <SubmitBar
            secondaryAction={{
              label: t('admin.actions.schedule'),
              variant: 'outline',
              disabled: !canSchedule || submitting,
              rightIcon: <MaterialIcons name="schedule-send" size={18} color={colors.primary.DEFAULT} />,
              onPress: () => handleGreetingSubmit('Scheduled'),
            }}
            primaryAction={{
              label: adminMode ? t('actions.saveAdmin') : t('actions.save'),
              disabled: !canSubmit || submitting,
              rightIcon: <MaterialIcons name="send" size={18} color={colors.text.inverse} />,
              onPress: () => handleGreetingSubmit('Delivered'),
            }}
          />
        </View>
      </View>

      <Dialog
        visible={Boolean(templatePendingDelete)}
        variant="confirm"
        title={t('admin.delete.title')}
        description={templatePendingDelete ? `${t('admin.delete.description')} ${templatePendingDelete.title}` : t('admin.delete.description')}
        confirmLabel={t('admin.actions.deleteTemplate')}
        cancelLabel={t('actions.cancel')}
        onConfirm={() => {
          void handleDeleteTemplate();
        }}
        onCancel={() => {
          if (isDeletingTemplate) {
            return;
          }
          setTemplateToDelete(null);
        }}
      />
      <Dialog
        visible={dialog.visible}
        variant={dialog.variant}
        title={dialog.title}
        description={dialog.description}
        onConfirm={() =>
          setDialog((current) => {
            if (current.navigateBackOnClose) {
              navigateBack();
            }
            return { ...current, visible: false, navigateBackOnClose: false };
          })
        }
        onCancel={() =>
          setDialog((current) => {
            if (current.navigateBackOnClose) {
              navigateBack();
            }
            return { ...current, visible: false, navigateBackOnClose: false };
          })
        }
      />
    </AppSafeAreaView>
  );
}
