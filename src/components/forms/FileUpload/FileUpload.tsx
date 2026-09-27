import { useField } from 'formik';
import { Alert, Image, Pressable, View } from 'react-native';
import { useState } from 'react';

import { Icon, Text } from '@/src/components/ui';
import { pickDocumentWithGuard } from '@/src/services/device/document-picker-consent';
import { useCroppedImagePicker } from '@/src/services/device/use-cropped-image-picker';
import {
  ALLOWED_IMAGE_DOCUMENT_TYPES,
  ALLOWED_PROMOTION_DOCUMENT_TYPES,
  isAllowedPromotionUploadFile,
  isAllowedUploadFile,
  isAllowedUploadImageFile,
  showInvalidUploadFormatAlert,
} from '@/src/services/files/upload-file-policy';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

type FileUploadProps = {
  name?: string;
  label: string;
  value?: FileValue | null;
  onChange?: (value: FileValue | null) => void;
  onPreview?: (value: FileValue) => void;
  helperText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: string;
  multiple?: boolean;
  documentTypes?: string | string[];
  variant?: 'dashed' | 'card' | 'compact' | 'manualDonation' | 'marksheet';
  existingPreviewUri?: string | null;
  existingPreviewName?: string;
  imagePickerOptions?: {
    enabled?: boolean;
    aspect?: [number, number];
  };
};

type ImageSourceChoice = 'camera' | 'gallery';

function isImageFile(file?: FileValue | null) {
  return isAllowedUploadImageFile(file);
}

