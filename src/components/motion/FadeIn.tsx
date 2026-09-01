import type { PropsWithChildren } from 'react';

import { motion } from '@/src/theme';
import { MotionView } from './MotionView';

export function FadeIn({
  children,
  delay = 0,
  duration = motion.duration.normal,
}: PropsWithChildren<{ delay?: number; duration?: number }>) {
  return (
    <MotionView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration }}>
      {children}
    </MotionView>
  );
}
