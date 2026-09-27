import * as ImagePicker from 'expo-image-picker';

import { ensureCameraPermission } from '@/src/services/device/app-permissions';
import { isAllowedUploadImageFile, showInvalidUploadFormatAlert } from '@/src/services/files/upload-file-policy';
import type { FileValue } from '@/src/types';

type MediaPickerOptions = {
  fileNamePrefix?: string;
  deniedMessage?: string;
  blockedMessage?: string;
  allowsEditing?: boolean;
  aspect?: [number, number];
};

export async function pickImageFromMediaLibrary(options?: MediaPickerOptions): Promise<FileValue | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: Boolean(options?.allowsEditing),
    ...(options?.aspect ? { aspect: options.aspect } : {}),
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];
  const nextFile = {
    uri: asset.uri,
    name: asset.fileName || `${options?.fileNamePrefix || 'image'}-${Date.now()}.jpg`,
    mimeType: asset.mimeType || 'image/jpeg',
    size: asset.fileSize,
  } satisfies FileValue;

  if (!isAllowedUploadImageFile(nextFile)) {
    showInvalidUploadFormatAlert();
    return null;
  }

  return nextFile;
}

export async function pickImageFromCamera(options?: MediaPickerOptions): Promise<FileValue | null> {
  const permission = await ensureCameraPermission({
    deniedMessage: options?.deniedMessage || 'Allow camera access to take a photo.',
    blockedMessage: options?.blockedMessage || 'Camera access is blocked. Enable it from settings to take a photo.',
  });

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: Boolean(options?.allowsEditing),
    ...(options?.aspect ? { aspect: options.aspect } : {}),
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];
  const nextFile = {
    uri: asset.uri,
    name: asset.fileName || `${options?.fileNamePrefix || 'image'}-${Date.now()}.jpg`,
    mimeType: asset.mimeType || 'image/jpeg',
    size: asset.fileSize,
  } satisfies FileValue;

  if (!isAllowedUploadImageFile(nextFile)) {
    showInvalidUploadFormatAlert();
    return null;
  }

  return nextFile;
}
