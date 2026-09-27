import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, AppSkeletonBlock, InfiniteScrollList, SearchInput, SelectField, Text, TextField, Button, Dialog, PhoneInput } from '@/src/components';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { isSuperAdminSession } from '@/src/core/navigation/admin-shell';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useDebounce } from '@/src/hooks';
import { useTranslations } from '@/src/i18n/use-translations';
import { pickDocumentWithGuard } from '@/src/services/device/document-picker-consent';
import { createAndDeliverTextFile } from '@/src/services/files/report-file';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { countryCallingCodeOptions } from '@/src/constants/country-calling-codes';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { Permission } from '@/src/types/app';
import { adminUserService, type AdminNormalUserItem, type AdminUserImportResult, type AdminUserRegistrationSummary } from '../services/admin-user-service';
import { formSchemas } from '@/src/components/forms/validation';

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  state: string;
  pincode: string;
};
type UserListItem = AdminNormalUserItem | { id: string; __skeleton: true };
type UserFormErrors = Partial<Record<keyof UserFormState, string>>;

const USER_IMPORT_SAMPLE_CSV = [
  'name,phone,countryCode,email,city,state,pincode,bloodGroup',
  'Demo Invited User 1,9876543210,91,demo.user1@example.com,Vadodara,Gujarat,390001,B+',
  'Demo Invited User 2,9876543211,91,demo.user2@example.com,Ahmedabad,Gujarat,380001,O+',
  'Demo Invited User 3,9876543212,91,demo.user3@example.com,Surat,Gujarat,395003,A+',
].join('\n');

function splitAdminPhoneValue(value?: string, fallbackCountryCode = '91') {
  const raw = String(value || '').trim();
  const digits = raw.replace(/[^\d]/g, '');
  const fallback = fallbackCountryCode.replace(/[^\d]/g, '') || '91';

  if (!digits) {
    return { countryCode: fallback, phone: '' };
  }

  if (raw.startsWith('+')) {
    const matched = [...countryCallingCodeOptions]
      .sort((left, right) => right.value.length - left.value.length)
      .find((option) => raw.startsWith(option.value));

    if (matched) {
      const countryCode = matched.value.replace(/[^\d]/g, '') || fallback;
      return {
        countryCode,
        phone: digits.slice(countryCode.length),
      };
    }
  }

  return { countryCode: fallback, phone: digits };
}

function buildAdminPhoneInputValue(form: UserFormState) {
  const countryCode = form.countryCode.replace(/[^\d]/g, '') || '91';
  const phone = form.phone.replace(/[^\d]/g, '');
  return phone ? `+${countryCode}${phone}` : '';
}

function buildUserForm(user?: AdminNormalUserItem | null): UserFormState {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    countryCode: user?.countryCode || '91',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  };
}

function DetailLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: colors.text.muted, fontSize: 11, fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: typography.fontFamily.medium }}>
        {value || '-'}
      </Text>
    </View>
  );
}

function hasAnyPermission(permissions: readonly Permission[], required: readonly Permission[]) {
  return required.some((permission) => permissions.includes(permission));
}

function NormalUserRow({
  user,
  onOpen,
  t,
}: {
  user: AdminNormalUserItem;
  onOpen: () => void;
  t: (key: string) => string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      style={{
        borderRadius: 24,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.muted,
        padding: spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
      }}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: radius.full,
          backgroundColor: colors.primary.subtle,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        {user.profilePic ? (
          <Image source={{ uri: user.profilePic }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
          {user.name}
        </Text>
        <Text style={{ color: colors.text.muted, fontSize: 12 }}>
          {user.phone || user.email || t('details.noContactInfo')}
        </Text>
        <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
          {user.role || t('labels.user')} • {user.joinStatus === 'REGISTERED' ? 'Registered' : 'Invited'}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: spacing[2] }}>
        <View
          style={{
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
            borderRadius: 999,
            backgroundColor: colors.primary.muted,
          }}>
          <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.bold }}>
            {user.joinStatus === 'REGISTERED' ? 'Registered' : 'Invited'}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} />
      </View>
    </Pressable>
  );
}

function NormalUserRowSkeleton() {
  return <SkeletonListItem />;
}

function AdminUsersHeaderSkeleton() {
  return (
    <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
      <View style={{ gap: spacing[2] }}>
        <AppSkeletonBlock width="42%" height={22} radiusSize={radius.sm} />
        <AppSkeletonBlock width="74%" height={12} radiusSize={radius.sm} />
      </View>

      <View
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          backgroundColor: colors.background.surface,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          gap: spacing[2],
        }}>
        <AppSkeletonBlock width="24%" height={12} radiusSize={radius.sm} />
        <AppSkeletonBlock width="100%" height={18} radiusSize={radius.sm} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppSkeletonBlock width="30%" height={18} radiusSize={radius.sm} />
        <AppSkeletonBlock width={84} height={28} radiusSize={radius.full} />
      </View>
    </View>
  );
}

