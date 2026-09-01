import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';
import type { FileValue } from '@/src/types';

export function ManualDonationProofCard({
  file,
  onPress,
}: {
  file?: FileValue | null;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        borderRadius: 28,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: colors.primary.border,
        backgroundColor: '#fff7ed',
        padding: spacing[6],
        alignItems: 'center',
        gap: spacing[3],
      }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 9999,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons
          name={file ? (file.mimeType?.startsWith('image/') ? 'image' : 'description') : 'add-a-photo'}
          size={28}
          color={colors.primary.DEFAULT}
        />
      </View>
      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
        {file ? file.name : 'Upload Transaction Screenshot'}
      </Text>
      <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'center' }}>
        {file ? 'Tap to replace the selected proof file' : 'PNG, JPG or PDF up to 5MB'}
      </Text>
    </Pressable>
  );
}
