import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, Button, Card, Dialog, FormScreenLayout, Text } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { roleManagementService, type RoleCatalogItem } from '@/src/features/admin/services/role-management-service';

type UserType = 'user' | 'member' | 'community_member' | 'trustee' | 'admin';
const PAGE_SIZE = 20;

const USER_TYPE_KEYS = new Set<UserType>(['user', 'member', 'community_member', 'trustee', 'admin']);

function RolePickerCard({
  role,
  selected,
  onPress,
}: {
  role: RoleCatalogItem;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        borderRadius: 22,
        borderWidth: 2,
        borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
        backgroundColor: selected ? colors.primary.subtle : colors.background.surface,
        padding: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: selected ? colors.primary.DEFAULT : 'transparent' }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {role.name}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
            {role.description || role.key}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.text.muted} />
      </View>
    </TouchableOpacity>
  );
}

function MemberResultCard({
  member,
  selected,
  onPress,
  helperText,
  canViewPhone,
}: {
  member: DirectoryMemberItem;
  selected: boolean;
  onPress: () => void;
  helperText: string;
  canViewPhone: boolean;
}) {
  const visibleDetails = [
    member.memberId,
    member.email,
    canViewPhone ? member.phone : null,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: selected ? colors.primary.DEFAULT : colors.border.muted,
        backgroundColor: selected ? colors.primary.subtle : colors.background.surface,
        padding: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ width: 52, height: 52, borderRadius: 999, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {member.title}
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2 }}>
            {member.subtitle}
          </Text>
          <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, marginTop: 2, fontFamily: typography.fontFamily.semibold }}>
            {visibleDetails.length > 0 ? visibleDetails.join(' • ') : member.meta || helperText}
          </Text>
        </View>
        {selected ? <MaterialIcons name="check-circle" size={22} color="#16a34a" /> : <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} />}
      </View>
    </TouchableOpacity>
  );
}

function resolveUserAssignment(member: DirectoryMemberItem) {
  const roleKeys = member.roles ?? [];
  const normalizedUserType = String(member.userType || 'user').toLowerCase();
  const userType = USER_TYPE_KEYS.has(normalizedUserType as UserType) ? (normalizedUserType as UserType) : 'user';
  const customRoleKeys = roleKeys.filter((roleKey) => !USER_TYPE_KEYS.has(roleKey as UserType));

  return {
    userType,
    customRoleKeys,
  };
}

function PermissionCardSkeleton() {
  return (
    <View
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border.muted,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <SkeletonBlock width={52} height={52} radiusSize={999} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <SkeletonBlock width="38%" height={16} radiusSize={radius.sm} />
          <SkeletonBlock width="62%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
    </View>
  );
}

