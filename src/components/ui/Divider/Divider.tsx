import { View } from 'react-native';

import { colors } from '@/src/theme';

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, width: '100%' }} />;
}
