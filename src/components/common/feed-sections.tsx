import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, shadows, spacing, typography } from '@/src/theme/tokens';

export interface FeedRowItem {
  title: string;
  subtitle: string;
  meta?: string;
  unread?: boolean;
  badge?: string;
  icon?: string;
}

export function FeedRowList({ items }: { items: FeedRowItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => (
        <Pressable
          key={`${item.title}-${item.meta ?? ''}`}
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: item.unread ? 1 : 0.78,
            },
          ]}>
          <View style={styles.iconWrap}>
            {item.unread ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
            <MaterialCommunityIcons
              name={(item.icon ?? 'bell-outline') as keyof typeof MaterialCommunityIcons.glyphMap}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.copy}>
            <View style={styles.rowBetween}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              {item.meta ? <Text style={[styles.meta, { color: colors.textMuted }]}>{item.meta}</Text> : null}
            </View>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
          </View>
          {item.badge ? (
            <View style={[styles.badge, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
              <Text style={[styles.badgeLabel, { color: colors.text }]}>{item.badge}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

export interface ShowcaseCardItem {
  title: string;
  subtitle: string;
  meta: string;
  footer?: string;
  badge?: string;
  actionLabel?: string;
}

export function ShowcaseCardList({ items }: { items: ShowcaseCardItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => (
        <View key={`${item.title}-${item.meta}`} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {item.badge ? <Text style={[styles.badgeText, { color: colors.primary }]}>{item.badge}</Text> : null}
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>{item.meta}</Text>
          {item.footer ? <Text style={[styles.meta, { color: colors.textMuted }]}>{item.footer}</Text> : null}
          {item.actionLabel ? (
            <View style={[styles.actionChip, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>{item.actionLabel}</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  iconWrap: {
    width: 36,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
  },
  subtitle: {
    ...typography.body,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadows.card,
  },
  badgeText: {
    ...typography.label,
  },
  actionChip: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  actionLabel: {
    ...typography.body,
    fontWeight: '700',
  },
});
