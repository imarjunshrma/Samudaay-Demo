import { Alert } from 'react-native';

import type { FileValue } from '@/src/types';

export const ALLOWED_IMAGE_DOCUMENT_TYPES = ['image/png', 'image/jpeg'] as const;
export const ALLOWED_PROMOTION_DOCUMENT_TYPES = ['image/png', 'image/jpeg', 'video/mp4', 'video/quicktime', 'video/webm'] as const;

const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'] as const;
const ALLOWED_PROMOTION_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.mp4', '.mov', '.webm'] as const;

function normalizeText(value?: string | null) {
  return String(value || '').trim().toLowerCase();
}

function hasAllowedExtension(value: string | null | undefined, allowedExtensions: readonly string[]) {
  const normalized = normalizeText(value);
  return allowedExtensions.some((extension) => normalized.endsWith(extension));
}

export function isAllowedUploadFile(
  file?: FileValue | null,
  allowedMimeTypes: readonly string[] = ALLOWED_IMAGE_DOCUMENT_TYPES,
  allowedExtensions: readonly string[] = ALLOWED_IMAGE_EXTENSIONS,
) {
  if (!file) {
    return false;
  }

  const mimeType = normalizeText(file.mimeType);
  if (mimeType && allowedMimeTypes.map((type) => normalizeText(type)).includes(mimeType)) {
    return true;
  }

  return hasAllowedExtension(file.name, allowedExtensions) || hasAllowedExtension(file.uri, allowedExtensions);
}

export function isAllowedUploadImageFile(file?: FileValue | null) {
  return isAllowedUploadFile(file, ALLOWED_IMAGE_DOCUMENT_TYPES, ALLOWED_IMAGE_EXTENSIONS);
}

export function isAllowedPromotionUploadFile(file?: FileValue | null) {
  return isAllowedUploadFile(file, ALLOWED_PROMOTION_DOCUMENT_TYPES, ALLOWED_PROMOTION_EXTENSIONS);
}

export function showInvalidUploadFormatAlert(message = 'Only PNG and JPEG image files are allowed.') {
  Alert.alert(
    'Invalid file format',
    message,
  );
}
