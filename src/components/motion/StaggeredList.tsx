import { Fragment, type ReactNode } from 'react';

import { FadeIn } from '@/src/components/motion/FadeIn';

export function StaggeredList({
  children,
  staggerDelay = 70,
}: {
  children: ReactNode[];
  staggerDelay?: number;
}) {
  return (
    <>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          <Fragment>{child}</Fragment>
        </FadeIn>
      ))}
    </>
  );
}
