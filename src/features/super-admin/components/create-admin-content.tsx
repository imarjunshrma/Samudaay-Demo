import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, AppListSkeleton, AppSkeletonBlock, AppSkeletonAvatar, Button, Card, FormScreenLayout, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { roleManagementService, type RoleCatalogItem } from '@/src/features/admin/services/role-management-service';

type UserType = 'user' | 'member' | 'community_member' | 'trustee' | 'admin';

const USER_TYPE_OPTIONS: {
  key: UserType;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  {
    key: 'user',
    title: 'User',
    description: 'Basic app access without member privileges',
    icon: 'person-outline',
  },
  {
    key: 'member',
    title: 'Member',
    description: 'Verified committee member access',
    icon: 'groups',
  },
  {
    key: 'community_member',
    title: 'Committee Member',
    description: 'Same app access as a member, shown separately for committee roster use',
    icon: 'groups',
  },
  {
    key: 'trustee',
    title: 'Trustee',
    description: 'Oversight and approval access',
    icon: 'verified-user',
  },
  {
    key: 'admin',
    title: 'Admin',
    description: 'Community admin access, only with Manage Admins permission',
    icon: 'admin-panel-settings',
  },
];

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
}: {
  member: DirectoryMemberItem;
  selected: boolean;
  onPress: () => void;
}) {
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
            {member.meta || member.phone || member.email || 'Select this user'}
          </Text>
        </View>
        {selected ? <MaterialIcons name="check-circle" size={22} color="#16a34a" /> : <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} />}
      </View>
    </TouchableOpacity>
  );
}

function MemberResultSkeleton() {
  return (
    <View
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border.muted,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <AppSkeletonAvatar size={52} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <AppSkeletonBlock width="42%" height={16} radiusSize={8} />
          <AppSkeletonBlock width="68%" height={12} radiusSize={8} />
          <AppSkeletonBlock width="36%" height={12} radiusSize={8} />
        </View>
        <AppSkeletonBlock width={22} height={22} radiusSize={11} />
      </View>
    </View>
  );
}

