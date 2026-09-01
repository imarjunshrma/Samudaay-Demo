import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, AppSkeletonBlock, InfiniteScrollList, SearchInput, SelectField, Text, TextField, Button, Dialog } from '@/src/components';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { isSuperAdminSession } from '@/src/core/navigation/admin-shell';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useDebounce } from '@/src/hooks';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { Permission } from '@/src/types/app';
import { adminUserService, type AdminNormalUserItem } from '../services/admin-user-service';

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
};
type UserListItem = AdminNormalUserItem | { id: string; __skeleton: true };

function buildUserForm(user?: AdminNormalUserItem | null): UserFormState {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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
          {user.email || user.phone || t('details.noContactInfo')}
        </Text>
        <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
          {user.role || t('labels.user')}
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
            {t('labels.normal')}
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
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [items, setItems] = useState<AdminNormalUserItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshingSearch, setIsRefreshingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminNormalUserItem | null>(null);
  const [form, setForm] = useState<UserFormState>(buildUserForm(null));
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
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

  const loadPage = useCallback(async (cursor?: string | null) => {
    const result = await adminUserService.loadNormalUsers({
      search: debouncedSearch.trim() || undefined,
      cursor: cursor || undefined,
      limit: 20,
    });

    const filtered = result.items.filter((user) => {
      const role = String(user.role || '').toLowerCase();
      return role !== 'admin' && role !== 'superadmin' && role !== 'super_admin';
    });
    return {
      items: filtered,
      nextCursor: result.nextCursor,
    };
  }, [debouncedSearch]);

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

    return () => {
      active = false;
    };
  }, [loadPage, t]);

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
  }, [loadPage]);

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

    setSelectedUser(user);
    setForm(buildUserForm(user));
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

  const handleSaveUser = useCallback(async () => {
    if (!selectedUser) {
      return;
    }

    if (!canEditUser) {
      Alert.alert(t('alerts.permissionRequiredTitle'), t('alerts.editPermissionDescription'));
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!name || !phone) {
      Alert.alert(t('alerts.missingDetailsTitle'), t('alerts.missingDetailsDescription'));
      return;
    }

    setIsSaving(true);
    try {
      const updated = await adminUserService.updateUser(selectedUser.id, {
        name,
        phone,
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
  }, [canEditUser, form, selectedUser]);

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

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('search.placeholder')}
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
  ), [error, items, search, showInitialSkeleton, t]);

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

        <Modal visible={isDetailVisible} transparent animationType="slide" onRequestClose={() => setIsDetailVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
            <Pressable style={{ flex: 1 }} onPress={() => setIsDetailVisible(false)} />
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
                      {t('details.title')}
                    </Text>
                    <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
                      {selectedUser?.memberId || selectedUser?.id || ''}
                    </Text>
                  </View>
                  <Pressable accessibilityRole="button" onPress={() => setIsDetailVisible(false)} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                    <MaterialIcons name="close" size={22} color={colors.text.primary} />
                  </Pressable>
                </View>

                <KeyboardAwareScrollView
                  bottomOffset={96}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[4] }}>
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

                  <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                    <View style={{ flex: 1, gap: spacing[3] }}>
                      <TextField
                        label={t('form.name')}
                        value={form.name}
                        onChangeText={(name) => setForm((current) => ({ ...current, name }))}
                        disabled={!canEditUser}
                        variant="registration"
                        labelVariant="default"
                      />
                      <TextField
                        label={t('form.phone')}
                        value={form.phone}
                        onChangeText={(phone) => setForm((current) => ({ ...current, phone }))}
                        disabled
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                        helperText={t('form.phoneHelper')}
                        variant="registration"
                        labelVariant="default"
                      />
                      <TextField
                        label={t('form.email')}
                        value={form.email}
                        onChangeText={(email) => setForm((current) => ({ ...current, email }))}
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
                              setForm((current) => ({ ...current, state: nextState, city: '' }));
                              selectState(nextState);
                            }}
                            options={stateOptions}
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
                            onSelect={(city) => setForm((current) => ({ ...current, city: String(city || '') }))}
                            options={cityOptions}
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
                        onChangeText={(pincode) =>
                          setForm((current) => ({
                            ...current,
                            pincode: pincode.replace(/[^\d]/g, '').slice(0, 6),
                          }))
                        }
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
                        {canBlockUser ? (
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
                        {canDeleteUser ? (
                          <View style={{ flex: 1 }}>
                            <Button variant="outline" fullWidth disabled={isDeleting || isSaving || isUpdatingStatus} loading={isDeleting} onPress={handleDeleteUser}>
                              {t('actions.delete')}
                            </Button>
                          </View>
                        ) : null}
                        {canEditUser ? (
                          <View style={{ flex: canDeleteUser || canBlockUser ? 2 : 1 }}>
                            <Button fullWidth disabled={isSaving || isDeleting || isUpdatingStatus || isLoadingDetail} loading={isSaving} onPress={() => void handleSaveUser()}>
                              {t('actions.saveChanges')}
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
