import { View } from 'react-native';

import { Text } from '@/src/components/ui';
import { useNotifications } from '@/src/notifications';
import { colors, radius, spacing } from '@/src/theme';

const toastColors = {
  success: { backgroundColor: colors.status.success, textColor: colors.text.inverse },
  error: { backgroundColor: colors.status.error, textColor: colors.text.inverse },
  warning: { backgroundColor: colors.primary.dark!, textColor: colors.text.inverse },
  info: { backgroundColor: colors.text.primary, textColor: colors.text.inverse },
} as const;

export function ToastViewport() {
  const { notifications } = useNotifications();

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 16, right: 16, bottom: 24, gap: spacing[2] }}>
      {notifications.map((notification) => {
        const scheme = toastColors[notification.variant];
        return (
          <View
            key={notification.id}
            style={{
              backgroundColor: scheme.backgroundColor,
              borderRadius: radius.lg,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
            }}>
            <Text variant="label" color={scheme.textColor}>
              {notification.title}
            </Text>
            {notification.description ? (
              <Text variant="caption" color={scheme.textColor}>
                {notification.description}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
