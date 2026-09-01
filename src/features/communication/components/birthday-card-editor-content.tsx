import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Switch, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeader, Card, FileUpload, FilterChips, FormScreenLayout, SubmitBar, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { isAllowedUploadImageFile } from '@/src/services/files/upload-file-policy';
import { colors, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';
import { birthdayCardTemplates } from '../constants';
import { birthdayTemplateService, useBirthdayTemplates } from '../services/birthday-template-service';

const categoryOptions = [
  { key: 'traditional', translationKey: 'categories.traditional', icon: 'temple-hindu' },
  { key: 'modern', translationKey: 'categories.modern', icon: 'auto-awesome' },
  { key: 'religious', translationKey: 'categories.religious', icon: 'volunteer-activism' },
  { key: 'kids', translationKey: 'categories.kids', icon: 'child-care' },
] as const;

function isImageFile(file: FileValue) {
  return isAllowedUploadImageFile(file);
}

export function BirthdayCardEditorContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ mode?: string; templateId?: string; returnTo?: string }>();
  const t = useTranslations('communication.birthday-card-editor');
  const templates = useBirthdayTemplates();
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const editingTemplate = useMemo(
    () => {
      const templateId = Array.isArray(params.templateId) ? params.templateId[0] : params.templateId;
      return templates.find((template) => template.id === templateId) ?? null;
    },
    [params.templateId, templates],
  );
  const creating = params.mode === 'create' || !editingTemplate;
  const fallbackImage = birthdayCardTemplates[0].image;
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(fallbackImage);
  const [message, setMessage] = useState('');
  const [categoryKey, setCategoryKey] = useState<(typeof categoryOptions)[number]['key']>('traditional');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<FileValue | null>(null);
  const imageFileValue = useMemo<FileValue | null>(() => {
    if (!image.trim()) {
      return null;
    }

    return {
      uri: image,
      name: title.trim() ? `${title.trim()} image` : 'birthday-template-image',
      mimeType: 'image/jpeg',
    };
  }, [image, title]);

  useEffect(() => {
    if (!editingTemplate) {
      setTitle('');
      setImage(fallbackImage);
      setSelectedImageFile(null);
      setMessage(t('placeholders.message'));
      setCategoryKey('traditional');
      setActive(true);
      return;
    }

    setTitle(editingTemplate.title);
    setImage(editingTemplate.image);
    setSelectedImageFile(null);
    setMessage(editingTemplate.defaultMessage);
    setCategoryKey(editingTemplate.categoryKey as (typeof categoryOptions)[number]['key']);
    setActive(editingTemplate.active);
  }, [editingTemplate, fallbackImage, t]);

  const resetEditor = useCallback(() => {
    if (!editingTemplate) {
      setTitle('');
      setImage(fallbackImage);
      setSelectedImageFile(null);
      setMessage(t('placeholders.message'));
      setCategoryKey('traditional');
      setActive(true);
      setSaving(false);
      return;
    }

    setTitle(editingTemplate.title);
    setImage(editingTemplate.image);
    setSelectedImageFile(null);
    setMessage(editingTemplate.defaultMessage);
    setCategoryKey(editingTemplate.categoryKey as (typeof categoryOptions)[number]['key']);
    setActive(editingTemplate.active);
    setSaving(false);
  }, [editingTemplate, fallbackImage, t]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetEditor();
      };
    }, [resetEditor]),
  );

  const categoryLabel = t(categoryOptions.find((option) => option.key === categoryKey)?.translationKey ?? 'categories.traditional');

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedImage = image.trim();
    const trimmedMessage = message.trim();

    if (!trimmedTitle || !trimmedImage || !trimmedMessage) {
      Alert.alert(t('errors.requiredTitle'), t('errors.requiredDescription'));
      return;
    }

    try {
      setSaving(true);
      const uploadedImage = selectedImageFile
        ? await birthdayTemplateService.uploadImage(selectedImageFile)
        : trimmedImage;
      const savedTemplate = await birthdayTemplateService.upsert({
        id: editingTemplate?.id,
        title: trimmedTitle,
        categoryKey,
        category: categoryLabel,
        image: uploadedImage,
        defaultMessage: trimmedMessage,
        active,
        sentCount: editingTemplate?.sentCount,
      });

      if (returnTo === '/admin/send-birthday-card') {
        router.replace({ pathname: '/admin/send-birthday-card', params: { templateId: savedTemplate.id, returnTo } } as never);
        return;
      }

      if (returnTo === '/admin/birthday-reminders') {
        router.replace('/admin/birthday-reminders' as never);
        return;
      }

      navigateBack();
    } catch (error) {
      Alert.alert(t('errors.saveTitle'), error instanceof Error ? error.message : t('errors.saveDescription'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreenLayout
      header={<AppHeader title={creating ? t('title.create') : t('title')} variant="back-inline" onLeftPress={navigateBack} />}
      footer={
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <SubmitBar primaryAction={{ label: creating ? t('actions.create') : t('actions.save'), disabled: saving, onPress: handleSave }} />
        </View>
      }>
      <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4], gap: spacing[4] }}>
          <Card variant="elevated" padding="none" style={{ overflow: 'hidden', borderColor: colors.primary.borderLight }}>
            <Image
              source={{ uri: image || fallbackImage }}
              resizeMode="cover"
              style={{ width: '100%', height: 180, backgroundColor: colors.background.surfaceAlt }}
            />
            <View style={{ padding: spacing[4], gap: spacing[1] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {creating ? t('preview.create') : t('preview.edit')}
              </Text>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {title.trim() || t('placeholders.title')}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {categoryLabel}
              </Text>
            </View>
          </Card>
          <Card variant="default" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <View style={{ gap: spacing[3] }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('sections.templateSettings')}
              </Text>
              <FilterChips
                items={categoryOptions.map((option) => ({
                  key: option.key,
                  label: t(option.translationKey),
                  icon: option.icon,
                }))}
                activeKey={categoryKey}
                onPress={(key) => setCategoryKey(key as (typeof categoryOptions)[number]['key'])}
                scrollable
                showIcons
              />
              <Text variant="caption" color={colors.text.muted}>
                {t('sections.templateSettingsHelper')}
              </Text>
            </View>
          </Card>
          <FileUpload
            label={t('field.uploadImage')}
            value={imageFileValue}
            onChange={(file) => {
              if (file?.uri) {
                if (!isImageFile(file)) {
                  Alert.alert(t('errors.saveTitle'), t('field.uploadImageHelper'));
                  return;
                }

                setSelectedImageFile(file);
                setImage(file.uri);
                return;
              }

              setSelectedImageFile(null);
              setImage('');
            }}
            helperText={t('field.uploadImageHelper')}
            emptyTitle={t('field.uploadImageEmpty')}
            emptyDescription={t('field.uploadImageHelper')}
            variant="card"
          />
          <TextField label={t('field.title')} labelVariant="default" placeholder={t('placeholders.title')} value={title} onChangeText={setTitle} variant="registration" />
          <TextField
            label={t('field.message')}
            labelVariant="default"
            placeholder={t('placeholders.message')}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            variant="registration"
            useSystemFont
          />
          <Card variant="default" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <View style={{ flex: 1, gap: spacing[2] }}>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                  {t('field.activeStatus')}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {t('field.activeStatusHelper')}
                </Text>
              </View>
              <Switch
                value={active}
                onValueChange={setActive}
                trackColor={{ false: colors.border.DEFAULT, true: colors.primary.border }}
                thumbColor={active ? colors.primary.DEFAULT : colors.background.surface}
              />
            </View>
          </Card>
        </View>
      </View>
    </FormScreenLayout>
  );
}
