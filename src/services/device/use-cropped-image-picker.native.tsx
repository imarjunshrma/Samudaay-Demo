import ImageCropPicker from 'react-native-image-crop-picker';

import { ensureCameraPermission } from '@/src/services/device/app-permissions';
import { isAllowedUploadImageFile, showInvalidUploadFormatAlert } from '@/src/services/files/upload-file-policy';
import { colors } from '@/src/theme';
import type { FileValue } from '@/src/types';

type CropPickerOptions = {
  fileNamePrefix?: string;
  aspect?: [number, number];
};

function getCroppedName(name: string) {
  const baseName = name.replace(/\.[^.]+$/, '') || 'photo';
  return `${baseName}-cropped.jpg`;
}

function isCropCancelled(error: unknown) {
  if (error instanceof Error) {
    return /cancel/i.test(error.message);
  }

  if (typeof error === 'object' && error && 'code' in error) {
    return String(error.code).toLowerCase().includes('cancel');
  }

  return typeof error === 'string' && /cancel/i.test(error);
}

function getCropSize(aspect?: [number, number]) {
  return aspect
    ? { width: Math.round(1200 * (aspect[0] / aspect[1])), height: 1200 }
    : {};
}

function getCropperOptions(aspect?: [number, number]) {
  return {
    mediaType: 'photo' as const,
    cropping: true,
    freeStyleCropEnabled: !aspect,
    cropperToolbarTitle: 'Crop Photo',
    cropperChooseText: 'Use Photo',
    cropperCancelText: 'Cancel',
    cropperTintColor: colors.primary.DEFAULT,
    cropperToolbarColor: colors.primary.DEFAULT,
    cropperToolbarWidgetColor: '#ffffff',
    showCropFrame: true,
    showCropGuidelines: true,
    enableRotationGesture: true,
    compressImageQuality: 0.9,
    forceJpg: true,
    ...getCropSize(aspect),
  };
}

function buildCroppedFile(result: { path: string; filename?: string | null; mime?: string | null; size?: number | null }, fallbackName: string, fallbackSize?: number) {
  return {
    uri: result.path,
    name: getCroppedName(result.filename || fallbackName),
    mimeType: result.mime || 'image/jpeg',
    size: result.size || fallbackSize,
  } satisfies FileValue;
}

function validateImageFile(file: FileValue) {
  if (isAllowedUploadImageFile(file)) {
    return true;
  }

  showInvalidUploadFormatAlert();
  return false;
}

export function useCroppedImagePicker() {
  async function cropImage(file: FileValue, options?: CropPickerOptions) {
    try {
      const aspect = options?.aspect;
      const result = await ImageCropPicker.openCropper({
        path: file.uri,
        ...getCropperOptions(aspect),
      });

      const croppedFile = buildCroppedFile(result, file.name, file.size);
      return validateImageFile(croppedFile) ? croppedFile : null;
    } catch (error) {
      if (isCropCancelled(error)) {
        return null;
      }

      throw error;
    }
  }

  async function pickImage(options?: CropPickerOptions) {
    try {
      const result = await ImageCropPicker.openPicker(getCropperOptions(options?.aspect));
      const fallbackName = `${options?.fileNamePrefix || 'photo'}-${Date.now()}.jpg`;
      const croppedFile = buildCroppedFile(result, fallbackName);

      return validateImageFile(croppedFile) ? croppedFile : null;
    } catch (error) {
      if (isCropCancelled(error)) {
        return null;
      }

      throw error;
    }
  }

  async function captureImage(options?: CropPickerOptions) {
    try {
      const permission = await ensureCameraPermission({
        deniedMessage: 'Allow camera access to take a photo.',
        blockedMessage: 'Camera access is blocked. Enable it from settings to take a photo.',
      });
      if (!permission.granted) {
        return null;
      }

      const result = await ImageCropPicker.openCamera(getCropperOptions(options?.aspect));
      const fallbackName = `${options?.fileNamePrefix || 'photo'}-${Date.now()}.jpg`;
      const croppedFile = buildCroppedFile(result, fallbackName);

      return validateImageFile(croppedFile) ? croppedFile : null;
    } catch (error) {
      if (isCropCancelled(error)) {
        return null;
      }

      throw error;
    }
  }

  return { cropImage, pickImage, captureImage, cropper: null };
}
