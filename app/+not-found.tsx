import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { Button, Text } from '@/src/components';

export default function NotFoundRoute() {
  const router = useRouter();

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text variant="h2" style={styles.title}>
          Page not found
        </Text>
        <Text variant="body" style={styles.subtitle}>
          The app opened an invalid route. Return to splash or login and continue from there.
        </Text>

        <View style={styles.actions}>
          <Button variant="secondary" onPress={() => router.replace('/splash')}>
            Go to Splash
          </Button>
          <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkButton}>
            <Text variant="caption" style={styles.linkText}>
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    gap: 16,
  },
  title: {
    color: '#fff',
  },
  subtitle: {
    color: '#cbd5e1',
    lineHeight: 22,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  linkText: {
    color: '#60a5fa',
  },
});