export function AdminUsersContent() {
  const t = useTranslations('admin.users');
  const { session } = useSession();
  const fabBottom = useBottomSafeSpacing(88);
  const [search, setSearch] = useState('');
  const [joinStatusFilter, setJoinStatusFilter] = useState<'all' | 'invited' | 'registered'>('all');
  const debouncedSearch = useDebounce(search, 300);
  const [items, setItems] = useState<AdminNormalUserItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshingSearch, setIsRefreshingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminNormalUserItem | null>(null);
  const [form, setForm] = useState<UserFormState>(buildUserForm(null));
  const [formErrors, setFormErrors] = useState<UserFormErrors>({});
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<{ uri: string; name?: string | null; mimeType?: string | null } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [registrationSummary, setRegistrationSummary] = useState<AdminUserRegistrationSummary | null>(null);
  const [importResult, setImportResult] = useState<AdminUserImportResult | null>(null);
  const [statusDialog, setStatusDialog] = useState<{
    visible: boolean;
    nextStatus: 'ACTIVE' | 'BLOCKED' | null;
    title: string;
    description: string;
    confirmLabel: string;
  }>({
    visible: false,
    nextStatus: null,
    title: '',
    description: '',
    confirmLabel: '',
  });
  const hasLoadedOnceRef = useRef(false);
  const latestSearchRequestRef = useRef(0);
  const allPermissions = useMemo(
    () => Array.from(new Set([...(session?.user.permissions ?? []), ...(session?.user.communityPermissions ?? [])])),
    [session],
  );
  const isAdminRole = ['admin', 'trustee'].includes(String(session?.user.role || '').toLowerCase());
  const canViewUserDetails =
    isSuperAdminSession(session) ||
    isAdminRole ||
    hasAnyPermission(allPermissions, ['directory.manage', 'user.manage', 'users.view', 'users.edit', 'users.delete', 'users.block']);
  const canEditUser =
    isSuperAdminSession(session) ||
    isAdminRole ||
    hasAnyPermission(allPermissions, ['directory.manage', 'user.manage', 'users.edit']);
  const canDeleteUser =
    isSuperAdminSession(session) ||
    isAdminRole ||
    hasAnyPermission(allPermissions, ['directory.manage', 'user.manage', 'users.delete', 'users.block']);
  const canBlockUser =
    isSuperAdminSession(session) ||
    isAdminRole ||
    hasAnyPermission(allPermissions, ['directory.manage', 'user.manage', 'users.block']);
  const { language } = useAppPreferences();
  const { stateOptions, cityOptions, selectState } = useCountryStateCityOptions({
    countryName: 'India',
    stateName: form.state || undefined,
  });

  const updateFormField = useCallback(<TKey extends keyof UserFormState>(field: TKey, value: UserFormState[TKey]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const updatePhoneField = useCallback((value: string) => {
    const parsed = splitAdminPhoneValue(value, form.countryCode);
    setForm((current) => ({
      ...current,
      phone: parsed.phone,
      countryCode: parsed.countryCode,
    }));
    setFormErrors((current) => {
      if (!current.phone && !current.countryCode) {
        return current;
      }
      const next = { ...current };
      delete next.phone;
      delete next.countryCode;
      return next;
    });
  }, [form.countryCode]);

  const validateUserForm = useCallback(async () => {
    const countryCode = form.countryCode.replace(/[^\d]/g, '');
    if (!countryCode) {
      setFormErrors((current) => ({ ...current, countryCode: 'Country code is required.', phone: 'Country code is required.' }));
      return false;
    }

    try {
      await formSchemas.directoryMember.validate(
        {
          fullName: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim() || null,
        },
        { abortEarly: false },
      );
      setFormErrors({});
      return true;
    } catch (error) {
      const nextErrors: UserFormErrors = {};
      const validationError = error as { inner?: { path?: string; message?: string }[]; path?: string; message?: string };
      const entries = validationError.inner?.length ? validationError.inner : [validationError];
      entries.forEach((entry) => {
        const fieldName = entry.path === 'fullName' ? 'name' : entry.path;
        if (fieldName && entry.message && ['name', 'phone', 'countryCode', 'email', 'city', 'state', 'pincode'].includes(fieldName)) {
          nextErrors[fieldName as keyof UserFormState] = entry.message;
        }
      });
      setFormErrors(nextErrors);
      return false;
    }
  }, [form]);

  const loadPage = useCallback(async (cursor?: string | null) => {
    const result = await adminUserService.loadNormalUsers({
      search: debouncedSearch.trim() || undefined,
      cursor: cursor || undefined,
      limit: 20,
      joinStatus: joinStatusFilter,
    });

    const filtered = result.items.filter((user) => {
      const role = String(user.role || '').toLowerCase();
      return role !== 'admin' && role !== 'superadmin' && role !== 'super_admin';
    });
    return {
      items: filtered,
      nextCursor: result.nextCursor,
    };
  }, [debouncedSearch, joinStatusFilter]);

  const loadRegistrationSummary = useCallback(async () => {
    try {
      const summary = await adminUserService.loadUserRegistrationSummary();
      setRegistrationSummary(summary);
    } catch {
      setRegistrationSummary(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const isFirstLoad = !hasLoadedOnceRef.current;
    const requestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = requestId;

    if (isFirstLoad) {
      setIsLoadingInitial(true);
    } else {
      setIsRefreshingSearch(true);
    }
    setError(null);

    loadPage()
      .then((result) => {
        if (!active || latestSearchRequestRef.current !== requestId) return;
        setItems(result.items);
        setNextCursor(result.nextCursor);
        hasLoadedOnceRef.current = true;
      })
      .catch((loadError) => {
        if (!active || latestSearchRequestRef.current !== requestId) return;
        if (isFirstLoad) {
          setItems([]);
          setNextCursor(null);
        }
        setError(loadError instanceof Error ? loadError.message : t('errors.unableToLoad'));
      })
      .finally(() => {
        if (!active || latestSearchRequestRef.current !== requestId) return;
        setIsLoadingInitial(false);
        setIsRefreshingSearch(false);
      });

    void loadRegistrationSummary();

    return () => {
      active = false;
    };
  }, [loadPage, loadRegistrationSummary, t]);

  const hasNextPage = Boolean(nextCursor);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !nextCursor) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const result = await loadPage(nextCursor);
      setItems((current) => [...current, ...result.items]);
      setNextCursor(result.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.unableToLoad'));
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, loadPage, nextCursor, t]);

  const handleRetry = useCallback(async () => {
    setIsLoadingInitial(true);
    setError(null);
    try {
      const result = await loadPage();
      setItems(result.items);
      setNextCursor(result.nextCursor);
    } catch (loadError) {
      setItems([]);
      setNextCursor(null);
      setError(loadError instanceof Error ? loadError.message : t('errors.unableToLoad'));
    } finally {
      setIsLoadingInitial(false);
    }
  }, [loadPage, t]);

  const refreshFirstPage = useCallback(async () => {
    const result = await loadPage();
    setItems(result.items);
    setNextCursor(result.nextCursor);
    await loadRegistrationSummary();
  }, [loadPage, loadRegistrationSummary]);

  const showInitialSkeleton = isLoadingInitial && !items.length;
  const listData = useMemo<UserListItem[]>(
    () => (showInitialSkeleton
      ? Array.from({ length: 5 }, (_, index) => ({ id: `skeleton-${index}`, __skeleton: true as const }))
      : items),
    [items, showInitialSkeleton],
  );

  const handleOpenUser = useCallback(async (user: AdminNormalUserItem) => {
    if (!canViewUserDetails) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.viewPermissionDescription'));
      return;
    }

    setIsCreatingUser(false);
    setSelectedUser(user);
    setForm(buildUserForm(user));
    setFormErrors({});
    setIsDetailVisible(true);
    setIsLoadingDetail(true);
    try {
      const detail = await adminUserService.loadUser(user.id);
      setSelectedUser(detail);
      setForm(buildUserForm(detail));
    } catch (loadError) {
      Alert.alert(t('alerts.loadUserFailedTitle'), loadError instanceof Error ? loadError.message : t('alerts.tryAgain'));
    } finally {
      setIsLoadingDetail(false);
    }
  }, [canViewUserDetails, t]);

  const handleOpenCreateUser = useCallback(() => {
    if (!canEditUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.editPermissionDescription'));
      return;
    }

    setSelectedUser(null);
    setForm(buildUserForm(null));
    setFormErrors({});
    setIsCreatingUser(true);
    setIsDetailVisible(true);
    setIsLoadingDetail(false);
  }, [canEditUser, t]);

  const resetImportModalState = useCallback(() => {
    setSelectedImportFile(null);
    setImportError(null);
    setImportResult(null);
  }, []);

  const closeImportModal = useCallback(() => {
    setIsImportModalVisible(false);
    resetImportModalState();
  }, [resetImportModalState]);

  const closeDetailModal = useCallback(() => {
    setIsDetailVisible(false);
    setIsCreatingUser(false);
    setSelectedUser(null);
    setForm(buildUserForm(null));
    setFormErrors({});
  }, []);

  useFocusEffect(
    useCallback(() => () => {
      setSearch('');
      setJoinStatusFilter('all');
      closeDetailModal();
      closeImportModal();
    }, [closeDetailModal, closeImportModal]),
  );

  const handleChooseImportFile = useCallback(async () => {
    if (!canEditUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.editPermissionDescription'));
      return;
    }

    try {
      const result = await pickDocumentWithGuard({
        type: [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];
      setSelectedImportFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });
      setImportResult(null);
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unable to select import file.');
    }
  }, [canEditUser, t]);

  const handleImportUsers = useCallback(async () => {
    if (!canEditUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.editPermissionDescription'));
      return;
    }

    if (!selectedImportFile) {
      setImportError('Select a CSV or Excel file before importing.');
      return;
    }

    try {
      setImportError(null);
      setIsImporting(true);
      const imported = await adminUserService.importUsers(selectedImportFile);
      setImportResult(imported);
      await refreshFirstPage();
      Alert.alert(
        'Import completed',
        `Created ${imported.summary.created}, skipped ${imported.summary.skipped}, failed ${imported.summary.failed}.`,
      );
    } catch (error) {
      setImportResult(null);
      setImportError(error instanceof Error ? error.message : 'Unable to import users from file.');
    } finally {
      setIsImporting(false);
    }
  }, [canEditUser, refreshFirstPage, selectedImportFile, t]);

  const handleDownloadSampleSheet = useCallback(async () => {
    try {
      setIsDownloadingSample(true);
      await createAndDeliverTextFile({
        content: USER_IMPORT_SAMPLE_CSV,
        fileName: 'sample-user-import.csv',
        mimeType: 'text/csv',
      });
    } catch (error) {
      Alert.alert('Download failed', error instanceof Error ? error.message : 'Unable to download sample sheet.');
    } finally {
      setIsDownloadingSample(false);
    }
  }, []);

  const handleSaveUser = useCallback(async () => {
    if (!canEditUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.editPermissionDescription'));
      return;
    }

    const isValid = await validateUserForm();
    if (!isValid) {
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();
    const countryCode = form.countryCode.replace(/[^\d]/g, '') || '91';
    const email = form.email.trim();

    setIsSaving(true);
    try {
      if (isCreatingUser) {
        const created = await adminUserService.createUser({
          name,
          phone,
          countryCode,
          email: email || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          pincode: form.pincode.trim() || null,
        });
        closeDetailModal();
        setItems((current) => [{ ...created, name, phone, countryCode, email: email || null, joinStatus: 'INVITED', registered: false }, ...current]);
        await refreshFirstPage();
        Alert.alert('User invited', `${name} has been added as an invited user.`);
        return;
      }

      if (!selectedUser) {
        return;
      }

      const updated = await adminUserService.updateUser(selectedUser.id, {
        name,
        phone,
        countryCode,
        email: email || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        pincode: form.pincode.trim() || null,
      });
      const nextUser = {
        ...selectedUser,
        ...updated,
        name,
        phone,
        countryCode,
        email: email || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        pincode: form.pincode.trim() || null,
      };
      setSelectedUser(nextUser);
      setItems((current) => current.map((item) => (item.id === selectedUser.id ? { ...item, ...nextUser } : item)));
      setIsDetailVisible(false);
    } catch (saveError) {
      Alert.alert(t('alerts.saveUserFailedTitle'), saveError instanceof Error ? saveError.message : t('alerts.tryAgain'));
    } finally {
      setIsSaving(false);
    }
  }, [canEditUser, closeDetailModal, form, isCreatingUser, refreshFirstPage, selectedUser, t, validateUserForm]);

  const handleDeleteUser = useCallback(() => {
    if (!selectedUser) {
      return;
    }

    if (!canDeleteUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.deletePermissionDescription'));
      return;
    }

    Alert.alert(t('alerts.deleteUserTitle'), t('alerts.deleteUserDescription').replace('{name}', selectedUser.name), [
      { text: t('actions.cancel'), style: 'cancel' },
      {
        text: t('actions.delete'),
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await adminUserService.deleteUser(selectedUser.id);
            setItems((current) => current.filter((item) => item.id !== selectedUser.id));
            setIsDetailVisible(false);
            await refreshFirstPage();
          } catch (deleteError) {
            Alert.alert(t('alerts.deleteUserFailedTitle'), deleteError instanceof Error ? deleteError.message : t('alerts.tryAgain'));
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  }, [canDeleteUser, refreshFirstPage, selectedUser, t]);

  const handleToggleBlockUser = useCallback(() => {
    if (!selectedUser) {
      return;
    }

    if (!canBlockUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.blockPermissionDescription'));
      return;
    }

    const isBlocked = String(selectedUser.status || '').toUpperCase() === 'BLOCKED';
    const nextStatus = isBlocked ? 'ACTIVE' : 'BLOCKED';
    const title = isBlocked ? t('alerts.unblockUserTitle') : t('alerts.blockUserTitle');
    const description = (isBlocked ? t('alerts.unblockUserDescription') : t('alerts.blockUserDescription')).replace('{name}', selectedUser.name);
    setStatusDialog({
      visible: true,
      nextStatus,
      title,
      description,
      confirmLabel: isBlocked ? t('actions.unblock') : t('actions.block'),
    });
  }, [canBlockUser, selectedUser, t]);

  const confirmToggleBlockUser = useCallback(async () => {
    if (!selectedUser || !statusDialog.nextStatus) {
      setStatusDialog((current) => ({ ...current, visible: false, nextStatus: null }));
      return;
    }

    const nextStatus = statusDialog.nextStatus;
    const isBlockedAction = nextStatus === 'BLOCKED';
    setIsUpdatingStatus(true);
    try {
      const updated = await adminUserService.updateUserStatus(selectedUser.id, nextStatus);
      const nextUser = { ...selectedUser, ...updated, status: updated.status ?? nextStatus };
      setSelectedUser(nextUser);
      setItems((current) => current.map((item) => (item.id === selectedUser.id ? { ...item, ...nextUser } : item)));
      setStatusDialog((current) => ({ ...current, visible: false, nextStatus: null }));
      await refreshFirstPage();
    } catch (statusError) {
      Alert.alert(
        isBlockedAction ? t('alerts.blockUserFailedTitle') : t('alerts.unblockUserFailedTitle'),
        statusError instanceof Error ? statusError.message : t('alerts.tryAgain'),
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [refreshFirstPage, selectedUser, statusDialog.nextStatus, t]);

  const header = useMemo(() => (
    showInitialSkeleton ? <AdminUsersHeaderSkeleton /> : (
      <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
        {error && items.length ? (
          <View style={{ padding: spacing[4], borderRadius: 20, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight }}>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
              {t('errors.loadFailed')}
            </Text>
            <Text style={{ color: colors.text.muted, marginTop: spacing[1] }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: spacing[2] }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
            {t('heading')}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>
            {t('subtitle')}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background.surface,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.border.muted,
            padding: spacing[4],
            gap: spacing[3],
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3], alignItems: 'flex-start' }}>
            <View style={{ flex: 1, gap: spacing[1] }}>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 15 }}>
                User invitations
              </Text>
              <Text style={{ color: colors.text.muted, fontSize: 12, lineHeight: 18 }}>
                Upload normal users or add one manually. They remain invited until registration.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], borderRadius: radius.full, backgroundColor: colors.status.warningLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
              <MaterialIcons name="schedule" size={14} color={colors.status.warning} />
              <Text style={{ color: colors.status.warning, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                Invited {registrationSummary?.invited ?? 0}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1], borderRadius: radius.full, backgroundColor: colors.status.successLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
              <MaterialIcons name="verified-user" size={14} color={colors.status.success} />
              <Text style={{ color: colors.status.success, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                Registered {registrationSummary?.registered ?? 0}
              </Text>
            </View>
          </View>

          {importResult ? (
            <Text style={{ color: colors.text.muted, fontSize: 12, lineHeight: 18 }}>
              Last import: {importResult.summary.created} created, {importResult.summary.skipped} skipped, {importResult.summary.failed} failed.
            </Text>
          ) : null}

        </View>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('search.placeholder')}
        />

        <SelectField
          variant="dropdown"
          label="Registration status"
          labelVariant="default"
          value={joinStatusFilter}
          onSelect={(value) => setJoinStatusFilter(value as 'all' | 'invited' | 'registered')}
          options={[
            { label: 'All users', value: 'all' },
            { label: 'Invited', value: 'invited' },
            { label: 'Registered', value: 'registered' },
          ]}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('sections.users')}
          </Text>
          <View style={{ backgroundColor: colors.primary.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 999 }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {String(items.length).padStart(2, '0')} {t('total.suffix')}
            </Text>
          </View>
        </View>
      </View>
    )
  ), [
    error,
    importResult,
    items,
    joinStatusFilter,
    registrationSummary?.invited,
    registrationSummary?.registered,
    search,
    showInitialSkeleton,
    t,
  ]);

  const selectedUserIsBlocked = String(selectedUser?.status || '').toUpperCase() === 'BLOCKED';

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <InfiniteScrollList
          data={listData}
          loadingSearch={isRefreshingSearch && !showInitialSkeleton}
          loadingMore={isLoadingMore}
          hasNextPage={showInitialSkeleton ? false : hasNextPage}
          onLoadMore={handleLoadMore}
          errorMessage={!showInitialSkeleton && !items.length ? error : null}
          onRetry={handleRetry}
          retrying={isLoadingInitial}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 112 }}
          ListHeaderComponent={<View style={{ gap: spacing[4], marginBottom: spacing[4] }}>{header}</View>}
          renderItem={({ item }) => {
            if ('__skeleton' in item) {
              return <NormalUserRowSkeleton />;
            }
            return <NormalUserRow user={item} onOpen={() => void handleOpenUser(item)} t={t} />;
          }}
          emptyTitle={t('empty.title')}
          emptyDescription={t('empty.description')}
        />

        <View style={{ position: 'absolute', right: spacing[4], bottom: fabBottom, zIndex: 30, gap: spacing[3] }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Upload users"
            activeOpacity={0.85}
            disabled={isImporting}
            onPress={() => {
              resetImportModalState();
              setIsImportModalVisible(true);
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.primary.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isImporting ? 0.55 : 1,
            }}>
            <MaterialIcons name="upload-file" size={24} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Add user" activeOpacity={0.85} onPress={handleOpenCreateUser} style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.text.inverse, fontSize: 28, lineHeight: 28 }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isDetailVisible} transparent animationType="slide" onRequestClose={closeDetailModal}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
            <Pressable style={{ flex: 1 }} onPress={closeDetailModal} />
            <View
              style={{
                maxHeight: '88%',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                backgroundColor: colors.background.DEFAULT,
                paddingHorizontal: spacing[4],
                paddingTop: spacing[4],
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
                      {isCreatingUser ? 'Add user' : t('details.title')}
                    </Text>
                    <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                      {isCreatingUser ? 'Invited user' : selectedUser?.memberId || selectedUser?.id || ''}
                    </Text>
                  </View>
                  <Pressable accessibilityRole="button" onPress={closeDetailModal} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                    <MaterialIcons name="close" size={22} color={colors.text.primary} />
                  </Pressable>
                </View>

                <KeyboardAwareScrollView
                  bottomOffset={96}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[4] }}>
                  {!isCreatingUser ? (
                  <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                      <View style={{ width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.primary.subtle, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {selectedUser?.profilePic ? (
                          <Image source={{ uri: selectedUser.profilePic }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                          <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                          {selectedUser?.name || form.name || t('labels.user')}
                        </Text>
                        {isLoadingDetail ? (
                          <View style={{ marginTop: spacing[1] }}>
                            <AppSkeletonBlock width={84} height={12} radiusSize={radius.sm} />
                          </View>
                        ) : (
                          <View
                            style={{
                              alignSelf: 'flex-start',
                              marginTop: spacing[1],
                              paddingHorizontal: spacing[2],
                              paddingVertical: 4,
                              borderRadius: 999,
                              backgroundColor: selectedUserIsBlocked ? colors.status.errorLight : colors.primary.muted,
                            }}>
                            <Text
                              style={{
                                color: selectedUserIsBlocked ? colors.status.error : colors.primary.DEFAULT,
                                fontSize: 12,
                                fontFamily: typography.fontFamily.bold,
                              }}>
                              {selectedUser?.status || 'ACTIVE'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
                      <View style={{ minWidth: '45%', flex: 1 }}>
                        <DetailLine label={t('details.type')} value={selectedUser?.userType || selectedUser?.role || t('labels.user')} />
                      </View>
                      <View style={{ minWidth: '45%', flex: 1 }}>
                        <DetailLine label={t('details.phone')} value={selectedUser?.phone} />
                      </View>
                      <View style={{ minWidth: '45%', flex: 1 }}>
                        <DetailLine label={t('details.email')} value={selectedUser?.email} />
                      </View>
                      <View style={{ minWidth: '45%', flex: 1 }}>
                        <DetailLine label={t('details.location')} value={translateLocationText([selectedUser?.city, selectedUser?.state, selectedUser?.pincode].filter(Boolean).join(', '), language)} />
                      </View>
                    </View>
                  </View>
                  ) : null}

                  <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                    <View style={{ flex: 1, gap: spacing[3] }}>
                      <TextField
                        label={t('form.name')}
                        value={form.name}
                        onChangeText={(name) => updateFormField('name', name)}
                        error={formErrors.name}
                        disabled={!canEditUser}
                        required
                        variant="registration"
                        labelVariant="default"
                      />
                      <PhoneInput
                        label={t('form.phone')}
                        value={buildAdminPhoneInputValue(form)}
                        onChangeText={updatePhoneField}
                        error={formErrors.phone}
                        disabled={!isCreatingUser}
                      />
                      <TextField
                        label={t('form.email')}
                        value={form.email}
                        onChangeText={(email) => updateFormField('email', email)}
                        error={formErrors.email}
                        disabled={!canEditUser}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        variant="registration"
                        labelVariant="default"
                      />
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        <View style={{ flex: 1, zIndex: 20 }}>
                          <SelectField
                            label={t('form.state')}
                            value={form.state}
                            onSelect={(state) => {
                              const nextState = String(state || '');
                              updateFormField('state', nextState);
                              updateFormField('city', '');
                              selectState(nextState);
                            }}
                            options={stateOptions}
                            error={formErrors.state}
                            disabled={!canEditUser}
                            placeholder={t('form.selectState')}
                            variant="registration"
                            labelVariant="default"
                            dropdownPosition="top"
                          />
                        </View>
                        <View style={{ flex: 1, zIndex: 19 }}>
                          <SelectField
                            label={t('form.city')}
                            value={form.city}
                            onSelect={(city) => updateFormField('city', String(city || ''))}
                            options={cityOptions}
                            error={formErrors.city}
                            disabled={!canEditUser || !form.state}
                            placeholder={form.state ? t('form.selectCity') : t('form.selectStateFirst')}
                            variant="registration"
                            labelVariant="default"
                            dropdownPosition="top"
                          />
                        </View>
                      </View>
                      <TextField
                        label={t('form.pincode')}
                        value={form.pincode}
                        onChangeText={(pincode) => updateFormField('pincode', pincode.replace(/[^\d]/g, '').slice(0, 6))}
                        error={formErrors.pincode}
                        disabled={!canEditUser}
                        keyboardType="number-pad"
                        variant="registration"
                        labelVariant="default"
                      />
                    </View>
                  </View>
                </KeyboardAwareScrollView>

                {canDeleteUser || canEditUser || canBlockUser ? (
                  <KeyboardStickyView>
                    <View style={{ backgroundColor: colors.background.DEFAULT, paddingTop: spacing[2], paddingBottom: spacing[6] }}>
                      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                        {canBlockUser && !isCreatingUser ? (
                          <View style={{ flex: 1 }}>
                            <Button
                              variant="outline"
                              fullWidth
                              disabled={isUpdatingStatus || isDeleting || isSaving || isLoadingDetail}
                              loading={isUpdatingStatus}
                              onPress={handleToggleBlockUser}>
                              {selectedUserIsBlocked ? t('actions.unblock') : t('actions.block')}
                            </Button>
                          </View>
                        ) : null}
                        {canDeleteUser && !isCreatingUser ? (
                          <View style={{ flex: 1 }}>
                            <Button variant="outline" fullWidth disabled={isDeleting || isSaving || isUpdatingStatus} loading={isDeleting} onPress={handleDeleteUser}>
                              {t('actions.delete')}
                            </Button>
                          </View>
                        ) : null}
                        {canEditUser ? (
                          <View style={{ flex: canDeleteUser || canBlockUser ? 2 : 1 }}>
                            <Button fullWidth disabled={isSaving || isDeleting || isUpdatingStatus || isLoadingDetail} loading={isSaving} onPress={() => void handleSaveUser()}>
                              {isCreatingUser ? 'Create invited user' : t('actions.saveChanges')}
                            </Button>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </KeyboardStickyView>
                ) : (
                  <View style={{ height: spacing[6] }} />
                )}
            </View>
          </View>
        </Modal>
        <Modal visible={isImportModalVisible} transparent animationType="slide" onRequestClose={closeImportModal}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
            <Pressable style={{ flex: 1 }} onPress={closeImportModal} />
            <View
              style={{
                maxHeight: '84%',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                backgroundColor: colors.background.DEFAULT,
                paddingHorizontal: spacing[4],
                paddingTop: spacing[4],
                paddingBottom: spacing[6],
                gap: spacing[4],
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
                    Import users
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2, lineHeight: 18 }}>
                    Download the sample, fill user rows, then upload CSV or Excel. Existing users are skipped.
                  </Text>
                </View>
                <Pressable accessibilityRole="button" onPress={closeImportModal} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                  <MaterialIcons name="close" size={22} color={colors.text.primary} />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Button variant="outline" fullWidth disabled={isDownloadingSample || isImporting} loading={isDownloadingSample} onPress={handleDownloadSampleSheet}>
                    Sample
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button variant="outline" fullWidth disabled={isImporting || isDownloadingSample} onPress={handleChooseImportFile}>
                    Choose file
                  </Button>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center' }}>
                <View style={{ flex: 1, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
                  <Text style={{ color: selectedImportFile ? colors.text.primary : colors.text.muted, fontSize: 12 }} numberOfLines={2}>
                    {selectedImportFile?.name || 'No file selected'}
                  </Text>
                </View>
                <View style={{ width: 128 }}>
                  <Button fullWidth disabled={isImporting || isDownloadingSample || !selectedImportFile} loading={isImporting} onPress={handleImportUsers}>
                    Import
                  </Button>
                </View>
              </View>

              {importResult ? (
                <View style={{ borderRadius: radius.lg, backgroundColor: colors.status.successLight, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
                  <Text style={{ color: colors.status.success, fontFamily: typography.fontFamily.bold, fontSize: 13 }}>
                    File imported successfully. {importResult.summary.created} invited, {importResult.summary.skipped} skipped, {importResult.summary.failed} failed.
                  </Text>
                </View>
              ) : null}

              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[2] }} showsVerticalScrollIndicator>
                <View style={{ borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[2] }}>
                  <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 15 }}>
                    Required columns
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 12, lineHeight: 18 }}>
                    name, phone, countryCode. Optional: email, city, state, pincode, bloodGroup.
                  </Text>
                </View>

                {importResult ? (
                  <View style={{ gap: spacing[3] }}>
                    <View style={{ borderRadius: radius.xl, borderWidth: 1, borderColor: importResult.summary.failed ? colors.status.warningLight : colors.status.successLight, backgroundColor: importResult.summary.failed ? colors.status.warningLight : colors.status.successLight, padding: spacing[4], gap: spacing[2] }}>
                      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                        Import completed
                      </Text>
                      <Text style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 18 }}>
                        {importResult.summary.created} invited, {importResult.summary.skipped} skipped, {importResult.summary.failed} failed. Review row details below.
                      </Text>
                      <Button
                        fullWidth
                        onPress={() => {
                          closeImportModal();
                        }}>
                        Done
                      </Button>
                    </View>

                    <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
                      <View style={{ borderRadius: radius.full, backgroundColor: colors.status.successLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                        <Text style={{ color: colors.status.success, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                          Created {importResult.summary.created}
                        </Text>
                      </View>
                      <View style={{ borderRadius: radius.full, backgroundColor: colors.status.warningLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                        <Text style={{ color: colors.status.warning, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                          Skipped {importResult.summary.skipped}
                        </Text>
                      </View>
                      <View style={{ borderRadius: radius.full, backgroundColor: colors.status.errorLight, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
                        <Text style={{ color: colors.status.error, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                          Failed {importResult.summary.failed}
                        </Text>
                      </View>
                    </View>

                    <View style={{ gap: spacing[2] }}>
                      {importResult.rows.slice(0, 50).map((row) => {
                        const status = String(row.status || '').toUpperCase();
                        const tone = status === 'CREATED'
                          ? { bg: colors.status.successLight, text: colors.status.success }
                          : status === 'FAILED'
                            ? { bg: colors.status.errorLight, text: colors.status.error }
                            : { bg: colors.status.warningLight, text: colors.status.warning };

                        return (
                          <View key={`${row.rowNumber}-${row.status}-${row.phone || row.name || row.reason}`} style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[3], gap: spacing[1] }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
                              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 13, flex: 1 }}>
                                Row {row.rowNumber}{row.name ? ` • ${row.name}` : ''}
                              </Text>
                              <View style={{ borderRadius: radius.full, backgroundColor: tone.bg, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
                                <Text style={{ color: tone.text, fontFamily: typography.fontFamily.bold, fontSize: 11 }}>
                                  {status}
                                </Text>
                              </View>
                            </View>
                            <Text style={{ color: colors.text.muted, fontSize: 12, lineHeight: 18 }}>
                              {row.reason}{row.phone ? ` • ${row.countryCode ? `+${row.countryCode} ` : ''}${row.phone}` : ''}
                            </Text>
                          </View>
                        );
                      })}
                      {importResult.rows.length > 50 ? (
                        <Text style={{ color: colors.text.muted, textAlign: 'center', fontSize: 12 }}>
                          Showing first 50 rows.
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={{ borderRadius: radius.xl, backgroundColor: importError ? colors.status.errorLight : colors.primary.subtle, padding: spacing[4] }}>
                    {importError ? (
                      <Text style={{ color: colors.status.error, fontFamily: typography.fontFamily.bold, fontSize: 14, marginBottom: spacing[1] }}>
                        Import issue
                      </Text>
                    ) : null}
                    <Text style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 18 }}>
                      {importError || 'After upload, row-level validation appears here. Duplicate phone/email users will be skipped.'}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Dialog
          visible={statusDialog.visible}
          variant="confirm"
          title={statusDialog.title}
          description={statusDialog.description}
          confirmLabel={statusDialog.confirmLabel}
          cancelLabel={t('actions.cancel')}
          onConfirm={() => void confirmToggleBlockUser()}
          onCancel={() => setStatusDialog((current) => ({ ...current, visible: false, nextStatus: null }))}
        />
      </View>
    </AppSafeAreaView>
  );
}
