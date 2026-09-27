import { pickImageFromCamera, pickImageFromMediaLibrary } from '@/src/services/device/media-picker';
import type { FileValue } from '@/src/types';

type CropPickerOptions = {
  fileNamePrefix?: string;
  aspect?: [number, number];
};

export function useCroppedImagePicker() {
  async function cropImage(file: FileValue) {
    return file;
  }

  async function pickImage(options?: CropPickerOptions) {
    return pickImageFromMediaLibrary({
      allowsEditing: true,
      aspect: options?.aspect,
      fileNamePrefix: options?.fileNamePrefix,
    });
  }

  async function captureImage(options?: CropPickerOptions) {
    return pickImageFromCamera({
      allowsEditing: true,
      aspect: options?.aspect,
      fileNamePrefix: options?.fileNamePrefix,
    });
  }

  return { cropImage, pickImage, captureImage, cropper: null };
}
