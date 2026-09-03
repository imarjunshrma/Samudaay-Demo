import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import type { ComponentProps } from 'react';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

type QuickInsightItem = {
  id: string;
  label: string;
  value: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
  iconBackgroundColor?: string;
};

type AdminQuickInsightsSectionProps = {
  title: string;
  periodLabel: string;
  actionLabel?: string;
  onActionPress?: () => void;
  items: QuickInsightItem[];
  compactAction?: boolean;
};

export function AdminQuickInsightsSection({
  title,
  periodLabel,
  actionLabel,
  onActionPress,
  items,
  compactAction = false,
}: AdminQuickInsightsSectionProps) {
  const action = actionLabel && onActionPress ? (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onActionPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        paddingVertical: spacing[1],
        flexShrink: 0,
      }}>
      <Text
        variant="caption"
        style={{
          color: colors.primary.DEFAULT,
          fontFamily: typography.fontFamily.bold,
          fontSize: compactAction ? 12 : 14,
        }}>
        {actionLabel}
      </Text>
      <MaterialIcons name="north-east" size={compactAction ? 14 : 16} color={colors.primary.DEFAULT} />
    </TouchableOpacity>
  ) : null;

  return (
    <View style={{ gap: spacing[3] }}>
      {compactAction ? (
        <View style={{ gap: spacing[1], position: 'relative', minHeight: 28 }}>
          {action ? (
            <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              {action}
            </View>
          ) : null}
          <View style={{ paddingRight: 120 }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              {title}
            </Text>
          </View>
          <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.medium }}>
            {periodLabel}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing[3] }}>
          <View style={{ flex: 1, gap: spacing[1] }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              {title}
            </Text>
            <Text variant="caption" style={{ color: colors.text.muted, fontFamily: typography.fontFamily.medium }}>
              {periodLabel}
            </Text>
          </View>
          {action}
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing[3], paddingRight: spacing[4] }}>
        {items.map((item) => (
          <View
            key={item.id}
            style={{
              width: 142,
              borderRadius: radius.xl,
              padding: spacing[3],
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              gap: spacing[2],
              ...shadows.sm,
            }}>
            <View style={{ width: 36, height: 36, borderRadius: radius.lg, backgroundColor: item.iconBackgroundColor ?? colors.primary.subtle ?? 'rgba(24,168,117,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name={item.icon} size={18} color={item.iconColor} />
            </View>
            <View style={{ gap: spacing[1] }}>
              <Text
                variant="caption"
                style={{
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  fontFamily: typography.fontFamily.medium,
                }}>
                {item.label}
              </Text>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, lineHeight: 28 }}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
