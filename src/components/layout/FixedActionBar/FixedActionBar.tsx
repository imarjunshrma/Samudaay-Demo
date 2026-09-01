import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { colors, spacing } from '@/src/theme';

type FixedActionBarAction = {
  key: string;
  label: string;
  onPress?: () => void;
  variant?: React.ComponentProps<typeof Button>['variant'];
  disabled?: boolean;
  loading?: boolean;
  flex?: number;
  leftIcon?: React.ComponentProps<typeof Button>['leftIcon'];
  rightIcon?: React.ComponentProps<typeof Button>['rightIcon'];
};

export interface FixedActionBarProps {
  actions: readonly FixedActionBarAction[];
  contentMaxWidth?: number | null;
  backgroundColor?: string;
}

export function FixedActionBar({ actions, contentMaxWidth = 672, backgroundColor = colors.background.DEFAULT }: FixedActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        elevation: 20,
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        backgroundColor,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
        paddingBottom: spacing[4] + insets.bottom,
      }}>
      <View
        style={{
          maxWidth: contentMaxWidth ?? undefined,
          width: '100%',
          alignSelf: 'center',
          flexDirection: 'row',
          gap: spacing[3],
        }}>
        {actions.map((action) => (
          <View key={action.key} style={{ flex: action.flex ?? 1 }}>
            <Button
              variant={action.variant ?? 'primary'}
              fullWidth
              onPress={action.onPress}
              disabled={action.disabled}
              loading={action.loading}
              leftIcon={action.leftIcon}
              rightIcon={
                typeof action.rightIcon === 'string'
                  ? <MaterialIcons name={action.rightIcon as ComponentProps<typeof MaterialIcons>['name']} size={18} color="#fff" />
                  : action.rightIcon
              }>
              {action.label}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}
