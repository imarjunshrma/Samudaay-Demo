import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, MetricGrid, SectionCard } from '@/src/components/common/feature-blocks';
import { FormSubmitButton } from '@/src/components/forms/form-fields';
import { InfoCard, LinkCard, Pill } from '@/src/components/ui/cards';
import { pageLinkSections } from '@/src/constants/page-links';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function HomeScreen() {
  const { language } = useAppPreferences();
  const { session, role, hasPermission } = useSession();
  const { signOut, isSubmitting } = useAuthActions();
  const router = useRouter();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Community SaaS', gu: 'કમ્યુનિટી SaaS' }}
      title={{ en: 'Stitch Community App', gu: 'સ્ટિચ કમ્યુનિટી એપ' }}
      description={{
        en: 'Real Expo React Native navigation with dedicated screens for registration, community, events, finance, and super-admin operations.',
        gu: 'નોંધણી, સમુદાય, ઇવેન્ટ્સ, નાણાંકીય અને સુપર એડમિન પ્રવાહો માટે સમર્પિત સ્ક્રીન સાથેનું વાસ્તવિક Expo React Native નૅવિગેશન.',
      }}
      tone="warm">
      <MetricGrid
        items={[
          { label: t('Signed in as', 'લૉગિન તરીકે'), value: session?.user.fullName ?? '-', accent: 'primary' },
          { label: t('Role', 'ભૂમિકા'), value: role ?? '-', accent: 'accent' },
          { label: t('Session source', 'સત્ર સોર્સ'), value: session?.source ?? '-', accent: 'warning' },
        ]}
      />

      <View style={styles.links}>
        <LinkCard title={t('Onboarding Welcome', 'ઓનબોર્ડિંગ વેલકમ')} subtitle={t('Open the first onboarding splash screen.', 'પ્રથમ onboarding splash screen ખોલો.')} onPress={() => router.push('/welcome')} />
        <LinkCard title={t('Registration Hub', 'નોંધણી હબ')} subtitle={t('Onboarding, KYC, profile, family, and marksheet flows.', 'ઓનબોર્ડિંગ, KYC, પ્રોફાઇલ, પરિવાર અને માર્કશીટ પ્રવાહ.')} onPress={() => router.push('/registration/registration-kyc')} />
        <LinkCard title={t('Community Hub', 'સમુદાય હબ')} subtitle={t('Directories, trustees, chats, notifications, birthdays, and matrimony.', 'ડિરેક્ટરી, ટ્રસ્ટી, ચેટ, સૂચના, જન્મદિવસ અને મેટ્રિમોની.')} onPress={() => router.push('/directory/member-directory')} />
        <LinkCard title={t('Events Hub', 'ઇવેન્ટ હબ')} subtitle={t('Creation, passes, registration, live chat, gallery, and attendance.', 'બનાવટ, પાસ, નોંધણી, લાઇવ ચેટ, ગેલેરી અને હાજરી.')} onPress={() => router.push('/events/event-details-registration')} />
        {hasPermission('donations.view') ? (
          <LinkCard title={t('Donations & Receipts', 'દાન અને રસીદ')} subtitle={t('Donation ledger, manual receipts, and member transaction history.', 'દાન લેજર, મેન્યુઅલ રસીદ અને સભ્ય ટ્રાન્ઝેક્શન ઇતિહાસ.')} onPress={() => router.push('/finance/donation-management')} />
        ) : null}
        {role === 'admin' || role === 'superAdmin' ? (
          <LinkCard title={t('Admin Hub', 'એડમિન હબ')} subtitle={t('Dashboards, billing, client onboarding, roles, analytics, and expenses.', 'ડેશબોર્ડ, બિલિંગ, ક્લાયન્ટ ઓનબોર્ડિંગ, રોલ, એનાલિટિક્સ અને ખર્ચ.')} onPress={() => router.push('/dashboard/admin-dashboard')} />
        ) : null}
      </View>

      <SectionCard title={t('What Changed', 'શું બદલાયું')}>
        <BulletSummary
          items={[
            t('Removed the catalog-driven runtime from the active app flow.', 'સક્રિય એપ પ્રવાહમાંથી કેટલોગ આધારિત રનટાઇમ દૂર કરાયો.'),
            t('Navigation now points to dedicated feature routes.', 'હવે નૅવિગેશન સમર્પિત ફીચર રૂટ તરફ જાય છે.'),
            t('Reusable blocks remain, but actual screens are implemented as route files.', 'રીયૂઝેબલ બ્લોક રહ્યા છે, પરંતુ વાસ્તવિક સ્ક્રીન રૂટ ફાઇલ તરીકે બનાવાયા છે.'),
          ]}
        />
      </SectionCard>

      <Text style={styles.title}>{t('Priority Areas', 'પ્રાથમિક વિસ્તાર')}</Text>
      <View style={styles.links}>
        <InfoCard icon="account-check-outline" title={t('Registration', 'નોંધણી')} body={t('Phone verification, KYC approval, digital ID, and PIN setup foundation.', 'ફોન ચકાસણી, KYC મંજૂરી, ડિજિટલ ID અને PIN સેટઅપનો આધાર.')} />
        <InfoCard icon="cash-multiple" title={t('Finance', 'વિત્ત')} body={t('Donations, receipts, billing, and transactions are represented with native flows.', 'દાન, રસીદ, બિલિંગ અને ટ્રાન્ઝેક્શન નેટિવ પ્રવાહમાં દર્શાવાયા છે.')} />
        <InfoCard icon="calendar-heart" title={t('Events', 'ઇવેન્ટ્સ')} body={t('Registration, passes, attendance, gallery, and streaming screens are split into real routes.', 'નોંધણી, પાસ, હાજરી, ગેલેરી અને સ્ટ્રીમિંગ સ્ક્રીન વાસ્તવિક રૂટમાં વહેંચાયા છે.')} />
      </View>

      <View style={styles.pills}>
        <Pill label="Expo Router" active />
        <Pill label={t('Feature routes', 'ફીચર રૂટ')} />
        <Pill label={t('Bilingual UI', 'દ્વિભાષી UI')} />
      </View>

      <SectionCard title={t('All Screens', 'બધી સ્ક્રીન')}>
        <BulletSummary
          items={[
            t('Every implemented screen is linked below so you can review layouts from the main page.', 'મુખ્ય પેજ પરથી લેઆઉટ રીવ્યુ કરવા માટે દરેક અમલમાં મુકાયેલ સ્ક્રીન નીચે લિંક કરેલી છે.'),
            t('Role guards still apply, so restricted screens may redirect depending on the signed-in user.', 'રોલ ગાર્ડ યથાવત છે, તેથી સાઇન-ઇન યૂઝર મુજબ પ્રતિબંધિત સ્ક્રીન રીડાયરેક્ટ થઈ શકે છે.'),
          ]}
        />
      </SectionCard>

      {pageLinkSections.map((section) => (
        <SectionCard key={section.title} title={t(section.title, section.title)}>
          <View style={styles.links}>
            {section.items.map((item) => (
              <LinkCard
                key={`${section.title}-${item.title}`}
                title={t(item.title, item.title)}
                subtitle={t(item.subtitle, item.subtitle)}
                onPress={() => router.push(item.href)}
              />
            ))}
          </View>
        </SectionCard>
      ))}

      <FormSubmitButton label={t('Sign Out', 'સાઇન આઉટ')} onPress={signOut} loading={isSubmitting} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  links: {
    gap: spacing.md,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
