import { useTranslations } from '@/src/i18n/use-translations';
import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, AppHeader, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminDashboardTopBar({
  onMenuPress,
}: {
  onMenuPress?: () => void;
}) {
  const t = useTranslations('admin.dashboard');
  return (
    <AppHeader
      variant="menu-notification"
      title={t('title.topBar')}
      onLeftPress={onMenuPress}
    />
  );
}
