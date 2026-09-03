import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { useTranslations } from '@/src/i18n/use-translations';
import { getPushNotificationPermissionStatus } from '@/src/services/device/app-permissions';
import { colors } from '@/src/theme';
import { ProfileActionCard } from './profile-action-card';

export function NotificationPreferenceCard({ returnTo }: { returnTo?: string } = {}) {
  const router = useRouter();
  const t = useTranslations('profile.device-access');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'blocked' | 'unavailable' | 'unknown'>('unknown');

  const refreshStatus = useCallback(async () => {
    const result = await getPushNotificationPermissionStatus({
      requestIfNeeded: false,
      showDeniedAlert: false,
      showBlockedAlert: false,
    });
    setPermissionStatus(result.status);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshStatus();
    }, [refreshStatus]),
  );

  return (
    <ProfileActionCard
      icon="admin-panel-settings"
      iconBackground={colors.primary.subtle ?? 'rgba(24, 168, 117, 0.1)'}
      iconColor={colors.primary.DEFAULT}
      title={t('card.title')}
      subtitle={permissionStatus === 'granted' ? t('card.subtitle.granted') : t('card.subtitle.default')}
      onPress={() =>
        router.push({
          pathname: '/profile/device-access',
          params: returnTo ? { returnTo } : undefined,
        } as never)
      }
    />
  );
}
