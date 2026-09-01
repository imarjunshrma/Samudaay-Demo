import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

export function AppSafeAreaView({ edges = ['top', 'left', 'right', 'bottom'], ...props }: SafeAreaViewProps) {
  return <SafeAreaView edges={edges} {...props} />;
}
