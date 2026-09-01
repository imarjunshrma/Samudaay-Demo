import { MotionView } from '@/src/components/motion';

import { colors, motion, radius } from '@/src/theme';

export function SkeletonBox({
  width = '100%',
  height = 16,
  radiusSize = radius.md,
}: {
  width?: number | `${number}%`;
  height?: number;
  radiusSize?: number;
}) {
  return (
    <MotionView
      from={{ opacity: 0.55 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', loop: true, duration: motion.duration.shimmer }}
      style={{
        width,
        height,
        borderRadius: radiusSize,
        backgroundColor: colors.border.DEFAULT,
      }}
    />
  );
}
