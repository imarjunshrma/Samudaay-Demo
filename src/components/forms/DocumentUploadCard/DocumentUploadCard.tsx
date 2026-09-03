import { Image, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Icon, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

export type DocumentUploadCardProps = {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle: string;
  ctaLabel?: string;
  value?: FileValue | null;
  onPress?: () => Promise<void> | void;
  onDelete?: () => void;
  error?: string;
};

function isImageFile(file?: FileValue | null) {
  if (!file) {
    return false;
  }

  if (file.mimeType?.startsWith('image/')) {
    return true;
  }

  return /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.name) || /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.uri);
}

export function DocumentUploadCard({
  icon,
  title,
  subtitle,
  ctaLabel = 'Select File',
  value,
  onPress,
  onDelete,
  error,
}: DocumentUploadCardProps) {
  const hasImagePreview = isImageFile(value);

  return (
    <View style={{ gap: spacing[2] }}>
      <View
        style={{
          backgroundColor: colors.background.surface,
          borderRadius: radius.xl,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: error ? colors.status.error : 'rgba(24, 168, 117, 0.3)',
          padding: spacing[6],
          alignItems: 'center',
          gap: spacing[3],
        }}>
        {hasImagePreview ? (
          <Image
            source={{ uri: value?.uri }}
            style={{
              width: '100%',
              height: 176,
              borderRadius: radius.lg,
              backgroundColor: colors.background.surfaceAlt,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.full,
              backgroundColor: colors.primary.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={icon} size="md" color={colors.primary.DEFAULT} />
          </View>
        )}
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color="#64748b" style={{ textAlign: 'center' }}>
            {value?.name ?? subtitle}
          </Text>
        </View>
        {onPress || onDelete ? (
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            {onPress ? (
              <Button variant="outline" size="sm" onPress={() => void onPress?.()}>
                {value ? 'Replace File' : ctaLabel}
              </Button>
            ) : null}
            {value && onDelete ? (
              <Button variant="ghost" size="sm" onPress={onDelete}>
                Delete
              </Button>
            ) : null}
          </View>
        ) : null}
      </View>
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}
