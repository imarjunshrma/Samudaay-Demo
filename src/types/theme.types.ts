export type ThemeScheme = 'light' | 'dark';

export interface AppColorScale {
  DEFAULT: string;
  light?: string;
  dark?: string;
  muted?: string;
  subtle?: string;
  border?: string;
  borderLight?: string;
}

export interface AppColors {
  primary: AppColorScale;
  background: {
    DEFAULT: string;
    warm: string;
    surface: string;
    surfaceAlt: string;
    muted: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
    inverse: string;
    brand: string;
  };
  border: {
    DEFAULT: string;
    light: string;
    muted: string;
    input: string;
  };
  status: {
    success: string;
    successLight: string;
    error: string;
    errorLight: string;
    warning: string;
    warningLight: string;
    info: string;
    infoLight: string;
  };
  semantic: {
    verified: string;
    verifiedLight: string;
  };
  admin: {
    text: string;
    accent: string;
    surface: string;
    background: string;
  };
}

export interface AppTypographyScale {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase';
}

export interface AppTypography {
  fontFamily: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
  size: {
    '2xs': number;
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  lineHeight: {
    '2xs': number;
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  text: {
    h1: AppTypographyScale;
    h2: AppTypographyScale;
    h3: AppTypographyScale;
    h4: AppTypographyScale;
    h5: AppTypographyScale;
    bodyLg: AppTypographyScale;
    body: AppTypographyScale;
    label: AppTypographyScale;
    caption: AppTypographyScale;
    navLabel: AppTypographyScale;
  };
}

export interface AppSpacing {
  0: number;
  0.5: number;
  1: number;
  1.5: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  10: number;
  12: number;
  16: number;
}

export interface AppRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface AppShadows {
  sm: object;
  md: object;
  lg: object;
}

export interface AppMotion {
  duration: {
    fast: number;
    normal: number;
    slow: number;
    shimmer: number;
  };
  scale: {
    press: number;
  };
  distance: {
    sm: number;
    md: number;
    lg: number;
  };
}

export interface AppLayout {
  screenPadding: number;
  sectionGap: number;
  itemGap: number;
  iconTextGap: number;
  headerHeight: number;
  bottomBarHeight: number;
  maxContentWidth: number;
}

export interface AppIconSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  header: number;
  bottomBar: number;
}
