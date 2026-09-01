import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

type AdvertisementRowStatus = 'Active' | 'Draft' | 'Expired' | 'Paused' | 'Scheduled';

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

function formatCurrency(value?: number | null) {
  const amount = Number(value || 0);
  return `Rs ${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export function AdminAdvertisementRow({
  id,
  title,
  status,
  statusLabel,
  category,
  schedule,
  pricing,
  contentType,
  impressions,
  clicks,
  amount,
  onEditPress,
  onDeletePress,
  onTogglePublishPress,
  onAnalyticsPress,
}: {
  id: string;
  title: string;
  status: AdvertisementRowStatus;
  statusLabel?: string;
  category: string;
  schedule: string;
  pricing: string;
  contentType: React.ComponentProps<typeof MaterialIcons>['name'];
  impressions: number;
  clicks: number;
  amount?: number | null;
  onEditPress?: (id: string) => void;
  onDeletePress?: (id: string) => void;
  onTogglePublishPress?: (id: string, nextStatus: 'ACTIVE' | 'DRAFT' | 'INACTIVE') => void;
  onAnalyticsPress?: (id: string) => void;
}) {
  const t = useTranslations('admin.advertisements');
  const isActive = status === 'Active';
  const isDraft = status === 'Draft';
  const isPaused = status === 'Paused';
  const isScheduled = status === 'Scheduled';
  const resolvedStatusLabel = statusLabel ?? status;
  const nextPublishStatus = isActive ? 'INACTIVE' : 'ACTIVE';
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const accentColor = isActive ? colors.primary.DEFAULT : isDraft ? '#f59e0b' : isPaused ? '#64748b' : '#94a3b8';
  const publishLabel = isActive
    ? t('row.pause')
    : isPaused
      ? t('row.resume')
      : isScheduled
        ? t('row.activate')
        : t('row.publish');
  const publishIcon = isActive ? 'pause-circle' : 'publish';
  const publishColor = isActive ? '#b45309' : '#15803d';

  return (
    <EntityActionCard
      accentColor={accentColor}
      leading={
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            backgroundColor: isActive ? colors.primary.muted : colors.background.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={contentType} size={24} color={isActive ? colors.primary.DEFAULT : colors.text.muted} />
        </View>
      }
      title={title}
      headerRight={
        onAnalyticsPress ? (
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
              {t('row.analytics')}
            </Text>
            <MaterialIcons name="north-east" size={14} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        ) : null
      }
      titleSuffix={
        <View
          style={{
            borderRadius: radius.full,
            paddingHorizontal: spacing[2],
            paddingVertical: 4,
            backgroundColor: isActive ? 'rgba(34,197,94,0.12)' : isDraft ? 'rgba(245,158,11,0.14)' : isPaused ? 'rgba(100,116,139,0.14)' : 'rgba(148,163,184,0.14)',
          }}>
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            fontFamily: typography.fontFamily.bold,
            color: isActive ? '#15803d' : isDraft ? '#b45309' : isPaused ? '#475569' : '#64748b',
          }}>
            {resolvedStatusLabel}
          </Text>
        </View>
      }
      metaItems={[
        {
          key: 'category',
          icon: <MaterialIcons name="category" size={14} color={colors.text.muted} />,
          label: category,
          color: colors.text.secondary,
        },
        {
          key: 'schedule',
          icon: <MaterialIcons name="calendar-month" size={14} color={colors.text.muted} />,
          label: schedule,
          color: colors.text.secondary,
        },
        {
          key: 'pricing',
          icon: <MaterialIcons name="payments" size={14} color={colors.text.muted} />,
          label: pricing,
          color: colors.text.secondary,
        },
        {
          key: 'impressions',
          icon: <MaterialIcons name="visibility" size={14} color={colors.text.muted} />,
          label: t('row.impressions').replace('{count}', formatCompactNumber(impressions)),
          color: colors.text.secondary,
        },
        {
          key: 'clicks',
          icon: <MaterialIcons name="ads-click" size={14} color={colors.text.muted} />,
          label: t('row.clicks').replace('{count}', formatCompactNumber(clicks)),
          color: colors.text.secondary,
        },
        {
          key: 'ctr',
          icon: <MaterialIcons name="trending-up" size={14} color={colors.text.muted} />,
          label: `${t('row.ctr').replace('{value}', formatPercent(ctr))}${amount ? ` • ${formatCurrency(amount)}` : ''}`,
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
          label: t('row.edit'),
          leftIcon: <MaterialIcons name="edit" size={16} color={colors.primary.DEFAULT} />,
          variant: 'outline',
          flex: 0.9,
          onPress: () => onEditPress?.(id),
        },
        {
          key: 'delete',
          label: t('row.delete'),
          leftIcon: <MaterialIcons name="delete" size={16} color="#dc2626" />,
          variant: 'ghost',
          flex: 0.9,
          onPress: () => onDeletePress?.(id),
        },
      ]}
    />
  );
}
