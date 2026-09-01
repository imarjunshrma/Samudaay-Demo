import type { PropsWithChildren } from 'react';

import { motion } from '@/src/theme';
import { MotionView } from './MotionView';

export function ScaleIn({
  children,
  delay = 0,
  duration = motion.duration.normal,
}: PropsWithChildren<{ delay?: number; duration?: number }>) {
  return (
    <MotionView from={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration }}>
      {children}
    </MotionView>
  );
}
