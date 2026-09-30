import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { COMMUNITY_SELECTION_ENABLED } from '@/src/core/config/community';
import { getDefaultRouteForSession } from '@/src/core/navigation/default-route';
import { hasSeenOnboarding } from '@/src/core/storage/onboarding-storage';
import { useLocalizedBrandText } from '@/src/core/config/brand';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';

const PRIMARY = '#18a875';

export function LaunchSplashContent() {
  const router = useRouter();
  const t = useTranslations('auth.launch-splash');
  const { tenantName, tagline, logoSource } = useLocalizedBrandText();
  const { session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      void (async () => {
        const seenOnboarding = await hasSeenOnboarding();

        if (!active) {
          return;
        }

        if (session) {
          router.replace(getDefaultRouteForSession(session) as never);
          return;
        }

        router.replace(COMMUNITY_SELECTION_ENABLED || seenOnboarding ? '/login' : '/welcome');
      })();
    }, 1200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router, session, status]);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.center}>
        <View style={styles.logoShell}>
          <Image source={logoSource} style={styles.logo} contentFit="contain" />
        </View>

        <View style={styles.copy}>
          <Text style={styles.kicker}>{tenantName}</Text>
          <Text style={styles.title}>{t('title.loading')}</Text>
          <Text style={styles.subtitle}>
            {t('subtitle.syncingSession').replace('{tagline}', tagline)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <ActivityIndicator size="small" color={PRIMARY} />
        </View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: PRIMARY,
    opacity: 0.08,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: PRIMARY,
    opacity: 0.05,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  logoShell: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  logo: {
    width: '84%',
    height: '84%',
  },
  copy: {
    alignItems: 'center',
  },
  kicker: {
    color: PRIMARY,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: '#1a1a1a',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: '#504441',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 18,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
});
