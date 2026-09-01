import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Button } from '@/src/components/ui';
import { colors, spacing } from '@/src/theme';

type SubmitBarAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type SubmitBarProps = {
  primaryAction: SubmitBarAction;
  secondaryAction?: SubmitBarAction;
  sticky?: boolean;
};

export function SubmitBar({ primaryAction, secondaryAction, sticky = false }: SubmitBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing[3],
        ...(sticky
          ? {
              borderTopWidth: 1,
              borderTopColor: colors.primary.borderLight,
              backgroundColor: colors.background.surface,
              paddingTop: spacing[3],
            }
          : undefined),
      }}>
      {secondaryAction ? (
        <View style={{ flex: 1 }}>
          <Button
            variant={secondaryAction.variant ?? 'outline'}
            fullWidth
            loading={secondaryAction.loading}
            disabled={secondaryAction.disabled}
            leftIcon={secondaryAction.leftIcon}
            rightIcon={secondaryAction.rightIcon}
            rounded
            onPress={secondaryAction.onPress}>
            {secondaryAction.label}
          </Button>
        </View>
      ) : null}
      <View style={{ flex: secondaryAction ? 2 : 1 }}>
        <Button
          variant={primaryAction.variant ?? 'primary'}
          fullWidth
          loading={primaryAction.loading}
          disabled={primaryAction.disabled}
          leftIcon={primaryAction.leftIcon}
          rightIcon={primaryAction.rightIcon}
          rounded
          onPress={primaryAction.onPress}>
          {primaryAction.label}
        </Button>
      </View>
    </View>
  );
}
