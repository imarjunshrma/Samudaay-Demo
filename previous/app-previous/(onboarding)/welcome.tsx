import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY = '#f2780d';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  hero: 'logo' | 'community' | 'secure';
};

const slides: Slide[] = [
  {
    title: 'Mochi Ekta\nCheritable Trust',
    subtitle: 'Empowering our Community',
    description: 'Connecting People',
    buttonLabel: 'Get Started',
    hero: 'logo',
  },
  {
    title: 'Discover Your\nCommunity Network',
    subtitle: 'Trusted Member Connections',
    description: 'Directories, family profiles, events, and updates in one place.',
    buttonLabel: 'Continue',
    hero: 'community',
  },
  {
    title: 'Secure Digital ID\n& KYC Ready',
    subtitle: 'Built for Verified Access',
    description: 'Complete onboarding, upload documents, and unlock community services.',
    buttonLabel: 'Start Registration',
    hero: 'secure',
  },
];

function HeroGraphic({ type }: { type: Slide['hero'] }) {
  if (type === 'logo') {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida/ADBb0ui91TcnXdBUV3HyuHBhE9jXGgCmxBpelyWpiJq4KhI4AmDUJedjA4_iSbsoKCxQQKhlZFOcXBAYEE4VmHdgKahPkEx9u6zeeqNsQrEAlcs8G5-3bNGqamrHGrHZfFDmAQl8sGxJ0uwLvyT8o2vZ3aBlc4ANwJMAfD2HcruYeYn_BvAeJBZcd5SJBEe9std_R_rAWNNXl3EVhaqCdjokVmt5bcXEa4K2tWW7-0j5ju2lGXNKb-36HWUjYPmZCMvOd4EyBZgMfkxV41g',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.logoBorder} />
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
          <MaterialCommunityIcons name="calendar-heart" size={28} color="#8E4B1F" />
        </View>
        <View style={styles.heroBadgeBottom}>
          <MaterialCommunityIcons name="message-text-outline" size={28} color="#8E4B1F" />
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
        <MaterialCommunityIcons name="card-account-details-outline" size={26} color="#8E4B1F" />
      </View>
      <View style={styles.heroCardRight}>
        <MaterialCommunityIcons name="file-document-check-outline" size={26} color="#8E4B1F" />
      </View>
    </View>
  );
}

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const currentSlide = useMemo(() => slides[step], [step]);

  function handleContinue() {
    if (step < slides.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    router.push('/registration-kyc');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.navbar}>
        <MaterialCommunityIcons name="menu" size={26} color="#1f2937" />
        <Text style={styles.title} />
        <View style={styles.navSpacer} />
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
          <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service
        </Text>

        <View style={styles.dots}>
          {slides.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => setStep(index)}
              accessibilityRole="button"
              accessibilityLabel={`Onboarding step ${index + 1}`}
              style={index === step ? styles.dotActive : styles.dot}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: 'center',
  },
  navSpacer: {
    width: 26,
  },
  title: {
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
  logoContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  heroCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    position: 'relative',
  },
  logo: {
    width: '82%',
    height: '82%',
  },
  logoBorder: {
    position: 'absolute',
    inset: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroBadgeLarge: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFF3E7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F9D7B5',
  },
  heroBadgeTop: {
    position: 'absolute',
    top: 42,
    right: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2D4C1',
  },
  heroBadgeBottom: {
    position: 'absolute',
    bottom: 42,
    left: 34,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2D4C1',
  },
  heroCardLeft: {
    position: 'absolute',
    left: 30,
    top: 108,
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2D4C1',
  },
  heroCardRight: {
    position: 'absolute',
    right: 30,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F2D4C1',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#97A4BE',
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
