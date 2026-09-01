import { View } from 'react-native';

import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { colors, spacing, typography } from '@/src/theme';

export interface StickySummaryActionBarProps {
  label: string;
  value: string;
  buttonLabel: string;
  buttonIcon?: React.ComponentProps<typeof Button>['leftIcon'];
  onButtonPress?: () => void;
}

export function StickySummaryActionBar({
  label,
  value,
  buttonLabel,
  buttonIcon,
  onButtonPress,
}: StickySummaryActionBarProps) {
  const bottomPadding = useBottomSafeSpacing(spacing[4]);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        backgroundColor: 'rgba(255,255,255,0.96)',
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
        paddingBottom: bottomPadding,
      }}>
      <View
        style={{
          maxWidth: 672,
          width: '100%',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[4],
        }}>
        <View>
          <Text
            variant="caption"
            color="#64748b"
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
            {label}
          </Text>
          <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold }}>
            {value}
          </Text>
        </View>
        <View style={{ flexShrink: 1 }}>
          <Button leftIcon={buttonIcon} onPress={onButtonPress}>
            {buttonLabel}
          </Button>
        </View>
      </View>
    </View>
  );
}