function AdminPermissionsSkeleton() {
  return (
    <View style={{ gap: spacing[6] }}>
      <View style={{ gap: spacing[2] }}>
        <SkeletonBlock width="18%" height={12} radiusSize={radius.sm} />
        <SkeletonBlock width="46%" height={24} radiusSize={radius.sm} />
        <SkeletonBlock width="78%" height={12} radiusSize={radius.sm} />
      </View>

      <View style={{ borderRadius: radius.xl, backgroundColor: colors.primary.subtle, borderWidth: 1, borderColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
        <SkeletonBlock width="100%" height={18} radiusSize={radius.sm} />
      </View>

      <View style={{ gap: spacing[3] }}>
        {[0, 1, 2].map((item) => (
          <PermissionCardSkeleton key={item} />
        ))}
      </View>

      <View style={{ gap: spacing[3] }}>
        <SkeletonBlock width="34%" height={20} radiusSize={radius.sm} />
        {[0, 1, 2].map((item) => (
          <PermissionCardSkeleton key={`role-${item}`} />
        ))}
      </View>
    </View>
  );
}

export function AdminPermissionsContent() {
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{ memberId?: string | string[] }>();
  const t = useTranslations('admin.permissions');
  const { hasPermission } = useSession();
  const preselectedMemberId = Array.isArray(params.memberId) ? params.memberId[0] : params.memberId;
  const canViewPhone = hasPermission('phone.view');
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<DirectoryMemberItem[]>([]);
  const [membersPage, setMembersPage] = useState(1);
  const [hasNextMembersPage, setHasNextMembersPage] = useState(false);
  const [roles, setRoles] = useState<RoleCatalogItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<DirectoryMemberItem | null>(null);
  const [selectedType, setSelectedType] = useState<UserType>('user');
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMoreMembers, setIsLoadingMoreMembers] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    title: string;
    description: string;
  }>({ visible: false, variant: 'success', title: '', description: '' });
  const scrollViewRef = useRef<ScrollView | null>(null);
  const hasLoadedRolesRef = useRef(false);
  const hasLoadedMembersRef = useRef(false);
  const userTypeOptions = useMemo(() => ([
    {
      key: 'user' as const,
      title: t('userType.user.title'),
      description: t('userType.user.description'),
      icon: 'person-outline' as const,
    },
    {
      key: 'member' as const,
      title: t('userType.member.title'),
      description: t('userType.member.description'),
      icon: 'groups' as const,
    },
    {
      key: 'community_member' as const,
      title: t('userType.communityMember.title'),
      description: t('userType.communityMember.description'),
      icon: 'groups' as const,
    },
    {
      key: 'trustee' as const,
      title: t('userType.trustee.title'),
      description: t('userType.trustee.description'),
      icon: 'verified-user' as const,
    },
    {
      key: 'admin' as const,
      title: t('userType.admin.title'),
      description: t('userType.admin.description'),
      icon: 'admin-panel-settings' as const,
    },
  ]), [t]);

  const resetInteractionState = useCallback(() => {
    setSearch('');
    setSelectedMember(null);
    setSelectedType('user');
    setSelectedRoleKeys(new Set());
    setMembersPage(1);
    setHasNextMembersPage(false);
    setError(null);
    setFeedbackDialog({ visible: false, variant: 'success', title: '', description: '' });
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetInteractionState();
    }, [resetInteractionState]),
  );

  useEffect(() => {
    let active = true;
    setIsLoadingRoles(true);

    roleManagementService.loadCatalog()
      .then((catalog) => {
        if (!active) {
          return;
        }
        setRoles(catalog.roles ?? []);
        setError(null);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : t('errors.loadRoles'));
      })
      .finally(() => {
        if (!active) {
          return;
        }
        hasLoadedRolesRef.current = true;
        setIsLoadingRoles(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    let active = true;
    const query = search.trim();
    setIsSearching(true);
    setIsLoadingMoreMembers(false);

    directoryService.loadMembersPage({
      q: query || undefined,
      userType: 'all',
      page: 1,
      limit: PAGE_SIZE,
    })
      .then((result) => {
        if (!active) {
          return;
        }
        setMembers(result.items);
        setMembersPage(1);
        setHasNextMembersPage(Boolean(result.pagination?.hasNextPage));
        setSelectedMember((current) => (current && result.items.some((member) => member.id === current.id) ? current : null));
        setError(null);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setMembers([]);
        setMembersPage(1);
        setHasNextMembersPage(false);
        setSelectedMember(null);
        setError(loadError instanceof Error ? loadError.message : t('errors.loadUsers'));
      })
      .finally(() => {
        if (!active) {
          return;
        }
        hasLoadedMembersRef.current = true;
        setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [search, t]);

  const visibleRoles = useMemo(
    () =>
      roles.filter((role) => {
        const normalized = role.key.toLowerCase();
        return !['user', 'member', 'community_member', 'trustee', 'admin'].includes(normalized);
      }),
    [roles],
  );

  const selectedRoleLabels = useMemo(
    () => visibleRoles.filter((role) => selectedRoleKeys.has(role.key)).map((role) => role.name),
    [selectedRoleKeys, visibleRoles],
  );
  const showInitialSkeleton =
    (!hasLoadedRolesRef.current || !hasLoadedMembersRef.current) && !roles.length && !members.length && !error;
  const selectedMemberDetails = useMemo(
    () => [
      selectedMember?.memberId,
      selectedMember?.email,
      canViewPhone ? selectedMember?.phone : null,
    ].filter(Boolean).join(' • '),
    [canViewPhone, selectedMember],
  );

  const handleSelectMember = useCallback((member: DirectoryMemberItem) => {
    const assignment = resolveUserAssignment(member);
    setSelectedMember(member);
    setSelectedType(assignment.userType);
    setSelectedRoleKeys(new Set(assignment.customRoleKeys));
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.({ x: 0, y: 0, animated: true });
    });
  }, []);

  useEffect(() => {
    if (!preselectedMemberId) {
      return;
    }

    let active = true;
    directoryService.loadMember(preselectedMemberId)
      .then((member) => {
        if (!active || !member) {
          return;
        }

        handleSelectMember(member);
        setSearch(member.title);
        setMembers((current) => (current.some((item) => item.id === member.id) ? current : [member, ...current]));
      })
      .catch(() => {
        if (!active) {
          return;
        }
      });

    return () => {
      active = false;
    };
  }, [handleSelectMember, preselectedMemberId]);

  const handleAssign = async () => {
    if (!selectedMember) {
      setError(t('errors.selectUserFirst'));
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await directoryService.assignMemberRoles(selectedMember.id, {
        userType: selectedType,
        roleKeys: Array.from(selectedRoleKeys),
      });
      const assignedName = selectedMember.title;
      setSearch('');
      setSelectedMember(null);
      setSelectedType('user');
      setSelectedRoleKeys(new Set());
      setFeedbackDialog({
        visible: true,
        variant: 'success',
        title: t('feedback.savedTitle'),
        description: t('feedback.savedDescription')
          .replace('{name}', assignedName)
          .replace('{type}', selectedType.toUpperCase()),
      });
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : t('errors.saveAssignment'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadMoreMembers = useCallback(async () => {
    if (isLoadingMoreMembers || !hasNextMembersPage) {
      return;
    }

    const nextPage = membersPage + 1;
    setIsLoadingMoreMembers(true);
    try {
      const result = await directoryService.loadMembersPage({
        q: search.trim() || undefined,
        userType: 'all',
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setMembers((current) => [
        ...current,
        ...result.items.filter((member) => !current.some((existing) => existing.id === member.id)),
      ]);
      setMembersPage(nextPage);
      setHasNextMembersPage(Boolean(result.pagination?.hasNextPage));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.loadUsers'));
    } finally {
      setIsLoadingMoreMembers(false);
    }
  }, [hasNextMembersPage, isLoadingMoreMembers, membersPage, search, t]);

  return (
    <>
    <FormScreenLayout
      scrollViewRef={scrollViewRef}
      header={<AppHeader variant="back-inline" title={t('title')} onLeftPress={navigateBack} />}
      footer={
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <Button variant="outline" fullWidth onPress={navigateBack}>
                {t('actions.cancel')}
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button fullWidth onPress={handleAssign} loading={isSaving} disabled={isSaving || !selectedMember}>
                {t('actions.assign')}
              </Button>
            </View>
          </View>
        </View>
      }>
      <View style={{ backgroundColor: '#f8fafc' }}>
        <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[6] }}>
            {showInitialSkeleton ? (
              <AdminPermissionsSkeleton />
            ) : (
              <>
            <View style={{ gap: spacing[2] }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                {t('title')}
              </Text>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {t('heading')}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {t('subtitle')}
              </Text>
            </View>

            <View style={{ gap: spacing[3] }}>
              {selectedMember ? (
                <View style={{ gap: spacing[3] }}>
                  <Card variant="elevated" padding="lg">
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                      <View style={{ width: 56, height: 56, borderRadius: 999, borderWidth: 2, borderColor: colors.primary.borderLight, backgroundColor: '#ebe7e4', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="badge" size={24} color={colors.primary.DEFAULT} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {t('summary.selectedUser')}
                        </Text>
                        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                          {selectedMember.title}
                        </Text>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold }}>
                          {selectedMember.subtitle}
                        </Text>
                        {selectedMemberDetails ? (
                          <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[1] }}>
                            {selectedMemberDetails}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </Card>

                  <View style={{ gap: spacing[3] }}>
                    <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('sections.accessType')}
                    </Text>
                    <View style={{ gap: spacing[3] }}>
                      {userTypeOptions.map((option) => {
                        const active = selectedType === option.key;
                        return (
                          <TouchableOpacity
                            key={option.key}
                            accessibilityRole="button"
                            activeOpacity={0.85}
                            onPress={() => setSelectedType(option.key)}
                            style={{
                              borderRadius: 22,
                              borderWidth: 2,
                              borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                              backgroundColor: active ? colors.primary.subtle : colors.background.surface,
                              padding: spacing[4],
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                              <View
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: 999,
                                  borderWidth: 2,
                                  borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: active ? colors.primary.DEFAULT : 'transparent' }} />
                              </View>
                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                                  <MaterialIcons name={option.icon} size={18} color={colors.primary.DEFAULT} />
                                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                                    {option.title}
                                  </Text>
                                </View>
                                <Text variant="caption" color={colors.text.muted} style={{ marginTop: spacing[1] }}>
                                  {option.description}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={{ gap: spacing[3] }}>
                    <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('sections.assignRoles')}
                    </Text>
                    {isLoadingRoles ? (
                      <View style={{ gap: spacing[3] }}>
                        {[0, 1].map((item) => (
                          <PermissionCardSkeleton key={`permissions-${item}`} />
                        ))}
                      </View>
                    ) : (
                      <View style={{ gap: spacing[3] }}>
                        {visibleRoles.map((role) => {
                          const active = selectedRoleKeys.has(role.key);
                          return (
                            <RolePickerCard
                              key={role.id}
                              role={role}
                              selected={active}
                              onPress={() => {
                                setSelectedRoleKeys((current) => {
                                  const next = new Set(current);
                                  if (next.has(role.key)) {
                                    next.delete(role.key);
                                  } else {
                                    next.add(role.key);
                                  }
                                  return next;
                                });
                              }}
                            />
                          );
                        })}
                      </View>
                    )}
                  </View>

                  <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4], gap: spacing[2] }}>
                    <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      {t('sections.assignmentSummary')}
                    </Text>
                    <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      {selectedMember.title}
                    </Text>
                    <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                      {t('summary.type')}: {selectedType.toUpperCase()}
                    </Text>
                    {selectedMemberDetails ? (
                      <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                        {selectedMemberDetails}
                      </Text>
                    ) : null}
                    <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                      {t('summary.roles')}: {selectedRoleLabels.length > 0 ? selectedRoleLabels.join(', ') : t('summary.none')}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.xl, backgroundColor: colors.primary.subtle, borderWidth: 1, borderColor: colors.primary.borderLight, paddingHorizontal: spacing[4] }}>
                <MaterialIcons name="search" size={20} color={colors.primary.DEFAULT} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t('search.placeholder')}
                  placeholderTextColor="#94a3b8"
                  style={{ flex: 1, paddingVertical: spacing[4], fontFamily: typography.fontFamily.medium }}
                />
              </View>

              {isSearching ? (
                <View style={{ gap: spacing[3] }}>
                  {[0, 1, 2].map((item) => (
                    <PermissionCardSkeleton key={`members-${item}`} />
                  ))}
                </View>
              ) : members.length > 0 ? (
                <View style={{ gap: spacing[3] }}>
                  {members.map((member) => (
                    <MemberResultCard
                      key={member.id}
                      member={member}
                      selected={selectedMember?.id === member.id}
                      onPress={() => handleSelectMember(member)}
                      helperText={t('search.selectUser')}
                      canViewPhone={canViewPhone}
                    />
                  ))}
                  {hasNextMembersPage ? (
                    <Button
                      variant="outline"
                      fullWidth
                      loading={isLoadingMoreMembers}
                      disabled={isLoadingMoreMembers}
                      onPress={() => {
                        void handleLoadMoreMembers();
                      }}>
                      {t('actions.loadMoreUsers')}
                    </Button>
                  ) : null}
                </View>
              ) : search.trim() ? (
                <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4] }}>
                  <Text style={{ color: colors.text.muted }}>{t('search.noMatches')}</Text>
                </View>
              ) : (
                <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4] }}>
                  <Text style={{ color: colors.text.muted }}>{t('search.recentUsers')}</Text>
                </View>
              )}
            </View>

            {error ? (
              <Text style={{ color: colors.status.error }}>
                {error}
              </Text>
            ) : null}
              </>
            )}
        </View>
      </View>
    </FormScreenLayout>

    <Dialog
      visible={feedbackDialog.visible}
      variant={feedbackDialog.variant}
      title={feedbackDialog.title}
      description={feedbackDialog.description}
      confirmLabel={t('actions.ok')}
      onConfirm={() => {
        setFeedbackDialog((current) => ({ ...current, visible: false }));
        navigateBack();
      }}
    />
    </>
  );
}
