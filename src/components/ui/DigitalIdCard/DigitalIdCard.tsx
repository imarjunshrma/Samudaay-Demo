import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

import { apiConfig } from '@/src/constants/apiConfig';
import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { communityConfig } from '@/src/core/config/community';
import { useAppLanguageText } from '@/src/services/translation/app-language-text';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export type DigitalIdCardVariant = 'full' | 'compact';

export interface DigitalIdCardProps {
  memberName: string;
  memberId: string;
  location: string;
  validity: string;
  photo?: string | null;
  qrImage?: string | null;
  variant?: DigitalIdCardVariant;
  memberLabel?: string;
  idLabel?: string;
  validityLabel?: string;
}

const CARD_MIME_TYPE = 'image/png';
const CARD_UTI = 'public.png';
const PNG_HEADER_BASE64 = 'iVBORw0KGgo';
const CARD_DIRECTORY_NAME = 'cards';
const EXPORT_CARD_WIDTH = 640;
const EXPORT_CARD_HEIGHT = 292;

const ANDROID_ACTION_VIEW = 'android.intent.action.VIEW';
const ANDROID_CATEGORY_DEFAULT = 'android.intent.category.DEFAULT';
const ANDROID_GRANT_READ_URI_PERMISSION = 1;

function normalizeCardFileName(value: string) {
  const cleaned = value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ');
  const safeName = cleaned || `membership-card-${Date.now()}`;

  return safeName.toLowerCase().endsWith('.png') ? safeName : `${safeName}.png`;
}

function resolveCardPhotoUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  const trimmed = fileUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(https?:|file:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  if (!apiConfig.isConfigured) {
    return null;
  }

  return `${apiConfig.baseUrl}/${trimmed.replace(/^\/+/, '')}`;
}

function getDocumentDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error('Card document directory is not available.');
  }

  return FileSystem.documentDirectory;
}

function joinUri(directoryUri: string, name: string) {
  return `${directoryUri.replace(/\/?$/, '/')}${name}`;
}

async function ensureCardDirectory() {
  const directoryUri = joinUri(getDocumentDirectory(), CARD_DIRECTORY_NAME);

  try {
    const info = await FileSystem.getInfoAsync(directoryUri);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }
  } catch (error) {
    logCardFlow('error', 'Unable to prepare persistent card directory.', {
      directoryUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to prepare card storage: ${getErrorMessage(error)}`);
  }

  return directoryUri;
}

async function getPersistentCardUri(fileName: string) {
  const directoryUri = await ensureCardDirectory();
  return joinUri(directoryUri, normalizeCardFileName(fileName));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}

function logCardFlow(level: 'info' | 'warn' | 'error', message: string, details?: Record<string, unknown>) {
  const payload = {
    platform: Platform.OS,
    ...details,
  };

  if (level === 'error') {
    console.error(`[digital-card] ${message}`, payload);
  } else if (level === 'warn') {
    console.warn(`[digital-card] ${message}`, payload);
  } else {
    console.log(`[digital-card] ${message}`, payload);
  }
}

async function assertReadablePng(uri: string, context: string) {
  const info = await FileSystem.getInfoAsync(uri);

  logCardFlow('info', `${context}: file info`, {
    uri,
    exists: info.exists,
    size: info.exists ? info.size : undefined,
  });

  if (!info.exists) {
    throw new Error(`${context}: image file was not created.`);
  }

  if (!info.size || info.size <= 0) {
    throw new Error(`${context}: image file is empty.`);
  }

  const header = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
    position: 0,
    length: 8,
  });
  if (!header.startsWith(PNG_HEADER_BASE64)) {
    throw new Error(`${context}: captured file is not a valid PNG image.`);
  }

  return info.size;
}

async function getAndroidContentUri(fileUri: string) {
  if (Platform.OS !== 'android') {
    return undefined;
  }

  try {
    const contentUri = await FileSystem.getContentUriAsync(fileUri);
    if (!contentUri?.startsWith('content://')) {
      throw new Error(`Invalid Android content URI: ${contentUri || 'empty'}.`);
    }

    logCardFlow('info', 'Resolved Android content URI.', {
      fileUri,
      contentUri,
    });
    return contentUri;
  } catch (error) {
    logCardFlow('error', 'Unable to resolve Android content URI.', {
      fileUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to prepare Android card permission URI: ${getErrorMessage(error)}`);
  }
}

