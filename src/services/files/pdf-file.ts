import { Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { storageKeys } from '@/src/constants/storageKeys';
import { storageService } from '@/src/services/storage.service';

export type PdfDeliveryMethod = 'download' | 'open' | 'share' | 'persist' | 'saf';
export type PdfDeliveryMode = 'auto' | 'open' | 'share' | 'persist' | 'saf';

export type PdfDeliveryResult = {
  fileName: string;
  method: PdfDeliveryMethod;
  uri: string;
  fileUri: string;
  contentUri?: string;
  size: number;
};

export type PdfSource =
  | {
      type: 'html';
      html: string;
      width?: number;
      height?: number;
    }
  | {
      type: 'url';
      url: string;
      headers?: Record<string, string>;
    }
  | {
      type: 'file';
      uri: string;
    };

export type CreateAndDeliverPdfOptions = {
  source: PdfSource;
  fileName: string;
  delivery?: PdfDeliveryMode;
  overwrite?: boolean;
};

export type DownloadPdfOptions = {
  url: string;
  fileName: string;
  headers?: Record<string, string>;
  delivery?: PdfDeliveryMode;
};

export type HtmlPdfOptions = {
  html: string;
  fileName: string;
  delivery?: PdfDeliveryMode;
};

type PersistedPdf = {
  fileName: string;
  fileUri: string;
  contentUri?: string;
  size: number;
};

const PDF_MIME_TYPE = 'application/pdf';
const PDF_UTI = 'com.adobe.pdf';
const PDF_HEADER_BASE64 = 'JVBERi0';
const PDF_DIRECTORY_NAME = 'pdf';
const DOWNLOAD_SIZE_TOLERANCE_BYTES = 1024;
const PDF_DOWNLOAD_CANCELLED_MESSAGE = 'PDF download was cancelled.';
const PDF_SAVE_PERMISSION_MESSAGE = 'Storage access is required to save this PDF to your selected folder.';
const PDF_SHARE_UNAVAILABLE_MESSAGE = 'Receipt PDF generated but could not be opened on this device.';

const ANDROID_ACTION_VIEW = 'android.intent.action.VIEW';
const ANDROID_CATEGORY_DEFAULT = 'android.intent.category.DEFAULT';
const ANDROID_GRANT_READ_URI_PERMISSION = 1;
const activePdfDeliveries = new Map<string, Promise<PdfDeliveryResult | null>>();
let activeDirectoryPermissionRequest: Promise<string | null> | null = null;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}

function logPdfFlow(
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  details?: Record<string, unknown>,
) {
  const payload = {
    platform: Platform.OS,
    ...details,
  };

  if (level === 'error') {
    console.error(`[pdf-file] ${message}`, payload);
  } else if (level === 'warn') {
    console.warn(`[pdf-file] ${message}`, payload);
  } else {
    console.log(`[pdf-file] ${message}`, payload);
  }
}

export function normalizePdfFileName(fileName: string) {
  const cleaned = fileName
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ');
  const safeName = cleaned || `document-${Date.now()}`;

  return safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;
}

export function isPdfDownloadCancelledError(error: unknown) {
  return error instanceof Error && error.message === PDF_DOWNLOAD_CANCELLED_MESSAGE;
}

export async function openDeliveredPdf(result: Pick<PdfDeliveryResult, 'uri' | 'fileUri' | 'contentUri' | 'fileName'>) {
  if (Platform.OS === 'web') {
    if (!result.uri) {
      throw new Error('Downloaded PDF link is not available.');
    }
    globalThis.window?.open(result.uri, '_blank');
    return;
  }

  if (Platform.OS === 'android') {
    const androidUri =
      (typeof result.uri === 'string' && result.uri.startsWith('content://') ? result.uri : null) ||
      result.contentUri ||
      result.uri ||
      result.fileUri;

    if (!androidUri) {
      throw new Error('Downloaded PDF location is not available.');
    }

    await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
      data: androidUri,
      type: PDF_MIME_TYPE,
      category: ANDROID_CATEGORY_DEFAULT,
      flags: ANDROID_GRANT_READ_URI_PERMISSION,
    });
    return;
  }

  const targetUri = result.fileUri || result.uri;
  if (!targetUri) {
    throw new Error('Downloaded PDF location is not available.');
  }

  await Linking.openURL(targetUri);
}

