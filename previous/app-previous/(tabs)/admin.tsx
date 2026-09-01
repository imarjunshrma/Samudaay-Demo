import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { BulletSummary, SectionCard } from '@/src/components/common/feature-blocks';
import { LinkCard } from '@/src/components/ui/cards';
import { spacing } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

export default function AdminHubScreen() {
  const { language } = useAppPreferences();
  const router = useRouter();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  return (
    <AppScreen
      eyebrow={{ en: 'Admin & Super Admin', gu: 'એડમિન અને સુપર એડમિન' }}
      title={{ en: 'Operations & Governance', gu: 'ઓપરેશન્સ અને ગવર્નન્સ' }}
      description={{
        en: 'Dashboards, finance, analytics, roles, expenses, and SaaS client management screens.',
        gu: 'ડેશબોર્ડ, વિત્ત, એનાલિટિક્સ, રોલ, ખર્ચ અને SaaS ક્લાયન્ટ મેનેજમેન્ટ સ્ક્રીન.',
      }}
      tone="warm">
      <SectionCard title={t('Administrative Layers', 'પ્રશાસનિક સ્તરો')}>
        <BulletSummary
          items={[
            t('Community admins manage roles, transactions, trustees, publications, and expenses.', 'સમુદાય એડમિન રોલ, ટ્રાન્ઝેક્શન, ટ્રસ્ટી, પ્રકાશન અને ખર્ચ સંભાળે છે.'),
            t('Super admins manage clients, themes, licensing, and module configuration.', 'સુપર એડમિન ક્લાયન્ટ, થીમ, લાઇસન્સ અને મોડ્યુલ કન્ફિગરેશન સંભાળે છે.'),
            t('Analytics and statements remain separated by domain for easier scaling.', 'એનલિટિક્સ અને સ્ટેટમેન્ટ ડોમેઇન પ્રમાણે અલગ રાખ્યા છે જેથી સ્કેલ સરળ બને.'),
          ]}
        />
      </SectionCard>

      <View style={styles.list}>
        <LinkCard title={t('Admin Dashboard', 'એડમિન ડેશબોર્ડ')} subtitle={t('Primary admin overview.', 'મુખ્ય એડમિન ઓવરવ્યુ.')} onPress={() => router.push('/dashboard/admin-dashboard')} />
        <LinkCard title={t('Admin Dashboard Analytics', 'એડમિન ડેશબોર્ડ એનાલિટિક્સ')} subtitle={t('Executive analytics summary for admins.', 'એડમિન માટે એક્ઝિક્યુટિવ એનાલિટિક્સ સમરી.')} onPress={() => router.push('/dashboard/admin-dashboard-analytics')} />
        <LinkCard title={t('Unified Community Dashboard', 'યુનિફાઇડ સમુદાય ડેશબોર્ડ')} subtitle={t('Cross-module snapshot of community performance.', 'સમુદાય પ્રદર્શનનો ક્રોસ-મોડ્યુલ સ્નેપશોટ.')} onPress={() => router.push('/dashboard/unified-community-dashboard')} />
        <LinkCard title={t('People Analytics', 'લોકો એનાલિટિક્સ')} subtitle={t('Member growth, engagement, and area views.', 'સભ્ય વૃદ્ધિ, જોડાણ અને વિસ્તાર આધારિત દૃશ્ય.')} onPress={() => router.push('/analytics/people-analytics')} />
        <LinkCard title={t('Event Analytics', 'ઇવેન્ટ એનાલિટિક્સ')} subtitle={t('Attendance, registration, and performance reporting.', 'હાજરી, નોંધણી અને પ્રદર્શન રિપોર્ટિંગ.')} onPress={() => router.push('/analytics/event-analytics')} />
        <LinkCard title={t('Event Performance Dashboard', 'ઇવેન્ટ પરફોર્મન્સ ડેશબોર્ડ')} subtitle={t('Focused event KPI surface.', 'કેન્‍દ્રીત ઇવેન્ટ KPI સપાટી.')} onPress={() => router.push('/dashboard/event-performance-dashboard')} />
        <LinkCard title={t('Transaction Analytics', 'ટ્રાન્ઝેક્શન એનાલિટિક્સ')} subtitle={t('Collection and revenue insights.', 'કલેક્શન અને આવક અંગેની ઇન્સાઇટ.')} onPress={() => router.push('/analytics/transaction-analytics')} />
        <LinkCard title={t('Matrimony Analytics', 'મેટ્રિમોની એનાલિટિક્સ')} subtitle={t('Subscription and engagement metrics.', 'સબ્સ્ક્રિપ્શન અને જોડાણ મેટ્રિક્સ.')} onPress={() => router.push('/analytics/matrimony-analytics')} />
        <LinkCard title={t('Yearly Profit & Loss', 'વાર્ષિક નફો અને નુકસાન')} subtitle={t('Year-end financial reporting surface.', 'વર્ષ અંત નાણાંકીય રિપોર્ટિંગ સપાટી.')} onPress={() => router.push('/analytics/yearly-profit-loss')} />
        <LinkCard title={t('Event Profit & Loss', 'ઇવેન્ટ નફો અને નુકસાન')} subtitle={t('Event-level profitability statement.', 'ઇવેન્ટ લેવલ નફાકારકતા સ્ટેટમેન્ટ.')} onPress={() => router.push('/analytics/event-profit-loss')} />
        <LinkCard title={t('Donation Management', 'દાન મેનેજમેન્ટ')} subtitle={t('Donation ledger and receipt operations.', 'દાન લેજર અને રસીદ પ્રવાહ.')} onPress={() => router.push('/finance/donation-management')} />
        <LinkCard title={t('Record Manual Donation', 'મેન્યુઅલ દાન રેકોર્ડ')} subtitle={t('Offline receipt entry for managers and members.', 'મેનેજર અને સભ્ય માટે ઓફલાઇન રસીદ એન્ટ્રી.')} onPress={() => router.push('/finance/record-manual-donation')} />
        <LinkCard title={t('Billing & Invoicing', 'બિલિંગ અને ઇન્વોઇસિંગ')} subtitle={t('SaaS billing and invoice tracking.', 'SaaS બિલિંગ અને ઇન્વોઇસ ટ્રેકિંગ.')} onPress={() => router.push('/finance/billing-invoicing')} />
        <LinkCard title={t('Transaction Management', 'ટ્રાન્ઝેક્શન મેનેજમેન્ટ')} subtitle={t('Admin transaction queue and filters.', 'એડમિન ટ્રાન્ઝેક્શન ક્યૂ અને ફિલ્ટર.')} onPress={() => router.push('/finance/transaction-management')} />
        <LinkCard title={t('My Transactions', 'મારા ટ્રાન્ઝેક્શન')} subtitle={t('Member receipt history.', 'સભ્યની રસીદ ઇતિહાસ.')} onPress={() => router.push('/finance/my-transactions')} />
        <LinkCard title={t('Expense Management', 'ખર્ચ મેનેજમેન્ટ')} subtitle={t('Expense approval and queue visibility.', 'ખર્ચ મંજૂરી અને ક્યૂ વિઝિબિલિટી.')} onPress={() => router.push('/expenses/expense-management')} />
        <LinkCard title={t('Create New Expense', 'નવો ખર્ચ બનાવો')} subtitle={t('Expense request form with receipt references.', 'રસીદ રેફરન્સ સાથે ખર્ચ વિનંતી ફોર્મ.')} onPress={() => router.push('/expenses/create-new-expense')} />
        <LinkCard title={t('Role Management & Permissions', 'રોલ મેનેજમેન્ટ અને પરવાનગી')} subtitle={t('Role matrix and module access controls.', 'રોલ મેટ્રિક્સ અને મોડ્યુલ ઍક્સેસ નિયંત્રણ.')} onPress={() => router.push('/roles/role-management')} />
        <LinkCard title={t('Assign User Role', 'યુઝર રોલ સોંપો')} subtitle={t('Assign roles to people or admin accounts.', 'લોકો અથવા એડમિન એકાઉન્ટને રોલ સોંપો.')} onPress={() => router.push('/roles/assign-user-role')} />
        <LinkCard title={t('Create New Client Organization', 'નવું ક્લાયન્ટ સંગઠન બનાવો')} subtitle={t('Super-admin onboarding for a new community.', 'નવા સમુદાય માટે સુપર-એડમિન ઓનબોર્ડિંગ.')} onPress={() => router.push('/super-admin/create-new-client-organization')} />
        <LinkCard title={t('Client Management', 'ક્લાયન્ટ મેનેજમેન્ટ')} subtitle={t('Multi-client SaaS roster and account health.', 'મલ્ટિ-ક્લાયન્ટ SaaS યાદી અને એકાઉન્ટ હેલ્થ.')} onPress={() => router.push('/super-admin/client-management')} />
        <LinkCard title={t('Client Configuration', 'ક્લાયન્ટ કન્ફિગરેશન')} subtitle={t('Theme, modules, and settings controls.', 'થીમ, મોડ્યુલ અને સેટિંગ નિયંત્રણ.')} onPress={() => router.push('/super-admin/client-configuration')} />
        <LinkCard title={t('Create Admin', 'એડમિન બનાવો')} subtitle={t('Create community admin accounts.', 'સમુદાય એડમિન એકાઉન્ટ બનાવો.')} onPress={() => router.push('/super-admin/create-admin')} />
        <LinkCard title={t('Main Navigation Menu', 'મુખ્ય નૅવિગેશન મેનુ')} subtitle={t('Menu shell for module visibility.', 'મોડ્યુલ વિઝિબિલિટી માટેનું મેનુ શેલ.')} onPress={() => router.push('/super-admin/main-navigation-menu')} />
        <LinkCard title={t('Main Navigation Menu Updated', 'અપડેટેડ મુખ્ય નૅવિગેશન')} subtitle={t('Refined navigation shell with more modules.', 'વધારે મોડ્યુલ સાથે સુધારેલ નૅવિગેશન શેલ.')} onPress={() => router.push('/super-admin/main-navigation-menu-updated')} />
        <LinkCard title={t('Splash Screen', 'સ્પ્લેશ સ્ક્રીન')} subtitle={t('Client-branded launch experience.', 'ક્લાયન્ટ બ્રાન્ડેડ લૉન્ચ અનુભવ.')} onPress={() => router.push('/super-admin/splash-screen')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
