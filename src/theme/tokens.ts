import { colors, radius as radiusScale, shadows, spacing as spacingScale, typography } from '@/src/theme';

export const palette = {
  light: {
    background: colors.background.DEFAULT,
    surface: colors.background.surface,
    surfaceMuted: colors.background.muted,
    surfaceAlt: colors.background.surfaceAlt,
    text: colors.text.primary,
    textMuted: colors.text.muted,
    primary: colors.primary.DEFAULT,
    primaryStrong: colors.primary.dark ?? colors.primary.DEFAULT,
    accent: colors.primary.dark ?? colors.primary.DEFAULT,
    border: colors.border.DEFAULT,
    success: colors.status.success,
    warning: colors.primary.DEFAULT,
    danger: colors.status.error,
    tab: colors.background.elevated,
  },
  dark: {
    background: colors.background.DEFAULT,
    surface: colors.background.surface,
    surfaceMuted: colors.background.muted,
    surfaceAlt: colors.background.surfaceAlt,
    text: colors.text.primary,
    textMuted: colors.text.muted,
    primary: colors.primary.DEFAULT,
    primaryStrong: colors.primary.dark ?? colors.primary.DEFAULT,
    accent: colors.primary.dark ?? colors.primary.DEFAULT,
    border: colors.border.DEFAULT,
    success: colors.status.success,
    warning: colors.primary.DEFAULT,
    danger: colors.status.error,
    tab: colors.background.elevated,
  },
};

export const spacing = {
  xs: spacingScale[1],
  sm: spacingScale[2],
  md: spacingScale[3],
  lg: spacingScale[4],
  xl: spacingScale[5],
  xxl: spacingScale[6],
  xxxl: spacingScale[8],
};

export const radius = {
  sm: radiusScale.sm,
  md: radiusScale.lg,
  lg: radiusScale.xl,
  pill: radiusScale.full,
};

export const legacyShadows = {
  ...shadows,
  card: shadows.md,
};

export const legacyTypography = {
  ...typography,
  display: typography.text.h2,
  title: typography.text.h4,
  subtitle: typography.text.h5,
  body: typography.text.body,
  label: typography.text.label,
};

export { legacyShadows as shadows, legacyTypography as typography };
