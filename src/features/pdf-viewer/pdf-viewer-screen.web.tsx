import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppHeader, AppSafeAreaView, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { colors, spacing } from '@/src/theme';

export function PdfViewerScreen() {
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ title?: string }>();
  const title = params.title || 'PDF';

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title={title} variant="back" onLeftPress={navigateBack} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[4],
          backgroundColor: colors.background.muted,
        }}>
        <Text color={colors.text.secondary}>PDF preview is available in the mobile app.</Text>
      </View>
    </AppSafeAreaView>
  );
}
