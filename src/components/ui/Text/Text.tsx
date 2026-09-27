import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { colors, typography } from '@/src/theme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'bodyLg'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption'
  | 'navLabel';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
}

export function Text({ variant = 'body', color = colors.text.primary, style, ...props }: TextProps) {
  const { language } = useAppPreferences();
  const resolvedVariant = variant === 'bodySmall' ? 'caption' : variant;
  const resolvedStyle = StyleSheet.flatten([typography.text[resolvedVariant], { color }, style]);

  const normalizedStyle =
    language === 'gu'
      ? {
          ...resolvedStyle,
          textTransform: resolvedStyle?.textTransform === 'uppercase' ? 'none' : resolvedStyle?.textTransform,
          letterSpacing:
            typeof resolvedStyle?.letterSpacing === 'number' && resolvedStyle.letterSpacing > 0
              ? 0
              : resolvedStyle?.letterSpacing,
        }
      : resolvedStyle;

  return <RNText {...props} style={normalizedStyle} />;
}
