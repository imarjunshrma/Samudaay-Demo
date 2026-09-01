import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { pageLinkSections } from '@/src/constants/page-links';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function IndexScreen() {
  const router = useRouter();
  const { language, resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Screen Review', gu: 'સ્ક્રીન રીવ્યુ' }}
      title={{ en: 'All App Screens', gu: 'એપની બધી સ્ક્રીન' }}
      description={{
        en: 'Use this public landing page to open and compare every implemented screen without signing in first.',
        gu: 'સાઇન ઇન કર્યા વગર દરેક અમલમાં મુકાયેલ સ્ક્રીન ખોલવા અને સરખાવા માટે આ જાહેર લેન્ડિંગ પેજ વાપરો.',
      }}
      tone="cool">
      <SectionCard title={t('Review Notes', 'રીવ્યુ નોંધો')}>
        <BulletSummary
          items={[
            t('This page exists for visual review and comparison.', 'આ પેજ દૃશ્ય રીવ્યુ અને સરખામણી માટે છે.'),
            t('Protected screens may still redirect if their flow requires an authenticated session.', 'સુરક્ષિત સ્ક્રીન માટે authenticated session જરૂરી હોય તો તે હજુ પણ રીડાયરેક્ટ થઈ શકે છે.'),
            t('Use Sign In when you want to test the real auth and onboarding journey.', 'વાસ્તવિક auth અને onboarding journey ચકાસવી હોય ત્યારે Sign In વાપરો.'),
          ]}
        />
      </SectionCard>

      <SectionCard title={t('Quick Access', 'ઝડપી પ્રવેશ')}>
        <View style={styles.list}>
          <LinkCard title={t('Onboarding Welcome', 'ઓનબોર્ડિંગ વેલકમ')} subtitle={t('Open the first onboarding splash screen.', 'પ્રથમ onboarding splash screen ખોલો.')} onPress={() => router.push('/welcome')} />
          <LinkCard title={t('Sign In', 'સાઇન ઇન')} subtitle={t('Open the real auth flow.', 'વાસ્તવિક auth flow ખોલો.')} onPress={() => router.push('/login')} />
          <LinkCard title={t('All Pages Review', 'બધા પેજ રીવ્યુ')} subtitle={t('Open the full in-app review index.', 'સંપૂર્ણ in-app review index ખોલો.')} onPress={() => router.push('/all-pages')} />
        </View>
      </SectionCard>

      {pageLinkSections.map((section) => (
        <SectionCard key={section.title} title={t(section.title, section.title)}>
          <View style={styles.list}>
            {section.items.map((item) => (
              <Pressable
                key={`${section.title}-${item.title}`}
                onPress={() => router.push(item.href)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title} ${String(item.href)}`}
                style={({ pressed }) => [
                  styles.routeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}>
                <View style={styles.routeCopy}>
                  <Text style={[styles.routeTitle, { color: colors.text }]}>{t(item.title, item.title)}</Text>
                  <Text style={[styles.routePath, { color: colors.primary }]}>{String(item.href)}</Text>
                  <Text style={[styles.routeSubtitle, { color: colors.textMuted }]}>
                    {t(item.subtitle, item.subtitle)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  routeCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
  },
  routeCopy: {
    gap: spacing.xs,
  },
  routeTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  routePath: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  routeSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
