import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  AppBottomBar,
  Button,
  DateField,
  Dialog,
  type DialogVariant,
  FormScreenLayout,
  PhotoUploadStrip,
  SelectField,
  Text,
  TextField,
} from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { getMemberBottomBarRoute, memberBottomBarItems } from '@/src/core/navigation/member-shell';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { FileValue, SelectOption } from '@/src/types';

import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyProfileRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';
import { MatrimonyProfileFormSkeleton } from './matrimony-loading-states';
import { MatrimonyModuleTabs, type MatrimonyModuleTabKey } from './matrimony-module-tabs';
import { MatrimonySharedHeader } from './matrimony-shared-header';

function getStatusTone(status?: MatrimonyProfileRecord['status']) {
  switch (status) {
    case 'APPROVED':
    case 'ACTIVE':
      return {
        backgroundColor: 'rgba(0,80,75,0.1)',
        color: colors.status.success,
        icon: 'verified' as const,
      };
    case 'REJECTED':
      return {
        backgroundColor: colors.status.errorLight,
        color: colors.status.error,
        icon: 'cancel' as const,
      };
    case 'PENDING_APPROVAL':
      return {
        backgroundColor: colors.primary.muted,
        color: colors.primary.DEFAULT,
        icon: 'schedule' as const,
      };
    default:
      return {
        backgroundColor: '#eef2f7',
        color: colors.text.muted,
        icon: 'edit' as const,
      };
  }
}

function mapPhotoUrlsToFiles(photoUrls: string[]) {
  return photoUrls.map((uri, index) => ({
    uri,
    name: `photo-${index + 1}.jpg`,
  })) as FileValue[];
}

function cleanProfileText(value?: string | null) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'undefined' || trimmed.toLowerCase() === 'null') {
    return '';
  }
  return trimmed;
}

function getProfileDisplayName(profile: MatrimonyProfileRecord) {
  return [cleanProfileText(profile.firstName), cleanProfileText(profile.lastName)].filter(Boolean).join(' ') || 'Matrimony Profile';
}

