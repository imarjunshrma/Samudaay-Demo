import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormikProvider } from 'formik';
import { useFocusEffect } from '@react-navigation/native';
import * as Yup from 'yup';

import { AppHeader, Button, Checkbox, Dialog, FileUpload, FormScreenLayout, SearchInput, SelectField, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppForm } from '@/src/hooks/useForm';
import { useTranslations } from '@/src/i18n/use-translations';
import { isAllowedUploadImageFile } from '@/src/services/files/upload-file-policy';
import { colors, radius, spacing, typography } from '@/src/theme';
import { notificationCampaignService } from '../services/notification-campaign-service';
import { directoryService } from '@/src/features/directory/services/directory-service';
import { chatService, type CommunityChatFeedItem } from '../services/chat-service';
import type { FileValue } from '@/src/types';
import { audienceTargetOptions, getAudienceTargetOption, type AudienceTargetKey } from '../constants/audience-targets';
import { roleManagementService, type RoleCatalogItem } from '@/src/features/admin/services/role-management-service';

type RecipientKey = AudienceTargetKey;

type FeedbackDialog = {
  visible: boolean;
  variant: 'success' | 'error';
  title: string;
  description: string;
};

type CreateNotificationFormValues = {
  title: string;
  message: string;
  imageFile: FileValue | null;
};

const MAX_NOTIFICATION_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const createNotificationValidationSchema = Yup.object({
  title: Yup.string().trim().required('Notification title is required.'),
  message: Yup.string().trim().required('Message is required.'),
  imageFile: Yup.mixed<FileValue>()
    .nullable()
    .test('notification-image-format', 'Only PNG and JPEG image files are allowed.', (value) => {
      if (!value) {
        return true;
      }

      return isAllowedUploadImageFile(value);
    })
    .test('notification-image-size', 'Image must be 5MB or smaller.', (value) => {
      if (!value?.size) {
        return true;
      }

      return value.size <= MAX_NOTIFICATION_IMAGE_SIZE_BYTES;
    }),
});