function splitPdfFileName(fileName: string) {
  const normalized = normalizePdfFileName(fileName);
  const lastDotIndex = normalized.lastIndexOf('.');
  if (lastDotIndex <= 0) {
    return {
      baseName: normalized,
      extension: '',
    };
  }

  return {
    baseName: normalized.slice(0, lastDotIndex),
    extension: normalized.slice(lastDotIndex),
  };
}

function assertFileUri(uri: string, context: string) {
  if (!uri || typeof uri !== 'string') {
    throw new Error(`${context}: file URI is missing.`);
  }

  if (!uri.startsWith('file://')) {
    throw new Error(`${context}: expected a file:// URI but received ${uri}.`);
  }
}

function getDocumentDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error('FileSystem.documentDirectory is not available.');
  }

  return FileSystem.documentDirectory;
}

function joinUri(directoryUri: string, name: string) {
  return `${directoryUri.replace(/\/?$/, '/')}${name}`;
}

async function ensurePdfDirectory() {
  const directoryUri = joinUri(getDocumentDirectory(), PDF_DIRECTORY_NAME);

  try {
    const info = await FileSystem.getInfoAsync(directoryUri);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }
  } catch (error) {
    logPdfFlow('error', 'Unable to prepare persistent PDF directory.', {
      directoryUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to prepare PDF storage: ${getErrorMessage(error)}`);
  }

  return directoryUri;
}

async function getPersistentPdfUri(fileName: string) {
  const directoryUri = await ensurePdfDirectory();
  return joinUri(directoryUri, normalizePdfFileName(fileName));
}

async function deleteIfExists(uri: string, context: string) {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    logPdfFlow('warn', `${context}: unable to delete existing file.`, {
      uri,
      error: getErrorMessage(error),
    });
  }
}

async function readPdfHeaderBase64(uri: string) {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
    position: 0,
    length: 5,
  });
}

async function assertReadablePdf(uri: string, context: string) {
  assertFileUri(uri, context);

  const info = await FileSystem.getInfoAsync(uri, { md5: false });

  logPdfFlow('info', `${context}: file info.`, {
    uri,
    exists: info.exists,
    size: info.exists ? info.size : undefined,
  });

  if (!info.exists) {
    throw new Error(`${context}: PDF file does not exist.`);
  }

  if (!info.size || info.size <= 0) {
    throw new Error(`${context}: PDF file is empty.`);
  }

  try {
    const header = await readPdfHeaderBase64(uri);
    if (!header.startsWith(PDF_HEADER_BASE64)) {
      throw new Error(`${context}: file does not start with a PDF header.`);
    }
  } catch (error) {
    logPdfFlow('error', `${context}: PDF header validation failed.`, {
      uri,
      size: info.size,
      headerPreview: await readPdfHeaderBase64(uri).catch(() => null),
      error: getErrorMessage(error),
    });
    throw error instanceof Error ? error : new Error(`${context}: Unable to validate PDF file.`);
  }

  return {
    uri,
    size: info.size,
  };
}

function getHeader(headers: Record<string, string> | undefined, name: string) {
  if (!headers) {
    return undefined;
  }

  const normalizedName = name.toLowerCase();
  return Object.entries(headers).find(([key]) => key.toLowerCase() === normalizedName)?.[1];
}

function validateDownloadHeaders(headers: Record<string, string> | undefined) {
  const contentType = getHeader(headers, 'content-type');
  const contentDisposition = getHeader(headers, 'content-disposition');
  const contentLength = getHeader(headers, 'content-length');
  const normalizedContentType = String(contentType || '').toLowerCase();

  logPdfFlow('info', 'PDF download response headers.', {
    contentType,
    contentDisposition,
    contentLength,
  });

  if (!contentType) {
    logPdfFlow('warn', 'PDF download response is missing Content-Type.');
  } else if (
    !normalizedContentType.includes(PDF_MIME_TYPE) &&
    !normalizedContentType.includes('application/octet-stream')
  ) {
    throw new Error(`Expected a PDF response but received Content-Type: ${contentType}.`);
  }

  const parsedContentLength = contentLength ? Number(contentLength) : undefined;
  return {
    contentLength: Number.isFinite(parsedContentLength) ? parsedContentLength : undefined,
  };
}

function validateDownloadedSize(expectedContentLength: number | undefined, actualSize: number) {
  if (expectedContentLength === undefined) {
    return;
  }

  if (expectedContentLength <= 0) {
    throw new Error(`PDF response has invalid Content-Length: ${expectedContentLength}.`);
  }

  const sizeDifference = Math.abs(actualSize - expectedContentLength);
  if (sizeDifference > DOWNLOAD_SIZE_TOLERANCE_BYTES) {
    throw new Error(
      `Downloaded PDF size mismatch. Expected ${expectedContentLength} bytes, received ${actualSize} bytes. Tolerance is ${DOWNLOAD_SIZE_TOLERANCE_BYTES} bytes.`,
    );
  }

  if (sizeDifference > 0) {
    logPdfFlow('warn', 'Downloaded PDF size differs from Content-Length within tolerance.', {
      expectedContentLength,
      actualSize,
      sizeDifference,
      tolerance: DOWNLOAD_SIZE_TOLERANCE_BYTES,
    });
  }
}

async function resolveAndroidContentUri(fileUri: string) {
  if (Platform.OS !== 'android') {
    return undefined;
  }

  try {
    const contentUri = await FileSystem.getContentUriAsync(fileUri);
    if (!contentUri?.startsWith('content://')) {
      throw new Error(`Invalid Android content URI: ${contentUri || 'empty'}.`);
    }

    logPdfFlow('info', 'Resolved Android content URI.', {
      fileUri,
      contentUri,
    });
    return contentUri;
  } catch (error) {
    logPdfFlow('error', 'Unable to resolve Android content URI.', {
      fileUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to prepare Android PDF permission URI: ${getErrorMessage(error)}`);
  }
}

