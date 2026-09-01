import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { spacing } from '@/src/theme';

export function ScreenSection({ children }: PropsWithChildren) {
  return <View style={{ gap: spacing[3] }}>{children}</View>;
}
