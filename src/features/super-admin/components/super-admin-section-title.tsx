import { Text } from '@/src/components';
import { typography } from '@/src/theme';

export function SuperAdminSectionTitle({ children }: { children: string }) {
  return (
    <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
      {children}
    </Text>
  );
}
