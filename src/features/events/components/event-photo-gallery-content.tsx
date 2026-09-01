import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Share, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';

import { AppHeader, Dialog, Text, type DialogVariant } from '@/src/components';
import { ImageViewer } from '@/src/components/media';
import { useTranslations } from '@/src/i18n/use-translations';
import { ensureCameraPermission } from '@/src/services/device/app-permissions';
import { isAllowedUploadImageFile, showInvalidUploadFormatAlert } from '@/src/services/files/upload-file-policy';
import { colors, radius, spacing, typography } from '@/src/theme';
import { EventFloatingAction } from './event-shared-blocks';
import { eventService, type EventGalleryRecord, type EventRecord } from '../services/event-service';
import { buildEventSharePayload } from '../services/event-share';

type GalleryImage = {
  uri: string;
  workshop: boolean;
  label?: string;
  isUploading?: boolean;
};

export function EventPhotoGalleryContent() {
  const t = useTranslations('events.event-photo-gallery');
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [canUpload, setCanUpload] = useState(false);
  const [capturedImages, setCapturedImages] = useState<GalleryImage[]>([]);
  const [galleryRecords, setGalleryRecords] = useState<EventGalleryRecord[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({ visible: false, variant: 'info', title: '' });
  const galleryImages = useMemo(
    () => [
      ...capturedImages,
      ...galleryRecords.map((item) => ({
        uri: item.fileUrl,
        workshop: String(item.category || '').toLowerCase() === 'workshop',
        label: item.caption || undefined,
      })),
    ],
    [capturedImages, galleryRecords],
  );
  const visibleImages = useMemo(() => galleryImages, [galleryImages]);
  const viewerImages = useMemo(() => visibleImages.map((image) => ({ uri: image.uri })), [visibleImages]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const resolvedEventId = eventId || (await eventService.loadEventOverview()).eventId;
      if (!resolvedEventId) return null;
      const [eventRecord, gallery, myPasses] = await Promise.all([
        eventService.loadEvent(resolvedEventId),
        eventService.loadEventGallery(resolvedEventId),
        eventService.loadMyEventPasses(),
      ]);
      return { eventRecord, gallery, myPasses, resolvedEventId };
    };
    load().then((result) => {
      if (!active || !result) return;
      setEvent(result.eventRecord);
      setGalleryRecords(result.gallery);
      setCanUpload(result.myPasses.some((item) => item.eventId === result.resolvedEventId));
    });
    return () => {
      active = false;
    };
  }, [eventId]);

  const handleCapturePress = async () => {
    const permission = await ensureCameraPermission({
      deniedMessage: t('errors.cameraDenied'),
      blockedMessage: t('errors.cameraBlocked'),
    });
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const nextFile = {
        uri: asset.uri,
        name: asset.fileName || `event-${event?.id || eventId || 'capture'}-${Date.now()}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
      };
      if (!isAllowedUploadImageFile(nextFile)) {
        showInvalidUploadFormatAlert();
        return;
      }
      const optimistic = { uri: asset.uri, workshop: false, isUploading: true };
      setCapturedImages((current) => [optimistic, ...current]);
      try {
        const resolvedEventId = event?.id || eventId || (await eventService.loadEventOverview()).eventId;
        if (!resolvedEventId) {
          throw new Error(t('errors.eventUnavailable'));
        }
        const uploaded = await eventService.uploadEventGalleryImage(resolvedEventId, {
          uri: nextFile.uri,
          name: nextFile.name,
          type: nextFile.mimeType || 'image/jpeg',
        });
        setCapturedImages((current) => current.filter((image) => image.uri !== optimistic.uri));
        setGalleryRecords((current) => [uploaded, ...current]);
      } catch (error) {
        setCapturedImages((current) => current.filter((image) => image.uri !== optimistic.uri));
        setDialog({
          visible: true,
          variant: 'error',
          title: t('errors.uploadTitle'),
          description: error instanceof Error ? error.message : t('errors.uploadDescription'),
        });
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share(buildEventSharePayload(event, t('title')));
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: t('errors.shareTitle'),
        description: error instanceof Error ? error.message : t('errors.shareDescription'),
      });
    }
  };

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={event?.title || t('title')}
          subtitle={t('subtitle')}
          variant="back"
          rightIcon="share"
          onRightPress={() => {
            void handleShare();
          }}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3], padding: spacing[4] }}>
          {visibleImages.map((image, index) => (
            <View key={`${image.uri}-${index}`} style={{ width: '48%', aspectRatio: 4 / 5 }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setViewerIndex(index)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  backgroundColor: colors.primary.subtle,
                }}>
                <Image source={{ uri: image.uri }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                {index === 0 && image.label ? (
                  <View style={{ position: 'absolute', left: spacing[3], right: spacing[3], bottom: spacing[3] }}>
                    <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.medium }}>
                      {image.label}
                    </Text>
                  </View>
                ) : null}
                {image.workshop ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: spacing[2],
                      right: spacing[2],
                      borderRadius: radius.full,
                      backgroundColor: colors.primary.DEFAULT,
                      paddingHorizontal: spacing[2],
                      paddingVertical: 4,
                    }}>
                    <Text
                      variant="caption"
                      color={colors.text.inverse}
                      style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase' }}>
                      {t('badges.workshop')}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
              {image.isUploading ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.35)',
                    borderRadius: radius.xl,
                  }}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              ) : null}
            </View>
          ))}
          {!visibleImages.length ? (
            <View style={{ width: '100%', paddingVertical: spacing[10] }}>
              <Text variant="body" color="#64748b" style={{ textAlign: 'center' }}>{t('empty')}</Text>
            </View>
          ) : null}
        </View>

        <ImageViewer
          images={viewerImages}
          imageIndex={viewerIndex ?? 0}
          visible={viewerIndex !== null}
          presentationStyle="fullScreen"
          backgroundColor="rgba(15,23,42,0.96)"
          HeaderComponent={() => (
            <View style={{ width: '100%', paddingTop: spacing[6], paddingHorizontal: spacing[4], alignItems: 'flex-end' }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close image preview"
                onPress={() => setViewerIndex(null)}
                hitSlop={10}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(15,23,42,0.56)',
                }}>
                <MaterialIcons name="close" size={22} color="#ffffff" />
              </Pressable>
            </View>
          )}
          onRequestClose={() => setViewerIndex(null)}
        />

        {canUpload ? (
          <View style={{ position: 'absolute', right: spacing[6], bottom: 92 }}>
            <EventFloatingAction icon="photo-camera" onPress={() => void handleCapturePress()} />
          </View>
        ) : null}
        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => setDialog((current) => ({ ...current, visible: false }))}
          onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </SafeAreaViewNative>
  );
}
