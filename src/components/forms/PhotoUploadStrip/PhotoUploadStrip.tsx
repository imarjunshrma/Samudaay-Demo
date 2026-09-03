import { useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { useCroppedImagePicker } from '@/src/services/device/use-cropped-image-picker';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

export type PhotoUploadStripProps = {
  label?: string;
  value?: FileValue[];
  onChange?: (value: FileValue[]) => void;
  maxPhotos?: number;
};

export function PhotoUploadStrip({ label = 'Upload Photos (Max 5)', value, onChange, maxPhotos = 5 }: PhotoUploadStripProps) {
  const [localValue, setLocalValue] = useState<FileValue[]>(value ?? []);
  const { pickImage, cropper } = useCroppedImagePicker();
  const photos = value ?? localValue;

  const slots = useMemo(() => Array.from({ length: maxPhotos }, (_, index) => photos[index]), [maxPhotos, photos]);

  async function handlePick(replaceIndex?: number) {
    const nextPhoto = await pickImage({ fileNamePrefix: 'photo' });
    if (!nextPhoto) {
      return;
    }

    const nextValue = [...photos];
    if (replaceIndex !== undefined) {
      nextValue[replaceIndex] = nextPhoto;
    } else {
      const emptyIndex = nextValue.length < maxPhotos ? nextValue.length : maxPhotos - 1;
      nextValue[emptyIndex] = nextPhoto;
    }

    const resolvedValue = nextValue.filter(Boolean).slice(0, maxPhotos);
    if (value === undefined) {
      setLocalValue(resolvedValue);
    }
    onChange?.(resolvedValue);
  }

  function handleRemove(index: number) {
    const nextValue = photos.filter((_, currentIndex) => currentIndex !== index);
    if (value === undefined) {
      setLocalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return (
    <View style={{ marginBottom: spacing[4] }}>
      <Text variant="body" style={{ marginBottom: spacing[3], color: '#46291e', fontFamily: typography.fontFamily.bold }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], paddingBottom: spacing[2] }}>
        {slots.map((photo, index) => {
          if (photo) {
            return (
              <View key={`${photo.uri}-${index}`} style={{ position: 'relative' }}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => void handlePick(index)} style={{ width: 96, height: 96, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(24,168,117,0.2)' }}>
                  <Image source={{ uri: photo.uri }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleRemove(index)}
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    backgroundColor: '#ef4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: '#f8f7f5',
                  }}>
                  <Text variant="caption" color="#ffffff" style={{ fontSize: 12, lineHeight: 12 }}>
                    x
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={`empty-${index}`}
              activeOpacity={0.85}
              onPress={() => void handlePick()}
              style={{
                width: 96,
                height: 96,
                borderRadius: radius.lg,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: index === 0 ? 'rgba(24,168,117,0.3)' : '#d1d5db',
                backgroundColor: index === 0 ? 'rgba(24,168,117,0.05)' : '#f8fafc',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text variant="caption" color={index === 0 ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 24, lineHeight: 24 }}>
                ＋
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {cropper}
    </View>
  );
}
