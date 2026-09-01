import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function RegistrationHubScreen() {
  const { language } = useAppPreferences();
  const router = useRouter();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Registration & Profile', gu: 'નોંધણી અને પ્રોફાઇલ' }}
      title={{ en: 'Onboarding Flows', gu: 'ઓનબોર્ડિંગ ફ્લો' }}
      description={{
        en: 'Dedicated routes for registration, KYC review, family records, profile management, education, and digital ID.',
        gu: 'નોંધણી, KYC સમીક્ષા, પરિવાર રેકોર્ડ, પ્રોફાઇલ, શિક્ષણ અને ડિજિટલ ID માટે સમર્પિત રૂટ.',
      }}
      tone="warm">
      <SectionCard title={t('Core User Journey', 'મુખ્ય યુઝર યાત્રા')}>
        <BulletSummary
          items={[
            t('Member registers with mobile number and OTP.', 'સભ્ય મોબાઇલ નંબર અને OTP સાથે નોંધણી કરે છે.'),
            t('KYC documents are uploaded and reviewed by an admin or registration manager.', 'KYC દસ્તાવેજ એડમિન અથવા રજિસ્ટ્રેશન મેનેજર દ્વારા સમીક્ષા થાય છે.'),
            t('Profile, family, and education data then become reusable across events and analytics.', 'પછી પ્રોફાઇલ, પરિવાર અને શિક્ષણ ડેટાનો ઇવેન્ટ્સ અને એનાલિટિક્સમાં ઉપયોગ થાય છે.'),
          ]}
        />
      </SectionCard>

      <View style={styles.list}>
        <LinkCard title={t('Registration & KYC', 'નોંધણી અને KYC')} subtitle={t('Mobile verification, onboarding steps, and activation readiness.', 'મોબાઇલ ચકાસણી, ઓનબોર્ડિંગ પગથિયા અને એક્ટિવેશન તૈયારી.')} onPress={() => router.push('/registration/registration-kyc')} />
        <LinkCard title={t('KYC Approval', 'KYC મંજૂરી')} subtitle={t('Admin review queue with document status and resolution steps.', 'દસ્તાવેજ સ્થિતિ અને રિઝોલ્યુશન સાથે એડમિન સમીક્ષા ક્યૂ.')} onPress={() => router.push('/registration/kyc-approval')} />
        <LinkCard title={t('Dashboard & ID Card', 'ડેશબોર્ડ અને ID કાર્ડ')} subtitle={t('Member home identity surface and digital card access.', 'સભ્ય હોમ ઓળખ અને ડિજિટલ કાર્ડ ઍક્સેસ.')} onPress={() => router.push('/profile/dashboard-id-card')} />
        <LinkCard title={t('My Profile', 'મારી પ્રોફાઇલ')} subtitle={t('Editable bilingual profile with locked phone number.', 'લોક થયેલા ફોન નંબર સાથે સંપાદિત દ્વિભાષી પ્રોફાઇલ.')} onPress={() => router.push('/profile/my-profile')} />
        <LinkCard title={t('Family Management', 'પરિવાર વ્યવસ્થાપન')} subtitle={t('Manage household members, DOB, and linked user records.', 'ઘરના સભ્ય, જન્મતારીખ અને જોડાયેલ રેકોર્ડનું સંચાલન.')} onPress={() => router.push('/profile/family-management')} />
        <LinkCard title={t('Children Education Directory', 'બાળકોની શિક્ષણ ડિરેક્ટરી')} subtitle={t('Class-wise student directory and performance tracking.', 'ક્લાસ-વાઇઝ વિદ્યાર્થી ડિરેક્ટરી અને પ્રદર્શન ટ્રેકિંગ.')} onPress={() => router.push('/profile/children-education-directory')} />
        <LinkCard title={t('Upload Marksheet', 'માર્કશીટ અપલોડ')} subtitle={t('Admin-controlled academic result submission workflow.', 'એડમિન નિયંત્રિત પરિણામ સબમિશન વર્કફ્લો.')} onPress={() => router.push('/profile/upload-marksheet')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