export function CreateNotificationContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('communication.create-notification');
  const [recipient, setRecipient] = useState<RecipientKey>('all');
  const [isSending, setIsSending] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [availableGroups, setAvailableGroups] = useState<CommunityChatFeedItem[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<CommunityChatFeedItem[]>([]);
  const selectedGroupIds = selectedGroups.map((group) => group.id);
  const [showGroups, setShowGroups] = useState(false);
  const [groupsPage, setGroupsPage] = useState(1);
  const [groupsHasNext, setGroupsHasNext] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [groupsRetry, setGroupsRetry] = useState(0);
  const [trusteeUserIds, setTrusteeUserIds] = useState<string[]>([]);
  const [customRoleKey, setCustomRoleKey] = useState('');
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [feedbackDialog, setFeedbackDialog] = useState<FeedbackDialog>({
    visible: false,
    variant: 'success',
    title: '',
    description: '',
  });

  const form = useAppForm<CreateNotificationFormValues>({
    initialValues: {
      title: '',
      message: '',
      imageFile: null,
    },
    validationSchema: createNotificationValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (selectedGroupIds.length > 0 && selectedGroupUserIds.length === 0) {
        setFeedbackDialog({
          visible: true,
          variant: 'error',
          title: t('errors.invalidGroupTitle'),
          description: t('errors.invalidGroupDescription'),
        });
        return;
      }
      if (selectedGroupIds.length === 0 && recipient === 'custom' && !customRoleKey.trim()) {
        setFeedbackDialog({
          visible: true,
          variant: 'error',
          title: 'Role required',
          description: 'Select a custom role before sending this notification.',
        });
        return;
      }

      setIsSending(true);
      try {
        const uploadedImage = values.imageFile
          ? await notificationCampaignService.uploadCampaignImage(values.imageFile)
          : null;
        const selectedAudience = getAudienceTargetOption(recipient);
        const selectedRoles = selectedAudience.custom
          ? (customRoleKey.trim() ? [customRoleKey.trim()] : [])
          : (selectedAudience.roles ?? []);
        const audienceJson =
          selectedGroupUserIds.length > 0
            ? { userIds: selectedGroupUserIds }
            : recipient === 'trustee' && trusteeUserIds.length > 0
              ? { userIds: trusteeUserIds }
              : selectedAudience.allUsers
                ? { allUsers: true }
                : {
                    ...(selectedRoles.length ? { roles: selectedRoles } : {}),
                    ...(selectedAudience.audienceSegments?.length ? { audienceSegments: selectedAudience.audienceSegments } : {}),
                  };

        await notificationCampaignService.createCampaign({
          title: values.title.trim(),
          body: values.message.trim(),
          titleOverride: values.title.trim(),
          bodyOverride: values.message.trim(),
          audienceJson,
          dataJson: uploadedImage ? { image: uploadedImage } : undefined,
          dataOverrideJson: uploadedImage ? { image: uploadedImage } : undefined,
        });
        resetForm();
        setRecipient('all');
        setCustomRoleKey('');
        setGroupSearch('');
        setSelectedGroups([]);
        setFeedbackDialog({
          visible: true,
          variant: 'success',
          title: 'Notification Sent',
          description: 'Your notification has been queued for delivery to the selected recipients.',
        });
      } catch (error) {
        setFeedbackDialog({
          visible: true,
          variant: 'error',
          title: 'Failed to Send',
          description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setIsSending(false);
      }
    },
  });

  const resetComposer = useCallback(() => {
    setRecipient('all');
    setCustomRoleKey('');
    setGroupSearch('');
    setSelectedGroups([]);
    setIsSending(false);
    setShowGroups(false);
    setFeedbackDialog({
      visible: false,
      variant: 'success',
      title: '',
      description: '',
    });
  }, []);

  const loadAudience = useCallback(() => {
    let active = true;

    void Promise.all([
      directoryService.loadTrustees(),
      directoryService.loadFilterOptions({ userType: 'all' }),
      roleManagementService.loadCatalog().catch(() => null),
    ])
      .then(([trustees, filters, catalog]) => {
        if (!active) {
          return;
        }

        setTrusteeUserIds(
          Array.from(new Set(trustees.map((trustee) => trustee.id).filter(Boolean))),
        );
        const roleCatalog = new Map<string, RoleCatalogItem>((catalog?.roles ?? []).map((role) => [role.key, role]));
        setRoleOptions((filters.roles ?? []).map((role) => ({
          label: roleCatalog.get(role)?.name || role
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          value: role,
        })));
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setTrusteeUserIds([]);
        setRoleOptions([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const cleanupAudience = loadAudience();

      return () => {
        cleanupAudience();
        resetComposer();
      };
    }, [loadAudience, resetComposer]),
  );

  useEffect(() => {
    if (!showGroups) return;
    let active = true;
    setGroupsLoading(true);
    setGroupsError(null);
    const timer = setTimeout(() => {
      chatService.loadChatsPage({
        context: 'communication', page: groupsPage, limit: 20,
        search: groupSearch.trim(), notificationGroups: true, includeMemberIds: true,
      }).then((result) => {
        if (!active) return;
        setAvailableGroups((current) => groupsPage === 1 ? result.items : [
          ...current, ...result.items.filter((group) => !current.some((item) => item.id === group.id)),
        ]);
        setGroupsHasNext(Boolean(result.pagination?.hasNextPage));
      }).catch((error) => {
        if (active) setGroupsError(error instanceof Error ? error.message : 'Unable to load groups.');
      }).finally(() => {
        if (active) setGroupsLoading(false);
      });
    }, groupSearch.trim() ? 300 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [showGroups, groupsPage, groupSearch, groupsRetry]);

  const selectedGroupUserIds = useMemo(
    () => [...new Set(selectedGroups.flatMap((group) => group.memberIds ?? []).filter(Boolean))],
    [selectedGroups],
  );

  function formatGroupMemberCount(count: number) {
    return `${count} ${count === 1 ? t('field.selectGroup.member') : t('field.selectGroup.members')}`;
  }

  function toggleGroup(group: CommunityChatFeedItem) {
    setSelectedGroups((current) => current.some((item) => item.id === group.id)
      ? current.filter((item) => item.id !== group.id)
      : [...current, group]);
  }

  return (
    <>
      <FormScreenLayout
        header={<AppHeader title={t('title')} variant="back-inline" onLeftPress={navigateBack} />}
        footer={
          <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
            <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center' }}>
              <Button
                fullWidth
                loading={isSending}
                disabled={isSending}
                rightIcon={<MaterialIcons name="send" size={18} color="#ffffff" />}
                onPress={() => {
                  void form.submitForm();
                }}>
                {t('actions.send')}
              </Button>
              <Text
                variant="caption"
                color={colors.text.muted}
                style={{ textAlign: 'center', fontStyle: 'italic', marginTop: spacing[3] }}>
                {t('meta.note')}
              </Text>
            </View>
          </View>
        }>
        <FormikProvider value={form}>
          <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[5] }}>
              <View style={{ gap: spacing[4] }}>
                <TextField
                  name="title"
                  label={t('field.title')}
                  labelVariant="default"
                  placeholder={t('field.title.placeholder')}
                  variant="registration"
                  required
                />
                <TextField
                  name="message"
                  label={t('field.message')}
                  labelVariant="default"
                  placeholder={t('field.message.placeholder')}
                  multiline
                  numberOfLines={5}
                  variant="registration"
                  required
                />
                <FileUpload
                  label={t('field.upload')}
                  value={form.values.imageFile}
                  onChange={(nextValue) => {
                    form.setFieldTouched('imageFile', true, false);
                    void form.setFieldValue('imageFile', nextValue);
                  }}
                  helperText={t('field.upload.helper')}
                  emptyTitle={t('field.upload.emptyTitle')}
                  emptyDescription={t('field.upload.emptyDescription')}
                  documentTypes="image/*"
                  variant="compact"
                  error={form.touched.imageFile ? form.errors.imageFile : undefined}
                />
              </View>

              <View style={{ borderTopWidth: 1, borderTopColor: colors.primary.borderLight, paddingTop: spacing[4], gap: spacing[4] }}>
                <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('section.sendTo')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                  {audienceTargetOptions.map((option) => {
                    const active = recipient === option.key;
                    return (
                      <View
                        key={option.key}
                        style={{
                          width: '48%',
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                          backgroundColor: active ? colors.primary.subtle : colors.background.surface,
                          padding: spacing[4],
                        }}>
                        <Checkbox label={option.label} checked={active} onChange={() => setRecipient(option.key)} />
                      </View>
                    );
                  })}
                </View>
                {recipient === 'custom' ? (
                  <SelectField
                    label="Custom Role"
                    placeholder="Select role"
                    value={customRoleKey}
                    onSelect={setCustomRoleKey}
                    options={roleOptions}
                    variant="registration"
                  />
                ) : null}

                <View style={{ gap: spacing[2] }}>
                  <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('field.selectGroup')}
                  </Text>
                  <Button variant="outline" onPress={() => {
                    setAvailableGroups([]);
                    setGroupSearch('');
                    setGroupsPage(1);
                    setGroupsHasNext(false);
                    setGroupsError(null);
                    setGroupsLoading(true);
                    setShowGroups(true);
                  }} leftIcon={<MaterialIcons name="groups" size={20} color={colors.primary.DEFAULT} />}>
                    {selectedGroups.length ? `Selected groups (${selectedGroups.length})` : t('field.selectGroup')}
                  </Button>
                  {selectedGroups.map((group) => (
                    <Pressable key={group.id} accessibilityRole="button" accessibilityLabel={`Remove ${group.title}`}
                      onPress={() => toggleGroup(group)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingVertical: spacing[2] }}>
                      <Text style={{ flex: 1 }}>{group.title}</Text>
                      <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </FormikProvider>
      </FormScreenLayout>

      <Modal visible={showGroups} transparent animationType="fade" onRequestClose={() => setShowGroups(false)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing[4], backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ height: '70%', borderRadius: radius.lg, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
              <Text variant="h5" style={{ flex: 1 }}>{t('field.selectGroup')} ({selectedGroups.length})</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setShowGroups(false)}>
                <MaterialIcons name="close" size={24} color={colors.text.secondary} />
              </Pressable>
            </View>
            <SearchInput placeholder={t('field.searchGroup.placeholder')} value={groupSearch} onChangeText={(value) => {
              setGroupSearch(value);
              setAvailableGroups([]);
              setGroupsPage(1);
              setGroupsHasNext(false);
              setGroupsError(null);
              setGroupsLoading(true);
            }} />
            <FlatList
              style={{ flex: 1 }}
              data={availableGroups}
              extraData={selectedGroups}
              keyExtractor={(group) => group.id}
              keyboardShouldPersistTaps="handled"
              onEndReachedThreshold={0.4}
              onEndReached={() => {
                if (groupsHasNext && !groupsLoading && !groupsError) {
                  setGroupsLoading(true);
                  setGroupsPage((page) => page + 1);
                }
              }}
              contentContainerStyle={{ gap: spacing[2] }}
              ListEmptyComponent={!groupsLoading && !groupsError ? <Text variant="caption">{groupSearch.trim() ? t('field.selectGroup.emptySearch') : t('field.selectGroup.empty')}</Text> : null}
              ListFooterComponent={groupsLoading ? <ActivityIndicator style={{ padding: spacing[3] }} color={colors.primary.DEFAULT} /> : groupsError ? (
                <Pressable onPress={() => setGroupsRetry((value) => value + 1)}>
                  <Text color={colors.status.error}>{groupsError}</Text><Text color={colors.primary.DEFAULT}>Retry</Text>
                </Pressable>
              ) : null}
              renderItem={({ item: group }) => {
                const selected = selectedGroupIds.includes(group.id);
                return (
                  <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggleGroup(group)}
                    style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
                      backgroundColor: selected ? colors.primary.subtle : colors.background.surface, padding: spacing[3],
                      flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: typography.fontFamily.semibold }}>{group.title}</Text>
                      <Text variant="caption" color={colors.text.muted}>{formatGroupMemberCount(group.memberCount ?? 0)}</Text>
                    </View>
                    <MaterialIcons name={selected ? 'check-box' : 'check-box-outline-blank'} size={22} color={colors.primary.DEFAULT} />
                  </Pressable>
                );
              }}
            />
            <Button onPress={() => setShowGroups(false)}>Done</Button>
          </View>
        </View>
      </Modal>

      <Dialog
        visible={feedbackDialog.visible}
        variant={feedbackDialog.variant}
        title={feedbackDialog.title}
        description={feedbackDialog.description}
        confirmLabel={t('actions.ok')}
        onConfirm={() => {
          form.resetForm();
          resetComposer();
          if (feedbackDialog.variant === 'success') {
            navigateBack();
          }
        }}
      />
    </>
  );
}
