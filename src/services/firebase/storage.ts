import { getFirebaseAvailabilityMessage, isNativeFirebaseAvailable } from '@/src/services/firebase/app';

function getStorageModule() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/storage').default as typeof import('@react-native-firebase/storage').default;
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function resolveFileExtension(fileName: string, contentType?: string) {
  const extensionMatch = String(fileName || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
  if (extensionMatch?.[1]) {
    return extensionMatch[1];
  }

  const normalizedContentType = String(contentType || '').toLowerCase();
  if (normalizedContentType === 'image/png') return '.png';
  if (normalizedContentType === 'image/webp') return '.webp';
  if (normalizedContentType === 'image/heic') return '.heic';
  if (normalizedContentType === 'image/heif') return '.heif';
  return '.jpg';
}

function buildUploadObjectName(fileName: string, contentType?: string) {
  const extension = resolveFileExtension(fileName, contentType);
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${randomPart}${extension}`;
}

export const storageService = {
  buildKycDocumentPath(userId: string, fileName: string, contentType?: string) {
    return `kyc/${userId}/${buildUploadObjectName(fileName, contentType)}`;
  },
  buildEventMediaPath(eventId: string, fileName: string, contentType?: string) {
    return `events/${eventId}/${buildUploadObjectName(fileName, contentType)}`;
  },
  async uploadKycDocument({
    userId,
    localFilePath,
    fileName,
    contentType,
    onProgress,
  }: {
    userId: string;
    localFilePath: string;
    fileName: string;
    contentType?: string;
    onProgress?: (progress: number) => void;
  }) {
    const path = this.buildKycDocumentPath(userId, fileName, contentType);
    const reference = getStorageModule()().ref(path);
    const uploadTask = reference.putFile(localFilePath.replace('file://', ''), contentType ? { contentType } : undefined);
    const unsubscribe = uploadTask.on('state_changed', (snapshot) => {
      if (!snapshot.totalBytes) {
        return;
      }
      onProgress?.(snapshot.bytesTransferred / snapshot.totalBytes);
    });
    await uploadTask;
    unsubscribe();
    const downloadUrl = await reference.getDownloadURL();

    return {
      path,
      downloadUrl,
    };
  },
  async uploadEventMedia({
    eventId,
    localFilePath,
    fileName,
    contentType,
    onProgress,
  }: {
    eventId: string;
    localFilePath: string;
    fileName: string;
    contentType?: string;
    onProgress?: (progress: number) => void;
  }) {
    const path = this.buildEventMediaPath(eventId, fileName, contentType);
    const reference = getStorageModule()().ref(path);
    const uploadTask = reference.putFile(localFilePath.replace('file://', ''), contentType ? { contentType } : undefined);
    const unsubscribe = uploadTask.on('state_changed', (snapshot) => {
      if (!snapshot.totalBytes) {
        return;
      }
      onProgress?.(snapshot.bytesTransferred / snapshot.totalBytes);
    });
    await uploadTask;
    unsubscribe();
    const downloadUrl = await reference.getDownloadURL();

    return {
      path,
      downloadUrl,
    };
  },
  async removeFile(storagePath: string) {
    await getStorageModule()().ref(storagePath).delete();
  },
};
