import type { AppColors } from '@/src/types';

const defaultPrimary = {
  DEFAULT: '#18a875',
  light: '#2ecb98',
  dark: '#256fd4',
  muted: 'rgba(24, 168, 117, 0.1)',
  subtle: 'rgba(24, 168, 117, 0.05)',
  border: 'rgba(24, 168, 117, 0.2)',
  borderLight: 'rgba(24, 168, 117, 0.1)',
};

function normalizeHexColor(value?: string | null) {
  const next = String(value || '').trim();
  return /^#[0-9A-Fa-f]{6}$/.test(next) ? next : null;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const colors: AppColors = {
  primary: {
    ...defaultPrimary,
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

export function applyCommunityTheme(theme?: { primaryColor?: string | null; secondaryColor?: string | null } | null) {
  const primary = normalizeHexColor(theme?.primaryColor) || defaultPrimary.DEFAULT;
  const secondary = normalizeHexColor(theme?.secondaryColor) || defaultPrimary.dark;

  colors.primary.DEFAULT = primary;
  colors.primary.light = primary;
  colors.primary.dark = secondary;
  colors.primary.muted = rgba(primary, 0.1);
  colors.primary.subtle = rgba(primary, 0.05);
  colors.primary.border = rgba(primary, 0.2);
  colors.primary.borderLight = rgba(primary, 0.1);
  colors.text.brand = primary;
  colors.border.input = rgba(primary, 0.2);
  colors.status.warning = primary;
  colors.status.warningLight = rgba(primary, 0.1);
  colors.admin.accent = secondary;
}
