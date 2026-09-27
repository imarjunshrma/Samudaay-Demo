import type { ReactNode } from 'react';
import { Image, Pressable, Switch, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Button, Card, Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import type {
  BirthdayAdminMetric,
  BirthdayGreetingLog,
  BirthdayReminderControl,
  BirthdayTemplateManagementItem,
} from '../constants';
import { formatBirthdayGreetingDateTime } from '../services/birthday-greeting-log-utils';

export function BirthdayAdminMetricGrid({ items }: { items: readonly BirthdayAdminMetric[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
      {items.map((item) => (
        <Card
          key={item.label}
          variant="elevated"
          padding="md"
          style={{ width: '48%', minHeight: 108, borderColor: colors.primary.borderLight }}>
          <View style={{ gap: spacing[2] }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary.muted,
              }}>
              <MaterialIcons name={item.icon} size={19} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>
              {item.value}
            </Text>
            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.medium }}>
              {item.label}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

export function BirthdayAdminSection({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  children,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.text.muted}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {actionLabel ? (
          <Pressable accessibilityRole="button" onPress={onActionPress} hitSlop={8}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function BirthdayReminderControlCard({
  item,
  enabled,
  onToggle,
}: {
  item: BirthdayReminderControl;
  enabled: boolean;
  onToggle: (key: string, nextValue: boolean) => void;
}) {
  return (
    <Card variant="default" padding="md" style={{ borderColor: colors.primary.borderLight }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: enabled ? colors.primary.muted : colors.background.muted,
          }}>
          <MaterialIcons name={item.icon} size={20} color={enabled ? colors.primary.DEFAULT : colors.text.muted} />
        </View>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
            {item.title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {item.description}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={(nextValue) => onToggle(item.key, nextValue)}
          trackColor={{ false: colors.border.DEFAULT, true: colors.primary.border }}
          thumbColor={enabled ? colors.primary.DEFAULT : colors.background.surface}
        />
      </View>
    </Card>
  );
}

export function BirthdayTemplateManagementCard({
  item,
  onEditPress,
  onDeletePress,
  activeLabel,
  inactiveLabel,
  editLabel,
  deleteLabel,
  sentLabel,
}: {
  item: BirthdayTemplateManagementItem;
  onEditPress?: (id: string) => void;
  onDeletePress?: (id: string) => void;
  activeLabel: string;
  inactiveLabel: string;
  editLabel: string;
  deleteLabel: string;
  sentLabel: string;
}) {
  return (
    <Card variant="elevated" padding="none" style={{ overflow: 'hidden', borderColor: colors.primary.borderLight }}>
      <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: '100%', height: 132 }} />
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[3] }}>
          <View style={{ flex: 1, gap: spacing[1] }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {item.title}
            </Text>
            <Text variant="caption" color={colors.text.muted}>
              {item.category} • {item.sentCount} {sentLabel}
            </Text>
          </View>
          <Badge label={item.active ? activeLabel : inactiveLabel} variant={item.active ? 'success' : 'default'} />
        </View>
        <View style={{ flexDirection: 'row', gap: spacing[3], borderTopWidth: 1, borderTopColor: colors.border.muted, paddingTop: spacing[3] }}>
          <View style={{ flex: 1 }}>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<MaterialIcons name="edit" size={16} color={colors.primary.DEFAULT} />}
              onPress={() => onEditPress?.(item.id)}>
              {editLabel}
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<MaterialIcons name="delete" size={16} color="#dc2626" />}
              onPress={() => onDeletePress?.(item.id)}>
              {deleteLabel}
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function BirthdayGreetingLogRow({
  item,
  statusLabel,
}: {
  item: BirthdayGreetingLog;
  statusLabel: string;
}) {
  const activityIcon = item.status === 'Delivered' ? 'mark-email-read' : 'schedule-send';
  const activityIconColor = item.status === 'Delivered' ? '#15803d' : '#b45309';
  const activityIconBackground = item.status === 'Delivered' ? '#dcfce7' : '#fef3c7';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[3],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.borderLight,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: activityIconBackground,
        }}>
        <MaterialIcons name={activityIcon} size={18} color={activityIconColor} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: spacing[1] }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.semibold }}>
          {item.recipient}
        </Text>
        <Text variant="caption" color={colors.text.secondary} numberOfLines={1}>
          {item.sender ? `From ${item.sender}` : item.template}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: 2 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              borderRadius: radius.full,
              backgroundColor: colors.background.surface,
              paddingHorizontal: spacing[2],
              paddingVertical: 4,
            }}>
            <MaterialIcons name="style" size={12} color={colors.text.muted} />
            <Text variant="caption" color={colors.text.muted} numberOfLines={1} style={{ fontSize: 12 }}>
              {item.template}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              borderRadius: radius.full,
              backgroundColor: colors.background.surface,
              paddingHorizontal: spacing[2],
              paddingVertical: 4,
            }}>
            <MaterialIcons name={item.status === 'Delivered' ? 'event-available' : 'event'} size={12} color={colors.text.muted} />
            <Text variant="caption" color={colors.text.muted} style={{ fontSize: 12 }}>
              {formatBirthdayGreetingDateTime(item.sentAt)}
            </Text>
          </View>
        </View>
      </View>
      <Badge label={statusLabel} variant={item.status === 'Delivered' ? 'success' : 'warning'} />
    </View>
  );
}
