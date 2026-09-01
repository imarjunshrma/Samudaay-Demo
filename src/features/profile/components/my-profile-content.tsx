import { Linking, Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Button, Dialog, Text } from '@/src/components';
import { showConfirmationDialog } from '@/src/components/feedback';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { useSession } from '@/src/core/providers/session-provider';
import { securityConfig } from '@/src/core/config/security';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { useProfile } from '../hooks';
import { useLocalizedProfileText } from '../services/localized-profile-text';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { LanguageSwitcherCard } from './language-switcher-card';
import { NotificationPreferenceCard } from './notification-preference-card';
import { ProfileActionCard, ProfileActionIcon, ProfileDetailRow, ProfileHero, ProfileSectionHeading } from './profile-blocks';
import { ProfilePageSkeleton } from './profile-page-skeleton';

function getProfileStatusLabel(status: string | null | undefined, t: (key: string) => string) {
  switch (String(status || '').trim().toUpperCase()) {
    case 'APPROVED':
      return t('fields.approved');
    case 'ACTIVE':
      return t('fields.active');
    case 'INACTIVE':
      return t('fields.inactive');
    case 'PENDING':
      return t('fields.pending');
    case 'REJECTED':
      return t('fields.rejected');
    default:
      return status ? status.replace(/_/g, ' ') : t('fields.active');
  }
}