function formatFileSize(size?: number) {
  if (!size) {
    return null;
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function pickFile(multiple = false, documentTypes?: string | string[]) {
  const resolvedDocumentTypes = Array.isArray(documentTypes)
    ? documentTypes
    : documentTypes
      ? [documentTypes]
      : [...ALLOWED_IMAGE_DOCUMENT_TYPES];
  const result = await pickDocumentWithGuard({
    copyToCacheDirectory: true,
    multiple,
    type: resolvedDocumentTypes,
  });

  if (result.canceled) {
    return undefined;
  }

  const asset = result.assets[0];
  const nextFile = {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
  } satisfies FileValue;

  const allowsPromotionVideo = resolvedDocumentTypes.some((type) =>
    ALLOWED_PROMOTION_DOCUMENT_TYPES.includes(type as (typeof ALLOWED_PROMOTION_DOCUMENT_TYPES)[number]),
  );
  const isAllowed = allowsPromotionVideo
    ? isAllowedPromotionUploadFile(nextFile)
    : isAllowedUploadFile(nextFile, resolvedDocumentTypes);

  if (!isAllowed) {
    showInvalidUploadFormatAlert(
      allowsPromotionVideo
        ? 'Only PNG, JPEG, MP4, MOV, and WEBM files are allowed.'
        : 'Only PNG and JPEG image files are allowed.',
    );
    return undefined;
  }

  return nextFile;
}

function chooseImageSource() {
  return new Promise<ImageSourceChoice | null>((resolve) => {
    Alert.alert('Upload image', 'Choose how you want to add the image.', [
      { text: 'Take Photo', onPress: () => resolve('camera') },
      { text: 'Choose from Gallery', onPress: () => resolve('gallery') },
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}

function FileUploadBody({
  label,
  value,
  onChange,
  onPreview,
  helperText,
  emptyTitle,
  emptyDescription,
  error,
  multiple,
  documentTypes,
  variant = 'dashed',
  existingPreviewUri,
  existingPreviewName,
  imagePickerOptions,
}: FileUploadProps & { onChange: (value: FileValue | null) => void }) {
  const [localValue, setLocalValue] = useState<FileValue | null>(value ?? null);
  const { pickImage, captureImage, cropper } = useCroppedImagePicker();
  const resolvedValue = value === undefined ? localValue : value;
  const hasImagePreview = isImageFile(resolvedValue);
  const previewUri = resolvedValue?.uri ?? existingPreviewUri ?? null;
  const hasExistingPreview = !resolvedValue && Boolean(existingPreviewUri);
  const isManualDonation = variant === 'manualDonation';
  const isMarksheet = variant === 'marksheet';

  async function handlePick() {
    let nextFile: FileValue | undefined;
    if (imagePickerOptions?.enabled) {
      const source = await chooseImageSource();
      if (!source) {
        return;
      }
      nextFile = source === 'camera'
        ? await captureImage({ fileNamePrefix: 'image', aspect: imagePickerOptions.aspect }) ?? undefined
        : await pickImage({ fileNamePrefix: 'image', aspect: imagePickerOptions.aspect }) ?? undefined;
    } else {
      nextFile = await pickFile(multiple, documentTypes);
    }

    if (nextFile === undefined) {
      return;
    }
    if (value === undefined) {
      setLocalValue(nextFile);
    }
    onChange(nextFile);
  }

  function handleDelete() {
    if (value === undefined) {
      setLocalValue(null);
    }
    onChange(null);
  }

  return (
    <View style={{ gap: spacing[2] }}>
      <Text
        variant="caption"
        color={error ? colors.status.error : '#6b7280'}
        style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label}
      </Text>
      <Pressable
        onPress={handlePick}
        style={{
          borderRadius: isManualDonation || isMarksheet ? radius.xl : variant === 'compact' ? radius.lg : radius.xl,
          borderWidth: 1,
          borderStyle: variant === 'dashed' || isMarksheet ? 'dashed' : 'solid',
          borderColor: error
            ? colors.status.error
            : variant === 'card'
              ? colors.primary.borderLight
              : isManualDonation
                ? colors.primary.border
                : isMarksheet
                  ? '#d4c3be'
                : '#cbd5e1',
          backgroundColor: variant === 'card' ? colors.primary.subtle : isManualDonation ? '#fff7ed' : isMarksheet ? '#f1edea' : colors.background.surface,
          padding: isManualDonation || isMarksheet ? spacing[6] : variant === 'compact' ? spacing[3] : spacing[4],
          flexDirection: isManualDonation || isMarksheet ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isManualDonation || isMarksheet ? 'center' : undefined,
          gap: spacing[3],
        }}>
        <View
          style={{
            width: isManualDonation || isMarksheet ? 56 : 40,
            height: isManualDonation || isMarksheet ? 56 : 40,
            borderRadius: radius.full,
            backgroundColor: isManualDonation || isMarksheet ? '#ffffff' : colors.primary.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={isManualDonation || isMarksheet ? 'add-a-photo' : 'upload-file'}
            size={isManualDonation || isMarksheet ? 28 : 'md'}
            color={colors.primary.DEFAULT}
          />
        </View>
        <View style={{ flex: 1, gap: 2, alignItems: isManualDonation || isMarksheet ? 'center' : 'flex-start' }}>
          <Text
            variant="body"
            color={resolvedValue ? colors.text.primary : isManualDonation || isMarksheet ? colors.text.primary : '#64748b'}
            style={isManualDonation || isMarksheet ? { fontFamily: typography.fontFamily.bold } : undefined}>
            {resolvedValue?.name
              ?? existingPreviewName
              ?? (isManualDonation ? emptyTitle ?? 'Choose file' : isMarksheet ? emptyTitle ?? 'Upload Marksheet' : 'Choose file')}
          </Text>
          <Text variant="caption" color="#64748b" style={isManualDonation || isMarksheet ? { textAlign: 'center' } : undefined}>
            {resolvedValue
              ? formatFileSize(resolvedValue.size) ?? helperText ?? 'File selected'
              : hasExistingPreview
                ? helperText ?? 'Current file attached'
              : helperText ?? (isManualDonation || isMarksheet ? emptyDescription ?? 'Tap to browse your files' : 'Tap to browse your files')}
          </Text>
        </View>
      </Pressable>
      {resolvedValue || hasExistingPreview ? (
        <View
          style={{
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            backgroundColor: colors.background.surface,
            padding: spacing[3],
            gap: spacing[3],
          }}>
          {hasImagePreview || hasExistingPreview ? (
            <Image
              source={{ uri: previewUri ?? undefined }}
              style={{
                width: '100%',
                height: 176,
                borderRadius: radius.lg,
                backgroundColor: colors.background.surfaceAlt,
              }}
              resizeMode="cover"
            />
          ) : resolvedValue ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[3],
                borderRadius: radius.lg,
                backgroundColor: colors.primary.subtle,
                padding: spacing[3],
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.muted,
                }}>
                <Icon name="description" size="md" color={colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
                  {resolvedValue.name}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  {formatFileSize(resolvedValue.size) ?? 'Document selected'}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" color={colors.text.secondary}>
              {resolvedValue ? 'Preview ready' : 'Current file'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              {isMarksheet && onPreview ? (
                <Pressable
                  onPress={() => resolvedValue ? onPreview(resolvedValue) : undefined}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                  <Icon name="visibility" size="sm" color={colors.primary.DEFAULT} />
                  <Text variant="caption" color={colors.primary.DEFAULT}>
                    View
                  </Text>
                </Pressable>
              ) : null}
              {resolvedValue ? (
                <Pressable
                  onPress={handleDelete}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
                  <Icon name="delete-outline" size="sm" color={colors.status.error} />
                  <Text variant="caption" color={colors.status.error}>
                    Remove
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
      {imagePickerOptions?.enabled ? cropper : null}
    </View>
  );
}

function FormikFileUpload(props: FileUploadProps & { name: string }) {
  const [field, meta, helpers] = useField<FileValue | null>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <FileUploadBody
      {...props}
      value={field.value}
      onChange={(nextValue) => helpers.setValue(nextValue)}
      error={hasError ? meta.error : props.error}
    />
  );
}

export function FileUpload(props: FileUploadProps) {
  if (props.name) {
    return <FormikFileUpload {...(props as FileUploadProps & { name: string })} />;
  }

  return <FileUploadBody {...props} value={props.value} onChange={props.onChange ?? (() => undefined)} />;
}
