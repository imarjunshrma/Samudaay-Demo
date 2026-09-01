import { View } from 'react-native';

import { spacing } from '@/src/theme';

import { SkeletonCard } from './SkeletonCard';

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: spacing[3] }}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} lines={2} />
      ))}
    </View>
  );
}
