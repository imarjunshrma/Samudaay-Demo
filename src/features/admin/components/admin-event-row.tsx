import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminEventRow({
  id,
  title,
  status,
  date,
  time,
  location,
  icon,
  muted = false,
  onEditPress,
  onDeletePress,
  onTogglePublishPress,
  onAnalyticsPress,
  onAdhocRegistrationPress,
}: {
  id: string;
  title: string;
  status: 'Upcoming' | 'Past' | 'Draft';
  date: string;
  time: string;
  location: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  muted?: boolean;
  onEditPress?: (id: string) => void;
  onDeletePress?: (id: string) => void;
  onTogglePublishPress?: (id: string, nextStatus: 'PUBLISHED' | 'DRAFT') => void;
  onAnalyticsPress?: (id: string) => void;
  onAdhocRegistrationPress?: (id: string) => void;
}) {
  const t = useTranslations('admin.manage-events');
  const active = status === 'Upcoming';
  const isDraft = status === 'Draft';
  const accentColor = active ? colors.primary.DEFAULT : isDraft ? '#f59e0b' : colors.border.light;
  const nextPublishStatus = isDraft ? 'PUBLISHED' : 'DRAFT';
  const publishLabel = isDraft ? t('actions.publish') : t('actions.moveToDraft');
  const publishIcon = isDraft ? 'publish' : 'archive';
  const publishColor = isDraft ? '#15803d' : '#b45309';

  return (
    <EntityActionCard
      muted={muted}
      accentColor={accentColor}
      leading={
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            backgroundColor: active ? colors.primary.muted : colors.background.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={24} color={active ? colors.primary.DEFAULT : colors.text.muted} />
        </View>
      }
      title={title}
      headerRight={
        onAnalyticsPress || onAdhocRegistrationPress ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            {onAnalyticsPress ? (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => onAnalyticsPress(id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text
                  variant="caption"
                  style={{
                    color: colors.primary.DEFAULT,
                    fontFamily: typography.fontFamily.bold,
                  }}>
                  {t('actions.analytics')}
                </Text>
                <MaterialIcons name="north-east" size={14} color={colors.primary.DEFAULT} />
              </TouchableOpacity>
            ) : null}
            {onAdhocRegistrationPress ? (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => onAdhocRegistrationPress(id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="person-add" size={14} color={colors.primary.DEFAULT} />
                <Text
                  variant="caption"
                  style={{
                    color: colors.primary.DEFAULT,
                    fontFamily: typography.fontFamily.bold,
                  }}>
                  {t('actions.register')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null
      }
      titleSuffix={
        <View
          style={{
            borderRadius: radius.full,
            paddingHorizontal: spacing[2],
            paddingVertical: 4,
            backgroundColor: active ? 'rgba(34,197,94,0.12)' : isDraft ? 'rgba(245,158,11,0.14)' : 'rgba(148,163,184,0.14)',
          }}>
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontFamily: typography.fontFamily.bold,
              color: active ? '#15803d' : isDraft ? '#b45309' : '#64748b',
            }}>
            {status}
          </Text>
        </View>
      }
      metaItems={[
        {
          key: 'date',
          icon: <MaterialIcons name="calendar-month" size={14} color={colors.text.muted} />,
          label: date,
          color: colors.text.secondary,
        },
        {
          key: 'time',
          icon: <MaterialIcons name="schedule" size={14} color={colors.text.muted} />,
          label: time,
          color: colors.text.secondary,
        },
        {
          key: 'location',
          icon: <MaterialIcons name="location-on" size={14} color={colors.text.muted} />,
          label: location,
          color: colors.text.secondary,
        },
      ]}
      actions={[
        {
          key: 'publish',
          label: publishLabel,
          leftIcon: <MaterialIcons name={publishIcon} size={16} color={publishColor} />,
          variant: 'soft',
          flex: 1.2,
          onPress: () => onTogglePublishPress?.(id, nextPublishStatus),
        },
        {
          key: 'edit',
          label: t('actions.edit'),
          leftIcon: <MaterialIcons name="edit" size={16} color={colors.primary.DEFAULT} />,
          variant: 'outline',
          flex: 0.9,
          onPress: () => onEditPress?.(id),
        },
        {
          key: 'delete',
          label: t('actions.delete'),
          leftIcon: <MaterialIcons name="delete" size={16} color="#dc2626" />,
          variant: 'ghost',
          flex: 0.9,
          onPress: () => onDeletePress?.(id),
        },
      ]}
    />
  );
}
