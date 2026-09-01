import type { PropsWithChildren, ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';

type FormSectionProps = PropsWithChildren<{
  title?: string;
  description?: string;
  footer?: ReactNode;
  variant?: 'default' | 'soft' | 'highlight';
}>;

const sectionVariants = {
  default: undefined,
  soft: {
    borderRadius: radius.xl,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    padding: spacing[4],
  },
  highlight: {
    borderRadius: radius.xl,
    backgroundColor: colors.primary.subtle,
    borderWidth: 1,
    borderColor: colors.primary.border,
    padding: spacing[4],
  },
} as const;

export function FormSection({ title, description, footer, children, variant = 'default' }: FormSectionProps) {
  return (
    <View style={[{ gap: spacing[3] }, sectionVariants[variant]]}>
      {title ? <Text variant="h5">{title}</Text> : null}
      {description ? (
        <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium }}>
          {description}
        </Text>
      ) : null}
      {children}
      {footer}
    </View>
  );
}
