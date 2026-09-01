import type { ReactNode } from 'react';

export type AsyncState = 'idle' | 'loading' | 'error' | 'empty' | 'success';

export interface ActionConfig {
  label: string;
  onPress: () => void;
}

export interface BaseComponentProps {
  testID?: string;
  className?: string;
  children?: ReactNode;
}
