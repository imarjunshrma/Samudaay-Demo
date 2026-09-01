import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { selectLanguage } from '@/src/utils/select-language';

const { width, height } = Dimensions.get('window');

export default function SplashScreenRoute() {
  const router = useRouter();
  const { language } = useAppPreferences();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/registration/registration-kyc');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, router]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} />

      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {t('INDIAN COBBLER COMMUNITY', 'ઈન્ડિયન કોબ્લર કોમ્યુનિટી')}
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.tagline}>
          {t('Crafting Tradition with Technology', 'પરંપરા અને ટેક્નોલોજીનું સંકલન')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1A12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundLayer: {
    position: 'absolute',
    width,
    height,
    opacity: 0.1,
    backgroundColor: '#F57C00',
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 24,
  },
  title: {
    color: '#F1EDEA',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 24,
  },
  tagline: {
    color: '#D7CCC8',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'serif',
  },
});
