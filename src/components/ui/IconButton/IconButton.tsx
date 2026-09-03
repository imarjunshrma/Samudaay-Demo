import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon, type IconName } from '@/src/components/ui/Icon';
import { colors, radius } from '@/src/theme';

export type IconButtonVariant = 'plain' | 'soft' | 'outlined' | 'filled';
export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap = {
  sm: { box: 32, icon: 16 },
  md: { box: 44, icon: 20 },
  lg: { box: 48, icon: 22 },
  xl: { box: 56, icon: 26 },
} as const;

const variantMap = {
  plain: { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent' },
  soft: {
    backgroundColor: colors.primary.muted ?? 'rgba(24,168,117,0.1)',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  outlined: { backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.border ?? colors.border.DEFAULT },
  filled: { backgroundColor: colors.primary.DEFAULT, borderWidth: 0, borderColor: 'transparent' },
} as const;

export interface IconButtonProps {
  icon: IconName;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  onPress?: () => void;
  color?: string;
  backgroundColor?: string;
  bordered?: boolean;
  disabled?: boolean;
}

function IconButtonInner({
  icon,
  size = 'md',
  variant,
  onPress,
  color,
  backgroundColor,
  bordered = false,
  disabled = false,
}: IconButtonProps) {
  const config = sizeMap[size];
  const resolvedVariant = variant ?? (bordered ? 'outlined' : backgroundColor ? 'filled' : 'plain');
  const scheme = variantMap[resolvedVariant];
  const resolvedBackgroundColor = backgroundColor ?? scheme.backgroundColor;
  const resolvedIconColor =
    color ?? (resolvedVariant === 'filled' ? colors.text.inverse : resolvedVariant === 'plain' ? colors.text.primary : colors.primary.DEFAULT);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={disabled ? disabledState : enabledState}
      disabled={disabled}
      hitSlop={10}
      onPress={onPress}
      pressRetentionOffset={12}
      style={({ pressed }) => [
        styles.base,
        {
          width: config.box,
          height: config.box,
          backgroundColor: resolvedBackgroundColor,
          borderWidth: scheme.borderWidth,
          borderColor: scheme.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
        },
      ]}>
      <Icon name={icon} size={config.icon} color={resolvedIconColor} />
    </Pressable>
  );
}

export const IconButton = memo(IconButtonInner);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
});

const disabledState = { disabled: true };
const enabledState = { disabled: false };
