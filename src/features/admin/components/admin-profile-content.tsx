import { Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Button, Text } from '@/src/components';
import { securityConfig } from '@/src/core/config/security';
import { useSession } from '@/src/core/providers/session-provider';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { useProfile } from '@/src/features/profile/hooks';
import { LanguageSwitcherCard } from '@/src/features/profile/components/language-switcher-card';
import { NotificationPreferenceCard } from '@/src/features/profile/components/notification-preference-card';
import { ProfileActionCard, ProfileActionIcon, ProfileDetailRow, ProfileHero, ProfileSectionHeading } from '@/src/features/profile/components/profile-blocks';
import { ProfilePageSkeleton } from '@/src/features/profile/components/profile-page-skeleton';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

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

export function AdminProfileContent() {
  const router = useRouter();
  const navigation = useNavigation();
  const { signOut, isSubmitting } = useAuthActions();
  const t = useTranslations('admin.profile');
  const tProfile = useTranslations('profile.my-profile');
  const { profile, isLoading } = useProfile();
  const { setAppViewMode } = useSession();
  const showSkeleton = isLoading && !profile;
  const profileReturnTo = '/admin/profile';

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader
        variant="menu-notification"
        title={t('title')}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        onRightPress={() => router.push('/admin/notification-inbox' as never)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: spacing[6], paddingHorizontal: spacing[4], paddingBottom: spacing[2], gap: 36 }}>
          {showSkeleton ? (
            <ProfilePageSkeleton />
          ) : (
            <>
              <ProfileHero
                name={profile?.fullNameEn || 'Admin'}
                memberId={profile?.memberId || null}
                photoUrl={profile?.profilePhotoUrl || null}
                statusLabel={getProfileStatusLabel(profile?.status, tProfile)}
              />

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void setAppViewMode('user').then(() => {
                    router.replace('/member/profile');
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
                  Switch to User
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
                    U
                  </Text>
                </View>
              </Pressable>

              <View style={{ gap: spacing[6] }}>
                <ProfileSectionHeading>{tProfile('sections.personal')}</ProfileSectionHeading>
                <View
                  style={{
                    backgroundColor: colors.background.surface,
                    padding: spacing[6],
                    borderRadius: radius.xl,
                    gap: spacing[6],
                    borderWidth: 1,
                    borderColor: colors.primary.borderLight,
                  }}>
                  <View style={{ gap: spacing[6], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[6] }}>
                    <ProfileDetailRow label={tProfile('fields.fullNameEn')} value={profile?.fullNameEn || tProfile('fields.notProvided')} />
                    <ProfileDetailRow label={`${tProfile('fields.fullNameGu')} / પૂરું નામ`} value={profile?.fullNameGu || tProfile('fields.notProvided')} large />
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing[8], rowGap: spacing[6] }}>
                    <View style={{ width: '47%' }}>
                      <ProfileDetailRow label={tProfile('fields.memberId')} value={profile?.memberId || tProfile('fields.pending')} />
                    </View>
                    <View style={{ width: '47%' }}>
                      <ProfileDetailRow label={tProfile('fields.membershipStatus')} value={getProfileStatusLabel(profile?.status, tProfile)} />
                    </View>
                  </View>
                </View>
                <LanguageSwitcherCard
                  label={t('language.label')}
                  helperText={t('language.helper')}
                />
              </View>

              <View style={{ gap: spacing[6] }}>
                <ProfileSectionHeading>{tProfile('sections.contact')}</ProfileSectionHeading>
                <View style={{ gap: spacing[4] }}>
                  <View
                    style={{
                      backgroundColor: colors.background.surface,
                      padding: spacing[5],
                      borderRadius: radius.xl,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[4],
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    <ProfileActionIcon name="call" color={colors.primary.DEFAULT} />
                    <View style={{ flex: 1 }}>
                      <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                        {tProfile('fields.mobile')}
                      </Text>
                      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold }}>
                        {profile?.mobileNumber || tProfile('fields.notProvided')}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: colors.background.surface,
                      padding: spacing[5],
                      borderRadius: radius.xl,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[4],
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    <ProfileActionIcon name="mail" color={colors.primary.DEFAULT} />
                    <View style={{ flex: 1 }}>
                      <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                        {tProfile('fields.email')}
                      </Text>
                      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold }}>
                        {profile?.email || tProfile('fields.notProvided')}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: colors.background.surface,
                      padding: spacing[6],
                      borderRadius: radius.xl,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                      <ProfileActionIcon name="location-on" color={colors.primary.DEFAULT} topOffset />
                      <View style={{ flex: 1, gap: spacing[6] }}>
                        <View style={{ gap: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingBottom: spacing[4] }}>
                          <View>
                            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                              {tProfile('fields.addressEn')}
                            </Text>
                            <Text variant="body" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24 }}>
                              {profile?.addressEn || tProfile('fields.notProvided')}
                            </Text>
                          </View>
                          <View>
                            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                              {tProfile('fields.addressGu')} / સરનામું
                            </Text>
                            <Text variant="body" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium, lineHeight: 24, fontSize: 18 }}>
                              {profile?.addressGu || tProfile('fields.notProvided')}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                          <View style={{ flex: 1 }}>
                            <ProfileDetailRow label={tProfile('fields.city')} value={profile?.city || tProfile('fields.notProvided')} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <ProfileDetailRow label={tProfile('fields.pincode')} value={profile?.pincode || tProfile('fields.notProvided')} />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <View style={{ marginBottom: spacing[2] }}>
                  <Text variant="h3" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                    {tProfile('sections.management')}
                  </Text>
                </View>
                <ProfileActionCard
                  icon="edit"
                  iconBackground={colors.primary.subtle ?? 'rgba(24, 168, 117, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title="Edit Profile"
                  subtitle="Update your profile details and photo"
                  onPress={() => router.push({ pathname: '/profile/change-details', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="groups"
                  iconBackground={colors.primary.subtle ?? 'rgba(24, 168, 117, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={tProfile('actions.manageFamily')}
                  subtitle={tProfile('actions.manageFamilySubtitle')}
                  onPress={() => router.push({ pathname: '/profile/family-management', params: { returnTo: profileReturnTo } } as never)}
                />
                <ProfileActionCard
                  icon="folder-shared"
                  iconBackground={colors.primary.subtle ?? 'rgba(24, 168, 117, 0.1)'}
                  iconColor={colors.primary.DEFAULT}
                  title={tProfile('actions.manageDocs')}
                  subtitle={tProfile('actions.manageDocsSubtitle')}
                  onPress={() => router.push({ pathname: '/profile/documents', params: { returnTo: profileReturnTo } } as never)}
                />
                <NotificationPreferenceCard returnTo={profileReturnTo} />
                {securityConfig.authSecurityEnabled ? (
                  <ProfileActionCard
                    icon="security"
                    iconBackground={colors.primary.subtle ?? 'rgba(24, 168, 117, 0.1)'}
                    iconColor={colors.primary.DEFAULT}
                    title={tProfile('actions.security')}
                    subtitle={tProfile('actions.securitySubtitle')}
                    onPress={() => router.push({ pathname: '/profile/security', params: { returnTo: profileReturnTo } } as never)}
                  />
                ) : null}
              </View>

              <View style={{ paddingVertical: spacing[3], alignItems: 'center', gap: spacing[4] }}>
                <Button
                  fullWidth
                  loading={isSubmitting}
                  loadingLabel={t('signOut')}
                  leftIcon={<MaterialIcons name="logout" size={18} color={colors.text.inverse} />}
                  onPress={() => void signOut()}>
                  {t('signOut')}
                </Button>
              </View>
            </>
          )}
      </ScrollView>
    </AppSafeAreaView>
  );
}
