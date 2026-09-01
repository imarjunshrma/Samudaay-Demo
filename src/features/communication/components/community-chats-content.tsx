import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Button, Dialog, InfiniteScrollList, SearchInput, SelectField, Tabs, Text, TextField, type DialogVariant } from '@/src/components';
import { communityChatTabs } from '../constants';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationLabel } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing } from '@/src/theme';
import { chatService, type CommunityChatFeedItem } from '../services/chat-service';
import { ChatListSection } from './chat-list-section';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { audienceTargetOptions, getAudienceTargetOption, type AudienceTargetKey } from '../constants/audience-targets';
import { roleManagementService, type RoleCatalogItem } from '@/src/features/admin/services/role-management-service';

type CommunityChatsContentProps = {
  mode?: 'member' | 'admin';
};

export function CommunityChatsContent({ mode = 'member' }: CommunityChatsContentProps) {
  const router = useRouter();
  const { safePush } = useSafeNavigation();
  const navigateBack = useBackNavigation();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const t = useTranslations('communication.community-chats');
  const { language } = useAppPreferences();
  const isAdminMode = mode === 'admin';
  const chatsRoute = isAdminMode ? '/admin/community-chats' : '/communication/community-chats';
  const [activeTab, setActiveTab] = useState<(typeof communityChatTabs)[number]>(communityChatTabs[0]);
  const [groups, setGroups] = useState<CommunityChatFeedItem[]>([]);
  const [search, setSearch] = useState('');
  const [isInitialLoadingChats, setIsInitialLoadingChats] = useState(true);
  const [isLoadingMoreChats, setIsLoadingMoreChats] = useState(false);
  const [isRefreshingChats, setIsRefreshingChats] = useState(false);
  const [chatPage, setChatPage] = useState(1);
  const [hasNextChatPage, setHasNextChatPage] = useState(false);
  const [chatListError, setChatListError] = useState<string | null>(null);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatAudienceTarget, setNewChatAudienceTarget] = useState<AudienceTargetKey>('member');
  const [newChatCity, setNewChatCity] = useState('');
  const [newChatRoleKey, setNewChatRoleKey] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [newChatStatus, setNewChatStatus] = useState<'ACTIVE' | 'RESTRICTED'>('ACTIVE');
  const [chatModalError, setChatModalError] = useState<string | null>(null);
  const [isSavingChat, setIsSavingChat] = useState(false);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<DirectoryMemberItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ cities: string[]; roles: string[] }>({ cities: [], roles: [] });
  const [roleCatalog, setRoleCatalog] = useState<Map<string, RoleCatalogItem>>(new Map());
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({ visible: false, variant: 'info', title: '' });
  const loadChatPage = useCallback(async ({ page, append = false, refresh = false }: { page: number; append?: boolean; refresh?: boolean }) => {
    if (append) {
      setIsLoadingMoreChats(true);
    } else if (refresh) {
      setIsRefreshingChats(true);
    } else {
      setIsInitialLoadingChats(true);
    }

    try {
      const result = await chatService.loadChatsPage({
        context: 'communication',
        page,
        limit: 20,
        search,
      });
      setGroups((current) => {
        if (!append) {
          return result.items;
        }

        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !existingIds.has(item.id))];
      });
      setChatPage(result.pagination?.page ?? page);
      setHasNextChatPage(Boolean(result.pagination?.hasNextPage));
      setChatListError(null);
    } catch (error) {
      setChatListError(error instanceof Error ? error.message : 'Unable to load chats.');
    } finally {
      setIsInitialLoadingChats(false);
      setIsLoadingMoreChats(false);
      setIsRefreshingChats(false);
    }
  }, [search]);

  useEffect(() => {
    void loadChatPage({ page: 1 });
  }, [loadChatPage]);

  useEffect(() => {
    if (!isAdminMode) {
      return;
    }

    let active = true;
    void Promise.all([
      directoryService.loadFilterOptions({ userType: 'all' }),
      directoryService.loadMembersPage({ userType: 'all', page: 1, limit: 20 }),
      roleManagementService.loadCatalog().catch(() => null),
    ]).then(([nextFilters, nextMembersResult, catalog]) => {
      if (!active) {
        return;
      }

      setFilterOptions({
        cities: nextFilters.cities ?? [],
        roles: nextFilters.roles ?? [],
      });
      setAvailableMembers(nextMembersResult.items);
      setRoleCatalog(new Map((catalog?.roles ?? []).map((role) => [role.key, role])));
    }).catch(() => {
      if (!active) {
        return;
      }

      setFilterOptions({ cities: [], roles: [] });
      setAvailableMembers([]);
      setRoleCatalog(new Map());
    });

    return () => {
      active = false;
    };
  }, [isAdminMode]);

  useEffect(() => {
    if (!isAdminMode) {
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      void directoryService
        .loadMembersPage({
          userType: 'all',
          q: memberSearch.trim() || undefined,
          page: 1,
          limit: 20,
        })
        .then((result) => {
          if (active) {
            setAvailableMembers(result.items);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isAdminMode, memberSearch]);

  useFocusEffect(
    useCallback(() => {
      setSelectedChatId(null);
    }, []),
  );

  const visibleGroups = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return groups.filter((group) => {
      const matchesTab =
        activeTab === 'Archived'
          ? group.status === 'DISABLED'
          : activeTab === 'Groups'
            ? group.type === 'GROUP' || group.type === 'COMMUNITY'
            : activeTab === 'Events'
              ? group.type === 'EVENT'
              : activeTab === 'Unread'
                ? Boolean(group.unread)
                : group.status !== 'DISABLED';

      const matchesSearch =
        !searchTerm ||
        `${group.title} ${group.preview} ${group.time}`.toLowerCase().includes(searchTerm);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, groups, search]);

  const visibleMemberOptions = useMemo(() => {
    return availableMembers.slice(0, 20);
  }, [availableMembers]);

  const cityOptions = useMemo(
    () => [
      { label: t('modal.fields.city.all'), value: '' },
      ...filterOptions.cities.map((city) => ({
        label: translateLocationLabel(city, language),
        value: city,
      })),
    ],
    [filterOptions.cities, language, t],
  );

  const roleOptions = useMemo(
    () => filterOptions.roles.map((role) => ({
      label: roleCatalog.get(role)?.name || role
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      value: role,
    })),
    [filterOptions.roles, roleCatalog],
  );
  const audienceOptions = useMemo(
    () => audienceTargetOptions.map((option) => ({ label: option.label, value: option.key })),
    [],
  );

  const selectedMembersLabel = useMemo(() => {
    if (!selectedMemberIds.length) {
      return 'No members selected';
    }

    return `${selectedMemberIds.length} member${selectedMemberIds.length === 1 ? '' : 's'} selected`;
  }, [selectedMemberIds]);
  const chatModalMaxHeight = Math.min(640, Math.max(320, windowHeight - insets.top - insets.bottom - spacing[6]));

  const resetChatForm = () => {
    setEditingChatId(null);
    setNewChatTitle('');
    setNewChatAudienceTarget('member');
    setNewChatCity('');
    setNewChatRoleKey('');
    setMemberSearch('');
    setSelectedMemberIds([]);
    setNewChatStatus('ACTIVE');
    setChatModalError(null);
  };

  const closeChatModal = () => {
    setShowCreateChat(false);
    setSelectedChatId(null);
    resetChatForm();
  };

  const openCreateChat = () => {
    resetChatForm();
    setShowCreateChat(true);
  };

  const openManageChat = (group: CommunityChatFeedItem) => {
    setSelectedChatId(group.id);
    setEditingChatId(group.id);
    setNewChatTitle(group.title);
    setNewChatAudienceTarget('custom');
    setNewChatCity('');
    setNewChatRoleKey('');
    setMemberSearch('');
    setSelectedMemberIds(group.memberIds ?? []);
    setNewChatStatus(group.status === 'RESTRICTED' ? 'RESTRICTED' : 'ACTIVE');
    setShowCreateChat(true);
  };

  const toggleSelectedMember = (memberId: string) => {
    setChatModalError(null);
    setSelectedMemberIds((current) => (
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    ));
  };

  const handleArchiveChat = async (group: CommunityChatFeedItem) => {
    if (!group.canManage || group.status === 'DISABLED') {
      return;
    }

    try {
      const updated = await chatService.archiveChat(group.id);
      setGroups((current) => current.map((item) => (item.id === group.id ? updated : item)));
      setDialog({
        visible: true,
        variant: 'success',
        title: 'Group archived',
        description: 'The chat was moved to Archived.',
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to archive chat',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleSaveChat = async () => {
    const title = newChatTitle.trim();
    if (!title) {
      setChatModalError('Enter a title for this group chat.');
      return;
    }
    if (newChatAudienceTarget === 'custom' && !newChatRoleKey.trim() && !newChatCity.trim() && selectedMemberIds.length === 0) {
      setChatModalError('Select a custom role, city, or manual members before creating this chat.');
      return;
    }

    try {
      setChatModalError(null);
      setIsSavingChat(true);
      const selectedAudience = getAudienceTargetOption(newChatAudienceTarget);
      const selectedRoleKeys = selectedAudience.custom
        ? (newChatRoleKey.trim() ? [newChatRoleKey.trim()] : [])
        : (selectedAudience.roles ?? []);
      const payload = {
        title,
        type: 'GROUP',
        status: newChatStatus,
        allUsers: selectedAudience.allUsers,
        cities: newChatCity.trim() ? [newChatCity.trim()] : undefined,
        roleKeys: selectedRoleKeys.length ? selectedRoleKeys : undefined,
        audienceSegments: selectedAudience.audienceSegments,
        memberIds: selectedMemberIds.length ? selectedMemberIds : undefined,
      };
      const saved = editingChatId
        ? await chatService.updateChat(editingChatId, payload)
        : await chatService.createChat(payload);
      setGroups((current) => (
        editingChatId
          ? current.map((item) => (item.id === editingChatId ? saved : item))
          : [saved, ...current]
      ));
      closeChatModal();
    } catch (error) {
      setChatModalError(error instanceof Error ? error.message : 'Unable to create chat. Please try again.');
    } finally {
      setIsSavingChat(false);
    }
  };

  const handleArchiveChatFromModal = async () => {
    if (!editingChatId) {
      return;
    }

    const target = groups.find((group) => group.id === editingChatId);
    if (!target) {
      return;
    }

    closeChatModal();
    await handleArchiveChat(target);
  };

  const handleDeleteChatFromModal = async () => {
    if (!editingChatId) {
      return;
    }

    try {
      setIsDeletingChat(true);
      await chatService.deleteChat(editingChatId);
      setGroups((current) => current.filter((group) => group.id !== editingChatId));
      closeChatModal();
      setDialog({
        visible: true,
        variant: 'success',
        title: 'Group deleted',
        description: 'The group chat was removed successfully.',
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to delete group',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsDeletingChat(false);
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={() => navigateBack(isAdminMode ? '/admin/community' : '/member/community')}
          onRightPress={() => safePush(isAdminMode ? '/admin/notification-inbox' : '/member/notifications')}
        />
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[3], gap: spacing[3], paddingBottom: spacing[3] }}>
          <SearchInput value={search} onChangeText={setSearch} placeholder={t('search.placeholder')} />
          <Tabs
            variant="underline"
            scrollable
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as (typeof communityChatTabs)[number])}
            items={communityChatTabs.map((tab) => ({ key: tab, label: t(`tabs.${tab.toLowerCase()}` as never) }))}
          />
        </View>
        <InfiniteScrollList
          data={visibleGroups}
          keyExtractor={(item) => item.id}
          loadingInitial={isInitialLoadingChats}
          loadingMore={isLoadingMoreChats}
          refreshing={isRefreshingChats}
          hasNextPage={hasNextChatPage}
          errorMessage={chatListError}
          onRetry={() => {
            void loadChatPage({ page: 1 });
          }}
          onRefresh={() => {
            void loadChatPage({ page: 1, refresh: true });
          }}
          onLoadMore={() => {
            if (isLoadingMoreChats || !hasNextChatPage) {
              return;
            }
            void loadChatPage({ page: chatPage + 1, append: true });
          }}
          contentContainerStyle={{ paddingTop: spacing[2], paddingBottom: 24 }}
          emptyTitle="No chats found"
          emptyDescription="Create a group or adjust your search."
          renderItem={({ item }) => (
            <ChatListSection
              groups={[item]}
              selectedGroupId={isAdminMode ? selectedChatId : null}
              onPressGroup={(group) => {
                if (isAdminMode) {
                  setSelectedChatId(group.id);
                  requestAnimationFrame(() => {
                    router.push({
                      pathname: '/events/event-live-chat',
                      params: {
                        chatId: group.id,
                        chatTitle: group.title,
                        chatContext: group.type === 'EVENT' ? 'event' : 'community',
                        returnTo: chatsRoute,
                      },
                    } as never);
                  });
                  return;
                }

                router.push({
                  pathname: '/events/event-live-chat',
                  params: {
                    chatId: group.id,
                    chatTitle: group.title,
                    chatContext: group.type === 'EVENT' ? 'event' : 'community',
                    returnTo: chatsRoute,
                  },
                } as never);
              }}
              onLongPressGroup={(group) => {
                if (!group.canManage || group.status === 'DISABLED') {
                  return;
                }

                openManageChat(group as CommunityChatFeedItem);
              }}
            />
          )}
        />
        {isAdminMode ? (
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={openCreateChat} style={{ position: 'absolute', right: spacing[4], bottom: 24 + insets.bottom, width: 56, height: 56, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', zIndex: 30, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8 }}>
            <MaterialIcons name="group-add" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
        ) : null}
        <Modal visible={showCreateChat} transparent animationType="fade" onRequestClose={closeChatModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.35)',
              justifyContent: 'flex-end',
              paddingTop: insets.top + spacing[3],
            }}>
            <View
              style={{
                height: chatModalMaxHeight,
                backgroundColor: colors.background.surface,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
                overflow: 'hidden',
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing[4], paddingBottom: spacing[3] }}>
                <Text variant="h4">{editingChatId ? t('modal.title.edit') : t('modal.title.create')}</Text>
                <TouchableOpacity accessibilityRole="button" onPress={closeChatModal}>
                  <MaterialIcons name="close" size={22} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <KeyboardAwareScrollView
                bottomOffset={insets.bottom}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  gap: spacing[4],
                  paddingHorizontal: spacing[4],
                  paddingBottom: spacing[4],
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator>
                <TextField
                  label={t('modal.fields.title')}
                  placeholder={t('modal.fields.titlePlaceholder')}
                  value={newChatTitle}
                  onChangeText={(value) => {
                    setChatModalError(null);
                    setNewChatTitle(value);
                  }}
                  variant="registration"
                />
                <View style={{ gap: spacing[3] }}>
                  <Text variant="caption" color={colors.text.secondary} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                    Audience
                  </Text>
                  <SelectField
                    label="Send To"
                    placeholder="Select audience"
                    value={newChatAudienceTarget}
                    onSelect={(value) => {
                      const nextValue = value as AudienceTargetKey;
                      setChatModalError(null);
                      setNewChatAudienceTarget(nextValue);
                      if (nextValue !== 'custom') {
                        setNewChatRoleKey('');
                      }
                    }}
                    options={audienceOptions}
                    variant="registration"
                  />
                  {newChatAudienceTarget === 'custom' ? (
                    <SelectField
                      label={t('modal.fields.role.label')}
                      placeholder={t('modal.fields.role.placeholder')}
                      value={newChatRoleKey}
                      onSelect={(value) => {
                        setChatModalError(null);
                        setNewChatRoleKey(value);
                      }}
                      options={roleOptions}
                      variant="registration"
                    />
                  ) : null}
                </View>
                <View style={{ gap: spacing[3] }}>
                  <Text variant="caption" color={colors.text.secondary} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                    Optional Filters
                  </Text>
                  <SelectField
                    label={t('modal.fields.city.label')}
                    placeholder={t('modal.fields.city.placeholder')}
                    value={newChatCity}
                    onSelect={(value) => {
                      setChatModalError(null);
                      setNewChatCity(value);
                    }}
                    options={cityOptions}
                    variant="registration"
                  />
                </View>
                <View style={{ gap: spacing[3] }}>
                  <Text variant="caption" color={colors.text.secondary} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                    Message Permission
                  </Text>
                  <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                    {[
                      { key: 'ACTIVE' as const, label: 'Everyone can message' },
                      { key: 'RESTRICTED' as const, label: 'Only admin can message' },
                    ].map((item) => {
                      const selected = newChatStatus === item.key;
                      return (
                        <TouchableOpacity
                          key={item.key}
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => setNewChatStatus(item.key)}
                          style={{
                            flex: 1,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: selected ? colors.primary.DEFAULT : colors.border.DEFAULT,
                            backgroundColor: selected ? colors.primary.muted : colors.background.DEFAULT,
                            padding: spacing[3],
                            alignItems: 'center',
                            minHeight: 58,
                            justifyContent: 'center',
                          }}>
                          <Text variant="caption" color={selected ? colors.primary.DEFAULT : colors.text.secondary} style={{ textAlign: 'center' }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={{ gap: spacing[2] }}>
                  <Text variant="caption" color={colors.text.secondary} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                    Manual Members
                  </Text>
                  <SearchInput
                    value={memberSearch}
                    onChangeText={(value) => {
                      setChatModalError(null);
                      setMemberSearch(value);
                    }}
                    placeholder={t('modal.searchMembers')}
                  />
                  <Text variant="caption" color={colors.text.secondary}>
                    {selectedMembersLabel}
                  </Text>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
                    <View style={{ gap: spacing[2] }}>
                      {visibleMemberOptions.map((member) => {
                        const selected = selectedMemberIds.includes(member.id);
                        return (
                          <Pressable
                            key={member.id}
                            accessibilityRole="button"
                            onPress={() => toggleSelectedMember(member.id)}
                            style={{
                              borderWidth: 1,
                              borderColor: selected ? colors.primary.DEFAULT : colors.border.DEFAULT,
                              borderRadius: radius.lg,
                              padding: spacing[3],
                              backgroundColor: selected ? colors.primary.muted : colors.background.DEFAULT,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: spacing[3],
                            }}>
                            <View style={{ flex: 1 }}>
                              <Text variant="body">{member.title}</Text>
                              <Text variant="caption" color={colors.text.secondary}>
                                {[member.subtitle, translateLocationLabel(member.city || '', language)].filter(Boolean).join(' • ') || 'Community member'}
                              </Text>
                            </View>
                            <MaterialIcons
                              name={selected ? 'check-circle' : 'radio-button-unchecked'}
                              size={20}
                              color={selected ? colors.primary.DEFAULT : colors.text.secondary}
                            />
                          </Pressable>
                        );
                      })}
                      {!visibleMemberOptions.length ? (
                        <View style={{ borderWidth: 1, borderColor: colors.border.DEFAULT, borderRadius: radius.lg, padding: spacing[3] }}>
                          <Text variant="caption" color={colors.text.secondary}>
                            No members found for this search.
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </ScrollView>
                </View>
              </KeyboardAwareScrollView>
              <View
                style={{
                  gap: spacing[3],
                  padding: spacing[4],
                  paddingTop: spacing[3],
                  paddingBottom: spacing[4] + insets.bottom,
                  borderTopWidth: 1,
                  borderTopColor: colors.border.light,
                  backgroundColor: colors.background.surface,
                }}>
                {chatModalError ? (
                  <View style={{ borderRadius: radius.lg, backgroundColor: colors.status.errorLight, padding: spacing[3] }}>
                    <Text variant="caption" color={colors.status.error}>
                      {chatModalError}
                    </Text>
                  </View>
                ) : null}
                <Button fullWidth loading={isSavingChat} disabled={isSavingChat || isDeletingChat} onPress={() => void handleSaveChat()}>
                  {editingChatId ? 'Save Chat' : 'Create Chat'}
                </Button>
                {editingChatId ? (
                  <>
                    <Button fullWidth variant="secondary" disabled={isSavingChat || isDeletingChat} onPress={() => void handleArchiveChatFromModal()}>
                      Archive Chat
                    </Button>
                    <Button fullWidth variant="ghost" disabled={isSavingChat || isDeletingChat} loading={isDeletingChat} onPress={() => void handleDeleteChatFromModal()}>
                      Delete Group
                    </Button>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => setDialog((current) => ({ ...current, visible: false }))}
          onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </AppSafeAreaView>
  );
}
