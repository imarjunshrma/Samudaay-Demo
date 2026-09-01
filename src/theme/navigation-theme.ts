import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { colors } from '@/src/theme/colors';

export function createNavigationTheme(mode: 'light' | 'dark'): Theme {
  return {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary.DEFAULT,
      background: colors.background.DEFAULT,
      card: colors.background.surface,
      text: colors.text.primary,
      border: colors.border.DEFAULT,
      notification: colors.primary.dark ?? colors.primary.DEFAULT,
    },
  };
}
