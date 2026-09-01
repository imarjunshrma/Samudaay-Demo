import { SkeletonBox } from './SkeletonBox';

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <SkeletonBox width={size} height={size} radiusSize={size / 2} />;
}
