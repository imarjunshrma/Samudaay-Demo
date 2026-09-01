import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, shadows, spacing, typography } from '@/src/theme/tokens';

interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.cardLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.cardValue, { color: accent ?? colors.text }]}>{value}</Text>
    </View>
  );
}

interface InfoCardProps {
  title: string;
  body: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function InfoCard({ title, body, icon }: InfoCardProps) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.card, styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.infoBody, { color: colors.textMuted }]}>{body}</Text>
    </View>
  );
}

export function Pill({ label, active = false }: { label: string; active?: boolean }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: active ? colors.primary : colors.surfaceMuted,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}>
      <Text style={[styles.pillLabel, { color: active ? '#fff' : colors.text }]}>{label}</Text>
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.searchInput, { color: colors.text }]}
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

export function LinkCard({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.card,
        styles.linkCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View style={styles.linkCardCopy}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.infoBody, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="arrow-right" size={22} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardLabel: {
    ...typography.label,
  },
  cardValue: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  infoCard: {
    minHeight: 140,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  infoTitle: {
    ...typography.subtitle,
  },
  infoBody: {
    ...typography.body,
  },
  pill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  pillLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
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
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkCardCopy: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
});
