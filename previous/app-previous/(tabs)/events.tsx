import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function EventsHubScreen() {
  const { language } = useAppPreferences();
  const router = useRouter();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Events & Ads', gu: 'ઇવેન્ટ્સ અને જાહેરાત' }}
      title={{ en: 'Events Workflow', gu: 'ઇવેન્ટ વર્કફ્લો' }}
      description={{
        en: 'Event creation, management, registration, attendance, live chat, gallery, and ad-enabled dashboard surfaces.',
        gu: 'ઇવેન્ટ બનાવટ, મેનેજમેન્ટ, નોંધણી, હાજરી, લાઇવ ચેટ, ગેલેરી અને જાહેરાત સાથેના ડેશબોર્ડ સપાટી.',
      }}
      tone="earth">
      <SectionCard title={t('Event Model', 'ઇવેન્ટ મોડેલ')}>
        <BulletSummary
          items={[
            t('Each event can include free or paid registration plus add-ons.', 'દરેક ઇવેન્ટમાં મફત અથવા પેઇડ નોંધણી સાથે એડ-ઓન હોઈ શકે છે.'),
            t('Attendance, gallery, live stream, and chat extend the same event record.', 'હાજરી, ગેલેરી, લાઇવ સ્ટ્રીમ અને ચેટ એ જ ઇવેન્ટ રેકોર્ડને વિસ્તારે છે.'),
            t('Advertisement-aware dashboards can surface sponsorships before and during the event cycle.', 'જાહેરાત આધારિત ડેશબોર્ડ ઇવેન્ટ પહેલાં અને દરમિયાન સ્પોન્સર દર્શાવી શકે છે.'),
          ]}
        />
      </SectionCard>

      <View style={styles.list}>
        <LinkCard title={t('Create New Event', 'નવો ઇવેન્ટ બનાવો')} subtitle={t('Event setup with pricing, schedule, and manager options.', 'કિંમત, સમયપત્રક અને મેનેજર વિકલ્પ સાથે ઇવેન્ટ સેટઅપ.')} onPress={() => router.push('/events/create-new-event')} />
        <LinkCard title={t('Manage Events', 'ઇવેન્ટ મેનેજ કરો')} subtitle={t('Admin roster of events and status filters.', 'ઇવેન્ટ યાદી અને સ્ટેટસ ફિલ્ટર સાથે એડમિન સ્ક્રીન.')} onPress={() => router.push('/events/manage-events')} />
        <LinkCard title={t('My Events List', 'મારા ઇવેન્ટ્સ')} subtitle={t('Member view of registered and upcoming events.', 'નોંધાયેલ અને આવનારા ઇવેન્ટ્સનું સભ્ય દૃશ્ય.')} onPress={() => router.push('/events/my-events-list')} />
        <LinkCard title={t('Event Details & Registration', 'ઇવેન્ટ વિગતો અને નોંધણી')} subtitle={t('Public detail page with CTA to register.', 'નોંધણી CTA સાથે જાહેર વિગતો પેજ.')} onPress={() => router.push('/events/event-details-registration')} />
        <LinkCard title={t('Event Details with Gallery Access', 'ગેલેરી ઍક્સેસ સાથે ઇવેન્ટ વિગતો')} subtitle={t('Event detail variant with gallery and review hooks.', 'ગેલેરી અને રિવ્યુ સાથેની ઇવેન્ટ વિગત આવૃત્તિ.')} onPress={() => router.push('/events/event-details-gallery')} />
        <LinkCard title={t('Event Live & Chat', 'ઇવેન્ટ લાઇવ અને ચેટ')} subtitle={t('Live stream embed entry with event chat room.', 'ઇવેન્ટ ચેટ રૂમ સાથે લાઇવ સ્ટ્રીમ એન્ટ્રી.')} onPress={() => router.push('/events/event-live-chat')} />
        <LinkCard title={t('Event Photo Gallery', 'ઇવેન્ટ ફોટો ગેલેરી')} subtitle={t('Image grid for event media browsing.', 'ઇવેન્ટ મીડિયા બ્રાઉઝિંગ માટે ઇમેજ ગ્રીડ.')} onPress={() => router.push('/events/event-photo-gallery')} />
        <LinkCard title={t('Family Event Passes', 'પરિવાર ઇવેન્ટ પાસ')} subtitle={t('Horizontal pass cards for households and guests.', 'ઘરેલું અને મહેમાન માટે આડા પાસ કાર્ડ.')} onPress={() => router.push('/events/family-event-passes')} />
        <LinkCard title={t('QR Scanner', 'QR સ્કેનર')} subtitle={t('Attendance and add-on redemption scanner entry point.', 'હાજરી અને એડ-ઓન ઉપયોગ માટેનું સ્કેનર એન્ટ્રી.')} onPress={() => router.push('/events/qr-scanner')} />
        <LinkCard title={t('Dashboard with Advertisement', 'જાહેરાત સાથે ડેશબોર્ડ')} subtitle={t('Member-facing dashboard with embedded sponsor placement.', 'સ્પોન્સર પ્લેસમેન્ટ સાથે સભ્ય ડેશબોર્ડ.')} onPress={() => router.push('/dashboard/dashboard-with-advertisement')} />
        <LinkCard title={t('Dashboard with Ad Popup', 'એડ પોપઅપ સાથે ડેશબોર્ડ')} subtitle={t('Popup ad interruption state for login and timed rotation.', 'લૉગિન અને સમયબદ્ધ ફેરફાર માટે પોપઅપ જાહેરાત સ્થિતિ.')} onPress={() => router.push('/dashboard/dashboard-with-ad-popup')} />
        <LinkCard title={t('Create Advertisement', 'જાહેરાત બનાવો')} subtitle={t('Advertisement creation form with schedule and billing details.', 'સમય અને બિલિંગ વિગતો સાથે જાહેરાત બનાવટ ફોર્મ.')} onPress={() => router.push('/advertisements/create-advertisement')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
