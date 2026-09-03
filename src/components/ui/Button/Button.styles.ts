import { colors, radius, spacing, typography } from '@/src/theme';
import type { ButtonSize, ButtonVariant } from '@/src/components/ui/Button/Button.types';

export const buttonVariantStyles: Record<
  ButtonVariant,
  {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textColor: string;
    pressedOpacity?: number;
    disabledBackgroundColor?: string;
    disabledBorderColor?: string;
    disabledTextColor?: string;
  }
> = {
  primary: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: colors.text.inverse,
    pressedOpacity: 0.92,
    disabledBackgroundColor: colors.primary.borderLight,
    disabledBorderColor: colors.primary.borderLight,
    disabledTextColor: colors.text.inverse,
  },
  secondary: {
    backgroundColor: '#2f1d16',
    borderColor: '#2f1d16',
    borderWidth: 0,
    textColor: colors.text.inverse,
    pressedOpacity: 0.92,
    disabledBackgroundColor: '#d6d3d1',
    disabledBorderColor: '#d6d3d1',
    disabledTextColor: colors.text.inverse,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: colors.primary.DEFAULT,
    pressedOpacity: 0.72,
    disabledBackgroundColor: 'transparent',
    disabledBorderColor: 'transparent',
    disabledTextColor: colors.text.disabled,
  },
  soft: {
    backgroundColor: colors.primary.muted ?? 'rgba(24, 168, 117, 0.1)',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: colors.primary.DEFAULT,
    pressedOpacity: 0.9,
    disabledBackgroundColor: colors.background.muted,
    disabledBorderColor: 'transparent',
    disabledTextColor: colors.text.disabled,
  },
  danger: {
    backgroundColor: colors.status.error,
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: colors.text.inverse,
    pressedOpacity: 0.92,
    disabledBackgroundColor: '#f5d1d1',
    disabledBorderColor: '#f5d1d1',
    disabledTextColor: colors.text.inverse,
  },
  outline: {
    backgroundColor: colors.background.surface,
    borderColor: colors.primary.border ?? colors.border.DEFAULT,
    borderWidth: 1,
    textColor: colors.primary.DEFAULT,
    pressedOpacity: 0.88,
    disabledBackgroundColor: colors.background.surface,
    disabledBorderColor: colors.border.DEFAULT,
    disabledTextColor: colors.text.disabled,
  },
};

export const buttonSizeStyles: Record<
  ButtonSize,
  { minHeight: number; paddingHorizontal: number; textStyle: object; borderRadius: number }
> = {
  sm: {
    minHeight: 36,
    paddingHorizontal: spacing[3],
    textStyle: { ...typography.text.caption, fontFamily: typography.fontFamily.semibold },
    borderRadius: radius.lg,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: spacing[4],
    textStyle: { ...typography.text.body, fontFamily: typography.fontFamily.semibold },
    borderRadius: radius.xl,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: spacing[5],
    textStyle: { ...typography.text.bodyLg, fontFamily: typography.fontFamily.bold },
    borderRadius: radius.xl,
  },
};
