import { ActivityIndicator, Pressable, View } from 'react-native';

import type { ButtonProps } from '@/src/components/ui/Button/Button.types';
import { buttonSizeStyles, buttonVariantStyles } from '@/src/components/ui/Button/Button.styles';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing } from '@/src/theme';

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingLabel,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  children,
  rounded = false,
}: ButtonProps) {
  const variantStyle = buttonVariantStyles[variant];
  const sizeStyle = buttonSizeStyles[size];
  const isDisabled = disabled || loading;
  const backgroundColor = isDisabled
    ? variantStyle.disabledBackgroundColor ?? colors.border.DEFAULT
    : variantStyle.backgroundColor;
  const borderColor = isDisabled
    ? variantStyle.disabledBorderColor ?? variantStyle.borderColor
    : variantStyle.borderColor;
  const textColor = isDisabled
    ? variantStyle.disabledTextColor ?? colors.text.disabled
    : variantStyle.textColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? variantStyle.pressedOpacity ?? 0.92 : 1,
          width: fullWidth ? '100%' : undefined,
        },
      ]}>
      <View
        style={{
          minHeight: sizeStyle.minHeight,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: size === 'lg' ? spacing[4] : spacing[3],
          borderRadius: rounded ? radius.full : sizeStyle.borderRadius,
          backgroundColor,
          borderColor,
          borderWidth: variantStyle.borderWidth,
          width: fullWidth ? '100%' : undefined,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2] }}>
        {loading ? <ActivityIndicator size="small" color={textColor} /> : leftIcon}
        <Text style={sizeStyle.textStyle} color={textColor}>
          {loading && loadingLabel ? loadingLabel : children}
        </Text>
        {loading ? null : rightIcon}
        </View>
      </View>
    </Pressable>
  );
}
