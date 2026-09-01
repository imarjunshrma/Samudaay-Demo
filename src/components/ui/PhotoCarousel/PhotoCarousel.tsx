import { useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing } from '@/src/theme';

export interface PhotoCarouselProps {
  photos: string[];
  counterLabel?: string;
  height?: number;
}

export function PhotoCarousel({ photos, counterLabel, height = 320 }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const safePhotos = useMemo(() => photos.filter(Boolean), [photos]);

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = event.nativeEvent.contentOffset.x;
    const index = carouselWidth > 0 ? Math.round(x / carouselWidth) : 0;
    setActiveIndex(Math.max(0, Math.min(index, safePhotos.length - 1)));
  }

  function handleLayout(event: LayoutChangeEvent) {
    setCarouselWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={{ position: 'relative' }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={handleLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ alignItems: 'stretch' }}>
        {safePhotos.map((photo, index) => (
          <View key={`${photo}-${index}`} style={{ width: carouselWidth || '100%', height }}>
            <Image source={{ uri: photo }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          </View>
        ))}
      </ScrollView>

      {counterLabel ? (
        <View style={{ position: 'absolute', top: spacing[4], right: spacing[4], backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: radius.full, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
          <Text variant="caption" color="#ffffff" style={{ fontSize: 10 }}>
            {counterLabel}
          </Text>
        </View>
      ) : null}

      {safePhotos.length > 1 ? (
        <View style={{ position: 'absolute', bottom: spacing[4], left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: spacing[2] }}>
          {safePhotos.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 32 : 8,
                height: 4,
                backgroundColor: index === activeIndex ? colors.primary.DEFAULT : 'rgba(255,255,255,0.5)',
                borderRadius: 999,
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