async function persistExistingPdf(sourceUri: string, destinationUri: string, overwrite: boolean) {
  assertFileUri(sourceUri, 'PDF persistence source');

  if (sourceUri === destinationUri) {
    await assertReadablePdf(destinationUri, 'PDF persistence');
    return;
  }

  if (overwrite) {
    await deleteIfExists(destinationUri, 'PDF persistence');
  }

  try {
    logPdfFlow('info', 'Copying PDF into persistent document storage.', {
      sourceUri,
      destinationUri,
      overwrite,
    });
    await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
  } catch (error) {
    logPdfFlow('error', 'Unable to copy PDF into persistent document storage.', {
      sourceUri,
      destinationUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to persist PDF: ${getErrorMessage(error)}`);
  }
}

async function generatePdfFromHtml(
  html: string,
  destinationUri: string,
  overwrite: boolean,
  printSize?: { width?: number; height?: number },
) {
  if (!html.trim()) {
    throw new Error('PDF HTML is empty.');
  }

  if (overwrite) {
    await deleteIfExists(destinationUri, 'HTML PDF generation');
  }

  let printedUri: string | null = null;

  try {
    logPdfFlow('info', 'Starting HTML to PDF generation.', {
      destinationUri,
      htmlLength: html.length,
    });

    const printed = await Print.printToFileAsync({
      html,
      base64: false,
      width: printSize?.width,
      height: printSize?.height,
    });
    printedUri = printed.uri;

    logPdfFlow('info', 'HTML to PDF generation completed.', {
      printedUri,
      numberOfPages: printed.numberOfPages,
      destinationUri,
    });

    await assertReadablePdf(printed.uri, 'Generated PDF temporary source');
    await persistExistingPdf(printed.uri, destinationUri, overwrite);
  } catch (error) {
    logPdfFlow('error', 'HTML to PDF generation failed.', {
      destinationUri,
      printedUri,
      error: getErrorMessage(error),
    });
    await deleteIfExists(destinationUri, 'HTML PDF generation rollback');
    throw new Error(`Unable to generate PDF: ${getErrorMessage(error)}`);
  } finally {
    if (printedUri) {
      await FileSystem.deleteAsync(printedUri, { idempotent: true }).catch((error) => {
        logPdfFlow('warn', 'Unable to delete Expo Print temporary PDF.', {
          printedUri,
          error: getErrorMessage(error),
        });
      });
    }
  }
}

async function downloadPdfFromUrl(
  url: string,
  destinationUri: string,
  headers: Record<string, string> | undefined,
  overwrite: boolean,
) {
  if (!url.trim()) {
    throw new Error('PDF download URL is empty.');
  }

  if (overwrite) {
    await deleteIfExists(destinationUri, 'PDF download');
  }

  try {
    logPdfFlow('info', 'Starting PDF download into persistent storage.', {
      url,
      destinationUri,
      hasHeaders: Boolean(headers),
    });

    const result = await FileSystem.downloadAsync(url, destinationUri, { headers });

    logPdfFlow('info', 'PDF download completed.', {
      requestedUri: destinationUri,
      resultUri: result.uri,
      status: result.status,
      headers: result.headers,
      mimeType: result.mimeType,
    });

    if (result.status < 200 || result.status >= 300) {
      throw new Error(`PDF download failed with status ${result.status}.`);
    }

    const { contentLength } = validateDownloadHeaders(result.headers);
    const info = await assertReadablePdf(destinationUri, 'Downloaded PDF');
    validateDownloadedSize(contentLength, info.size);
  } catch (error) {
    const info = await FileSystem.getInfoAsync(destinationUri).catch(() => null);
    logPdfFlow('error', 'PDF download failed.', {
      url,
      destinationUri,
      exists: info?.exists,
      size: info?.exists ? info.size : undefined,
      error: getErrorMessage(error),
    });
    await deleteIfExists(destinationUri, 'PDF download rollback');
    throw new Error(`Unable to download PDF: ${getErrorMessage(error)}`);
  }
}

async function preparePersistedPdf(fileName: string, fileUri: string): Promise<PersistedPdf> {
  const info = await assertReadablePdf(fileUri, 'Persistent PDF');
  const contentUri = await resolveAndroidContentUri(fileUri);

  logPdfFlow('info', 'Persistent PDF is ready for delivery.', {
    fileName,
    fileUri,
    contentUri,
    size: info.size,
  });

  return {
    fileName,
    fileUri,
    contentUri,
    size: info.size,
  };
}

async function getStoredPdfDirectoryUri() {
  return storageService.getItem(storageKeys.pdfDownloadDirectoryUri);
}

async function setStoredPdfDirectoryUri(directoryUri: string) {
  await storageService.setItem(storageKeys.pdfDownloadDirectoryUri, directoryUri);
}

async function clearStoredPdfDirectoryUri() {
  await storageService.removeItem(storageKeys.pdfDownloadDirectoryUri);
}

export async function getPdfDownloadDirectoryStatus() {
  const directoryUri = await getStoredPdfDirectoryUri();
  return {
    configured: Boolean(directoryUri),
    directoryUri: directoryUri || null,
  };
}

async function requestPdfDirectoryUri() {
  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted || !permissions.directoryUri) {
    return null;
  }

  await setStoredPdfDirectoryUri(permissions.directoryUri);
  return permissions.directoryUri;
}

async function getOrRequestPdfDirectoryUri(): Promise<string | null> {
  const storedDirectoryUri = await getStoredPdfDirectoryUri();
  if (storedDirectoryUri) {
    return storedDirectoryUri;
  }

  if (activeDirectoryPermissionRequest) {
    return activeDirectoryPermissionRequest;
  }

  const request = requestPdfDirectoryUri().finally(() => {
    activeDirectoryPermissionRequest = null;
  });
  activeDirectoryPermissionRequest = request;
  return request;
}

export async function ensurePdfDownloadDirectoryAccess() {
  const existingDirectoryUri = await getStoredPdfDirectoryUri();
  const directoryUri = await getOrRequestPdfDirectoryUri();
  return {
    granted: Boolean(directoryUri),
    directoryUri: directoryUri || null,
    reused: Boolean(existingDirectoryUri && existingDirectoryUri === directoryUri),
  };
}

export async function clearPdfDownloadDirectoryAccess() {
  await clearStoredPdfDirectoryUri();
}

async function savePdfWithAndroidStorageAccess(pdf: PersistedPdf): Promise<PdfDeliveryResult | null> {
  const writePdfToDirectory = async (directoryUri: string) => {
    const { baseName, extension } = splitPdfFileName(pdf.fileName);
    let targetUri: string | null = null;
    let lastCreateError: unknown = null;

    for (let index = 0; index < 50; index += 1) {
      const candidateFileName = index === 0
        ? `${baseName}${extension}`
        : `${baseName} (${index})${extension}`;

      try {
        targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          candidateFileName,
          PDF_MIME_TYPE,
        );
        break;
      } catch (error) {
        lastCreateError = error;
        const message = getErrorMessage(error).toLowerCase();
        const duplicateFile =
          message.includes('already exists') ||
          message.includes('file exists') ||
          message.includes('could not be created');

        if (!duplicateFile) {
          throw error;
        }
      }
    }

    if (!targetUri) {
      throw lastCreateError ?? new Error('Unable to create PDF file in selected folder.');
    }

    const base64Content = await FileSystem.readAsStringAsync(pdf.fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.writeAsStringAsync(targetUri, base64Content, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      fileName: pdf.fileName,
      method: 'saf' as const,
      uri: targetUri,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    };
  };

  const tryWrite = async (allowRetryWithFreshDirectory: boolean) => {
    const directoryUri = await getOrRequestPdfDirectoryUri();
    if (!directoryUri) {
      return null;
    }

    try {
      return await writePdfToDirectory(directoryUri);
    } catch (error) {
      const message = getErrorMessage(error);
      const permissionLost =
        message.includes('does not have permission') ||
        message.includes('Permission Denial') ||
        message.includes('No permission to write') ||
        message.includes('not allowed');

      if (!allowRetryWithFreshDirectory || !permissionLost) {
        throw error;
      }

      await clearStoredPdfDirectoryUri();
      return tryWrite(false);
    }
  };

  try {
    return await tryWrite(true);
  } catch (error) {
    logPdfFlow('error', 'Android SAF PDF save failed.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to save PDF to device storage: ${getErrorMessage(error) || PDF_SAVE_PERMISSION_MESSAGE}`);
  }
}

async function openPdfOnAndroid(pdf: PersistedPdf): Promise<PdfDeliveryResult> {
  if (!pdf.contentUri) {
    throw new Error('Android content URI is missing.');
  }

  try {
    logPdfFlow('info', 'Opening Android PDF with IntentLauncher.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      flags: ANDROID_GRANT_READ_URI_PERMISSION,
    });

    await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
      data: pdf.contentUri,
      type: PDF_MIME_TYPE,
      category: ANDROID_CATEGORY_DEFAULT,
      flags: ANDROID_GRANT_READ_URI_PERMISSION,
    });

    logPdfFlow('info', 'Android PDF open succeeded.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    });

    return {
      fileName: pdf.fileName,
      method: 'open',
      uri: pdf.contentUri,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    };
  } catch (error) {
    logPdfFlow('error', 'Android PDF open failed.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to open PDF on Android: ${getErrorMessage(error)}`);
  }
}

