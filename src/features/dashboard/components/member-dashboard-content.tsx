import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AppSafeAreaView, CardGridSkeleton, ListRowSkeleton, ProfileHeaderSkeleton, Text } from '@/src/components';
import { isPlainUserSession } from '@/src/core/navigation/default-route';
import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { useSession } from '@/src/core/providers/session-provider';
import { useLocalizedProfileText } from '@/src/features/profile/services/localized-profile-text';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { useMemberDashboard } from '../hooks';
import {
  localizeDashboardCards,
  localizeDashboardIdentityCard,
} from '../services/dashboard-display-translation';
import { emptyDashboardSummary } from '../services/dashboard-service';
import { sponsorImage } from '../constants';
import {
  DashboardFeatureGrid,
  DashboardPopupOverlay,
  MemberDashboardSponsoredCard,
} from './dashboard-blocks';
import { DashboardTopBar } from './dashboard-top-bar';
import { MemberDashboardIdCard } from './member-dashboard-id-card';

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

function MemberDashboardSkeleton() {
  return (
    <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: 96 }}>
        <ListRowSkeleton minHeight={104} />
      </View>

      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], gap: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: 'transparent' }}>
          Loading ID Card
        </Text>
        <ProfileHeaderSkeleton />
      </View>

      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[8], gap: spacing[4] }}>
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: 'transparent' }}>
          Loading Overview
        </Text>
        <CardGridSkeleton columns={2} cards={6} cardMinHeight={128} />
      </View>
    </View>
  );
}

function DashboardShell({ withPopup }: { withPopup: boolean }) {
  const router = useRouter();
  const openMemberMenu = useMemberMenuAction();
  const t = useTranslations('dashboard.home');
  const { session } = useSession();
  const { dashboard, isLoading } = useMemberDashboard();
  const showInitialSkeleton = isLoading && !dashboard;
  const summary = dashboard ?? emptyDashboardSummary;
  const isNormalUser = isPlainUserSession(session);
  const sponsoredCard = summary.sponsoredCard;
  const identityCard = localizeDashboardIdentityCard(summary.identityCard, t);
  const localizedMemberName = useLocalizedProfileText(identityCard.memberName);
  const actionCards = localizeDashboardCards(
    summary.cards.filter(
      (card) =>
        !(
          isNormalUser &&
          (card.icon === 'newspaper' ||
            card.icon === 'campaign' ||
            card.route === '/publications/archive' ||
            card.route?.startsWith('/advertisements'))
        ),
    ),
    summary.summary,
    t,
  );

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        {withPopup && sponsoredCard ? (
          <DashboardPopupOverlay
            image={sponsoredCard.image || sponsorImage}
            title={sponsoredCard.title}
            description={sponsoredCard.description}
            ctaLabel={t('actions.learnMore')}
            onClosePress={() => undefined}
            onPrimaryPress={() => undefined}
          />
        ) : null}

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <DashboardTopBar
            title={t('title.dashboard')}
            onNotificationsPress={() => router.push('/member/notifications')}
            onMenuPress={openMemberMenu}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[3] }}>
          {showInitialSkeleton ? <MemberDashboardSkeleton /> : <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: 96 }}>
              {sponsoredCard ? (
                <MemberDashboardSponsoredCard
                  title={sponsoredCard.title}
                  description={sponsoredCard.description}
                  image={sponsoredCard.image || sponsorImage}
                />
              ) : null}
            </View>

            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
              <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('title.idCard')}
              </Text>
              <MemberDashboardIdCard
                memberName={localizedMemberName}
                memberId={identityCard.memberId}
                location={identityCard.location}
                validity={identityCard.bloodGroup || '-'}
                photo={identityCard.photo || session?.user.profilePhotoUrl || null}
                qrImage={identityCard.qrImage}
                memberLabel={formatUserTypeLabel(session?.user.role)}
                idLabel={t('identity.id')}
                validityLabel={t('identity.bloodGroup')}
              />
            </View>

            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[8] }}>
              <Text variant="h5" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {t('title.overview')}
              </Text>
              <DashboardFeatureGrid items={actionCards} />
            </View>
          </View>}
        </ScrollView>

      </View>
    </AppSafeAreaView>
  );
}

export function MemberDashboardContent({
  withPopupBehavior = false,
}: {
  withPopupBehavior?: boolean;
}) {
  return <DashboardShell withPopup={withPopupBehavior} />;
}
