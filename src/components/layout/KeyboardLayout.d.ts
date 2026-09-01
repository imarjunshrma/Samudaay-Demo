import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface KeyboardLayoutProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  extraScrollHeight?: number;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  showsVerticalScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export declare function KeyboardLayout(props: KeyboardLayoutProps): ReactNode;

export default KeyboardLayout;