async function openCardOnAndroid(fileName: string, fileUri: string, contentUri: string, size: number) {
  try {
    logCardFlow('info', 'Opening Android digital card with IntentLauncher.', {
      fileName,
      fileUri,
      contentUri,
      size,
      flags: ANDROID_GRANT_READ_URI_PERMISSION,
    });

    await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
      data: contentUri,
      type: CARD_MIME_TYPE,
      category: ANDROID_CATEGORY_DEFAULT,
      flags: ANDROID_GRANT_READ_URI_PERMISSION,
    });
  } catch (error) {
    logCardFlow('error', 'Android digital card open failed.', {
      fileName,
      fileUri,
      contentUri,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to open card on Android: ${getErrorMessage(error)}`);
  }
}

async function shareCardOnIos(fileName: string, fileUri: string, size: number) {
  try {
    const available = await Sharing.isAvailableAsync();

    logCardFlow('info', 'iOS digital card sharing availability checked.', {
      available,
      fileName,
      fileUri,
      size,
    });

    if (!available) {
      throw new Error('Native sharing is not available on this device.');
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: CARD_MIME_TYPE,
      UTI: CARD_UTI,
      dialogTitle: fileName,
    });
  } catch (error) {
    logCardFlow('error', 'iOS digital card share failed.', {
      fileName,
      fileUri,
      size,
      error: getErrorMessage(error),
    });
    throw new Error(`Unable to share card: ${getErrorMessage(error)}`);
  }
}

export function DigitalIdCard({
  memberName,
  memberId,
  location,
  validity,
  photo,
  qrImage,
  variant = 'full',
  memberLabel = 'Committee Member',
  idLabel = 'ID',
  validityLabel = 'Valid thru',
}: DigitalIdCardProps) {
  const cardRef = useRef<View>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { tenantName, logoSource } = useLocalizedBrandText();
  const communityName = tenantName || communityConfig.brandName || 'Community';
  const localizedLocation = useAppLanguageText(location);
  const resolvedPhoto = resolveCardPhotoUrl(photo);
  const resolvedQrImage = resolveCardPhotoUrl(qrImage);
  const [isQrReady, setIsQrReady] = useState(!resolvedQrImage);
  const [hasQrLoadFailed, setHasQrLoadFailed] = useState(false);
  const isCompact = variant === 'compact';
  const logoSize = isCompact ? 42 : 48;
  const photoSize = isCompact ? 70 : 88;
  const qrSize = isCompact ? 52 : 64;

  useEffect(() => {
    setHasQrLoadFailed(false);
    setIsQrReady(!resolvedQrImage);
  }, [resolvedQrImage]);

  async function handleDownloadPress() {
    if (isDownloading) {
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('Download unavailable', 'Card download is not supported on web.');
      return;
    }

    const cardNode = cardRef.current;
    if (!cardNode) {
      Alert.alert('Download unavailable', 'Card is not ready yet.');
      return;
    }

    if (resolvedQrImage && !isQrReady) {
      Alert.alert('Download unavailable', 'Card QR code is still loading. Please try again in a moment.');
      return;
    }

    try {
      setIsDownloading(true);
      const fileName = normalizeCardFileName(`${communityName}-${memberId}-card.png`);
      const destinationUri = await getPersistentCardUri(fileName);

      logCardFlow('info', 'Starting digital card capture.', {
        fileName,
        destinationUri,
        memberId,
      });

      const capturedUri = await captureRef(cardNode, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width: EXPORT_CARD_WIDTH,
        height: EXPORT_CARD_HEIGHT,
      });

      logCardFlow('info', 'Digital card capture completed.', {
        capturedUri,
        destinationUri,
      });

      await assertReadablePng(capturedUri, 'Digital card capture');
      await FileSystem.deleteAsync(destinationUri, { idempotent: true }).catch((error) => {
        logCardFlow('warn', 'Unable to delete existing persistent card before copy.', {
          destinationUri,
          error: getErrorMessage(error),
        });
      });
      await FileSystem.copyAsync({
        from: capturedUri,
        to: destinationUri,
      });
      await FileSystem.deleteAsync(capturedUri, { idempotent: true }).catch((error) => {
        logCardFlow('warn', 'Unable to delete temporary captured card.', {
          capturedUri,
          error: getErrorMessage(error),
        });
      });

      const size = await assertReadablePng(destinationUri, 'Digital card delivery');
      const contentUri = await getAndroidContentUri(destinationUri);

      logCardFlow('info', 'Digital card ready.', {
        fileName,
        fileUri: destinationUri,
        contentUri,
        size,
      });

      if (Platform.OS === 'android') {
        if (!contentUri) {
          throw new Error('Android card content URI is missing.');
        }
        await openCardOnAndroid(fileName, destinationUri, contentUri, size);
        return;
      }

      await shareCardOnIos(fileName, destinationUri, size);
    } catch (error) {
      Alert.alert('Unable to download card', getErrorMessage(error));
    } finally {
      setIsDownloading(false);
    }
  }

  function renderCard({ exportMode = false }: { exportMode?: boolean } = {}) {
    return (
      <View
        ref={exportMode ? cardRef : undefined}
        collapsable={false}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: exportMode ? EXPORT_CARD_WIDTH : '100%',
          maxWidth: EXPORT_CARD_WIDTH,
          height: exportMode ? EXPORT_CARD_HEIGHT : undefined,
          alignSelf: 'center',
          borderRadius: radius.xl,
          paddingHorizontal: isCompact ? spacing[4] : spacing[5],
          paddingTop: isCompact ? spacing[4] : spacing[5],
          paddingBottom: isCompact ? spacing[4] : spacing[5],
          backgroundColor: colors.primary.DEFAULT,
          ...shadows.lg,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[2] }}>
          <View
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 4,
            }}>
            <Image source={logoSource} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}>
            <Text
              variant="caption"
              color={colors.text.inverse}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.76}
              style={{
                textTransform: 'uppercase',
                fontFamily: typography.fontFamily.bold,
                fontSize: isCompact ? 12 : 15,
                lineHeight: isCompact ? 17 : 21,
              }}>
              {communityName}
            </Text>
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: spacing[2],
                borderRadius: radius.full,
                backgroundColor: 'rgba(151,70,0,0.35)',
                paddingHorizontal: isCompact ? spacing[3] : spacing[4],
                paddingVertical: 5,
              }}>
              <Text
                variant="caption"
                color={colors.text.inverse}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.76}
                style={{ fontFamily: typography.fontFamily.semibold, fontSize: isCompact ? 12 : 14 }}>
                {memberLabel}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: isCompact ? spacing[3] : spacing[4], alignItems: 'center' }}>
          <View
            style={{
              width: photoSize,
              height: photoSize,
              borderRadius: radius.full,
              backgroundColor: colors.background.surface,
              padding: 4,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {resolvedPhoto ? (
              <Image source={{ uri: resolvedPhoto }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: radius.full }} />
            ) : (
              <Icon name="person" size={isCompact ? 34 : 40} color={colors.primary.DEFAULT} />
            )}
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              variant={isCompact ? 'h4' : 'h2'}
              color={colors.text.inverse}
              numberOfLines={exportMode ? 2 : 1}
              ellipsizeMode={exportMode ? undefined : 'tail'}
              adjustsFontSizeToFit={exportMode}
              minimumFontScale={exportMode ? 0.68 : undefined}
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: isCompact ? 22 : 30,
                lineHeight: isCompact ? 27 : 36,
                textTransform: 'uppercase',
              }}>
              {memberName}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: isCompact ? spacing[4] : spacing[5],
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.25)',
            paddingTop: spacing[3],
            flexDirection: 'row',
            alignItems: 'center',
            gap: isCompact ? spacing[2] : spacing[3],
          }}>
          <View
            style={{
              width: isCompact ? 68 : 84,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surface,
              paddingHorizontal: isCompact ? 4 : 6,
              paddingVertical: isCompact ? 3 : 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: isCompact ? 4 : spacing[1],
            }}>
            <Icon name="badge" size={isCompact ? 12 : 14} color={colors.primary.DEFAULT} />
            <Text
              variant="body"
              color={colors.text.primary}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              style={{ flex: 1, fontFamily: typography.fontFamily.bold, fontSize: isCompact ? 9 : 11 }}>
              {idLabel}: {memberId}
            </Text>
          </View>

          <View style={{ flex: 1, gap: spacing[2] }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] }}>
              <View style={{ width: isCompact ? 20 : 24, height: isCompact ? 20 : 24, borderRadius: radius.full, backgroundColor: colors.background.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="location-on" size={isCompact ? 10 : 12} color={colors.primary.DEFAULT} />
              </View>
              <Text
                variant="caption"
                color={colors.text.inverse}
                numberOfLines={2}
                style={{ flex: 1, fontFamily: typography.fontFamily.semibold, fontSize: isCompact ? 11 : 13, lineHeight: isCompact ? 14 : 17 }}>
                {localizedLocation || '-'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ width: isCompact ? 20 : 24, height: isCompact ? 20 : 24, borderRadius: radius.full, backgroundColor: colors.background.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bloodtype" size={isCompact ? 10 : 12} color={colors.status.error} />
              </View>
              <Text
                variant="caption"
                color={colors.text.inverse}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                style={{ flex: 1, fontFamily: typography.fontFamily.semibold, fontSize: isCompact ? 12 : 14 }}>
                {validityLabel}: {validity}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: qrSize,
              height: qrSize,
              borderRadius: radius.md,
              backgroundColor: colors.background.surface,
              padding: isCompact ? 3 : 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {resolvedQrImage && !hasQrLoadFailed ? (
              <Image
                source={{ uri: resolvedQrImage }}
                resizeMode="contain"
                onLoadEnd={() => setIsQrReady(true)}
                onError={() => {
                  setHasQrLoadFailed(true);
                  setIsQrReady(true);
                }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Icon name="qr-code-2" size={isCompact ? 44 : 54} color={colors.text.primary} />
            )}
          </View>
        </View>

        <View style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.1 }}>
          <Icon name="badge" size={160} color={colors.text.inverse} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: spacing[3] }}>
      {renderCard()}

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -EXPORT_CARD_WIDTH - 100,
          top: 0,
          width: EXPORT_CARD_WIDTH,
          height: EXPORT_CARD_HEIGHT,
        }}>
        {renderCard({ exportMode: true })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Download or share membership card"
        onPress={() => void handleDownloadPress()}
        style={{
          alignSelf: 'center',
          minHeight: 44,
          borderRadius: radius.full,
          paddingHorizontal: spacing[5],
          flexDirection: 'row',
          gap: spacing[2],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
        }}>
        {isDownloading ? <ActivityIndicator size="small" color={colors.primary.DEFAULT} /> : <Icon name="download" size={18} color={colors.primary.DEFAULT} />}
        <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold }}>
          Download / Share Card
        </Text>
      </Pressable>
    </View>
  );
}
