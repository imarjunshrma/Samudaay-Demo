import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

export type ReportDeliveryMethod = 'download' | 'open' | 'share' | 'saf';

export type ReportDeliveryResult = {
  fileName: string;
  method: ReportDeliveryMethod;
  uri: string;
  fileUri: string;
  contentUri?: string;
};

type DeliverTextFileOptions = {
  content: string;
  fileName: string;
  mimeType: string;
};

type DeliverBase64FileOptions = {
  base64Content: string;
  fileName: string;
  mimeType: string;
};

const REPORT_DIRECTORY_NAME = 'reports';
const ANDROID_ACTION_VIEW = 'android.intent.action.VIEW';
const FLAG_GRANT_READ_URI_PERMISSION = 1;
const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function normalizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    || `report-${Date.now()}`;
}

function joinUri(directoryUri: string, name: string) {
  return `${directoryUri.replace(/\/?$/, '/')}${name}`;
}

async function ensureReportDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error('File system document directory is not available.');
  }

  const directoryUri = joinUri(FileSystem.documentDirectory, REPORT_DIRECTORY_NAME);
  const info = await FileSystem.getInfoAsync(directoryUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }

  return directoryUri;
}

async function downloadOnWeb(content: string, fileName: string, mimeType: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Web download is not available.');
  }

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(objectUrl);

  return {
    fileName,
    method: 'download' as const,
    uri: objectUrl,
    fileUri: objectUrl,
  };
}

function base64ToUint8Array(base64Content: string) {
  const binary = atob(base64Content);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function downloadBase64OnWeb(base64Content: string, fileName: string, mimeType: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Web download is not available.');
  }

  const blob = new Blob([base64ToUint8Array(base64Content)], { type: mimeType });
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(objectUrl);

  return {
    fileName,
    method: 'download' as const,
    uri: objectUrl,
    fileUri: objectUrl,
  };
}

async function deliverThroughSaf(content: string, fileName: string, mimeType: string) {
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted || !permissions.directoryUri) {
    throw new Error('Storage access is required to save this file.');
  }

  const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    fileName,
    mimeType,
  );

  await FileSystem.writeAsStringAsync(targetUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return {
    fileName,
    method: 'saf' as const,
    uri: targetUri,
    fileUri: targetUri,
    contentUri: targetUri,
  };
}

async function deliverBase64ThroughSaf(base64Content: string, fileName: string, mimeType: string) {
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted || !permissions.directoryUri) {
    throw new Error('Storage access is required to save this file.');
  }

  const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    fileName,
    mimeType,
  );

  await FileSystem.writeAsStringAsync(targetUri, base64Content, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    fileName,
    method: 'saf' as const,
    uri: targetUri,
    fileUri: targetUri,
    contentUri: targetUri,
  };
}

async function shareLocalFile(fileUri: string, fileName: string, mimeType: string) {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('Native sharing is not available on this device.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType,
    dialogTitle: fileName,
  });
}

async function openAndroidXlsxFile(fileUri: string) {
  const contentUri = await FileSystem.getContentUriAsync(fileUri);

  await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
    data: contentUri,
    type: XLSX_MIME_TYPE,
    flags: FLAG_GRANT_READ_URI_PERMISSION,
  });

  return contentUri;
}

async function persistLocalTextFile(content: string, fileName: string) {
  const directoryUri = await ensureReportDirectory();
  const fileUri = joinUri(directoryUri, fileName);
  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}

async function persistLocalBase64File(base64Content: string, fileName: string) {
  const directoryUri = await ensureReportDirectory();
  const fileUri = joinUri(directoryUri, fileName);
  await FileSystem.writeAsStringAsync(fileUri, base64Content, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

export async function createAndDeliverTextFile({
  content,
  fileName,
  mimeType,
}: DeliverTextFileOptions): Promise<ReportDeliveryResult> {
  const normalizedFileName = normalizeFileName(fileName);

  if (Platform.OS === 'web') {
    return downloadOnWeb(content, normalizedFileName, mimeType);
  }

  const fileUri = await persistLocalTextFile(content, normalizedFileName);

  try {
    await shareLocalFile(fileUri, normalizedFileName, mimeType);

    return {
      fileName: normalizedFileName,
      method: 'share',
      uri: fileUri,
      fileUri,
    };
  } catch (error) {
    if (Platform.OS !== 'android') {
      throw error;
    }

    const result = await deliverThroughSaf(content, normalizedFileName, mimeType);
    return result;
  }
}

export async function createAndDeliverBase64File({
  base64Content,
  fileName,
  mimeType,
}: DeliverBase64FileOptions): Promise<ReportDeliveryResult> {
  const normalizedFileName = normalizeFileName(fileName);

  if (Platform.OS === 'web') {
    return downloadBase64OnWeb(base64Content, normalizedFileName, mimeType);
  }

  const fileUri = await persistLocalBase64File(base64Content, normalizedFileName);

  if (Platform.OS === 'android' && mimeType === XLSX_MIME_TYPE) {
    try {
      const contentUri = await openAndroidXlsxFile(fileUri);

      return {
        fileName: normalizedFileName,
        method: 'open',
        uri: fileUri,
        fileUri,
        contentUri,
      };
    } catch {
      // Fall back to the existing Android share flow when no viewer can handle XLSX.
    }
  }

  try {
    await shareLocalFile(fileUri, normalizedFileName, mimeType);

    return {
      fileName: normalizedFileName,
      method: 'share',
      uri: fileUri,
      fileUri,
    };
  } catch (error) {
    if (Platform.OS !== 'android') {
      throw error;
    }

    const result = await deliverBase64ThroughSaf(base64Content, normalizedFileName, mimeType);
    return result;
  }
}
