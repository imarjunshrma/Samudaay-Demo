import type { AppTypography } from '@/src/types';

export const fontFamily = {
  regular: 'PublicSans_400Regular',
  medium: 'PublicSans_500Medium',
  semibold: 'PublicSans_600SemiBold',
  bold: 'PublicSans_700Bold',
  extrabold: 'PublicSans_800ExtraBold',
} as const;

export const typography: AppTypography = {
  fontFamily,
  size: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 44,
  },
  lineHeight: {
    '2xs': 14,
    xs: 16,
    sm: 20,
    base: 24,
    lg: 26,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
    '5xl': 52,
  },
  text: {
    h1: { fontFamily: fontFamily.extrabold, fontSize: 36, lineHeight: 44, fontWeight: '800' },
    h2: { fontFamily: fontFamily.bold, fontSize: 30, lineHeight: 38, fontWeight: '700' },
    h3: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32, fontWeight: '700' },
    h4: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28, fontWeight: '700' },
    h5: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 26, fontWeight: '600' },
    bodyLg: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24, fontWeight: '400' },
    body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, fontWeight: '400' },
    label: {
      fontFamily: fontFamily.semibold,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    caption: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16, fontWeight: '500' },
    navLabel: {
      fontFamily: fontFamily.medium,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
  },
};
