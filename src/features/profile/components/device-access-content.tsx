import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Linking, ScrollView, Switch, TouchableOpacity, View } from 'react-native';

import { AppHeader, Text } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import {
  getCameraPermissionStatus,
  getPushNotificationPermissionStatus,
  type PermissionResultStatus,
} from '@/src/services/device/app-permissions';
import { clearPdfDownloadDirectoryAccess, ensurePdfDownloadDirectoryAccess, getPdfDownloadDirectoryStatus } from '@/src/services/files/pdf-file';
import { colors, radius, spacing, typography } from '@/src/theme';

type PermissionState = PermissionResultStatus | 'not_requested';

type ToggleRowProps = {
  title: string;
  subtitle: string;
  enabled: boolean;
  onPress: () => void;
};

function ToggleRow({ title, subtitle, enabled, onPress }: ToggleRowProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[5],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
      }}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <Text variant="label" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onPress}
        trackColor={{ false: '#d1d5db', true: colors.primary.DEFAULT }}
        thumbColor={colors.background.surface}
      />
    </TouchableOpacity>
  );
}

function describePermission(status: PermissionState, activeText: string, inactiveText: string) {
  if (status === 'granted') {
    return activeText;
  }

  return inactiveText;
}

export function DeviceAccessContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('profile.device-access');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<PermissionState>('not_requested');
  const [cameraStatus, setCameraStatus] = useState<PermissionState>('not_requested');
  const [downloadFolderEnabled, setDownloadFolderEnabled] = useState(false);

  const refreshStatuses = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [notifications, camera, downloadFolder] = await Promise.all([
        getPushNotificationPermissionStatus({ requestIfNeeded: false, showDeniedAlert: false, showBlockedAlert: false }),
        getCameraPermissionStatus({ requestIfNeeded: false, showDeniedAlert: false, showBlockedAlert: false }),
        getPdfDownloadDirectoryStatus(),
      ]);

      setNotificationStatus(notifications.granted ? 'granted' : notifications.status);
      setCameraStatus(camera.granted ? 'granted' : camera.status);
      setDownloadFolderEnabled(downloadFolder.configured);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshStatuses();
    }, [refreshStatuses]),
  );

  const openSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  const handleDownloadFolderToggle = useCallback(async () => {
    if (downloadFolderEnabled) {
      await clearPdfDownloadDirectoryAccess();
    } else {
      try {
        await ensurePdfDownloadDirectoryAccess();
      } catch {
        return;
      }
    }

    await refreshStatuses();
  }, [downloadFolderEnabled, refreshStatuses]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[5], paddingBottom: spacing[6], gap: spacing[4] }}>
          <View style={{ gap: spacing[2] }}>
            <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {t('hero.title')}
            </Text>
            <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
              {t('hero.subtitle')}
            </Text>
            {isRefreshing ? (
              <Text variant="caption" color={colors.text.muted}>
                {t('hero.refreshing')}
              </Text>
            ) : null}
          </View>

          <ToggleRow
            title={t('notifications.title')}
            subtitle={describePermission(
              notificationStatus,
              t('notifications.enabled'),
              t('notifications.disabled'),
            )}
            enabled={notificationStatus === 'granted'}
            onPress={openSettings}
          />

          <ToggleRow
            title={t('camera.title')}
            subtitle={describePermission(
              cameraStatus,
              t('camera.enabled'),
              t('camera.disabled'),
            )}
            enabled={cameraStatus === 'granted'}
            onPress={openSettings}
          />

          <ToggleRow
            title={t('downloads.title')}
            subtitle={
              downloadFolderEnabled
                ? t('downloads.enabled')
                : t('downloads.disabled')
            }
            enabled={downloadFolderEnabled}
            onPress={() => {
              void handleDownloadFolderToggle();
            }}
          />
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
