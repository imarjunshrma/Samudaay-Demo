import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Dialog, ErrorState } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing } from '@/src/theme';
import { BirthdaySummaryCard } from './birthday-summary-card';
import { BirthdayTodayList } from './birthday-today-list';
import { BirthdayUpcomingList } from './birthday-upcoming-list';
import {
  BirthdayAdminMetricGrid,
  BirthdayAdminSection,
  BirthdayGreetingLogRow,
  BirthdayReminderControlCard,
  BirthdayTemplateManagementCard,
} from './birthday-admin-blocks';
import {
  birthdayAdminMetrics,
  birthdayReminderControls,
} from '../constants';
import { birthdayTemplateService, useBirthdayTemplates } from '../services/birthday-template-service';
import { useBirthdayFeed } from '../hooks/use-communication-feeds';
import { birthdayGreetingService } from '../services/birthday-greeting-service';
import { getBirthdayGreetingTimestamp } from '../services/birthday-greeting-log-utils';
import { birthdaySettingsService } from '../services/birthday-settings-service';
import type { BirthdayGreetingLog } from '../constants';

type BirthdayContentMode = 'user' | 'admin';
const GREETING_ACTIVITY_PREVIEW_COUNT = 5;

function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function BirthdayRemindersContent({
  mode = 'user',
}: {
  mode?: BirthdayContentMode;
}) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const t = useTranslations('communication.birthday-reminders');
  const adminMode = mode === 'admin';
  const templates = useBirthdayTemplates(adminMode);
  const birthdayFeed = useBirthdayFeed();
  const [controlState, setControlState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(birthdayReminderControls.map((control) => [control.key, control.enabled])),
  );
  const [recentGreetingLogs, setRecentGreetingLogs] = useState<BirthdayGreetingLog[]>([]);
  const [deliveredGreetingLogs, setDeliveredGreetingLogs] = useState<BirthdayGreetingLog[]>([]);
  const [greetingLogTotal, setGreetingLogTotal] = useState(0);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [cancelGreetingTarget, setCancelGreetingTarget] = useState<{ id: string; recipient: string } | null>(null);
  const [cancellingGreetingId, setCancellingGreetingId] = useState<string | null>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const handleToggleControl = (key: string, nextValue: boolean) => {
    setControlState((current) => {
      const nextState = { ...current, [key]: nextValue };
      birthdaySettingsService
        .update(Object.entries(nextState).map(([settingKey, enabled]) => ({ key: settingKey, enabled })))
        .catch(() => {
          return;
        });
      return nextState;
    });
  };

  useEffect(() => {
    if (!adminMode) {
      return;
    }

    let active = true;
    birthdaySettingsService
      .list()
      .then((settings) => {
        if (!active || !settings.length) {
          return;
        }

        setControlState((current) => ({
          ...current,
          ...Object.fromEntries(settings.map((setting) => [setting.key, setting.enabled])),
        }));
      })
      .catch(() => {
        return;
      });

    return () => {
      active = false;
    };
  }, [adminMode]);
  const metricValues: Record<string, string> = {
    today: String(birthdayFeed.todayItems.length),
    week: String(birthdayFeed.upcomingItems.length),
    sent: String(greetingLogTotal),
    templates: String(templates.length),
  };
  const localizedMetrics = birthdayAdminMetrics.map((metric) => ({
    ...metric,
    label: t(`admin.metrics.${metric.key}`),
    value: metricValues[metric.key] ?? metric.value,
  }));
  const localizedControls = birthdayReminderControls.map((control) => ({
    ...control,
    title: t(`admin.controls.${control.key}.title`),
    description: t(`admin.controls.${control.key}.description`),
  }));
  const localizedTemplates = templates.map((template) => ({
    ...template,
    category: t(`admin.templateCategories.${template.categoryKey}`),
  }));
  const todayDate = new Date();
  const wishedRecipientIds = session?.user.id
    ? Array.from(
        new Set(
          deliveredGreetingLogs
            .filter(
              (log) =>
                log.status === 'Delivered' &&
                Boolean(log.senderId) &&
                Boolean(log.recipientId) &&
                log.senderId === session.user.id &&
                isSameCalendarDay(new Date(getBirthdayGreetingTimestamp(log.sentAt)), todayDate),
            )
            .map((log) => log.recipientId as string),
        ),
      )
    : [];
  const scheduledRecipientIds = session?.user.id
    ? Array.from(
        new Set(
          deliveredGreetingLogs
            .filter(
              (log) =>
                log.status === 'Scheduled' &&
                Boolean(log.senderId) &&
                Boolean(log.recipientId) &&
                log.senderId === session.user.id,
            )
            .map((log) => log.recipientId as string),
        ),
      )
    : [];
  const scheduledGreetingIdsByRecipientId = session?.user.id
    ? Object.fromEntries(
        deliveredGreetingLogs
          .filter(
            (log) =>
              log.status === 'Scheduled' &&
              Boolean(log.id) &&
              Boolean(log.senderId) &&
              Boolean(log.recipientId) &&
              log.senderId === session.user.id,
          )
          .map((log) => [log.recipientId as string, log.id as string]),
      )
    : {};
  const templatePendingDelete = templateToDelete
    ? localizedTemplates.find((template) => template.id === templateToDelete) ?? null
    : null;

  useFocusEffect(
    useCallback(() => {
      setTemplateToDelete(null);
      setDeleteError('');
      let active = true;
      const greetingLimit = adminMode ? 100 : 50;
      if (!adminMode && !birthdayFeed.todayItems.length) {
        setRecentGreetingLogs([]);
        setDeliveredGreetingLogs([]);
        setGreetingLogTotal(0);
        return () => {
          active = false;
        };
      }

      birthdayGreetingService
        .listPaginated({ page: 1, limit: greetingLimit, sort: 'latest' })
        .then((greetingResult) => {
          if (!active) {
            return;
          }
          setRecentGreetingLogs(greetingResult.items.slice(0, GREETING_ACTIVITY_PREVIEW_COUNT));
          setGreetingLogTotal(greetingResult.pagination.total);
          setDeliveredGreetingLogs(greetingResult.items);
        })
        .catch(() => {
          if (!active) {
            return;
          }
          setRecentGreetingLogs([]);
          setDeliveredGreetingLogs([]);
          setGreetingLogTotal(0);
        });

      return () => {
        active = false;
      };
    }, [adminMode, birthdayFeed.todayItems.length]),
  );

  async function handleDeleteTemplate() {
    if (!templateToDelete) {
      return;
    }

    setIsDeletingTemplate(true);
    setDeleteError('');
    try {
      await birthdayTemplateService.remove(templateToDelete);
      setTemplateToDelete(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : t('admin.delete.error'));
    } finally {
      setIsDeletingTemplate(false);
    }
  }

  async function reloadGreetingLogs() {
    const greetingLimit = adminMode ? 100 : 50;
    const greetingResult = await birthdayGreetingService.listPaginated({ page: 1, limit: greetingLimit, sort: 'latest' });
    setRecentGreetingLogs(greetingResult.items.slice(0, GREETING_ACTIVITY_PREVIEW_COUNT));
    setGreetingLogTotal(greetingResult.pagination.total);
    setDeliveredGreetingLogs(greetingResult.items);
  }

  async function handleCancelScheduledGreeting() {
    if (!cancelGreetingTarget) {
      return;
    }

    setCancellingGreetingId(cancelGreetingTarget.id);
    try {
      await birthdayGreetingService.cancel(cancelGreetingTarget.id);
      setCancelGreetingTarget(null);
      await reloadGreetingLogs();
    } catch {
      return;
    } finally {
      setCancellingGreetingId(null);
    }
  }

  return (
    <>
      <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center' }}>
          <AppHeader
            title={adminMode ? t('admin.title') : t('title')}
            subtitle={adminMode ? t('admin.subtitle') : undefined}
            variant="back-inline"
            onLeftPress={() => navigateBack(adminMode ? '/admin/dashboard' : '/member/community')}
          />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 88 }}>
            {adminMode ? (
              <View style={{ padding: spacing[4], gap: spacing[6] }}>
              <BirthdayAdminSection title={t('admin.overview.title')} subtitle={t('admin.overview.subtitle')}>
                <BirthdayAdminMetricGrid items={localizedMetrics} />
              </BirthdayAdminSection>

              <BirthdayAdminSection
                title={t('admin.today.title')}
                subtitle={t('admin.today.subtitle')}
                actionLabel={t('admin.actions.sendBulk')}
                onActionPress={() =>
                  router.push({
                    pathname: '/admin/send-birthday-card',
                    params: { returnTo: '/admin/birthday-reminders' },
                  } as never)
                }>
                <BirthdayTodayList
                  onWishPress={(item) =>
                    router.push({
                      pathname: '/admin/send-birthday-card',
                      params: { recipientId: item.id, returnTo: '/admin/birthday-reminders' },
                    } as never)
                  }
                  compact
                  items={birthdayFeed.todayItems}
                  loading={birthdayFeed.isLoading}
                  wishedRecipientIds={wishedRecipientIds}
                  scheduledRecipientIds={scheduledRecipientIds}
                  scheduledGreetingIdsByRecipientId={scheduledGreetingIdsByRecipientId}
                  cancellingGreetingId={cancellingGreetingId}
                  onCancelScheduledPress={(greetingId, item) => setCancelGreetingTarget({ id: greetingId, recipient: item.name })}
                  currentUserId={session?.user.id ?? null}
                />
              </BirthdayAdminSection>

              <BirthdayAdminSection title={t('admin.settings.title')} subtitle={t('admin.settings.subtitle')}>
                <View style={{ gap: spacing[3] }}>
                  {localizedControls.map((control) => (
                    <BirthdayReminderControlCard
                      key={control.key}
                      item={control}
                      enabled={controlState[control.key] ?? control.enabled}
                      onToggle={handleToggleControl}
                    />
                  ))}
                </View>
              </BirthdayAdminSection>

              <BirthdayAdminSection
                title={t('admin.templates.title')}
                subtitle={t('admin.templates.subtitle')}>
                <View style={{ gap: spacing[3] }}>
                  {localizedTemplates.map((template) => (
                    <BirthdayTemplateManagementCard
                      key={template.id}
                      item={template}
                      onEditPress={(templateId) =>
                        router.push({
                          pathname: '/admin/birthday-card-editor',
                          params: { templateId, returnTo: '/admin/birthday-reminders' },
                        } as never)
                      }
                      onDeletePress={(templateId) => {
                        setDeleteError('');
                        setTemplateToDelete(templateId);
                      }}
                      activeLabel={t('admin.templateStatus.active')}
                      inactiveLabel={t('admin.templateStatus.inactive')}
                      editLabel={t('admin.actions.editTemplate')}
                      deleteLabel={t('admin.actions.deleteTemplate')}
                      sentLabel={t('admin.templateStatus.sent')}
                    />
                  ))}
                </View>
              </BirthdayAdminSection>

              <BirthdayAdminSection
                title={t('admin.activity.title')}
                subtitle={t('admin.activity.subtitle')}
                actionLabel={t('admin.actions.seeAll')}
                onActionPress={() =>
                  router.push({
                    pathname: '/admin/birthday-greeting-activity',
                    params: { returnTo: '/admin/birthday-reminders' },
                  } as never)
                }>
                <View
                  style={{
                    borderRadius: radius.xl,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.primary.borderLight,
                    paddingHorizontal: spacing[4],
                  }}>
                  {recentGreetingLogs.map((log, index) => (
                    <BirthdayGreetingLogRow
                      key={`${log.sender || 'system'}-${log.recipient}-${log.template}-${log.channel}-${log.sentAt}-${index}`}
                      item={log}
                      statusLabel={t(`admin.activity.status.${log.status}`)}
                    />
                  ))}
                </View>
              </BirthdayAdminSection>
              </View>
            ) : (
              <>
                <BirthdaySummaryCard todayCount={birthdayFeed.todayItems.length} loading={birthdayFeed.isLoading} />
                {birthdayFeed.errorMessage ? (
                  <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
                    <ErrorState
                      title={t('error.title')}
                      description={birthdayFeed.errorMessage}
                    />
                  </View>
                ) : (
                  <>
                    <BirthdayTodayList
                      onWishPress={(item) =>
                        router.push({
                          pathname: '/member/send-birthday-card',
                          params: { recipientId: item.id, returnTo: '/member/birthday-reminders' },
                        } as never)
                      }
                      items={birthdayFeed.todayItems}
                      loading={birthdayFeed.isLoading}
                      wishedRecipientIds={wishedRecipientIds}
                      scheduledRecipientIds={scheduledRecipientIds}
                      scheduledGreetingIdsByRecipientId={scheduledGreetingIdsByRecipientId}
                      cancellingGreetingId={cancellingGreetingId}
                      onCancelScheduledPress={(greetingId, item) => setCancelGreetingTarget({ id: greetingId, recipient: item.name })}
                      currentUserId={session?.user.id ?? null}
                    />
                    <BirthdayUpcomingList
                      items={birthdayFeed.upcomingItems}
                      loading={birthdayFeed.isLoading}
                    />
                  </>
                )}
              </>
            )}
          </ScrollView>
          {adminMode ? (
            <View pointerEvents="box-none" style={{ position: 'absolute', right: spacing[4], bottom: spacing[6] + insets.bottom, zIndex: 30 }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t('admin.actions.createTemplate')}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/admin/birthday-card-editor',
                    params: { mode: 'create', returnTo: '/admin/birthday-reminders' },
                  } as never)
                }
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.full,
                  backgroundColor: colors.primary.DEFAULT,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.18,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 8,
                }}>
                <MaterialIcons name="add" size={28} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </AppSafeAreaView>

      <Dialog
        visible={Boolean(templatePendingDelete)}
        variant="confirm"
        title={t('admin.delete.title')}
        description={
          deleteError ||
          (templatePendingDelete
            ? `${t('admin.delete.description')} ${templatePendingDelete.title}`
            : t('admin.delete.description'))
        }
        confirmLabel={t('admin.actions.deleteTemplate')}
        cancelLabel={t('actions.cancel')}
        onConfirm={() => { void handleDeleteTemplate(); }}
        onCancel={() => {
          if (isDeletingTemplate) {
            return;
          }
          setDeleteError('');
          setTemplateToDelete(null);
        }}
      />
      <Dialog
        visible={Boolean(cancelGreetingTarget)}
        variant="confirm"
        title={t('admin.activity.cancelTitle')}
        description={
          cancelGreetingTarget
            ? t('admin.activity.cancelDescription').replace('{recipient}', cancelGreetingTarget.recipient)
            : undefined
        }
        confirmLabel={t('admin.activity.cancelConfirm')}
        cancelLabel={t('admin.activity.cancelKeep')}
        onConfirm={() => { void handleCancelScheduledGreeting(); }}
        onCancel={() => {
          if (cancellingGreetingId) {
            return;
          }
          setCancelGreetingTarget(null);
        }}
      />
    </>
  );
}
