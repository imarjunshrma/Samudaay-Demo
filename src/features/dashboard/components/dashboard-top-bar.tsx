import { View } from 'react-native';

import { AppHeader } from '@/src/components/layout/AppHeader';

export function DashboardTopBar({
  onNotificationsPress,
  onMenuPress,
  title = 'Dashboard',
}: {
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  title?: string;
}) {
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <AppHeader
        contentMaxWidth={672}
        title={title}
        variant="menu-notification"
        onLeftPress={onMenuPress}
        onRightPress={onNotificationsPress}
      />
    </View>
  );
}
