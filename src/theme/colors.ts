import type { AppColors } from '@/src/types';

export const colors: AppColors = {
  primary: {
    DEFAULT: '#f2780d',
    light: '#ff8928',
    dark: '#964900',
    muted: 'rgba(242, 120, 13, 0.1)',
    subtle: 'rgba(242, 120, 13, 0.05)',
    border: 'rgba(242, 120, 13, 0.2)',
    borderLight: 'rgba(242, 120, 13, 0.1)',
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
    brand: '#f2780d',
  },
  border: {
    DEFAULT: '#e7e5e4',
    light: '#d4c3be',
    muted: 'rgba(212, 195, 190, 0.3)',
    input: 'rgba(242, 120, 13, 0.2)',
  },
  status: {
    success: '#00504b',
    successLight: '#e5f5f2',
    error: '#ba1a1a',
    errorLight: '#ffedea',
    warning: '#f2780d',
    warningLight: 'rgba(242, 120, 13, 0.1)',
    info: '#0066cc',
    infoLight: '#e6f0ff',
  },
  semantic: {
    verified: '#003733',
    verifiedLight: '#00504b',
  },
  admin: {
    text: '#46291e',
    accent: '#964900',
    surface: '#f1edea',
    background: '#fdf9f6',
  },
};
