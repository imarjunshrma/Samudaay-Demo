import { View } from 'react-native';

import { Card, Text, TextField } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing, typography } from '@/src/theme';

export function BirthdayMessageSection({
  message,
  onMessageChange,
  recipientLabel = 'Arjun Sharma',
}: {
  message?: string;
  onMessageChange?: (message: string) => void;
  recipientLabel?: string;
}) {
  const t = useTranslations('communication.send-birthday-card');

  return (
    <View
      style={{
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[6],
        gap: spacing[4],
      }}>
      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
        {t('message.title')}
      </Text>
      <TextField
        placeholder={t('message.placeholder')}
        value={message}
        onChangeText={onMessageChange}
        multiline
        numberOfLines={5}
        useSystemFont
      />
      <Card variant="default" padding="md">
        <View style={{ gap: spacing[1] }}>
          <Text
            variant="caption"
            color="#64748b"
            style={{
              fontFamily: typography.fontFamily.semibold,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
            {t('message.sendingTo')}
          </Text>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {recipientLabel}
          </Text>
        </View>
      </Card>
    </View>
  );
}
