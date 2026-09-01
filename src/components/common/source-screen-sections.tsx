import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, shadows, spacing, typography } from '@/src/theme/tokens';

export interface TileItem {
  title: string;
  subtitle?: string;
  icon?: string;
  active?: boolean;
  onPress?: () => void;
}

export interface MemberRowItem {
  title: string;
  subtitle: string;
  meta?: string;
  badge?: string;
  icon?: string;
  accent?: 'primary' | 'success' | 'warning' | 'muted';
  onPress?: () => void;
}

export function SearchFilterBar({
  searchValue,
  onChangeText,
  searchPlaceholder,
  filters,
}: {
  searchValue: string;
  onChangeText: (value: string) => void;
  searchPlaceholder: string;
  filters: string[];
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          value={searchValue}
          onChangeText={onChangeText}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
          accessibilityLabel={searchPlaceholder}
        />
      </View>
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <View
            key={filter}
            style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>{filter}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function QuickActionGrid({ items }: { items: TileItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable
          key={item.title}
          onPress={item.onPress}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.tile,
            {
              backgroundColor: colors.surface,
              borderColor: item.active ? colors.primary : colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}>
          {item.icon ? (
            <View style={[styles.tileIconWrap, { backgroundColor: colors.surfaceMuted }]}>
              <MaterialCommunityIcons
                name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={20}
                color={colors.primary}
              />
            </View>
          ) : null}
          <Text style={[styles.tileTitle, { color: colors.text }]}>{item.title}</Text>
          {item.subtitle ? <Text style={[styles.tileSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text> : null}
        </Pressable>
      ))}
    </View>
  );
}

export function DirectoryMemberList({ items }: { items: MemberRowItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => {
        const badgeColor =
          item.accent === 'success'
            ? colors.success
            : item.accent === 'warning'
              ? colors.warning
              : item.accent === 'muted'
                ? colors.textMuted
                : colors.primary;

        return (
          <Pressable
            key={`${item.title}-${item.subtitle}`}
            onPress={item.onPress}
            accessibilityRole={item.onPress ? 'button' : undefined}
            style={({ pressed }) => [
              styles.memberRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: item.onPress && pressed ? 0.92 : 1,
              },
            ]}>
            <View style={[styles.memberAvatar, { backgroundColor: colors.surfaceMuted }]}>
              <MaterialCommunityIcons
                name={(item.icon ?? 'account-outline') as keyof typeof MaterialCommunityIcons.glyphMap}
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.memberCopy}>
              <Text style={[styles.memberTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.memberSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
              {item.meta ? <Text style={[styles.memberMeta, { color: colors.textMuted }]}>{item.meta}</Text> : null}
            </View>
            {item.badge ? (
              <View style={[styles.badge, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
                <View style={[styles.badgeDot, { backgroundColor: badgeColor }]} />
                <Text style={[styles.badgeLabel, { color: colors.text }]}>{item.badge}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function ActionSummaryCard({
  title,
  subtitle,
  actionLabel,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
      <View style={styles.summaryCopy}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.summaryBody, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <View style={[styles.summaryButton, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryButtonLabel, { color: colors.text }]}>{actionLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  searchWrap: {
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    minHeight: 22,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: '48%',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadows.card,
  },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tileTitle: {
    ...typography.subtitle,
  },
  tileSubtitle: {
    ...typography.body,
  },
  memberRow: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCopy: {
    flex: 1,
    gap: 2,
  },
  memberTitle: {
    ...typography.subtitle,
  },
  memberSubtitle: {
    ...typography.body,
  },
  memberMeta: {
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  badgeLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryTitle: {
    ...typography.subtitle,
  },
  summaryBody: {
    ...typography.body,
  },
  summaryButton: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  summaryButtonLabel: {
    ...typography.body,
    fontWeight: '700',
  },
});
