import { memo } from 'react';
import { View } from 'react-native';

import { IconButton, Text } from '@/src/components';
import { useNotificationSummary } from '@/src/features/communication/hooks/use-communication-feeds';
import { colors, spacing } from '@/src/theme';

function DashboardHeaderActionsInner({
  onNotificationsPress,
}: {
  onNotificationsPress?: () => void;
}) {
  const unreadNotificationCount = useNotificationSummary(Boolean(onNotificationsPress));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
      {onNotificationsPress ? (
        <View style={{ position: 'relative' }}>
          <IconButton
            icon="notifications"
            onPress={onNotificationsPress}
            variant="soft"
            size="xl"
          />
          {unreadNotificationCount > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: '#dc2626',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 1,
                borderColor: colors.background.DEFAULT,
              }}>
              <Text
                variant="caption"
                color={colors.text.inverse}
                style={{ fontSize: 10 }}>
                {unreadNotificationCount > 99 ? '99+' : String(unreadNotificationCount)}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export const DashboardHeaderActions = memo(DashboardHeaderActionsInner);
