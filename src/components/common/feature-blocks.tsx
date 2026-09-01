import type { ReactNode } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { Pill, StatCard } from '@/src/components/ui/cards';
import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonListItem,
  SkeletonText,
} from '@/src/components/ui/skeleton';
import { palette, radius, spacing, typography } from '@/src/theme/tokens';
import type { ListItem, MetricItem } from '@/src/types/app';

interface ActionItem {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function MetricGrid({ items }: { items: MetricItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          accent={
            item.accent === 'accent'
              ? colors.accent
              : item.accent === 'warning'
                ? colors.warning
                : item.accent === 'danger'
                  ? colors.danger
                  : colors.primary
          }
        />
      ))}
    </View>
  );
}

export function ActionRow({ actions }: { actions: (string | ActionItem)[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.actions}>
      {actions.map((action, index) => {
        const item = typeof action === 'string' ? { label: action } : action;

        return (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            disabled={item.disabled}
            accessibilityRole="button"
            style={[
              styles.actionButton,
              {
                backgroundColor: index === 0 ? colors.primary : colors.surface,
                borderColor: colors.border,
                opacity: item.disabled ? 0.55 : 1,
              },
            ]}>
            <Text style={[styles.actionText, { color: index === 0 ? '#fff' : colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

export function BulletSummary({ items }: { items: string[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.body, { color: colors.textMuted }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function RecordList({ items }: { items: ListItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => `${item.title}-${item.meta ?? ''}-${index}`}
      scrollEnabled={false}
      contentContainerStyle={styles.stack}
      renderItem={({ item }) => (
        <View key={`${item.title}-${item.meta ?? ''}`} style={[styles.record, { borderBottomColor: colors.border }]}>
          <View style={styles.stackXs}>
            <Text style={[styles.subtitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>{item.subtitle}</Text>
          </View>
          <View style={styles.metaRow}>
            {item.meta ? <Text style={[styles.body, { color: colors.textMuted }]}>{item.meta}</Text> : null}
            {item.status ? <Pill label={item.status} active={['Ready', 'Active', 'Approved', 'Paid', 'Live', 'Issued', 'Verified', 'Checked in'].includes(item.status)} /> : null}
          </View>
        </View>
      )}
    />
  );
}

export function TimelineList({ items }: { items: ListItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => `${item.title}-${item.meta ?? ''}-${index}`}
      scrollEnabled={false}
      contentContainerStyle={styles.stack}
      renderItem={({ item }) => (
        <View key={`${item.title}-${item.meta ?? ''}`} style={styles.rowStart}>
          <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
          <View style={styles.timelineCopy}>
            <Text style={[styles.subtitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>{item.subtitle}</Text>
          </View>
          {item.meta ? <Text style={[styles.body, { color: colors.textMuted }]}>{item.meta}</Text> : null}
        </View>
      )}
    />
  );
}

export function FormPreview({ items }: { items: ListItem[] }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      {items.map((item) => (
        <View key={item.title} style={styles.stackXs}>
          <Text style={[styles.label, { color: colors.textMuted }]}>{item.title}</Text>
          <View style={[styles.inputShell, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <Text style={[styles.bodyStrong, { color: colors.text }]}>{item.meta ?? item.subtitle}</Text>
          </View>
          {item.meta ? <Text style={[styles.body, { color: colors.textMuted }]}>{item.subtitle}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function GalleryPreview({ caption }: { caption: string }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={styles.stack}>
      <View style={styles.gallery}>
        {[0, 1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.galleryTile,
              {
                backgroundColor: item === 0 ? colors.surfaceAlt : colors.surfaceMuted,
                borderColor: colors.border,
              },
            ]}>
            <MaterialCommunityIcons name="image-outline" size={28} color={colors.primary} />
          </View>
        ))}
      </View>
      <Text style={[styles.body, { color: colors.textMuted }]}>{caption}</Text>
    </View>
  );
}

export function ScannerPreview({ label }: { label: string }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.scanner, { borderColor: colors.primary, backgroundColor: colors.surfaceMuted }]}>
      <MaterialCommunityIcons name="qrcode-scan" size={56} color={colors.primary} />
      <Text style={[styles.subtitle, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

export function MetricGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.card}>
          <SkeletonBlock width="34%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="52%" height={28} radiusSize={radius.sm} />
        </View>
      ))}
    </View>
  );
}

export function SectionCardSkeleton({
  titleWidth = '38%',
  children,
}: {
  titleWidth?: number | `${number}%`;
  children?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <SkeletonBlock width={titleWidth} height={22} radiusSize={radius.sm} />
      {children ?? <SkeletonText lines={3} />}
    </View>
  );
}

export function RecordListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.stack}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </View>
  );
}

export function ActionRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.actions}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBlock key={index} width={`${28 + index * 3}%`} height={44} radiusSize={radius.pill} />
      ))}
    </View>
  );
}

export function InfoCardSkeleton() {
  return <SkeletonCard showAvatar lines={3} />;
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  stackXs: {
    gap: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionText: {
    ...typography.body,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.subtitle,
  },
  body: {
    ...typography.body,
  },
  bodyStrong: {
    ...typography.body,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  record: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    marginTop: 5,
  },
  timelineCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
  },
  inputShell: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  galleryTile: {
    width: '47%',
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanner: {
    height: 240,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
});
