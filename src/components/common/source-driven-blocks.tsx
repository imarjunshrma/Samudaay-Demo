import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, shadows, spacing, typography } from '@/src/theme/tokens';

interface ChoiceChipItem {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function ChoiceChipRow({ items }: { items: ChoiceChipItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          accessibilityRole="button"
          accessibilityState={{ selected: item.active }}
          style={({ pressed }) => [
            styles.choiceChip,
            {
              backgroundColor: item.active ? colors.primary : colors.surface,
              borderColor: item.active ? colors.primary : colors.border,
              opacity: pressed ? 0.88 : 1,
            },
          ]}>
          <Text style={[styles.choiceLabel, { color: item.active ? '#fff' : colors.text }]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HighlightPanel({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <View style={styles.highlightPanel}>
      <Text style={styles.highlightEyebrow}>{eyebrow}</Text>
      <Text style={styles.highlightTitle}>{title}</Text>
      <Text style={styles.highlightSubtitle}>{subtitle}</Text>
      {badge ? <Text style={styles.highlightBadge}>{badge}</Text> : null}
    </View>
  );
}

export function MiniBarChart({
  values,
  labels,
}: {
  values: number[];
  labels?: string[];
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];
  const maxValue = Math.max(...values, 1);

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chart}>
        {values.map((value, index) => (
          <View key={`${value}-${index}`} style={styles.chartColumn}>
            <View style={[styles.chartTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.chartBar,
                  {
                    height: `${Math.max(12, (value / maxValue) * 100)}%`,
                    backgroundColor: index % 3 === 1 ? colors.accent : colors.primary,
                  },
                ]}
              />
            </View>
            {labels?.[index] ? (
              <Text style={[styles.chartLabel, { color: colors.textMuted }]}>{labels[index]}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export function UploadRequirementCard({
  icon,
  title,
  subtitle,
  buttonLabel,
  onPress,
  disabled,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View
      style={[
        styles.uploadCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
        },
      ]}>
      <View style={[styles.uploadIconShell, { backgroundColor: colors.surfaceMuted }]}>
        <MaterialCommunityIcons name={icon} size={26} color={colors.primary} />
      </View>
      <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.uploadSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.uploadButton,
          {
            borderColor: colors.primary,
            opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          },
        ]}>
        <Text style={[styles.uploadButtonLabel, { color: colors.primary }]}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choiceChip: {
    minHeight: 44,
    minWidth: 92,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLabel: {
    ...typography.body,
    fontWeight: '700',
  },
  highlightPanel: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.xs,
    backgroundColor: '#F57C00',
  },
  highlightEyebrow: {
    ...typography.label,
    color: '#FFE0B2',
  },
  highlightTitle: {
    fontFamily: 'serif',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: '#fff',
  },
  highlightSubtitle: {
    ...typography.body,
    color: '#FFF3E0',
  },
  highlightBadge: {
    ...typography.subtitle,
    color: '#fff',
    marginTop: spacing.xs,
  },
  chartWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  chart: {
    minHeight: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  chartTrack: {
    width: '100%',
    height: 128,
    borderRadius: radius.pill,
    justifyContent: 'flex-end',
    padding: 6,
  },
  chartBar: {
    width: '100%',
    borderRadius: radius.pill,
    minHeight: 12,
  },
  chartLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  uploadCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.card,
  },
  uploadIconShell: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  uploadTitle: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  uploadButton: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  uploadButtonLabel: {
    ...typography.body,
    fontWeight: '700',
  },
});
