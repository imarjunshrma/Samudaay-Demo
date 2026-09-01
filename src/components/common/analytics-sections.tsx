import { StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, spacing, typography } from '@/src/theme/tokens';

export interface ProgressStatItem {
  label: string;
  value: string;
  percent: number;
  accent?: 'primary' | 'accent' | 'success' | 'warning';
}

export function ProgressStatList({ items }: { items: ProgressStatItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => {
        const fillColor =
          item.accent === 'accent'
            ? colors.accent
            : item.accent === 'success'
              ? colors.success
              : item.accent === 'warning'
                ? colors.warning
                : colors.primary;

        return (
          <View key={`${item.label}-${item.value}`} style={styles.stackXs}>
            <View style={styles.rowBetween}>
              <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.fill, { width: `${item.percent}%`, backgroundColor: fillColor }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function SplitMetricRow({
  items,
}: {
  items: { title: string; value: string; subtitle?: string }[];
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.title} style={[styles.metricCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <Text style={[styles.meta, { color: colors.textMuted }]}>{item.title}</Text>
          <Text style={[styles.bigValue, { color: colors.text }]}>{item.value}</Text>
          {item.subtitle ? <Text style={[styles.meta, { color: colors.textMuted }]}>{item.subtitle}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  stackXs: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  value: {
    ...typography.body,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
  },
  bigValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
});