function RolePickerSkeleton() {
  return (
    <View
      style={{
        borderRadius: 22,
        borderWidth: 2,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <AppSkeletonBlock width={22} height={22} radiusSize={11} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <AppSkeletonBlock width="34%" height={16} radiusSize={8} />
          <AppSkeletonBlock width="70%" height={12} radiusSize={8} />
        </View>
        <AppSkeletonBlock width={20} height={20} radiusSize={10} />
      </View>
    </View>
  );
}

export function CreateAdminContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('super-admin.create-admin');
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<DirectoryMemberItem[]>([]);
  const [roles, setRoles] = useState<RoleCatalogItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<DirectoryMemberItem | null>(null);
  const [selectedType, setSelectedType] = useState<UserType>('member');
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetInteractionState = useCallback(() => {
    setSearch('');
    setMembers([]);
    setSelectedMember(null);
    setSelectedType('member');
    setSelectedRoleKeys(new Set());
    setIsSearching(false);
    setIsSaving(false);
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetInteractionState();
      };
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
        setError(loadError instanceof Error ? loadError.message : 'Unable to load roles.');
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setIsLoadingRoles(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const query = search.trim();
    if (!query) {
      setMembers([]);
      setSelectedMember(null);
      setIsSearching(false);
      return;
    }

    let active = true;
    setIsSearching(true);

    directoryService.loadMembers({ q: query })
      .then((memberResults) => {
        if (!active) {
          return;
        }
        setMembers(memberResults.slice(0, 10));
        setSelectedMember((current) => (current && memberResults.some((member) => member.id === current.id) ? current : null));
        setError(null);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setMembers([]);
        setSelectedMember(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [search]);

  const visibleRoles = useMemo(
    () =>
      roles.filter((role) => {
        const normalized = role.key.toLowerCase();
        return !['super_admin', 'user', 'member', 'community_member', 'trustee', 'admin'].includes(normalized);
      }),
    [roles],
  );

  const selectedRoleLabels = useMemo(
    () => visibleRoles.filter((role) => selectedRoleKeys.has(role.key)).map((role) => role.name),
    [selectedRoleKeys, visibleRoles],
  );

  const handleAssign = async () => {
    if (!selectedMember) {
      setError('Select a user first.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await directoryService.assignMemberRoles(selectedMember.id, {
        userType: selectedType,
        roleKeys: Array.from(selectedRoleKeys),
      });
      navigateBack();
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : 'Unable to save assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormScreenLayout
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
                Assign
              </Button>
            </View>
          </View>
        </View>
      }>
      <View style={{ backgroundColor: '#f8fafc' }}>
        <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[6] }}>
            <View style={{ gap: spacing[2] }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                {t('title')}
              </Text>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                Permissions
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                Search a user first, choose the access type, then assign scoped roles.
              </Text>
            </View>

            <View style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.xl, backgroundColor: colors.primary.subtle, borderWidth: 1, borderColor: colors.primary.borderLight, paddingHorizontal: spacing[4] }}>
                <MaterialIcons name="search" size={20} color={colors.primary.DEFAULT} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search user by name, phone, email or member ID"
                  placeholderTextColor="#94a3b8"
                  style={{ flex: 1, paddingVertical: spacing[4], fontFamily: typography.fontFamily.medium }}
                />
              </View>

              {isSearching ? (
                <View style={{ gap: spacing[3] }}>
                  <AppListSkeleton count={3} renderItem={() => <MemberResultSkeleton />} />
                </View>
              ) : members.length > 0 ? (
                <View style={{ gap: spacing[3] }}>
                  {members.map((member) => (
                    <MemberResultCard
                      key={member.id}
                      member={member}
                      selected={selectedMember?.id === member.id}
                      onPress={() => setSelectedMember(member)}
                    />
                  ))}
                </View>
              ) : search.trim() ? (
                <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4] }}>
                  <Text style={{ color: colors.text.muted }}>No matching users found.</Text>
                </View>
              ) : (
                <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4] }}>
                  <Text style={{ color: colors.text.muted }}>Search to find a user and assign access.</Text>
                </View>
              )}
            </View>

            {selectedMember ? (
              <Card variant="elevated" padding="lg">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <View style={{ width: 56, height: 56, borderRadius: 999, borderWidth: 2, borderColor: colors.primary.borderLight, backgroundColor: '#ebe7e4', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="badge" size={24} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                      {selectedMember.title}
                    </Text>
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold }}>
                      {selectedMember.subtitle}
                    </Text>
                  </View>
                </View>
              </Card>
            ) : null}

            {selectedMember ? (
              <View style={{ gap: spacing[3] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                Access Type
              </Text>
              <View style={{ gap: spacing[3] }}>
                {USER_TYPE_OPTIONS.map((option) => {
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
            ) : null}

            {selectedMember ? (
              <View style={{ gap: spacing[3] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                Assign Roles
              </Text>
                {isLoadingRoles ? (
                  <View style={{ gap: spacing[3] }}>
                    <AppListSkeleton count={3} renderItem={() => <RolePickerSkeleton />} />
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
            ) : null}

            {selectedMember ? (
              <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4], gap: spacing[2] }}>
              <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Assignment Summary
              </Text>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {selectedMember ? selectedMember.title : 'No user selected'}
              </Text>
              <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                Type: {selectedType.toUpperCase()}
              </Text>
              <Text style={{ color: colors.text.muted, fontSize: 12 }}>
                Roles: {selectedRoleLabels.length > 0 ? selectedRoleLabels.join(', ') : 'None'}
              </Text>
              </View>
            ) : null}

            {error ? (
              <Text style={{ color: colors.status.error }}>
                {error}
              </Text>
            ) : null}
        </View>
      </View>
    </FormScreenLayout>
  );
}