async function sharePdfOnAndroid(pdf: PersistedPdf): Promise<PdfDeliveryResult> {
  try {
    const available = await Sharing.isAvailableAsync();
    logPdfFlow('info', 'Android PDF sharing availability checked.', {
      available,
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    });

    if (!available) {
      throw new Error(PDF_SHARE_UNAVAILABLE_MESSAGE);
    }

    logPdfFlow('info', 'Opening Android PDF share sheet.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    });

    await Sharing.shareAsync(pdf.fileUri, {
      mimeType: PDF_MIME_TYPE,
      dialogTitle: pdf.fileName,
    });

    logPdfFlow('info', 'Android PDF share succeeded.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    });

    return {
      fileName: pdf.fileName,
      method: 'share',
      uri: pdf.fileUri,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    };
  } catch (error) {
    logPdfFlow('error', 'Android PDF share failed.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to share PDF on Android: ${getErrorMessage(error)}`);
  }
}

async function sharePdfOnIos(pdf: PersistedPdf): Promise<PdfDeliveryResult> {
  try {
    const available = await Sharing.isAvailableAsync();
    logPdfFlow('info', 'iOS PDF sharing availability checked.', {
      available,
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      size: pdf.size,
    });

    if (!available) {
      throw new Error(PDF_SHARE_UNAVAILABLE_MESSAGE);
    }

    logPdfFlow('info', 'Opening iOS PDF share sheet.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      size: pdf.size,
    });

    await Sharing.shareAsync(pdf.fileUri, {
      mimeType: PDF_MIME_TYPE,
      UTI: PDF_UTI,
      dialogTitle: pdf.fileName,
    });

    logPdfFlow('info', 'iOS PDF share succeeded.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      size: pdf.size,
    });

    return {
      fileName: pdf.fileName,
      method: 'share',
      uri: pdf.fileUri,
      fileUri: pdf.fileUri,
      size: pdf.size,
    };
  } catch (error) {
    logPdfFlow('error', 'iOS PDF share failed.', {
      fileName: pdf.fileName,
      fileUri: pdf.fileUri,
      size: pdf.size,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to share PDF: ${getErrorMessage(error)}`);
  }
}

async function deliverPdf(pdf: PersistedPdf, delivery: PdfDeliveryMode): Promise<PdfDeliveryResult | null> {
  if (delivery === 'persist') {
    return {
      fileName: pdf.fileName,
      method: 'persist',
      uri: pdf.fileUri,
      fileUri: pdf.fileUri,
      contentUri: pdf.contentUri,
      size: pdf.size,
    };
  }

  if (delivery === 'saf') {
    if (Platform.OS === 'android') {
      return savePdfWithAndroidStorageAccess(pdf);
    }

    return Platform.OS === 'web' ? null : sharePdfOnIos(pdf);
  }

  if (Platform.OS === 'android') {
    if (delivery === 'auto' || delivery === 'share') {
      return sharePdfOnAndroid(pdf);
    }

    return openPdfOnAndroid(pdf);
  }

  if (delivery === 'auto' || delivery === 'share') {
    return sharePdfOnIos(pdf);
  }

  return sharePdfOnIos(pdf);
}

async function deliverPdfOnWeb(source: PdfSource, fileName: string): Promise<PdfDeliveryResult> {
  const normalizedFileName = normalizePdfFileName(fileName);

  if (source.type === 'html') {
    const win = globalThis.window?.open('', '_blank');
    if (win) {
      win.document.write(source.html);
      win.document.close();
      win.print();
    }

    return {
      fileName: normalizedFileName,
      method: 'open',
      uri: '',
      fileUri: '',
      size: 0,
    };
  }

  if (source.type === 'file') {
    globalThis.window?.open(source.uri, '_blank');
    return {
      fileName: normalizedFileName,
      method: 'open',
      uri: source.uri,
      fileUri: source.uri,
      size: 0,
    };
  }

  const response = await fetch(source.url, { headers: source.headers });
  if (!response.ok) {
    throw new Error(`PDF download failed with status ${response.status}.`);
  }

  const blob = await response.blob();
  if (blob.size <= 0) {
    throw new Error('Downloaded PDF is empty.');
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = globalThis.document?.createElement('a');
  if (anchor) {
    anchor.href = objectUrl;
    anchor.download = normalizedFileName;
    anchor.style.display = 'none';
    globalThis.document?.body?.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } else {
    globalThis.window?.open(objectUrl, '_blank');
  }

  return {
    fileName: normalizedFileName,
    method: 'download',
    uri: objectUrl,
    fileUri: objectUrl,
    size: blob.size,
  };
}

export async function createAndDeliverPdf({
  source,
  fileName,
  delivery = 'auto',
  overwrite = true,
}: CreateAndDeliverPdfOptions): Promise<PdfDeliveryResult | null> {
  const normalizedFileName = normalizePdfFileName(fileName);
  const operationKey = JSON.stringify({
    sourceType: source.type,
    sourceUri: source.type === 'url' ? source.url : source.type === 'file' ? source.uri : normalizedFileName,
    fileName: normalizedFileName,
    delivery,
    overwrite,
  });
  const existingOperation = activePdfDeliveries.get(operationKey);
  if (existingOperation) {
    return existingOperation;
  }

  const operation = (async () => {
    if (Platform.OS === 'web') {
      return deliverPdfOnWeb(source, normalizedFileName);
    }

    const destinationUri = await getPersistentPdfUri(normalizedFileName);

    logPdfFlow('info', 'Preparing PDF delivery.', {
      sourceType: source.type,
      fileName: normalizedFileName,
      destinationUri,
      delivery,
      overwrite,
    });

    if (source.type === 'html') {
      await generatePdfFromHtml(source.html, destinationUri, overwrite, {
        width: source.width,
        height: source.height,
      });
    } else if (source.type === 'url') {
      await downloadPdfFromUrl(source.url, destinationUri, source.headers, overwrite);
    } else {
      await persistExistingPdf(source.uri, destinationUri, overwrite);
    }

    const pdf = await preparePersistedPdf(normalizedFileName, destinationUri);
    return deliverPdf(pdf, delivery);
  })().finally(() => {
    activePdfDeliveries.delete(operationKey);
  });

  activePdfDeliveries.set(operationKey, operation);
  return operation;
}

export async function createAndDeliverPdfFromHtml({
  html,
  fileName,
  delivery = 'auto',
}: HtmlPdfOptions): Promise<PdfDeliveryResult | null> {
  return createAndDeliverPdf({
    source: { type: 'html', html },
    fileName,
    delivery,
  });
}

export async function downloadAndDeliverPdf({
  url,
  fileName,
  headers,
  delivery = 'auto',
}: DownloadPdfOptions): Promise<PdfDeliveryResult | null> {
  return createAndDeliverPdf({
    source: { type: 'url', url, headers },
    fileName,
    delivery,
  });
}
