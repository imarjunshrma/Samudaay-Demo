import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { generatedHtmlScreenMap } from '@/src/generated/html-screens';

export default function GeneratedHtmlPreviewScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const ScreenComponent = slug ? generatedHtmlScreenMap[slug] : undefined;

  if (!ScreenComponent) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f7f5] px-6">
        <Text className="text-lg font-semibold text-slate-900">Screen not found</Text>
        <Text className="mt-2 text-center text-sm text-slate-600">
          No generated screen matches this slug.
        </Text>
        <Link href="/" className="mt-6 text-sm font-semibold text-[#f2780d]">
          Back to preview list
        </Link>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenComponent />
    </>
  );
}
