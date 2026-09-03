import type { AppColors } from '@/src/types';

export const colors: AppColors = {
  primary: {
    DEFAULT: '#18a875',
    light: '#2ecb98',
    dark: '#256fd4',
    muted: 'rgba(24, 168, 117, 0.1)',
    subtle: 'rgba(24, 168, 117, 0.05)',
    border: 'rgba(24, 168, 117, 0.2)',
    borderLight: 'rgba(24, 168, 117, 0.1)',
  },
  background: {
    DEFAULT: '#f8f7f5',
    warm: '#fdf9f6',
    surface: '#ffffff',
    surfaceAlt: '#f7f3f0',
    muted: '#f5f5f4',
    elevated: '#f1edea',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#504441',
    muted: '#78716c',
    disabled: '#a8a29e',
    inverse: '#ffffff',
    brand: '#18a875',
  },
  border: {
    DEFAULT: '#e7e5e4',
    light: '#d4c3be',
    muted: 'rgba(212, 195, 190, 0.3)',
    input: 'rgba(24, 168, 117, 0.2)',
  },
  status: {
    success: '#00504b',
    successLight: '#e5f5f2',
    error: '#ba1a1a',
    errorLight: '#ffedea',
    warning: '#18a875',
    warningLight: 'rgba(24, 168, 117, 0.1)',
    info: '#0066cc',
    infoLight: '#e6f0ff',
  },
  semantic: {
    verified: '#003733',
    verifiedLight: '#00504b',
  },
  admin: {
    text: '#46291e',
    accent: '#256fd4',
    surface: '#f1edea',
    background: '#fdf9f6',
  },
};
