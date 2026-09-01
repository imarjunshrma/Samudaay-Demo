import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { type DonationRecordItem } from '@/src/features/finance/services/donation-service';

function getStatusTone(status: string) {
  if (status === 'PAID') {
    return {
      text: colors.status.success,
      background: colors.status.successLight,
      border: colors.border.muted,
    };
  }

  if (status === 'PENDING') {
    return {
      text: colors.status.warning,
      background: colors.status.warningLight,
      border: colors.border.muted,
    };
  }

  return {
    text: colors.status.error,
    background: colors.status.errorLight,
    border: colors.border.muted,
  };
}

function formatDonationDateTime(value?: string | null) {
  if (!value) {
    return 'Today';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Today';
  }

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AdminDonationCard({
  record,
  onDownloadPress,
  onEditPress,
  downloading = false,
}: {
  record: DonationRecordItem;
  onDownloadPress?: () => void;
  onEditPress?: () => void;
  downloading?: boolean;
}) {
  const t = useTranslations('admin.manage-donations');
  const statusTone = getStatusTone(record.status);
  const paymentLabel = record.paymentMode
    ? t(`filters.${record.paymentMode}`)
    : t('detail.manual');
  const statusLabel =
    record.status === 'PAID'
      ? t('filters.paid')
      : record.status === 'CANCELLED'
        ? t('filters.cancelled')
        : t('filters.pending');
  const subtitle = record.donorName || record.receiptNo || record.purpose || t('detail.donation');
  const detail = record.receiptNo
    ? t('detail.receipt').replace('{receiptNo}', record.receiptNo)
    : record.memberSearch
      ? t('detail.member').replace('{member}', record.memberSearch)
      : t('detail.manualRecord');

  return (
    <EntityActionCard
      style={{ borderRadius: radius.xl }}
      leading={
        <View style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <MaterialIcons name="volunteer-activism" size={24} color={colors.primary.DEFAULT} />
        </View>
      }
      title={`₹${Number(record.amount || 0).toLocaleString('en-IN')}`}
      subtitle={subtitle}
      detail={detail}
      titleSuffix={
        <View style={{ paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radius.full, backgroundColor: statusTone.background, borderWidth: 1, borderColor: statusTone.border }}>
          <Text variant="caption" style={{ color: statusTone.text, fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase' }}>
            {statusLabel}
          </Text>
        </View>
      }
      headerRight={
        onDownloadPress || onEditPress ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
            {onEditPress ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Edit donation"
                activeOpacity={0.85}
                onPress={onEditPress}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.subtle,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                }}>
                <MaterialIcons name="edit" size={20} color={colors.primary.DEFAULT} />
              </TouchableOpacity>
            ) : null}
            {onDownloadPress ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Download donation slip"
                activeOpacity={0.85}
                disabled={downloading}
                onPress={onDownloadPress}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.subtle,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  opacity: downloading ? 0.65 : 1,
                }}>
                <MaterialIcons name="picture-as-pdf" size={20} color={colors.primary.DEFAULT} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null
      }
      metaItems={[
        {
          key: 'date',
          icon: <MaterialIcons name="event" size={14} color={colors.text.muted} />,
          label: formatDonationDateTime(record.createdAt),
          color: colors.text.muted,
        },
        {
          key: 'mode',
          icon: <MaterialIcons name="payments" size={14} color={colors.text.muted} />,
          label: paymentLabel,
          color: colors.text.muted,
        },
      ]}
    />
  );
}
