import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { colors } from '@/src/theme/colors';
import { iconSizes } from '@/src/theme/iconSizes';
import { layout } from '@/src/theme/layout';
import { motion } from '@/src/theme/motion';
import { radius } from '@/src/theme/radius';
import { shadows } from '@/src/theme/shadows';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { createNavigationTheme } from '@/src/theme/navigation-theme';
import type { ThemeScheme } from '@/src/types';

interface ThemeContextValue {
  scheme: ThemeScheme;
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
  motion: typeof motion;
  layout: typeof layout;
  iconSizes: typeof iconSizes;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({
  children,
  scheme = 'light',
}: PropsWithChildren<{ scheme?: ThemeScheme }>) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors,
      spacing,
      radius,
      shadows,
      typography,
      motion,
      layout,
      iconSizes,
    }),
    [scheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={createNavigationTheme(scheme)}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }

  return context;
}
