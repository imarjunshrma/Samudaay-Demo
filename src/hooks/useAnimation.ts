import { useMemo } from 'react';

import { motion } from '@/src/theme';

export function useAnimation() {
  return useMemo(
    () => ({
      duration: motion.duration,
      distance: motion.distance,
      scale: motion.scale,
    }),
    [],
  );
}
