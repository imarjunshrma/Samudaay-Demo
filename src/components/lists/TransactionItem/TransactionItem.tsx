import { Pressable, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type TransactionItemVariant = 'summary' | 'history';

export function TransactionItem({
  title,
  subtitle,
  amount,
  meta,
  icon = 'history-edu',
  tone = colors.primary.DEFAULT,
  bg = colors.primary.muted,
  ctaLabel,
  onCtaPress,
  variant = 'summary',
  date,
  transactionType,
}: {
  title: string;
  subtitle: string;
  amount: string;
  meta?: string;
  date?: string;
  transactionType?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  tone?: string;
  bg?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  variant?: TransactionItemVariant;
}) {
  if (variant === 'history') {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing[4],
          backgroundColor: colors.background.surface,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: 'rgba(24,168,117,0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, minWidth: 0 }}>
          <View style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={24} color={tone} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="body" numberOfLines={1} style={{ fontFamily: typography.fontFamily.bold }}>
              {title}
            </Text>
            <Text variant="caption" color="#64748b" numberOfLines={1} style={{ fontFamily: typography.fontFamily.medium }}>
              {[date, transactionType || subtitle].filter(Boolean).join(' • ')}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing[2], marginLeft: spacing[2] }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {amount}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={ctaLabel ?? 'Download PDF'}
            disabled={!onCtaPress}
            onPress={onCtaPress}
            style={{ width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.subtle, opacity: onCtaPress ? 1 : 0.6 }}>
            <Icon name="picture-as-pdf" size={18} color={colors.primary.DEFAULT} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ borderRadius: radius.xl, padding: spacing[6], backgroundColor: 'rgba(24,168,117,0.1)', borderWidth: 1, borderColor: 'rgba(24,168,117,0.2)', gap: spacing[2] }}>
      {meta ? (
        <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
          {meta}
        </Text>
      ) : null}
      <Text variant="h1" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
        {amount}
      </Text>
      <View style={{ marginTop: spacing[2], flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <Icon name="verified" size={16} color="#6b7280" />
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color="#6b7280">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
