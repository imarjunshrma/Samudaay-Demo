import { Image, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventListCard({
  title,
  date,
  location,
  image,
  muted = false,
  status = 'unregistered',
  hasPass = false,
  onRegister,
  onViewPass,
  onDetails,
}: {
  title: string;
  date: string;
  location: string;
  image?: string | null;
  muted?: boolean;
  status?: 'unregistered' | 'registered' | 'past';
  hasPass?: boolean;
  onRegister?: () => void;
  onViewPass?: () => void;
  onDetails?: () => void;
}) {
  const t = useTranslations('events.my-events-list');
  const showPassAction = status === 'registered' || (status === 'past' && hasPass);
  const showRegisterAction = status === 'unregistered';
  const compactActions = showRegisterAction || showPassAction;
  const hasImage = Boolean(image);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[4], borderRadius: radius.xl, backgroundColor: muted ? 'rgba(255,255,255,0.6)' : colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
      <View style={{ flex: 1, gap: spacing[2] }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, textAlign: 'left' }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <MaterialIcons name="calendar-today" size={14} color="#64748b" />
          <Text variant="caption" color="#64748b">{date}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
          <MaterialIcons name="location-on" size={14} color="#64748b" />
          <Text variant="caption" color="#64748b">{location}</Text>
        </View>
        <View style={{ marginTop: spacing[3], flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
          {showRegisterAction ? (
            <View style={{ flex: 1, minWidth: 120 }}>
              <Button variant="primary" size="sm" fullWidth onPress={onRegister} leftIcon={<MaterialIcons name="event-available" size={16} color={colors.text.inverse} />}>{t('actions.register')}</Button>
            </View>
          ) : null}
          {showPassAction ? (
            <View style={{ flex: 1, minWidth: 120 }}>
              <Button variant="primary" size="sm" fullWidth onPress={onViewPass} leftIcon={<MaterialIcons name="confirmation-number" size={16} color={colors.text.inverse} />}>{t('actions.viewPass')}</Button>
            </View>
          ) : null}
          <View style={{ flex: compactActions ? 1 : undefined, minWidth: compactActions ? 120 : undefined, width: compactActions ? undefined : '100%' }}>
            <Button variant={compactActions ? 'outline' : 'primary'} size="sm" fullWidth={!compactActions} onPress={onDetails} leftIcon={<MaterialIcons name="info-outline" size={16} color={compactActions ? colors.primary.DEFAULT : colors.text.inverse} />}>{t('actions.details')}</Button>
          </View>
        </View>
      </View>
      {hasImage ? <Image source={{ uri: image as string }} resizeMode="cover" style={{ width: 104, height: 104, borderRadius: radius.lg }} /> : null}
    </View>
  );
}
