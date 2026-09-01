import { memo, type ReactNode, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, spacing } from '@/src/theme/tokens';

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height: number;
  radiusSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBlock({
  width = '100%',
  height,
  radiusSize = radius.md,
  style,
}: SkeletonBlockProps) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius: radiusSize,
          backgroundColor: resolvedTheme === 'dark' ? colors.surfaceAlt : colors.surfaceMuted,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonText({
  lines = 2,
  widths,
}: {
  lines?: number;
  widths?: (number | `${number}%`)[];
}) {
  const derivedWidths = useMemo(
    () => widths ?? Array.from({ length: lines }, (_, index) => (index === lines - 1 ? '68%' : '100%')),
    [lines, widths],
  );

  return (
    <View style={styles.stackXs}>
      {derivedWidths.map((width, index) => (
        <SkeletonBlock
          key={`${String(width)}-${index}`}
          width={width}
          height={index === 0 ? 16 : 12}
          radiusSize={radius.sm}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({ size = 44 }: { size?: number }) {
  return <SkeletonBlock width={size} height={size} radiusSize={size / 2} />;
}

export function SkeletonCard({
  showAvatar = false,
  lines = 3,
  footer = false,
}: {
  showAvatar?: boolean;
  lines?: number;
  footer?: boolean;
}) {
  return (
    <View style={styles.card}>
      {showAvatar ? (
        <View style={styles.row}>
          <SkeletonAvatar />
          <View style={styles.flex}>
            <SkeletonText lines={2} widths={['52%', '78%']} />
          </View>
        </View>
      ) : null}
      <SkeletonText lines={showAvatar ? lines - 1 : lines} />
      {footer ? (
        <View style={styles.rowBetween}>
          <SkeletonBlock width="28%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width={74} height={28} radiusSize={radius.pill} />
        </View>
      ) : null}
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <View style={styles.flex}>
        <SkeletonText lines={2} widths={['44%', '82%']} />
      </View>
      <View style={styles.metaColumn}>
        <SkeletonBlock width={72} height={12} radiusSize={radius.sm} />
        <SkeletonBlock width={64} height={28} radiusSize={radius.pill} />
      </View>
    </View>
  );
}

export function SkeletonForm({ fields = 3 }: { fields?: number }) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: fields }, (_, index) => (
        <View key={index} style={styles.stackXs}>
          <SkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="100%" height={48} radiusSize={radius.md} />
        </View>
      ))}
      <SkeletonBlock width="100%" height={48} radiusSize={radius.md} />
    </View>
  );
}

export const AppSkeletonBlock = SkeletonBlock;
export const AppSkeletonText = SkeletonText;
export const AppSkeletonAvatar = SkeletonAvatar;
export const AppSkeletonCard = SkeletonCard;

export const AppListSkeleton = memo(function AppListSkeleton({
  count = 4,
  renderItem,
  gap = spacing.md,
}: {
  count?: number;
  renderItem?: (index: number) => ReactNode;
  gap?: number;
}) {
  const items = useMemo(() => Array.from({ length: count }, (_, index) => index), [count]);

  return (
    <View style={{ gap }}>
      {items.map((index) => (
        <View key={index}>{renderItem ? renderItem(index) : <SkeletonListItem />}</View>
      ))}
    </View>
  );
});

export const AppFormSkeleton = memo(function AppFormSkeleton({
  fields = 6,
  showFooter = true,
}: {
  fields?: number;
  showFooter?: boolean;
}) {
  return (
    <View style={styles.formShell}>
      <View style={styles.stack}>
        {Array.from({ length: fields }, (_, index) => (
          <View key={index} style={styles.stackXs}>
            <SkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
            <SkeletonBlock width="100%" height={48} radiusSize={radius.md} />
          </View>
        ))}
      </View>
      {showFooter ? (
        <View style={styles.formFooter}>
          <SkeletonBlock width="34%" height={48} radiusSize={radius.md} />
          <SkeletonBlock width="62%" height={48} radiusSize={radius.md} />
        </View>
      ) : null}
    </View>
  );
});

export const AppGridSkeleton = memo(function AppGridSkeleton({
  count = 4,
  columns = 2,
  itemHeight = 132,
}: {
  count?: number;
  columns?: number;
  itemHeight?: number;
}) {
  const items = useMemo(() => Array.from({ length: count }, (_, index) => index), [count]);
  const basis = `${100 / columns}%` as const;

  return (
    <View style={styles.grid}>
      {items.map((index) => (
        <View key={index} style={[styles.gridItem, { width: basis }]}>
          <SkeletonBlock width="100%" height={itemHeight} radiusSize={radius.lg} />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  block: {
    overflow: 'hidden',
  },
  stack: {
    gap: spacing.md,
  },
  stackXs: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  card: {
    gap: spacing.md,
  },
  formShell: {
    gap: spacing.xl,
  },
  formFooter: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  metaColumn: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
});
