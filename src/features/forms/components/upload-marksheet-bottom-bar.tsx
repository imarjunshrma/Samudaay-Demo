import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

type UploadMarksheetBottomBarProps = {
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  caption?: string;
  actionLabel?: string;
};

export function UploadMarksheetBottomBar({ loading = false, disabled = false, onPress, caption = 'Academic Records', actionLabel = 'Submit Marksheet' }: UploadMarksheetBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background.surface,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[4],
        paddingBottom: spacing[6] + insets.bottom,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
      }}>
      <Button fullWidth loading={loading} disabled={disabled} onPress={onPress} rightIcon={<MaterialIcons name="send" size={18} color="#ffffff" />}>
        {actionLabel}
      </Button>
      <Text
        variant="caption"
        color={colors.text.muted}
        style={{
          marginTop: spacing[3],
          textAlign: 'center',
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
        {caption} • Community Education
      </Text>
    </View>
  );
}