function formatProfileDate(value?: string | null) {
  if (!value) return 'Not provided';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not provided';
  return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getProfileDetailRows(profile: MatrimonyProfileRecord) {
  return [
    { label: 'Date of Birth', value: formatProfileDate(profile.dob) },
    { label: 'Height', value: profile.height || 'Not provided' },
    { label: 'Education', value: profile.education || 'Not provided' },
    { label: 'Occupation', value: profile.occupation || 'Not provided' },
    { label: 'Location', value: [profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Not provided' },
  ];
}

function shouldShowProfileDetails(profile: MatrimonyProfileRecord | null, editMode: boolean) {
  if (!profile || editMode) {
    return false;
  }
  return profile.status !== 'DRAFT';
}

function shouldOpenEditor(profile: MatrimonyProfileRecord | null) {
  return !profile || profile.status === 'DRAFT';
}

const DOB_MIN_DATE = new Date(1900, 0, 1);

function getProfileStatusDescription(profile: MatrimonyProfileRecord | null, t: ReturnType<typeof useTranslations>) {
  if (!profile) {
    return t('status.draftMessage');
  }

  if (profile.status === 'REJECTED') {
    return t('status.rejectedMessage');
  }

  if (profile.status === 'PENDING_APPROVAL') {
    return 'Your matrimony profile is under admin approval. It will become available in discovery after approval.';
  }

  if (profile.hasPendingReview) {
    return 'Your update request is under review. Your current approved profile remains active in discovery until the review is completed.';
  }

  if (profile.status === 'APPROVED' || profile.status === 'ACTIVE') {
    return 'Your matrimony profile is approved and active for discovery.';
  }

  return 'Your matrimony profile is approved and active for discovery.';
}

export function CreateMatrimonyProfileContent({
  embeddedInMemberTab = false,
  onTabPress,
}: {
  embeddedInMemberTab?: boolean;
  onTabPress?: (key: MatrimonyModuleTabKey) => boolean | void;
} = {}) {
  const { language } = useAppPreferences();
  const cachedProfile = matrimonyScreenCache.myProfile;
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const { safeNavigateRoot } = useSafeNavigation();
  const t = useTranslations('matrimony.create-profile');
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
    navigateTo?: string;
    confirmLabel?: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(!matrimonyScreenCache.profileLoaded);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<MatrimonyProfileRecord | null>(cachedProfile);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(matrimonyScreenCache.access);
  const [editMode, setEditMode] = useState(() => shouldOpenEditor(cachedProfile));
  const [photoError, setPhotoError] = useState<string | null>(null);
  const profileBlockedBySubscription = access?.canCreateProfile === false;

  const [photos, setPhotos] = useState<FileValue[]>(() => mapPhotoUrlsToFiles(cachedProfile?.photoUrls || []));
  const [firstName, setFirstName] = useState(() => cleanProfileText(cachedProfile?.firstName));
  const [lastName, setLastName] = useState(() => cleanProfileText(cachedProfile?.lastName));
  const [dob, setDob] = useState<Date | undefined>(() => (cachedProfile?.dob ? new Date(cachedProfile.dob) : undefined));
  const [height, setHeight] = useState<string | undefined>(() => cachedProfile?.height || undefined);
  const [gender, setGender] = useState<string | undefined>(() => cachedProfile?.gender || undefined);
  const [maritalStatus, setMaritalStatus] = useState<string | undefined>(() => cachedProfile?.maritalStatus || undefined);
  const [education, setEducation] = useState<string | undefined>(() => cachedProfile?.education || undefined);
  const [occupation, setOccupation] = useState(() => cachedProfile?.occupation || '');
  const [income, setIncome] = useState(() => cachedProfile?.income || '');
  const [bio, setBio] = useState(() => cachedProfile?.aboutMe || cachedProfile?.remarks || '');
  const [familyType, setFamilyType] = useState<string | undefined>(() => cachedProfile?.familyType || undefined);
  const [familyBackground, setFamilyBackground] = useState(() => cachedProfile?.familyBackground || '');
  const [caste, setCaste] = useState(() => cachedProfile?.caste || '');
  const [community, setCommunity] = useState(() => cachedProfile?.community || '');
  const [city, setCity] = useState(() => cachedProfile?.city || '');
  const [stateName, setStateName] = useState(() => cachedProfile?.state || '');
  const [country, setCountry] = useState(() => cachedProfile?.country || 'India');
  const [preferredAgeMin, setPreferredAgeMin] = useState(() => (cachedProfile?.preferredAgeMin ? String(cachedProfile.preferredAgeMin) : ''));
  const [preferredAgeMax, setPreferredAgeMax] = useState(() => (cachedProfile?.preferredAgeMax ? String(cachedProfile.preferredAgeMax) : ''));
  const [preferredLocation, setPreferredLocation] = useState(() => cachedProfile?.preferredLocation || '');
  const [preferences, setPreferences] = useState(() => cachedProfile?.preferences || '');
  const {
    countryOptions,
    isLoadingCountries,
    stateOptions,
    cityOptions,
    isLoadingStates,
    isLoadingCities,
    selectCountry,
  } = useCountryStateCityOptions({
    countryName: country || 'India',
    stateName: stateName || '',
  });

  const heightOptions: SelectOption[] = useMemo(
    () => [
      { value: '5-0', label: `5' 0"` },
      { value: '5-2', label: `5' 2"` },
      { value: '5-4', label: `5' 4"` },
      { value: '5-6', label: `5' 6"` },
      { value: '5-8', label: `5' 8"` },
      { value: '6-0', label: `6' 0"` },
    ],
    [],
  );

  const educationOptions: SelectOption[] = useMemo(
    () => [
      { value: 'hs', label: t('options.education.hs') },
      { value: 'diploma', label: t('options.education.diploma') },
      { value: 'bachelors', label: t('options.education.bachelors') },
      { value: 'masters', label: t('options.education.masters') },
      { value: 'phd', label: t('options.education.phd') },
    ],
    [t],
  );
  const genderOptions: SelectOption[] = useMemo(
    () => [
      { value: 'Female', label: t('options.gender.female') },
      { value: 'Male', label: t('options.gender.male') },
      { value: 'Other', label: t('options.gender.other') },
    ],
    [t],
  );
  const maritalStatusOptions: SelectOption[] = useMemo(
    () => [
      { value: 'Never Married', label: t('options.maritalStatus.neverMarried') },
      { value: 'Divorced', label: t('options.maritalStatus.divorced') },
      { value: 'Widowed', label: t('options.maritalStatus.widowed') },
      { value: 'Separated', label: t('options.maritalStatus.separated') },
    ],
    [t],
  );
  const familyTypeOptions: SelectOption[] = useMemo(
    () => [
      { value: 'Joint', label: t('options.familyType.joint') },
      { value: 'Nuclear', label: t('options.familyType.nuclear') },
    ],
    [t],
  );
  const ageOptions: SelectOption[] = useMemo(
    () =>
      Array.from({ length: 33 }, (_, index) => {
        const age = String(index + 18);
        return { value: age, label: age };
      }),
    [],
  );
  const maxAgeOptions: SelectOption[] = useMemo(() => {
    const minAge = Number(preferredAgeMin);
    if (!Number.isFinite(minAge) || minAge <= 0) {
      return ageOptions;
    }

    return ageOptions.filter((option) => Number(option.value) >= minAge);
  }, [ageOptions, preferredAgeMin]);

  useEffect(() => {
    if (!preferredAgeMin || !preferredAgeMax) {
      return;
    }

    if (Number(preferredAgeMax) < Number(preferredAgeMin)) {
      setPreferredAgeMax(preferredAgeMin);
    }
  }, [preferredAgeMax, preferredAgeMin]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void (async () => {
        if (!matrimonyScreenCache.profileLoaded) {
          setLoadingProfile(true);
        }
        try {
          const [accessResult, result] = await Promise.all([
            matrimonyFeedService.loadAccess().catch(() => null),
            matrimonyFeedService.loadMyProfile(),
          ]);
          if (!active) {
            return;
          }

          matrimonyScreenCache.access = accessResult;
          matrimonyScreenCache.myProfile = result;
          matrimonyScreenCache.profileLoaded = true;
          setAccess(accessResult);
          setProfile(result);
          setEditMode(shouldOpenEditor(result));
          if (result) {
            setFirstName(cleanProfileText(result.firstName));
            setLastName(cleanProfileText(result.lastName));
            setDob(result.dob ? new Date(result.dob) : undefined);
            setHeight(result.height || undefined);
            setGender(result.gender || undefined);
            setMaritalStatus(result.maritalStatus || undefined);
            setEducation(result.education || undefined);
            setOccupation(result.occupation || '');
            setIncome(result.income || '');
            setBio(result.aboutMe || result.remarks || '');
            setFamilyType(result.familyType || undefined);
            setFamilyBackground(result.familyBackground || '');
            setCaste(result.caste || '');
            setCommunity(result.community || '');
            setCity(result.city || '');
            setStateName(result.state || '');
            setCountry('India');
            setPreferredAgeMin(result.preferredAgeMin ? String(result.preferredAgeMin) : '');
            setPreferredAgeMax(result.preferredAgeMax ? String(result.preferredAgeMax) : '');
            setPreferredLocation(result.preferredLocation || '');
            setPreferences(result.preferences || '');
            setPhotos(mapPhotoUrlsToFiles(result.photoUrls || []));
          }
        } finally {
          if (active) {
            matrimonyScreenCache.profileLoaded = true;
            setLoadingProfile(false);
          }
        }
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  function openCreateSubscriptionRequiredDialog() {
    const isViewerOnly = access?.subscription?.type === 'VIEWER_ONLY';
    setDialog({
      visible: true,
      variant: 'confirm',
      title: 'Matrimony subscription required',
      description: isViewerOnly
        ? 'Your Viewer Only subscription allows profile browsing only. A Profile Creation subscription is required to create or resubmit a matrimony profile.'
        : access?.reason || 'A Profile Creation subscription is required to create or resubmit a matrimony profile.',
      navigateTo: '/matrimony/subscribe?type=PROFILE_CREATION&returnTo=%2Fmember%2Fmatrimony%3Ftab%3Dprofile',
      confirmLabel: 'Purchase now',
    });
  }

  function handlePhotosChange(nextPhotos: FileValue[]) {
    setPhotos(nextPhotos);
    if (nextPhotos.some((photo) => Boolean(photo?.uri))) {
      setPhotoError(null);
    }
  }

  async function handleSave() {
    if (access && access.canCreateProfile === false) {
      openCreateSubscriptionRequiredDialog();
      return;
    }

    if (!photos.some((photo) => Boolean(photo?.uri))) {
      setPhotoError('Profile photo is required.');
      setDialog({
        visible: true,
        variant: 'warning',
        title: 'Profile photo required',
        description: 'Please upload at least one profile photo before submitting your matrimony profile.',
      });
      return;
    }

    if (!firstName.trim()) {
      setDialog({
        visible: true,
        variant: 'warning',
        title: 'Missing information',
        description: 'Please enter at least a first name.',
      });
      return;
    }

    if (dob && dob.getTime() > Date.now()) {
      setDialog({
        visible: true,
        variant: 'warning',
        title: 'Invalid date of birth',
        description: 'Date of birth cannot be in the future.',
      });
      return;
    }

    if (saving) {
      return;
    }

    if (profile?.hasPendingReview) {
      setDialog({
        visible: true,
        variant: 'warning',
        title: 'Update already under review',
        description: 'Your previous matrimony profile update request is still pending. Please wait for admin review before submitting again.',
      });
      return;
    }

    setSaving(true);
    try {
      const result = await matrimonyFeedService.saveMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        dob: dob ?? undefined,
        height: height || undefined,
        gender: gender || undefined,
        maritalStatus: maritalStatus || undefined,
        education: education || undefined,
        occupation: occupation.trim() || undefined,
        income: income.trim() || undefined,
        aboutMe: bio.trim() || undefined,
        familyType: familyType || undefined,
        familyBackground: familyBackground.trim() || undefined,
        caste: caste.trim() || undefined,
        community: community.trim() || undefined,
        city: city.trim() || undefined,
        state: stateName.trim() || undefined,
        country: country.trim() || undefined,
        preferredAgeMin: preferredAgeMin.trim() ? Number(preferredAgeMin) : undefined,
        preferredAgeMax: preferredAgeMax.trim() ? Number(preferredAgeMax) : undefined,
        preferredLocation: preferredLocation.trim() || undefined,
        preferences: preferences.trim() || undefined,
        photos,
      });

      const redirectTo = profile ? '/member/matrimony?tab=discovery' : '/member';

      setProfile(result);
      matrimonyScreenCache.myProfile = result;
      matrimonyScreenCache.profileLoaded = true;
      setFirstName(cleanProfileText(result.firstName));
      setLastName(cleanProfileText(result.lastName));
      setDob(result.dob ? new Date(result.dob) : undefined);
      setHeight(result.height || undefined);
      setGender(result.gender || undefined);
      setMaritalStatus(result.maritalStatus || undefined);
      setEducation(result.education || undefined);
      setOccupation(result.occupation || '');
      setIncome(result.income || '');
      setBio(result.aboutMe || '');
      setFamilyType(result.familyType || undefined);
      setFamilyBackground(result.familyBackground || '');
      setCaste(result.caste || '');
      setCommunity(result.community || '');
      setCity(result.city || '');
      setStateName(result.state || '');
      setCountry('India');
      setPreferredAgeMin(result.preferredAgeMin ? String(result.preferredAgeMin) : '');
      setPreferredAgeMax(result.preferredAgeMax ? String(result.preferredAgeMax) : '');
      setPreferredLocation(result.preferredLocation || '');
      setPreferences(result.preferences || '');
      setPhotos(mapPhotoUrlsToFiles(result.photoUrls || []));
      setEditMode(shouldOpenEditor(result));
      setDialog({
        visible: true,
        variant: 'success',
        title: result.status === 'PENDING_APPROVAL' ? 'Profile submitted for review' : 'Profile update requested',
        description:
          result.status === 'PENDING_APPROVAL'
            ? 'Your matrimony profile is now pending admin approval.'
            : 'Your matrimony profile update has been submitted.',
        navigateTo: redirectTo,
        confirmLabel: profile ? 'Go to Discovery' : 'Go to Home',
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unable to save matrimony profile.',
      });
    } finally {
      setSaving(false);
    }
  }

  const statusTone = getStatusTone(profile?.status);
  const showProfileDetails = shouldShowProfileDetails(profile, editMode);
  const footer = embeddedInMemberTab ? undefined : (
    <AppBottomBar
      activeKey="matrimony"
      items={memberBottomBarItems}
      onChange={(key) => safeNavigateRoot(getMemberBottomBarRoute(key))}
    />
  );

  const handleSuccessNavigation = useCallback((targetRoute?: string) => {
    if (!targetRoute) {
      return;
    }

    if (targetRoute === '/member/matrimony?tab=discovery') {
      const handled = onTabPress?.('discovery');
      if (handled === true || embeddedInMemberTab) {
        return;
      }
    }

    safeNavigateRoot(targetRoute);
  }, [embeddedInMemberTab, onTabPress, safeNavigateRoot]);

  return (
    <>
      <FormScreenLayout
        header={
        <MatrimonySharedHeader onProfilePress={() => onTabPress?.('profile')} />
      }
      footer={footer}>
      {loadingProfile ? (
        <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[5] }}>
          <View style={{ marginHorizontal: -spacing[4], marginTop: -spacing[4] }}>
            <MatrimonyModuleTabs activeKey="profile" onTabPress={onTabPress} />
          </View>
          <MatrimonyProfileFormSkeleton />
        </View>
      ) : (
        <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[5] }}>
          <View style={{ marginHorizontal: -spacing[4], marginTop: -spacing[4] }}>
            <MatrimonyModuleTabs activeKey="profile" onTabPress={onTabPress} />
          </View>

          {profileBlockedBySubscription ? (
            <View
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                padding: spacing[4],
                gap: spacing[3],
              }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                Matrimony subscription required
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
                {access?.reason || 'A Profile Creation subscription is required to create or update a matrimony profile.'}
              </Text>
              <Button
                fullWidth
                rounded
                onPress={() =>
                  router.push({
                    pathname: '/matrimony/subscribe',
                    params: { type: 'PROFILE_CREATION', returnTo: '/member/matrimony?tab=profile' },
                  } as never)
                }>
                Purchase subscription
              </Button>
            </View>
          ) : null}

          {profile ? (
            <View
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                padding: spacing[4],
                gap: spacing[3],
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 1,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: typography.fontFamily.bold }}>
                  {t('status.label')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[2],
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[1],
                    borderRadius: radius.full,
                    backgroundColor: statusTone.backgroundColor,
                  }}>
                  <MaterialIcons name={statusTone.icon} size={16} color={statusTone.color} />
                  <Text variant="caption" style={{ color: statusTone.color, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase' }}>
                    {profile.status}
                  </Text>
                </View>
              </View>
              <Text variant="body" style={{ color: colors.text.muted, lineHeight: 22 }}>
                {getProfileStatusDescription(profile, t)}
              </Text>
              {profile.hasPendingReview && profile.reviewChangeSummary?.length ? (
                <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: spacing[3] }}>
                  <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.1, fontFamily: typography.fontFamily.bold }}>
                    Pending Update
                  </Text>
                  <Text variant="body" style={{ color: colors.text.primary, marginTop: spacing[1], lineHeight: 22 }}>
                    Changed: {profile.reviewChangeSummary.join(', ')}
                  </Text>
                </View>
              ) : null}
              {profile.remarks ? (
                <View style={{ borderTopWidth: 1, borderTopColor: colors.border.light, paddingTop: spacing[3] }}>
                  <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.1, fontFamily: typography.fontFamily.bold }}>
                    {t('status.remarks')}
                  </Text>
                  <Text variant="body" style={{ color: colors.text.primary, marginTop: spacing[1], lineHeight: 22 }}>
                    {profile.remarks}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
          {!profileBlockedBySubscription && showProfileDetails && profile ? (
            <View
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: colors.border.DEFAULT,
                padding: spacing[4],
                gap: spacing[4],
              }}>
              <View style={{ gap: spacing[1] }}>
                {(profile.photoUrls.length || profile.profilePhotoUrl) ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], marginBottom: spacing[2] }}>
                    {(profile.photoUrls.length ? profile.photoUrls : [profile.profilePhotoUrl || '']).filter(Boolean).map((uri, index) => (
                      <View key={`${uri}-${index}`} style={{ width: 220, aspectRatio: 4 / 3, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.background.muted }}>
                        <Image
                          source={{ uri }}
                          resizeMode="cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </View>
                    ))}
                  </ScrollView>
                ) : null}
                <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {getProfileDisplayName(profile)}
                </Text>
                <Text variant="body" style={{ color: colors.text.secondary }}>
                  {profile.aboutMe || 'Your matrimony profile details are visible after approval.'}
                </Text>
              </View>

              <View style={{ gap: spacing[3] }}>
                {getProfileDetailRows(profile).map((row) => (
                  <View key={row.label} style={{ borderTopWidth: 1, borderTopColor: colors.border.muted, paddingTop: spacing[3] }}>
                    <Text variant="caption" style={{ color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1.1, fontFamily: typography.fontFamily.bold }}>
                      {row.label}
                    </Text>
                    <Text variant="body" style={{ color: colors.text.primary, marginTop: spacing[1], fontFamily: typography.fontFamily.medium }}>
                      {row.label === 'Location' ? translateLocationText(row.value, language) || row.value : row.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          {!profileBlockedBySubscription && (profile?.status === 'APPROVED' || profile?.status === 'ACTIVE') ? (
            <View style={{ gap: spacing[3] }}>
              <Button
                fullWidth
                rounded
                variant="outline"
                disabled={profile.hasPendingReview}
                onPress={() => setEditMode((current) => !current)}
                leftIcon={<MaterialIcons name={editMode ? 'close' : 'edit'} size={18} color={colors.primary.DEFAULT} />}>
                {profile.hasPendingReview ? 'Update Under Review' : editMode ? 'Cancel Update Request' : 'Request Profile Update'}
              </Button>
              <Button
                fullWidth
                rounded
                variant="primary"
                onPress={() => {
                  const handled = onTabPress?.('discovery');
                  if (handled === true) {
                    return;
                  }
                  router.push('/member/matrimony' as never);
                }}
                leftIcon={<MaterialIcons name="explore" size={18} color={colors.text.inverse} />}>
                {t('actions.browse')}
              </Button>
            </View>
          ) : null}

          {profileBlockedBySubscription ? null : (profile?.status === 'APPROVED' || profile?.status === 'ACTIVE') ? editMode ? (
            <>
              <View style={{ gap: spacing[3] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.photos')}
                </Text>
                <PhotoUploadStrip label={t('section.photos')} value={photos} onChange={handlePhotosChange} />
                {photoError ? (
                  <Text variant="caption" color={colors.status.error} style={{ marginTop: -spacing[3] }}>
                    {photoError}
                  </Text>
                ) : null}
                <Text variant="caption" style={{ color: colors.text.muted, lineHeight: 18 }}>
                  {t('section.photosWatermarkHelp')}
                </Text>
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.personal')}
                </Text>
                <TextField
                  label={t('field.firstName')}
                  labelVariant="default"
                  variant="registration"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={t('placeholders.firstName')}
                />
                <TextField
                  label={t('field.lastName')}
                  labelVariant="default"
                  variant="registration"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={t('placeholders.lastName')}
                />
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <DateField label={t('field.dob')} labelVariant="default" variant="registration" value={dob} onChange={setDob} minimumDate={DOB_MIN_DATE} maximumDate={new Date()} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.height')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.height')}
                      options={heightOptions}
                      value={height}
                      onSelect={setHeight}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.gender')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.gender')}
                      options={genderOptions}
                      value={gender}
                      onSelect={setGender}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.maritalStatus')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.maritalStatus')}
                      options={maritalStatusOptions}
                      value={maritalStatus}
                      onSelect={setMaritalStatus}
                    />
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <SelectField
                  label={t('field.education')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={t('placeholders.education')}
                  options={educationOptions}
                  value={education}
                  onSelect={setEducation}
                />
                <TextField
                  label={t('field.occupation')}
                  labelVariant="default"
                  variant="registration"
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder={t('placeholders.occupation')}
                />
                <TextField
                  label={t('field.income')}
                  labelVariant="default"
                  variant="registration"
                  value={income}
                  onChangeText={setIncome}
                  placeholder={t('placeholders.income')}
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.bio')}
                </Text>
                <TextField
                  label={t('field.bio')}
                  labelVariant="default"
                  variant="registration"
                  value={bio}
                  onChangeText={setBio}
                  placeholder={t('placeholders.bio')}
                  multiline
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.familyDetails')}
                </Text>
                <SelectField
                  label={t('field.familyType')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={t('placeholders.familyType')}
                  options={familyTypeOptions}
                  value={familyType}
                  onSelect={setFamilyType}
                />
                <TextField
                  label={t('field.familyBackground')}
                  labelVariant="default"
                  variant="registration"
                  value={familyBackground}
                  onChangeText={setFamilyBackground}
                  placeholder={t('placeholders.familyBackground')}
                  multiline
                />
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <TextField label={t('field.caste')} labelVariant="default" variant="registration" value={caste} onChangeText={setCaste} placeholder={t('placeholders.caste')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label={t('field.community')} labelVariant="default" variant="registration" value={community} onChangeText={setCommunity} placeholder={t('placeholders.community')} />
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.location')}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.country')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={isLoadingCountries ? t('placeholders.loadingCountries') : t('placeholders.country')}
                      value={country}
                      onSelect={(value) => {
                        setCountry(value);
                        selectCountry(value);
                        setStateName('');
                        setCity('');
                      }}
                      options={countryOptions}
                      disabled={isLoadingCountries}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.state')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={country ? (isLoadingStates ? t('placeholders.loadingStates') : t('placeholders.stateSelect')) : t('placeholders.countryFirst')}
                      value={stateName}
                      onSelect={(value) => {
                        setStateName(value);
                        if (value !== stateName) {
                          setCity('');
                        }
                      }}
                      options={country ? stateOptions : []}
                      disabled={!country || isLoadingStates}
                    />
                  </View>
                </View>
                <SelectField
                  label={t('field.city')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={stateName ? (isLoadingCities ? t('placeholders.loadingCities') : t('placeholders.citySelect')) : t('placeholders.stateFirst')}
                  value={city}
                  onSelect={setCity}
                  options={stateName ? cityOptions : []}
                  disabled={!stateName || isLoadingCities}
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.preferences')}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.preferredAgeMin')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.preferredAgeMin')}
                      value={preferredAgeMin}
                      onSelect={setPreferredAgeMin}
                      options={ageOptions}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.preferredAgeMax')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.preferredAgeMax')}
                      value={preferredAgeMax}
                      onSelect={setPreferredAgeMax}
                      options={maxAgeOptions}
                    />
                  </View>
                </View>
                <TextField
                  label={t('field.preferredLocation')}
                  labelVariant="default"
                  variant="registration"
                  value={preferredLocation}
                  onChangeText={setPreferredLocation}
                  placeholder={t('placeholders.preferredLocation')}
                />
                <TextField
                  label={t('field.preferences')}
                  labelVariant="default"
                  variant="registration"
                  value={preferences}
                  onChangeText={setPreferences}
                  placeholder={t('placeholders.preferences')}
                  multiline
                />
              </View>

              <Button
                fullWidth
                rounded
                disabled={loadingProfile || saving || Boolean(profile?.hasPendingReview)}
                onPress={handleSave}
                loading={saving}
                rightIcon={<MaterialIcons name="chevron-right" size={18} color={colors.text.inverse} />}>
                Submit Update Request
              </Button>
            </>
          ) : null : (
            <>
              <View style={{ gap: spacing[3] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.photos')}
                </Text>
                <PhotoUploadStrip label={t('section.photos')} value={photos} onChange={handlePhotosChange} />
                {photoError ? (
                  <Text variant="caption" color={colors.status.error} style={{ marginTop: -spacing[3] }}>
                    {photoError}
                  </Text>
                ) : null}
                <Text variant="caption" style={{ color: colors.text.muted, lineHeight: 18 }}>
                  {t('section.photosWatermarkHelp')}
                </Text>
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.personal')}
                </Text>
                <TextField
                  label={t('field.firstName')}
                  labelVariant="default"
                  variant="registration"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={t('placeholders.firstName')}
                />
                <TextField
                  label={t('field.lastName')}
                  labelVariant="default"
                  variant="registration"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={t('placeholders.lastName')}
                />
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <DateField label={t('field.dob')} labelVariant="default" variant="registration" value={dob} onChange={setDob} minimumDate={DOB_MIN_DATE} maximumDate={new Date()} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.height')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.height')}
                      options={heightOptions}
                      value={height}
                      onSelect={setHeight}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.gender')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.gender')}
                      options={genderOptions}
                      value={gender}
                      onSelect={setGender}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.maritalStatus')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.maritalStatus')}
                      options={maritalStatusOptions}
                      value={maritalStatus}
                      onSelect={setMaritalStatus}
                    />
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <SelectField
                  label={t('field.education')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={t('placeholders.education')}
                  options={educationOptions}
                  value={education}
                  onSelect={setEducation}
                />
                <TextField
                  label={t('field.occupation')}
                  labelVariant="default"
                  variant="registration"
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder={t('placeholders.occupation')}
                />
                <TextField
                  label={t('field.income')}
                  labelVariant="default"
                  variant="registration"
                  value={income}
                  onChangeText={setIncome}
                  placeholder={t('placeholders.income')}
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.bio')}
                </Text>
                <TextField
                  label={t('field.bio')}
                  labelVariant="default"
                  variant="registration"
                  value={bio}
                  onChangeText={setBio}
                  placeholder={t('placeholders.bio')}
                  multiline
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.familyDetails')}
                </Text>
                <SelectField
                  label={t('field.familyType')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={t('placeholders.familyType')}
                  options={familyTypeOptions}
                  value={familyType}
                  onSelect={setFamilyType}
                />
                <TextField
                  label={t('field.familyBackground')}
                  labelVariant="default"
                  variant="registration"
                  value={familyBackground}
                  onChangeText={setFamilyBackground}
                  placeholder={t('placeholders.familyBackground')}
                  multiline
                />
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <TextField label={t('field.caste')} labelVariant="default" variant="registration" value={caste} onChangeText={setCaste} placeholder={t('placeholders.caste')} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label={t('field.community')} labelVariant="default" variant="registration" value={community} onChangeText={setCommunity} placeholder={t('placeholders.community')} />
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.location')}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.country')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={isLoadingCountries ? t('placeholders.loadingCountries') : t('placeholders.country')}
                      value={country}
                      onSelect={(value) => {
                        setCountry(value);
                        selectCountry(value);
                        setStateName('');
                        setCity('');
                      }}
                      options={countryOptions}
                      disabled={isLoadingCountries}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.state')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={country ? (isLoadingStates ? t('placeholders.loadingStates') : t('placeholders.stateSelect')) : t('placeholders.countryFirst')}
                      value={stateName}
                      onSelect={(value) => {
                        setStateName(value);
                        if (value !== stateName) {
                          setCity('');
                        }
                      }}
                      options={country ? stateOptions : []}
                      disabled={!country || isLoadingStates}
                    />
                  </View>
                </View>
                <SelectField
                  label={t('field.city')}
                  labelVariant="default"
                  variant="registration"
                  placeholder={stateName ? (isLoadingCities ? t('placeholders.loadingCities') : t('placeholders.citySelect')) : t('placeholders.stateFirst')}
                  value={city}
                  onSelect={setCity}
                  options={stateName ? cityOptions : []}
                  disabled={!stateName || isLoadingCities}
                />
              </View>

              <View style={{ gap: spacing[4] }}>
                <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                  {t('section.preferences')}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.preferredAgeMin')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.preferredAgeMin')}
                      value={preferredAgeMin}
                      onSelect={setPreferredAgeMin}
                      options={ageOptions}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('field.preferredAgeMax')}
                      labelVariant="default"
                      variant="registration"
                      placeholder={t('placeholders.preferredAgeMax')}
                      value={preferredAgeMax}
                      onSelect={setPreferredAgeMax}
                      options={maxAgeOptions}
                    />
                  </View>
                </View>
                <TextField
                  label={t('field.preferredLocation')}
                  labelVariant="default"
                  variant="registration"
                  value={preferredLocation}
                  onChangeText={setPreferredLocation}
                  placeholder={t('placeholders.preferredLocation')}
                />
                <TextField
                  label={t('field.preferences')}
                  labelVariant="default"
                  variant="registration"
                  value={preferences}
                  onChangeText={setPreferences}
                  placeholder={t('placeholders.preferences')}
                  multiline
                />
              </View>

              <Button
                fullWidth
                rounded
                disabled={loadingProfile || saving}
                onPress={handleSave}
                loading={saving}
                rightIcon={<MaterialIcons name="chevron-right" size={18} color={colors.text.inverse} />}>
                {profile?.status === 'REJECTED'
                  ? t('actions.resubmit')
                  : profile?.status === 'PENDING_APPROVAL'
                    ? 'Update Pending Profile'
                    : t('actions.save')}
              </Button>
            </>
          )}
        </View>
      )}
      </FormScreenLayout>
      <Dialog
        visible={dialog.visible}
        variant={dialog.variant}
        title={dialog.title}
        description={dialog.description}
        confirmLabel={dialog.confirmLabel}
        onConfirm={() => {
          const navigateTo = dialog.navigateTo;
          setDialog((current) => ({ ...current, visible: false, navigateTo: undefined, confirmLabel: undefined }));
          handleSuccessNavigation(navigateTo);
        }}
        onCancel={() => {
          const navigateTo = dialog.navigateTo;
          const shouldNavigate = dialog.variant === 'success' && Boolean(navigateTo);
          setDialog((current) => ({ ...current, visible: false, navigateTo: undefined, confirmLabel: undefined }));
          if (shouldNavigate) {
            handleSuccessNavigation(navigateTo);
          }
        }}
      />
    </>
  );
}
