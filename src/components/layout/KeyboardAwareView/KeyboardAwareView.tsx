import type { PropsWithChildren } from 'react';
import { KeyboardLayout } from '@/src/components/layout/KeyboardLayout';

export function KeyboardAwareView({
  children,
  scrollEnabled = true,
}: PropsWithChildren<{ scrollEnabled?: boolean }>) {
  return (
    <KeyboardLayout scrollEnabled={scrollEnabled}>
      {children}
    </KeyboardLayout>
  );
}
