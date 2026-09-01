import { Text } from '@/src/components/ui/Text';
import { colors, typography } from '@/src/theme';

export type FormLabelProps = {
  children: string;
  uppercase?: boolean;
  error?: boolean;
};

export function FormLabel({ children, uppercase = false, error = false }: FormLabelProps) {
  return (
    <Text
      variant="caption"
      color={error ? colors.status.error : colors.text.primary}
      style={{
        fontFamily: typography.fontFamily.semibold,
        fontSize: 14,
        letterSpacing: uppercase ? 0.8 : 0,
        textTransform: uppercase ? 'uppercase' : 'none',
      }}>
      {children}
    </Text>
  );
}
