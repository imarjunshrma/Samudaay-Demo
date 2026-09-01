import type { PropsWithChildren } from 'react';

import { SlideIn } from '@/src/components/motion/SlideIn';

export function SlideUp(props: PropsWithChildren<{ delay?: number; duration?: number; distance?: number }>) {
  return <SlideIn direction="up" {...props} />;
}
