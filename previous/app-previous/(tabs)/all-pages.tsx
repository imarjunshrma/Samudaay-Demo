import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { htmlScreenMap } from '@/src/constants/html-screen-map';
import { pageLinkSections } from '@/src/constants/page-links';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

const latestDesignPages = [
  {
    title: 'Dashboard & ID Card',
    subtitle: 'Latest member digital ID and dashboard design.',
    href: '/profile/dashboard-id-card' as const,
  },
  {
    title: 'Dashboard with Advertisement',
    subtitle: 'Latest ad-supported dashboard design.',
    href: '/dashboard/dashboard-with-advertisement' as const,
  },
  {
    title: 'Dashboard with Ad Popup',
    subtitle: 'Latest popup-ad dashboard design.',
    href: '/dashboard/dashboard-with-ad-popup' as const,
  },
  {
    title: 'Admin Dashboard',
    subtitle: 'Latest admin overview design.',
    href: '/dashboard/admin-dashboard' as const,
  },
  {
    title: 'Registration & KYC',
    subtitle: 'Latest registration flow design.',
    href: '/registration/registration-kyc' as const,
  },
  {
    title: 'KYC Approval',
    subtitle: 'Latest approval queue design.',
    href: '/registration/kyc-approval' as const,
  },
  {
    title: 'Role Management',
    subtitle: 'Latest roles and permissions design.',
    href: '/roles/role-management' as const,
  },
  {
    title: 'My Profile',
    subtitle: 'Latest profile design.',
    href: '/profile/my-profile' as const,
  },
];

export default function AllPagesScreen() {
  const router = useRouter();
  const { language } = useAppPreferences();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Review Mode', gu: 'રીવ્યુ મોડ' }}
      title={{ en: 'All Pages', gu: 'બધા પેજ' }}
      description={{
        en: 'Open any screen from one place so you can compare layouts, flows, and visual consistency quickly.',
        gu: 'એક જ સ્થાનેથી દરેક સ્ક્રીન ખોલો જેથી તમે લેઆઉટ, ફ્લો અને દૃશ્ય સુસંગતતા ઝડપથી સરખાવી શકો.',
      }}
      tone="cool">
      <SectionCard title={t('How to Use This Page', 'આ પેજ કેવી રીતે વાપરવો')}>
        <BulletSummary
          items={[
            t('Use this as a screen directory for visual comparison.', 'દૃશ્ય સરખામણી માટે આને સ્ક્રીન ડિરેક્ટરી તરીકે વાપરો.'),
            t('Some screens may still redirect based on your current role and guard rules.', 'કેટલાક સ્ક્રીન તમારા વર્તમાન રોલ અને ગાર્ડ નિયમ પ્રમાણે રીડાયરેક્ટ થઈ શકે છે.'),
            t('Grouped routes mirror the real product structure instead of a demo renderer.', 'ગ્રુપ કરેલા રૂટ ડેમો રેન્ડરર નહીં પરંતુ વાસ્તવિક પ્રોડક્ટ રચનાને દર્શાવે છે.'),
            t(`Converted html source coverage: ${htmlScreenMap.length} mapped screens.`, `કન્વર્ટ થયેલ html સોર્સ કવરેજ: ${htmlScreenMap.length} મેપ કરેલી સ્ક્રીનો.`),
          ]}
        />
      </SectionCard>

      <SectionCard title={t('Latest Design Pages', 'નવીનતમ ડિઝાઇન પેજ')}>
        <View style={styles.list}>
          {latestDesignPages.map((item) => (
            <LinkCard
              key={`latest-${item.title}`}
              title={t(item.title, item.title)}
              subtitle={t(item.subtitle, item.subtitle)}
              onPress={() => {
                router.push(item.href);
              }}
            />
          ))}
        </View>
      </SectionCard>

      {pageLinkSections.map((section) => (
        <SectionCard key={section.title} title={t(section.title, section.title)}>
          <View style={styles.list}>
            {section.items.map((item) => (
              <LinkCard
                key={`${section.title}-${item.title}`}
                title={t(item.title, item.title)}
                subtitle={t(item.subtitle, item.subtitle)}
                onPress={() => {
                  router.push(item.href);
                }}
              />
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
});