export function MyProfileContent() {
  const router = useRouter();
  const openMemberMenu = useMemberMenuAction();
  const { signOut, isSubmitting } = useAuthActions();
  const { session, setAppViewMode } = useSession();
  const { profile, isLoading } = useProfile();
  const t = useTranslations('profile.my-profile');
  const [deleteRequestErrorVisible, setDeleteRequestErrorVisible] = useState(false);
  const isAdmin = isAdminLikeSession(session);
  const isKycApproved = isAdmin || session?.user.kycStatus === 'APPROVED';
  const profileLabel = isKycApproved
    ? getProfileStatusLabel(profile?.status, t)
    : t('fields.inactive');
  const showSkeleton = isLoading && !profile;
  const localizedDisplayName = useLocalizedProfileText(
    profile?.fullNameEn || session?.user.fullName || t('fallback.communityMember'),
    profile?.fullNameGu,
  );
  const profileReturnTo = isAdmin ? '/admin/profile' : '/member/profile';

  async function requestDeleteAccount() {
    const confirmed = await showConfirmationDialog({
      title: t('deleteRequest.confirmTitle'),
      description: t('deleteRequest.confirmDescription'),
      confirmLabel: t('deleteRequest.confirmButton'),
      cancelLabel: t('edit.actions.cancel'),
    });

    if (!confirmed) {
      return;
    }

    const supportEmail = 'connect@mectv.org';
    const subject = encodeURIComponent('Delete Account Request');
    const body = encodeURIComponent(
      [
        'Hello Team,',
        '',
        'I would like to request deletion of my account.',
        '',
        `Name: ${profile?.fullNameEn || session?.user.fullName || ''}`,
        `Member ID: ${profile?.memberId || session?.user.communityMembershipId || ''}`,
        `Phone: ${profile?.mobileNumber || session?.user.mobileNumber || ''}`,
        `Email: ${profile?.email || session?.user.email || ''}`,
        '',
        'Please process my request.',
      ].join('\n'),
    );
    const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (!supported) {
        setDeleteRequestErrorVisible(true);
        return;
      }
      await Linking.openURL(mailtoUrl);
    } catch {
      setDeleteRequestErrorVisible(true);
    }
  }

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title={t('title')}
          variant="menu-notification"
          onLeftPress={openMemberMenu}
          onRightPress={() => router.push((isAdmin ? '/admin/notifications' : '/member/notifications') as never)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: spacing[6], paddingHorizontal: spacing[4], paddingBottom: spacing[2], gap: 36 }}>
          {showSkeleton ? (
            <ProfilePageSkeleton />
          ) : (
            <>
              <ProfileHero
                name={localizedDisplayName || t('fallback.communityMember')}
                memberId={profile?.memberId || null}
                photoUrl={profile?.profilePhotoUrl || null}
                statusLabel={profileLabel}
              />
              {isAdmin ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    void setAppViewMode('admin').then(() => {
                      router.replace('/admin/profile');
                    });
                  }}
                  style={{
                    minHeight: 66,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: colors.primary.borderLight,
                    backgroundColor: colors.background.surface,
                    paddingHorizontal: spacing[4],
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[4],
                  }}>
                  <MaterialIcons name="switch-account" size={26} color={colors.primary.DEFAULT} />
                  <Text variant="body" style={{ flex: 1, color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
                    Switch to Admin
                  </Text>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: radius.md,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                      backgroundColor: colors.primary.subtle,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                      A
                    </Text>
                  </View>
                </Pressable>
              ) : null}
              {!isKycApproved ? (
                <View style={{ padding: spacing[4], borderRadius: radius.xl, backgroundColor: '#fff4e6', borderWidth: 1, borderColor: '#f5c98b' }}>
                  <Text variant="label" color="#9a3412" style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('kyc.inactiveTitle')}
                  </Text>
                  <Text variant="body" color="#9a3412" style={{ marginTop: 4, lineHeight: 22 }}>
                    {t('kyc.inactiveDescription')}
                  </Text>
                </View>
              ) : null}

              <View style={{ gap: spacing[6] }}>
                <ProfileSectionHeading>{t('sections.personal')}</ProfileSectionHeading>
                <View style={{ backgroundColor: colors.background.surface, padding: spacing[6], borderRadius: radius.xl, gap: spacing[6], borderWidth: 1, borderColor: colors.primary.borderLight }}>
                  <View style={{ gap: spacing[6], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[6] }}>
                    <ProfileDetailRow label={t('fields.fullNameEn')} value={profile?.fullNameEn || t('fields.notProvided')} />
                    <ProfileDetailRow label={`${t('fields.fullNameGu')} / પૂરું નામ`} value={profile?.fullNameGu || t('fields.notProvided')} large />
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[8], rowGap: spacing[6] }}>
                    <View style={{ width: '47%' }}><ProfileDetailRow label={t('fields.memberId')} value={profile?.memberId || t('fields.pending')} /></View>
                    <View style={{ width: '47%' }}><ProfileDetailRow label={t('fields.membershipStatus')} value={profileLabel} /></View>
                    <View style={{ width: '47%' }}><ProfileDetailRow label={t('fields.profilePhoto')} value={profile?.profilePhotoUrl ? t('fields.uploaded') : t('fields.notUploaded')} /></View>
                    <View style={{ width: '47%' }}><ProfileDetailRow label={t('fields.bloodGroup')} value={profile?.bloodGroup || t('fields.notProvided')} /></View>
                  </View>
                </View>
                <LanguageSwitcherCard
                  label={t('language.label')}
                  helperText={t('language.helper')}
                />
              </View>

              <View style={{ gap: spacing[6] }}>
                <ProfileSectionHeading>{t('sections.contact')}</ProfileSectionHeading>
                <View style={{ gap: spacing[4] }}>
                  <View style={{ backgroundColor: colors.background.surface, padding: spacing[5], borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
                    <ProfileActionIcon name="call" color={colors.primary.DEFAULT} />
                    <View style={{ flex: 1 }}>
                      <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                        {t('fields.mobile')}
                      </Text>
                      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold }}>
                        {profile?.mobileNumber || t('fields.notProvided')}
                      </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: colors.background.surface, padding: spacing[5], borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
                    <ProfileActionIcon name="mail" color={colors.primary.DEFAULT} />
                    <View style={{ flex: 1 }}>
                      <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                        {t('fields.email')}
                      </Text>
                      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold }}>
                        {profile?.email || t('fields.notProvided')}
                      </Text>
                    </View>
                  </View>

                  <View style={{ backgroundColor: colors.background.surface, padding: spacing[6], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight }}>
                    <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                      <ProfileActionIcon name="location-on" color={colors.primary.DEFAULT} topOffset />
                      <View style={{ flex: 1, gap: spacing[6] }}>
                        <View style={{ gap: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[4] }}>
                          <View>
                            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                              {t('fields.addressEn')}
                            </Text>
                            <Text variant="body" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
                              {profile?.addressEn || t('fields.notProvided')}
                            </Text>
                          </View>
                          <View>
                            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                              {t('fields.addressGu')} / સરનામું
                            </Text>
                            <Text variant="body" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24, fontSize: 18 }}>
                              {profile?.addressGu || t('fields.notProvided')}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                          <View style={{ flex: 1 }}><ProfileDetailRow label={t('fields.city')} value={profile?.city || t('fields.notProvided')} /></View>
                          <View style={{ flex: 1 }}><ProfileDetailRow label={t('fields.pincode')} value={profile?.pincode || t('fields.notProvided')} /></View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <View style={{ marginBottom: spacing[2] }}>
                  <Text variant="h3" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                    {t('sections.management')}
                  </Text>
                </View>
                <ProfileActionCard
                  icon="edit"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.profileDetails')}
                  subtitle={isAdmin ? t('actions.profileDetailsSubtitleAdmin') : t('actions.profileDetailsSubtitleMember')}
                  onPress={() => router.push({ pathname: '/profile/change-details', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="groups"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.manageFamily')}
                  subtitle={t('actions.manageFamilySubtitle')}
                  onPress={() => router.push({ pathname: '/profile/family-management', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="folder-shared"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.manageDocs')}
                  subtitle={t('actions.manageDocsSubtitle')}
                  onPress={() => router.push({ pathname: '/profile/documents', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="description"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.terms')}
                  subtitle={t('actions.termsSubtitle')}
                  onPress={() => router.push({ pathname: '/profile/terms-and-conditions', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="policy"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.privacy')}
                  subtitle={t('actions.privacySubtitle')}
                  onPress={() => router.push({ pathname: '/profile/privacy-policy', params: { returnTo: profileReturnTo } } as never)}
                />
                {securityConfig.authSecurityEnabled && isKycApproved ? (
                  <ProfileActionCard
                    icon="security"
                    iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                    iconColor={colors.primary.DEFAULT}
                    title={t('actions.security')}
                    subtitle={t('actions.securitySubtitle')}
                    onPress={() => router.push({ pathname: '/profile/security', params: { returnTo: profileReturnTo } } as never)}
                  />
                ) : null}
                <NotificationPreferenceCard returnTo={profileReturnTo} />
                <ProfileActionCard
                  icon="delete"
                  iconBackground={colors.primary.subtle ?? 'rgba(242, 120, 13, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={t('actions.deleteAccountRequest')}
                  subtitle={t('actions.deleteAccountRequestSubtitle')}
                  onPress={() => {
                    void requestDeleteAccount();
                  }}
                />
              </View>

              <View style={{ paddingVertical: spacing[3], alignItems: 'center', gap: spacing[4] }}>
                <Button
                  variant="primary"
                  rounded
                  loading={isSubmitting}
                  loadingLabel={t('actions.signOut')}
                  leftIcon={<MaterialIcons name="logout" size={18} color="#fff" />}
                  onPress={() => void signOut()}
                >
                  {t('actions.signOut')}
                </Button>
              </View>
            </>
          )}
        </ScrollView>

      </View>
      <Dialog
        visible={deleteRequestErrorVisible}
        variant="error"
        title={t('deleteRequest.errorTitle')}
        description={t('deleteRequest.errorDescription')}
        onConfirm={() => setDeleteRequestErrorVisible(false)}
        onCancel={() => setDeleteRequestErrorVisible(false)}
      />
    </AppSafeAreaView>
  );
}
