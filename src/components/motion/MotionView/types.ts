import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type MotionStyle = {
  opacity?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
  rotate?: string;
};

export type MotionViewProps = PropsWithChildren<ViewProps & {
  from?: MotionStyle;
  animate?: MotionStyle;
  transition?: Record<string, unknown>;
  style?: StyleProp<ViewStyle>;
}>;
