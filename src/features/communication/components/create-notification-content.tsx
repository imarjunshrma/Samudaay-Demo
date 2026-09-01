import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FormikProvider } from 'formik';
import { useFocusEffect } from '@react-navigation/native';
import * as Yup from 'yup';

import { AppHeader, Button, Checkbox, Dialog, FileUpload, FormScreenLayout, SearchInput, SelectField, Text, TextField } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
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
  const [isLoadingAudience, setIsLoadingAudience] = useState(true);
  const [groupSearch, setGroupSearch] = useState('');
  const [availableGroups, setAvailableGroups] = useState<CommunityChatFeedItem[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
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
        setSelectedGroupIds([]);
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
    setSelectedGroupIds([]);
    setIsSending(false);
    setFeedbackDialog({
      visible: false,
      variant: 'success',
      title: '',
      description: '',
    });
  }, []);

  const loadAudience = useCallback(() => {
    let active = true;

    setIsLoadingAudience(true);
    void Promise.all([
      chatService.loadChatsPage({ context: 'communication', page: 1, limit: 100 }),
      directoryService.loadTrustees(),
      directoryService.loadFilterOptions({ userType: 'all' }),
      roleManagementService.loadCatalog().catch(() => null),
    ])
      .then(([groupsResult, trustees, filters, catalog]) => {
        if (!active) {
          return;
        }

        setAvailableGroups(
          groupsResult.items.filter((group) => {
            const type = String(group.type || '').toUpperCase();
            const status = String(group.status || '').toUpperCase();
            return type !== 'DIRECT' && status !== 'DISABLED';
          }),
        );
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

        setAvailableGroups([]);
        setTrusteeUserIds([]);
        setRoleOptions([]);
      })
      .finally(() => {
        if (active) {
          setIsLoadingAudience(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return loadAudience();
  }, [loadAudience]);

  useFocusEffect(
    useCallback(() => {
      const cleanupAudience = loadAudience();

      return () => {
        cleanupAudience();
        resetComposer();
      };
    }, [loadAudience, resetComposer]),
  );

  const filteredGroups = useMemo(() => {
    const query = groupSearch.trim().toLowerCase();
    if (!query) {
      return availableGroups;
    }

    return availableGroups.filter((group) => {
      const searchText = `${group.title} ${group.preview} ${group.status || ''}`.toLowerCase();
      return searchText.includes(query);
    });
  }, [availableGroups, groupSearch]);

  const selectedGroupUserIds = useMemo(() => {
    const ids = new Set<string>();
    availableGroups.forEach((group) => {
      if (!selectedGroupIds.includes(group.id)) {
        return;
      }

      (group.memberIds ?? []).forEach((userId) => {
        if (userId) {
          ids.add(userId);
        }
      });
    });
    return Array.from(ids);
  }, [availableGroups, selectedGroupIds]);

  function formatGroupMemberCount(count: number) {
    return `${count} ${count === 1 ? t('field.selectGroup.member') : t('field.selectGroup.members')}`;
  }

  function toggleGroup(groupId: string) {
    setSelectedGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((value) => value !== groupId)
        : [...current, groupId],
    );
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
                  <SearchInput
                    placeholder={t('field.searchGroup.placeholder')}
                    value={groupSearch}
                    onChangeText={setGroupSearch}
                  />
                  <View style={{ gap: spacing[2] }}>
                    {isLoadingAudience ? (
                      Array.from({ length: 3 }, (_, index) => (
                        <View
                          key={index}
                          style={{
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: colors.primary.borderLight,
                            backgroundColor: colors.background.surface,
                            paddingHorizontal: spacing[4],
                            paddingVertical: spacing[3],
                            gap: spacing[2],
                          }}>
                          <SkeletonBlock width={`${64 - index * 8}%`} height={16} radiusSize={radius.sm} />
                          <SkeletonBlock width="28%" height={12} radiusSize={radius.sm} />
                        </View>
                      ))
                    ) : filteredGroups.length ? (
                      filteredGroups.map((group) => {
                        const selected = selectedGroupIds.includes(group.id);
                        return (
                          <Pressable
                            key={group.id}
                            accessibilityRole="button"
                            onPress={() => toggleGroup(group.id)}
                            style={{
                              borderRadius: radius.lg,
                              borderWidth: 1,
                              borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
                              backgroundColor: selected ? colors.primary.subtle : colors.background.surface,
                              paddingHorizontal: spacing[4],
                              paddingVertical: spacing[3],
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: spacing[3],
                            }}>
                            <View style={{ flex: 1, gap: 2 }}>
                              <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                                {group.title}
                              </Text>
                              <Text variant="caption" color={colors.text.muted}>
                                {formatGroupMemberCount(group.memberCount ?? group.memberIds?.length ?? 0)}
                              </Text>
                            </View>
                            <MaterialIcons
                              name={selected ? 'check-circle' : 'radio-button-unchecked'}
                              size={20}
                              color={selected ? colors.primary.DEFAULT : colors.text.muted}
                            />
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text variant="caption" color={colors.text.muted}>
                        {groupSearch.trim() ? t('field.selectGroup.emptySearch') : t('field.selectGroup.empty')}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </FormikProvider>
      </FormScreenLayout>

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
