import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { ActivityIndicator, Platform, View } from 'react-native';
import Pdf from 'react-native-pdf';

import { AppHeader, AppSafeAreaView, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { colors, spacing } from '@/src/theme';

const PDF_HEADER_BASE64 = 'JVBERi0';

function parseHeaders(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    );
  } catch {
    return undefined;
  }
}

function getCacheDirectory() {
  return `${FileSystem.cacheDirectory || FileSystem.documentDirectory || ''}pdf-viewer/`;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

async function ensureDirectory(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
  }
}

async function readPdfHeaderBase64(uri: string) {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
    length: 8,
    position: 0,
  });
}

async function downloadPdfToCache(url: string, headers?: Record<string, string>) {
  const cacheDirectory = getCacheDirectory();
  if (!cacheDirectory) {
    throw new Error('PDF cache directory is not available.');
  }

  await ensureDirectory(cacheDirectory);
  const destinationUri = `${cacheDirectory}${hashString(url)}.pdf`;
  await FileSystem.deleteAsync(destinationUri, { idempotent: true });
  const result = await FileSystem.downloadAsync(url, destinationUri, { headers });

  if (result.status < 200 || result.status >= 300) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    throw new Error(`PDF request failed with status ${result.status}.`);
  }

  const info = await FileSystem.getInfoAsync(destinationUri);
  if (!info.exists || !info.size) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    throw new Error('Downloaded PDF is empty.');
  }

  const header = await readPdfHeaderBase64(destinationUri);
  if (!header.startsWith(PDF_HEADER_BASE64)) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
    throw new Error('The server did not return a valid PDF file.');
  }

  return destinationUri;
}

export function PdfViewerScreen() {
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ title?: string; url?: string; headers?: string }>();
  const title = params.title || 'PDF';
  const url = params.url || '';
  const headers = useMemo(() => parseHeaders(params.headers), [params.headers]);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLocalUri(null);
    setErrorMessage(null);

    if (!url || Platform.OS === 'web') {
      return () => {
        active = false;
      };
    }

    downloadPdfToCache(url, headers)
      .then((uri) => {
        if (active) {
          setLocalUri(uri);
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load PDF.');
        }
      });

    return () => {
      active = false;
    };
  }, [headers, url]);

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title={title} variant="back" onLeftPress={navigateBack} />
      <View style={{ flex: 1, backgroundColor: colors.background.muted }}>
        {url ? (
          <>
            {localUri ? (
              <Pdf
                source={{ uri: localUri }}
                trustAllCerts={false}
                onLoadComplete={() => setErrorMessage(null)}
                onError={(error) => {
                  setErrorMessage(error instanceof Error ? error.message : 'Unable to render PDF.');
                }}
                renderActivityIndicator={() => (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={colors.primary.DEFAULT} />
                  </View>
                )}
                style={{ flex: 1, width: '100%', height: '100%' }}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={colors.primary.DEFAULT} />
              </View>
            )}
            {errorMessage ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: spacing[4],
                }}>
                <Text color={colors.text.secondary}>{errorMessage}</Text>
              </View>
            ) : null}
          </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] }}>
            <Text color={colors.text.secondary}>{Platform.OS === 'web' ? 'PDF preview is available in the mobile app.' : 'PDF link is not available.'}</Text>
          </View>
        )}
      </View>
    </AppSafeAreaView>
  );
}
