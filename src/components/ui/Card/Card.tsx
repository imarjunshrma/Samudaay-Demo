import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/src/theme';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'muted' | 'primary';

export interface CardProps {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const paddingMap = {
  none: 0,
  sm: spacing[3],
  md: spacing[4],
  lg: spacing[5],
} as const;

const variantMap = {
  default: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
  },
  elevated: {
    backgroundColor: colors.background.surface,
    borderWidth: 0,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
  },
  muted: {
    backgroundColor: colors.background.DEFAULT,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: colors.primary.DEFAULT,
    borderWidth: 0,
    borderColor: 'transparent',
  },
} as const;

export function Card({ variant = 'default', padding = 'md', children, onPress, style }: CardProps) {
  const baseStyle = {
    borderRadius: radius.lg,
    padding: paddingMap[padding],
    ...variantMap[variant],
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [baseStyle, style, { opacity: pressed ? 0.95 : 1 }]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}
