import type { ReactNode } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard } from '@/src/components';
import { colors, radius } from '@/src/theme';

function getStatusTone(status: string) {
  const normalizedStatus = String(status || '').toUpperCase();

  if (normalizedStatus === 'APPROVED' || normalizedStatus === 'PAID') {
    return {
      text: colors.status.success,
      background: colors.status.successLight,
      border: colors.border.muted,
    };
  }

  if (normalizedStatus === 'SUBMITTED' || normalizedStatus === 'PENDING_APPROVAL') {
    return {
      text: colors.status.warning,
      background: colors.status.warningLight,
      border: colors.border.muted,
    };
  }

  if (normalizedStatus === 'REJECTED') {
    return {
      text: colors.status.error,
      background: colors.status.errorLight,
      border: colors.border.muted,
    };
  }

  return {
    text: colors.text.secondary,
    background: colors.background.muted,
    border: colors.border.muted,
  };
}

export function AdminExpenseRow({
  title,
  category,
  date,
  note,
  amount,
  statusLabel,
  status,
  requestedBy,
  headerRight,
  actions,
  icon,
  iconBackground,
  iconColor = colors.primary.DEFAULT,
}: {
  title: string;
  category: string;
  date: string;
  note: string;
  amount: string;
  statusLabel: string;
  status: string;
  requestedBy?: string;
  headerRight?: ReactNode;
  actions?: {
    key: string;
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft';
    leftIcon?: ReactNode;
    flex?: number;
    disabled?: boolean;
    loading?: boolean;
  }[];
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconBackground: string;
  iconColor?: string;
}) {
  const statusTone = getStatusTone(status);
  const showRequestedBy = Boolean(requestedBy);

  return (
    <EntityActionCard
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
      leading={
        <View style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: iconBackground, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
      }
      title={title}
      subtitle={`${amount} • ${category}`}
      detail={showRequestedBy ? requestedBy : note}
      headerRight={headerRight}
      metaItems={[
        {
          key: 'date',
          icon: <MaterialIcons name="event" size={14} color={colors.text.muted} />,
          label: date,
          color: colors.text.muted,
        },
        {
          key: 'status',
          icon: <MaterialIcons name="info-outline" size={14} color={statusTone.text} />,
          label: statusLabel,
          color: statusTone.text,
        },
      ]}
      actions={actions}
    />
  );
}
