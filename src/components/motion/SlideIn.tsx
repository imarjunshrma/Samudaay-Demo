import type { PropsWithChildren } from 'react';

import { motion } from '@/src/theme';
import { MotionView } from './MotionView';

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = motion.duration.normal,
  distance = motion.distance.md,
}: PropsWithChildren<{
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
}>) {
  const axis = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';
  const offset =
    direction === 'left' || direction === 'up' ? -distance : distance;

  return (
    <MotionView
      from={{ opacity: 0, [axis]: offset }}
      animate={{ opacity: 1, [axis]: 0 }}
      transition={{ delay, duration }}>
      {children}
    </MotionView>
  );
}
