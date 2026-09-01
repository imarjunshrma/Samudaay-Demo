import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function CommunityHubScreen() {
  const { language } = useAppPreferences();
  const router = useRouter();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Community Operations', gu: 'સમુદાય ઓપરેશન્સ' }}
      title={{ en: 'Community & Discovery', gu: 'સમુદાય અને શોધ' }}
      description={{
        en: 'Member directories, trustees, chat, birthdays, notifications, matrimony, and publication flows.',
        gu: 'સભ્ય ડિરેક્ટરી, ટ્રસ્ટી, ચેટ, જન્મદિવસ, સૂચના, મેટ્રિમોની અને પ્રકાશન પ્રવાહ.',
      }}
      tone="cool">
      <SectionCard title={t('Community Layers', 'સમુદાય સ્તરો')}>
        <BulletSummary
          items={[
            t('Area-based directories and trustees keep people discoverable.', 'વિસ્તાર આધારિત ડિરેક્ટરી અને ટ્રસ્ટી લોકો સુધી પહોંચ સુલભ રાખે છે.'),
            t('Group chat, notifications, and birthday engagement are managed as communication features.', 'ગ્રુપ ચેટ, સૂચના અને જન્મદિવસ જોડાણ કોમ્યુનિકેશન ફીચર તરીકે મેનેજ થાય છે.'),
            t('Matrimony and monthly publication sit on top of the same member data foundation.', 'મેટ્રિમોની અને માસિક પ્રકાશન એ જ સભ્ય ડેટા આધાર પર બેસે છે.'),
          ]}
        />
      </SectionCard>

      <View style={styles.list}>
        <LinkCard title={t('Member Directory', 'સભ્ય ડિરેક્ટરી')} subtitle={t('Public member search and area-based browsing.', 'જાહેર સભ્ય શોધ અને વિસ્તાર આધારિત બ્રાઉઝિંગ.')} onPress={() => router.push('/directory/member-directory')} />
        <LinkCard title={t('Manage Member Directory', 'સભ્ય ડિરેક્ટરી મેનેજ કરો')} subtitle={t('Admin curation of records and access visibility.', 'રેકોર્ડ અને ઍક્સેસ વિઝિબિલિટીનું એડમિન નિયંત્રણ.')} onPress={() => router.push('/directory/manage-member-directory')} />
        <LinkCard title={t('Trustees', 'ટ્રસ્ટીઓ')} subtitle={t('Trustee listing and public introductions.', 'ટ્રસ્ટી યાદી અને જાહેર પરિચય.')} onPress={() => router.push('/directory/trustees')} />
        <LinkCard title={t('Manage Community Trustees', 'સમુદાય ટ્રસ્ટી મેનેજ કરો')} subtitle={t('Admin management of trustee records and contact details.', 'ટ્રસ્ટી રેકોર્ડ અને સંપર્કનું એડમિન સંચાલન.')} onPress={() => router.push('/directory/manage-community-trustees')} />
        <LinkCard title={t('Community Hub', 'સમુદાય હબ')} subtitle={t('High-level social home for notices, groups, and activity.', 'સૂચના, જૂથ અને પ્રવૃત્તિ માટેનું સામાજિક હોમ.')} onPress={() => router.push('/communication/community-hub')} />
        <LinkCard title={t('Community Chats', 'સમુદાય ચેટ્સ')} subtitle={t('Group and event conversation rooms with moderation.', 'મોડરેશન સાથે ગ્રુપ અને ઇવેન્ટ ચેટ રૂમ.')} onPress={() => router.push('/communication/community-chats')} />
        <LinkCard title={t('Notifications', 'સૂચનાઓ')} subtitle={t('Inbox view for bilingual community announcements.', 'દ્વિભાષી સમુદાય જાહેરાત માટે ઇનબોક્સ.')} onPress={() => router.push('/communication/notifications')} />
        <LinkCard title={t('Create Notification', 'સૂચના બનાવો')} subtitle={t('Audience targeting with image and video support.', 'ઇમેજ અને વીડિયો સપોર્ટ સાથે ઑડિયન્સ ટાર્ગેટિંગ.')} onPress={() => router.push('/communication/create-notification')} />
        <LinkCard title={t('Birthday Reminders', 'જન્મદિવસ યાદ અપાવટ')} subtitle={t('Daily reminder feed for upcoming birthdays.', 'આગામી જન્મદિવસ માટે દૈનિક ફીડ.')} onPress={() => router.push('/birthdays/birthday-reminders')} />
        <LinkCard title={t('Send Birthday Card', 'જન્મદિવસ કાર્ડ મોકલો')} subtitle={t('Greeting composer with message and artwork selection.', 'સંદેશ અને આર્ટવર્ક પસંદગી સાથે શુભેચ્છા સંપાદક.')} onPress={() => router.push('/birthdays/send-birthday-card')} />
        <LinkCard title={t('Create Matrimony Profile', 'મેટ્રિમોની પ્રોફાઇલ બનાવો')} subtitle={t('Profile creation flow with subscription controls.', 'સબ્સ્ક્રિપ્શન નિયંત્રણ સાથે પ્રોફાઇલ બનાવટ.')} onPress={() => router.push('/matrimony/create-matrimony-profile')} />
        <LinkCard title={t('Matrimony Discovery', 'મેટ્રિમોની શોધ')} subtitle={t('Primary discovery grid with filters and featured placements.', 'ફિલ્ટર અને ફીચર્ડ પ્લેસમેન્ટ સાથે પ્રાથમિક શોધ ગ્રીડ.')} onPress={() => router.push('/matrimony/matrimony-discovery')} />
        <LinkCard title={t('Matrimony Discovery 2', 'મેટ્રિમોની શોધ 2')} subtitle={t('Alternative editorial-style discovery view.', 'વૈકલ્પિક એડિટોરિયલ-શૈલી શોધ દૃશ્ય.')} onPress={() => router.push('/matrimony/matrimony-discovery-2')} />
        <LinkCard title={t('Approve Matrimony Profiles', 'મેટ્રિમોની પ્રોફાઇલ મંજૂરી')} subtitle={t('Manager approval queue for submitted profiles.', 'સબમિટ થયેલ પ્રોફાઇલ માટે મેનેજર મંજૂરી ક્યૂ.')} onPress={() => router.push('/matrimony/approve-matrimony-profiles')} />
        <LinkCard title={t('Monthly Publications Archive', 'માસિક પ્રકાશન આર્કાઇવ')} subtitle={t('Archive of generated monthly publications.', 'જનરેટ થયેલ માસિક પ્રકાશનનું આર્કાઇવ.')} onPress={() => router.push('/publications/monthly-publications-archive')} />
        <LinkCard title={t('Generate Publication', 'પ્રકાશન જનરેટ કરો')} subtitle={t('Create publication drafts from ads and matrimony profiles.', 'જાહેરાત અને મેટ્રિમોની પ્રોફાઇલ પરથી પ્રકાશન ડ્રાફ્ટ બનાવો.')} onPress={() => router.push('/publications/generate-publication')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
