import { View } from 'react-native';
import type { ViewStyle } from 'react-native';

import type { MotionStyle, MotionViewProps } from './types';

function getMotionStyle(animate?: MotionStyle): ViewStyle {
  if (!animate) {
    return {};
  }

  const nextStyle: ViewStyle = {};
  const transform: NonNullable<ViewStyle['transform']>[number][] = [];

  if (typeof animate.opacity === 'number') {
    nextStyle.opacity = animate.opacity;
  }
  if (typeof animate.scale === 'number') {
    transform.push({ scale: animate.scale });
  }
  if (typeof animate.translateX === 'number') {
    transform.push({ translateX: animate.translateX });
  }
  if (typeof animate.translateY === 'number') {
    transform.push({ translateY: animate.translateY });
  }
  if (typeof animate.rotate === 'string') {
    transform.push({ rotate: animate.rotate });
  }
  if (transform.length > 0) {
    nextStyle.transform = transform as ViewStyle['transform'];
  }

  return nextStyle;
}

export function MotionView({
  animate,
  children,
  from: _from,
  transition: _transition,
  style,
  ...rest
}: MotionViewProps) {
  return (
    <View {...rest} style={[style, getMotionStyle(animate)]}>
      {children}
    </View>
  );
}
