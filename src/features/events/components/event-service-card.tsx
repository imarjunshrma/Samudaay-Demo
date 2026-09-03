import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventServiceCard({
  icon,
  title,
  subtitle,
  state,
  onAction,
  showDivider = true,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  state: 'action' | 'redeemed';
  onAction?: () => void;
  showDivider?: boolean;
}) {
  const t = useTranslations('events.qr-scanner');

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[3], borderBottomWidth: showDivider ? 1 : 0, borderBottomColor: 'rgba(24,168,117,0.1)', opacity: state === 'redeemed' ? 0.6 : 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: state === 'redeemed' ? '#f1f5f9' : colors.primary.muted ?? 'rgba(24,168,117,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={icon} size={20} color={state === 'redeemed' ? '#64748b' : colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>{title}</Text>
          <Text variant="caption" color="#64748b" style={{ fontSize: 12 }}>{subtitle}</Text>
        </View>
      </View>
      {state === 'redeemed' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <MaterialIcons name="check-circle" size={14} color="#16a34a" />
          <Text variant="caption" color="#16a34a" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase' }}>{t('services.redeemed')}</Text>
        </View>
      ) : (
        <Button size="sm" onPress={onAction}>{t('actions.markUsed')}</Button>
      )}
    </View>
  );
}
