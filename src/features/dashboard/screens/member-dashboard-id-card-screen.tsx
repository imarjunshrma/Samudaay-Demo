import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { DigitalIdCard, Text } from '@/src/components';
import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { useSession } from '@/src/core/providers/session-provider';
import { useLocalizedProfileText } from '@/src/features/profile/services/localized-profile-text';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { DashboardTopBar } from '../components/dashboard-top-bar';
import { MemberDashboardActionGrid } from '../components/dashboard-blocks';
import { useMemberDashboard } from '../hooks';
import {
  localizeDashboardCards,
  localizeDashboardIdentityCard,
} from '../services/dashboard-display-translation';
import { emptyDashboardSummary } from '../services/dashboard-service';

function chunkIntoRows<T>(items: readonly T[], size: number) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}

function formatUserTypeLabel(value?: string | null) {
  const normalized = String(value || 'user').trim().toLowerCase().replace(/-/g, '_');
  switch (normalized) {
    case 'admin':
      return 'Admin';
    case 'trustee':
      return 'Trustee';
    case 'member':
      return 'Member';
    case 'community_member':
      return 'Committee Member';
    case 'user':
    default:
      return 'User';
  }
}

export function MemberDashboardIdCardScreen() {
  const router = useRouter();
  const openMemberMenu = useMemberMenuAction();
  const t = useTranslations('dashboard.member-id-card');
  const { session } = useSession();
  const { dashboard } = useMemberDashboard();
  const summary = dashboard ?? emptyDashboardSummary;
  const localizedIdentityCard = localizeDashboardIdentityCard(summary.identityCard, t);
  const localizedMemberName = useLocalizedProfileText(localizedIdentityCard.memberName);
  const localizedCards = localizeDashboardCards(summary.cards, summary.summary, t);
  const dashboardRows = chunkIntoRows(localizedCards, 2);

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <DashboardTopBar
            title={t('title')}
            onNotificationsPress={() => router.push('/member/notifications')}
            onMenuPress={openMemberMenu}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[3] }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: 96 }}>
              <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('card.title')}
              </Text>
              <DigitalIdCard
                memberName={localizedMemberName}
                memberId={localizedIdentityCard.memberId}
                location={localizedIdentityCard.location}
                validity={localizedIdentityCard.bloodGroup || '-'}
                photo={localizedIdentityCard.photo || session?.user.profilePhotoUrl || null}
                qrImage={localizedIdentityCard.qrImage}
                memberLabel={formatUserTypeLabel(session?.user.role)}
                idLabel={t('identity.id')}
                validityLabel={t('identity.bloodGroup')}
              />
            </View>

            <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[8] }}>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('dashboard.title')}
              </Text>
              <MemberDashboardActionGrid rows={dashboardRows} />
            </View>
          </View>
        </ScrollView>

      </View>
    </AppSafeAreaView>
  );
}
