import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { APP_LOGO_SOURCE, APP_SHORT_NAME, useLocalizedBrandText } from '@/src/core/config/brand';
import { markOnboardingSeen } from '@/src/core/storage/onboarding-storage';
import { useTranslations } from '@/src/i18n/use-translations';

const PRIMARY = '#f2780d';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  hero: 'logo' | 'community' | 'secure';
};

function HeroGraphic({ type }: { type: Slide['hero'] }) {
  if (type === 'logo') {
    return (
      <View style={styles.heroCircle}>
        <Image
          source={APP_LOGO_SOURCE}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (type === 'community') {
    return (
      <View style={styles.heroCircle}>
        <View style={styles.heroBadgeLarge}>
          <MaterialCommunityIcons name="account-group-outline" size={84} color={PRIMARY} />
        </View>
        <View style={styles.heroBadgeTop}>
          <MaterialCommunityIcons name="calendar-heart" size={28} color="#8e4b1f" />
        </View>
        <View style={styles.heroBadgeBottom}>
          <MaterialCommunityIcons name="message-text-outline" size={28} color="#8e4b1f" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.heroCircle}>
      <View style={styles.heroBadgeLarge}>
        <MaterialCommunityIcons name="shield-check-outline" size={82} color={PRIMARY} />
      </View>
      <View style={styles.heroCardLeft}>
        <MaterialCommunityIcons name="card-account-details-outline" size={26} color="#8e4b1f" />
      </View>
      <View style={styles.heroCardRight}>
        <MaterialCommunityIcons name="file-document-check-outline" size={26} color="#8e4b1f" />
      </View>
    </View>
  );
}

export function SplashContent() {
  const router = useRouter();
  const t = useTranslations('auth.splash');
  const { tenantName, tagline } = useLocalizedBrandText();
  const [step, setStep] = useState(0);
  const slides = useMemo<Slide[]>(
    () => [
      {
        title: tenantName,
        subtitle: tagline,
        description: t('slides.0.description'),
        buttonLabel: t('slides.0.buttonLabel'),
        hero: 'logo',
      },
      {
        title: t('slides.1.title'),
        subtitle: t('slides.1.subtitle'),
        description: t('slides.1.description'),
        buttonLabel: t('slides.1.buttonLabel'),
        hero: 'community',
      },
      {
        title: t('slides.2.title'),
        subtitle: t('slides.2.subtitle'),
        description: t('slides.2.description'),
        buttonLabel: t('slides.2.buttonLabel'),
        hero: 'secure',
      },
    ],
    [t, tagline, tenantName],
  );
  const currentSlide = useMemo(() => slides[step], [slides, step]);

  function handleContinue() {
    if (step < slides.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    void (async () => {
      await markOnboardingSeen();
      router.push('/login');
    })();
  }

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.navbar}>
        <Text style={styles.navTitle}>{APP_SHORT_NAME}</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.logoWrapper}>
          <HeroGraphic type={currentSlide.hero} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.heading}>{currentSlide.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.subHeading}>{currentSlide.subtitle}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={currentSlide.buttonLabel}
          onPress={handleContinue}>
          <Text style={styles.buttonText}>{currentSlide.buttonLabel}</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.footerText}>{t('footer.terms')}</Text>

        <View style={styles.dots}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => setStep(index)}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.onboardingStep').replace('{step}', String(index + 1))}
              style={index === step ? styles.dotActive : styles.dot}
            />
          ))}
        </View>
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
    justifyContent: 'space-between',
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: PRIMARY,
    opacity: 0.08,
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: PRIMARY,
    opacity: 0.05,
  },
  navbar: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  main: {
    alignItems: 'center',
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 36,
  },
  heroCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    position: 'relative',
  },
  logo: {
    width: '78%',
    height: '78%',
  },
  heroBadgeLarge: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#fff3e7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f9d7b5',
  },
  heroBadgeTop: {
    position: 'absolute',
    top: 42,
    right: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff8f3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f2d4c1',
  },
  heroBadgeBottom: {
    position: 'absolute',
    bottom: 42,
    left: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff8f3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f2d4c1',
  },
  heroCardLeft: {
    position: 'absolute',
    left: 30,
    top: 108,
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#fff8f3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f2d4c1',
  },
  heroCardRight: {
    position: 'absolute',
    right: 30,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#fff8f3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f2d4c1',
  },
  textContainer: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
    color: '#17203a',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: PRIMARY,
    marginVertical: 14,
    borderRadius: 10,
  },
  subHeading: {
    fontSize: 18,
    lineHeight: 24,
    color: PRIMARY,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#596684',
    marginTop: 8,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 14,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#97a4be',
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f2780d55',
  },
});
