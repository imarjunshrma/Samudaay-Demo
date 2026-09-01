import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Avatar, Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function ProfileHero({
  name,
  memberId,
  photoUrl,
  statusLabel,
}: {
  name: string;
  memberId?: string | null;
  photoUrl?: string | null;
  statusLabel?: string;
}) {
  const t = useTranslations('profile.my-profile');
  const { language } = useAppPreferences();

  return (
    <View style={{ alignItems: 'center', gap: spacing[4] }}>
      <View style={{ position: 'relative' }}>
        <View style={{ width: 128, height: 128, borderRadius: 64, overflow: 'hidden', borderWidth: 4, borderColor: colors.background.surface }}>
          <Avatar uri={photoUrl ?? undefined} name={name} size="2xl" />
        </View>
        <View
          style={{
            position: 'absolute',
            right: 4,
            bottom: 4,
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.background.DEFAULT,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="verified" size={16} color="#fff" />
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text variant="h1" color={colors.text.primary} style={{ letterSpacing: -0.5, fontFamily: typography.fontFamily.bold, fontSize: 34, textAlign: 'center' }}>
          {name}
        </Text>
        <Text
          variant="caption"
          color={colors.text.secondary}
          style={{
            marginTop: 4,
            fontFamily: typography.fontFamily.medium,
            letterSpacing: language === 'gu' ? 0 : 1,
            textAlign: 'center',
          }}>
          {language === 'gu' ? t('fields.memberId') : t('fields.memberId').toUpperCase()}: {memberId || t('fields.pending')}
        </Text>
        <View
          style={{
            marginTop: spacing[3],
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
            borderRadius: radius.full,
            backgroundColor: colors.primary.muted,
          }}>
          <Text
            variant="caption"
            color={colors.primary.DEFAULT}
            style={{
              fontFamily: typography.fontFamily.bold,
              textTransform: language === 'gu' ? 'none' : 'uppercase',
              letterSpacing: language === 'gu' ? 0 : 1.4,
            }}>
            {statusLabel || t('title')}
          </Text>
        </View>
      </View>
    </View>
  );
}
