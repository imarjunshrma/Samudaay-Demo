import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, FlatList, Dimensions, Image, Modal, Platform, Pressable, Share, useWindowDimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView as SafeAreaViewNative, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

import { AppHeader, Dialog, SearchInput, SelectionPopup, Text, TextField, type DialogVariant } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { pickDocumentWithGuard } from '@/src/services/device/document-picker-consent';
import { ALLOWED_IMAGE_DOCUMENT_TYPES, isAllowedUploadImageFile, showInvalidUploadFormatAlert } from '@/src/services/files/upload-file-policy';
import { colors, radius, spacing, typography } from '@/src/theme';
import { chatDebugEnabled, chatDebugLog, chatService, type CommunityChatMember, type CommunityChatFeedItem, type CommunityChatMessage } from '@/src/features/communication/services/chat-service';
import { EventChatBubble } from './event-shared-blocks';
import { eventService, type EventRecord } from '../services/event-service';
import { buildEventSharePayload } from '../services/event-share';

function getYoutubeVideoId(url?: string | null) {
  const value = String(url || '').trim();
  if (!value) {
    return null;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/live\/|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/i,
    /[?&]v=([\w-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function getYoutubeEmbedUrl(url?: string | null) {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1` : null;
}

function getYoutubeThumbnailUrl(url?: string | null) {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

function getVisibleChatMessageText(message: CommunityChatMessage) {
  const text = String(message.text || '').trim();
  if (!message.mediaUrl) {
    return text;
  }

  return /^image$/i.test(text) ? '' : text;
}

function buildChatSharePayload({
  chatId,
  title,
  context,
  memberCount,
  status,
}: {
  chatId?: string;
  title: string;
  context?: string;
  memberCount?: number;
  status?: string;
}) {
  const normalizedContext = context === 'matrimony' ? 'matrimony' : context === 'event' ? 'event' : 'community';
  const link = chatId
    ? Linking.createURL('/events/event-live-chat', {
        queryParams: {
          chatId,
          chatTitle: title,
          chatContext: normalizedContext,
        },
      })
    : null;
  const statusLine =
    String(status || '').toUpperCase() === 'RESTRICTED'
      ? 'Posting is currently admin-only.'
      : String(status || '').toUpperCase() === 'DISABLED'
        ? 'This chat is currently archived.'
        : null;
  const memberLine = memberCount ? `${memberCount} members` : null;
  const message = [
    title,
    normalizedContext === 'community' ? 'Join this community group chat on Samudaay.' : 'Open this chat on Samudaay.',
    memberLine,
    statusLine,
    link,
  ].filter(Boolean).join('\n');

  return {
    title,
    message,
    url: link ?? undefined,
  };
}

export function EventLiveChatContent() {
  const windowDimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const { session } = useSession();
  const t = useTranslations('events.event-live-chat');
  const params = useLocalSearchParams<{ chatId?: string; chatTitle?: string; chatContext?: string | string[]; eventId?: string | string[] }>();
  const matrimonyProfileIdParam = Array.isArray((params as { profileId?: string | string[] }).profileId)
    ? (params as { profileId?: string | string[] }).profileId?.[0]
    : (params as { profileId?: string | string[] }).profileId;
  const chatIdParam = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
  const chatTitleParam = Array.isArray(params.chatTitle) ? params.chatTitle[0] : params.chatTitle;
  const chatContext = Array.isArray(params.chatContext) ? params.chatContext[0] : params.chatContext;
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const isMatrimonyChat = chatContext === 'matrimony';
  const isEventChat = Boolean(eventId) || chatContext === 'event';
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [isResolvingChat, setIsResolvingChat] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [selectedChat, setSelectedChat] = useState<CommunityChatFeedItem | null>(null);
  const [selectedChatTitle, setSelectedChatTitle] = useState(t('title'));
  const [chatAccessBlocked, setChatAccessBlocked] = useState(false);
  const [messages, setMessages] = useState<CommunityChatMessage[]>([]);
  const chatIsFocused = useIsFocused();
  const [chatAppState, setChatAppState] = useState(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setChatAppState);
    return () => subscription.remove();
  }, []);
  const newestVisibleMessageId = messages[messages.length - 1]?.id;
  useEffect(() => {
    if (!selectedChatId || !newestVisibleMessageId || !chatIsFocused || chatAppState !== 'active') return;
    const timer = setTimeout(() => {
      void chatService.markChatRead(selectedChatId, newestVisibleMessageId).catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedChatId, newestVisibleMessageId, chatIsFocused, chatAppState]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatConnectionLost, setChatConnectionLost] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [olderMessagesCursor, setOlderMessagesCursor] = useState<string | null>(null);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const loadedOlderMessagesRef = useRef(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [draftImage, setDraftImage] = useState<{ uri: string; name?: string; type?: string } | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [pendingDeleteMessageId, setPendingDeleteMessageId] = useState<string | null>(null);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [pendingChatStatus, setPendingChatStatus] = useState<'ACTIVE' | 'RESTRICTED' | 'DISABLED'>('ACTIVE');
  const [memberSearch, setMemberSearch] = useState('');
  const [addingMembers, setAddingMembers] = useState(false);
  const [membersPage, setMembersPage] = useState(1);
  const [membersHasNext, setMembersHasNext] = useState(false);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersRevision, setMembersRevision] = useState(0);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [availableMembers, setAvailableMembers] = useState<CommunityChatMember[]>([]);
  const [isLoadingMemberOptions, setIsLoadingMemberOptions] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({ visible: false, variant: 'info', title: '' });
  const youtubeUrl = String(event?.youtubeUrl || '').trim();
  const youtubeEmbedUrl = getYoutubeEmbedUrl(youtubeUrl);
  const youtubeThumbnailUrl = getYoutubeThumbnailUrl(youtubeUrl);
  const screenHeight = Dimensions.get('screen').height;
  const reservedBottomInset = Platform.OS === 'android' ? Math.max(0, screenHeight - windowDimensions.height - insets.top) : insets.bottom;
  const composerSafeAreaBottom = Platform.OS === 'android' ? Math.max(0, insets.bottom - reservedBottomInset) : 0;
  const effectivePermissions = new Set(
    [...(session?.user.permissions ?? []), ...(session?.user.communityPermissions ?? [])].map((permission) => String(permission || '')),
  );
  const canManageEventChat =
    ['admin', 'trustee'].includes(String(session?.user.role || '').toLowerCase()) ||
    effectivePermissions.has('events.manage') ||
    effectivePermissions.has('event.manage') ||
    effectivePermissions.has('communication.manage') ||
    effectivePermissions.has('chats.manage') ||
    effectivePermissions.has('chat.manage');

  useEffect(() => {
    let active = true;
    const openedAt = Date.now();
    setIsResolvingChat(true);
    if (chatDebugEnabled) {
      chatDebugLog('User opened chat screen', {
        chatId: chatIdParam || null,
        userId: session?.user.id || null,
        chatContext: chatContext || null,
        eventId: eventId || null,
      });
    }

    Promise.all([
      chatService.loadChats({ context: chatContext === 'matrimony' ? 'matrimony' : isEventChat ? 'event' : 'communication' }),
      chatIdParam ? chatService.loadChat(chatIdParam) : Promise.resolve(null),
      eventId ? eventService.loadEvent(eventId) : Promise.resolve(null),
    ]).then(([chats, directChat, eventRecord]) => {
      if (!active) {
        return;
      }

      setChatAccessBlocked(false);
      setEvent(eventRecord);
      const eventChatId = eventRecord ? `event-${eventRecord.id}` : null;
      const firstChat = chatIdParam
        ? directChat || chats.find((chat) => chat.id === chatIdParam)
        : eventChatId
          ? chats.find((chat) => chat.id === eventChatId)
          : chats[0];
      const title = chatTitleParam || eventRecord?.title || firstChat?.title || t('title');
      if (firstChat) {
        setSelectedChat(firstChat);
        setSelectedChatId(firstChat.id);
        setSelectedChatTitle(title);
        chatDebugLog('User opened a chat', {
          chatId: firstChat.id,
          userId: session?.user.id || null,
          chatContext: chatContext || null,
          executionMs: Date.now() - openedAt,
          status: 'success',
        });
      } else {
        setSelectedChat(null);
        setSelectedChatId(undefined);
        setSelectedChatTitle(title);
        setChatAccessBlocked(Boolean(chatIdParam || eventChatId || isEventChat));
        chatDebugLog('User chat open failed', {
          chatId: chatIdParam || eventChatId || null,
          userId: session?.user.id || null,
          chatContext: chatContext || null,
          executionMs: Date.now() - openedAt,
          status: 'failure',
        });
      }
    }).catch(() => {
      if (!active) {
        return;
      }

      setSelectedChat(null);
      setSelectedChatId(undefined);
      setChatAccessBlocked(Boolean(chatIdParam || eventId || isEventChat));
    }).finally(() => {
      if (active) {
        setIsResolvingChat(false);
      }
    });

    return () => {
      active = false;
    };
  }, [chatContext, chatIdParam, chatTitleParam, eventId, isEventChat, session?.user.id, t]);

  const canAccessCurrentEventChat = !isEventChat || Boolean(selectedChatId) || canManageEventChat;
  const showEventStream = isEventChat && youtubeUrl && canAccessCurrentEventChat && !chatAccessBlocked;
  const visibleMembers = useMemo(() => selectedChat?.members ?? [], [selectedChat?.members]);
  const canManageChatMembers = Boolean(selectedChat?.canManageMembers);
  const matrimonyOtherMember = isMatrimonyChat
    ? visibleMembers.find((member) => member.id && member.id !== session?.user.id) ?? null
    : null;
  const matrimonySubtitle = isMatrimonyChat
    ? matrimonyOtherMember?.isOnline
      ? 'Active now'
      : matrimonyOtherMember
        ? 'Inactive'
        : undefined
    : undefined;

  useEffect(() => {
    if (!showMembersModal || !selectedChatId) return;
    let active = true;
    setIsLoadingMemberOptions(true);
    setMembersError(null);
    const timer = setTimeout(() => {
      chatService.loadChatMembersPage(selectedChatId, {
        page: membersPage, q: addingMembers ? memberSearch.trim() : undefined, candidates: addingMembers,
      }).then((result) => {
        if (!active) return;
        setAvailableMembers((current) => membersPage === 1 ? result.items : [
          ...current, ...result.items.filter((item) => !current.some((member) => member.id === item.id)),
        ]);
        setMembersTotal(result.pagination.total);
        setMembersHasNext(result.pagination.hasNextPage);
      }).catch((error) => {
        if (active) setMembersError(error instanceof Error ? error.message : 'Unable to load members.');
      }).finally(() => {
        if (active) setIsLoadingMemberOptions(false);
      });
    }, addingMembers ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [showMembersModal, selectedChatId, addingMembers, memberSearch, membersPage, membersRevision]);

  const resetMemberList = () => {
    setAvailableMembers([]);
    setMembersPage(1);
    setMembersHasNext(false);
    setMembersError(null);
    setMembersTotal(0);
    setIsLoadingMemberOptions(true);
    setMembersRevision((value) => value + 1);
  };

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    if (!selectedChatId) {
      setMessages([]);
      setIsLoadingMessages(false);
      setChatConnectionLost(false);
      loadedOlderMessagesRef.current = false;
      return () => {
        active = false;
      };
    }
    loadedOlderMessagesRef.current = false;
    setIsLoadingMessages(true);
    setChatConnectionLost(false);

    const loadMessages = () => chatService.loadChatMessages(selectedChatId).then((result) => {
      if (active) {
        setMessages((current) => {
          if (!loadedOlderMessagesRef.current) {
            setHasOlderMessages(result.hasMore);
            setOlderMessagesCursor(result.nextCursor);
            return result.messages;
          }

          const existingIds = new Set(current.map((item) => item.id));
          const incoming = result.messages.filter((item) => !existingIds.has(item.id));
          return incoming.length ? [...current, ...incoming] : current;
        });
        setIsLoadingMessages(false);
      }
    }).catch(() => {
      if (active) {
        setIsLoadingMessages(false);
      }
    });
    void loadMessages();
    void chatService.subscribeToChat(selectedChatId, {
      onMessage: (message) => {
        if (active) {
          setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
        }
      },
      onPresence: ({ userId, isOnline, lastSeenAt }) => {
        if (!active) {
          return;
        }

        setSelectedChat((current) => {
          if (!current?.members?.some((member) => member.id === userId)) {
            return current;
          }

          return {
            ...current,
            members: current.members.map((member) => (
              member.id === userId
                ? { ...member, isOnline, lastSeenAt: lastSeenAt || null }
                : member
            )),
          };
        });
      },
      onJoined: () => {
        if (active) {
          setChatConnectionLost(false);
        }
      },
      onError: () => {
        if (active) {
          setChatConnectionLost(true);
        }
      },
      onConnectionChange: (connected) => {
        if (active) {
          setChatConnectionLost(!connected);
        }
      },
    }).then((cleanup) => {
      if (active) {
        unsubscribe = cleanup;
      } else {
        cleanup();
      }
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [selectedChatId]);

  const handleLoadOlderMessages = async () => {
    if (!selectedChatId || !olderMessagesCursor || isLoadingOlderMessages) {
      return;
    }

    setIsLoadingOlderMessages(true);
    try {
      const result = await chatService.loadChatMessages(selectedChatId, { beforeMessageId: olderMessagesCursor });
      loadedOlderMessagesRef.current = true;
      setMessages((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        const older = result.messages.filter((item) => !existingIds.has(item.id));
        return [...older, ...current];
      });
      setHasOlderMessages(result.hasMore);
      setOlderMessagesCursor(result.nextCursor);
    } finally {
      setIsLoadingOlderMessages(false);
    }
  };

  const handlePickImage = async () => {
    const result = await pickDocumentWithGuard({
      copyToCacheDirectory: true,
      multiple: false,
      type: [...ALLOWED_IMAGE_DOCUMENT_TYPES],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    const nextFile = {
      uri: asset.uri,
      name: asset.name || `chat-${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    };

    if (!isAllowedUploadImageFile({ uri: nextFile.uri, name: nextFile.name, mimeType: nextFile.type })) {
      showInvalidUploadFormatAlert();
      return;
    }

    setDraftImage(nextFile);
  };

  const handleSend = async () => {
    const text = draftMessage.trim();
    if ((!text && !draftImage) || !selectedChatId || selectedChat?.canPost === false || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);
    try {
      const sent = draftImage
        ? await chatService.sendChatMessage(selectedChatId, text, draftImage)
        : await chatService.sendSocketChatMessage(selectedChatId, text);
      if (sent) {
        setMessages((current) => (current.some((item) => item.id === sent.id) ? current : [...current, sent]));
        setDraftMessage('');
        setDraftImage(null);
        return;
      }
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Message not sent',
        description: 'Please try again.',
      });
    } catch (sendError) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Message not sent',
        description: sendError instanceof Error ? sendError.message : 'Please try again.',
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleOpenStream = async () => {
    if (!youtubeUrl) {
      return;
    }

    try {
      if (process.env.EXPO_OS === 'web' && typeof window !== 'undefined') {
        window.location.assign(youtubeUrl);
        return;
      }

      await WebBrowser.openBrowserAsync(youtubeEmbedUrl || youtubeUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to open live stream',
        description: error instanceof Error ? error.message : 'The live stream link could not be opened.',
      });
    }
  };

  const handleShare = async () => {
    const payload = event
      ? buildEventSharePayload(event, selectedChatTitle)
      : buildChatSharePayload({
          chatId: selectedChatId,
          title: selectedChatTitle,
          context: chatContext,
          memberCount: selectedChat?.memberCount,
          status: selectedChat?.status,
        });

    try {
      await Share.share(payload);
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Share failed',
        description: error instanceof Error ? error.message : 'Unable to share this chat.',
      });
    }
  };

  const closeMembersModal = () => {
    setAddingMembers(false);
    resetMemberList();
    setShowMembersModal(false);
    setMemberSearch('');
    setAvailableMembers([]);
  };


  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChatId || !selectedChat?.canManage) {
      return;
    }

    try {
      await chatService.deleteChatMessage(selectedChatId, messageId);
      setMessages((current) => current.filter((item) => item.id !== messageId));
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to delete message',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleUpdateChatStatus = async (status: 'ACTIVE' | 'RESTRICTED' | 'DISABLED') => {
    if (!selectedChatId || !selectedChat?.canManage) {
      return;
    }

    try {
      const updated = await chatService.updateChatSettings(selectedChatId, { status });
      setSelectedChat(updated);
      setShowChatSettings(false);
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to update chat',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!selectedChatId || !canManageChatMembers || updatingMemberId) {
      return;
    }

    try {
      setUpdatingMemberId(memberId);
      const updated = await chatService.addChatMembers(selectedChatId, { memberIds: [memberId] });
      setSelectedChat(updated);
      resetMemberList();
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to add member',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedChatId || !canManageChatMembers || updatingMemberId || memberId === session?.user.id) {
      return;
    }

    try {
      setUpdatingMemberId(memberId);
      const updated = await chatService.removeChatMember(selectedChatId, memberId);
      setSelectedChat(updated);
      resetMemberList();
    } catch (error) {
      setDialog({
        visible: true,
        variant: 'error',
        title: 'Unable to remove member',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const headerActions = [
    ...(!isMatrimonyChat
      ? [{
          key: 'members',
          icon: 'group' as const,
          onPress: () => {
            setShowMembersModal(true);
          },
        }]
      : []),
    ...(chatContext === 'matrimony' && matrimonyProfileIdParam
      ? [{
          key: 'profile',
          icon: 'person-search' as const,
          onPress: () => {
            router.push({
              pathname: '/matrimony/profile/[profileId]',
              params: { profileId: matrimonyProfileIdParam },
            } as never);
          },
        }]
      : []),
    ...(!isMatrimonyChat
      ? [{
          key: 'share',
          icon: 'share' as const,
          onPress: () => {
            void handleShare();
          },
        }]
      : []),
    ...(!isMatrimonyChat && selectedChat?.canManage
      ? [{
          key: 'chat-settings',
          icon: 'tune' as const,
          onPress: () => {
            setPendingChatStatus(
              selectedChat?.status === 'RESTRICTED' || selectedChat?.status === 'DISABLED'
                ? selectedChat.status
                : 'ACTIVE',
            );
            setShowChatSettings(true);
          },
        }]
      : []),
  ];

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <AppHeader
          title={selectedChatTitle}
          subtitle={matrimonySubtitle}
          variant="back"
          onLeftPress={navigateBack}
          actions={headerActions}
        />

        {showEventStream ? (
        <View style={{ backgroundColor: '#0f172a', aspectRatio: 16 / 9, position: 'relative' }}>
          <View style={{ flex: 1 }}>
            {youtubeThumbnailUrl ? (
              <Image
                source={{ uri: youtubeThumbnailUrl }}
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.5 }}
                resizeMode="cover"
              />
            ) : null}
            <View style={{ position: 'absolute', top: spacing[4], left: spacing[4], flexDirection: 'row', gap: spacing[2] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.md, backgroundColor: '#dc2626', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: radius.full, backgroundColor: '#ffffff' }} />
                <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                  LIVE
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.md, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                <MaterialIcons name="visibility" size={12} color="#ffffff" />
                <Text variant="caption" color="#ffffff" style={{ fontSize: 10 }}>
                  {messages.length}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="play-arrow" size={32} color="#ffffff" />
              </View>
              <Text variant="body" color="#ffffff" style={{ marginTop: spacing[3], textAlign: 'center', paddingHorizontal: spacing[4], fontFamily: typography.fontFamily.bold }}>
                {event?.title || selectedChatTitle}
              </Text>
              <Text variant="caption" color="#ffffff" style={{ marginTop: spacing[2], textAlign: 'center', paddingHorizontal: spacing[4] }}>
                Streaming link uploaded by admin. Play this event stream.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void handleOpenStream();
                }}
                style={{ marginTop: spacing[3], borderRadius: radius.full, backgroundColor: '#ffffff', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                  Play live stream
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        ) : null}

        <KeyboardAwareScrollView
          bottomOffset={96 + composerSafeAreaBottom}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing[4], gap: spacing[5], paddingBottom: 112 + composerSafeAreaBottom }}>
          {isResolvingChat ? (
            <View style={{ gap: spacing[3] }}>
              <SkeletonBlock width="36%" height={14} radiusSize={radius.full} />
              {Array.from({ length: 4 }, (_, index) => (
                <View key={index} style={{ alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end', maxWidth: '84%', gap: spacing[2] }}>
                  <SkeletonBlock width={index % 2 === 0 ? 40 : '0%'} height={index % 2 === 0 ? 40 : 0} radiusSize={radius.full} />
                  <SkeletonBlock width={index % 2 === 0 ? '78%' : '64%'} height={index % 2 === 0 ? 58 : 46} radiusSize={radius.lg} />
                </View>
              ))}
            </View>
          ) : !selectedChatId ? (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                {t('unavailable.title')}
              </Text>
              <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing[1], lineHeight: 22 }}>
                {isEventChat ? t('unavailable.eventParticipantsOnly') : t('unavailable.default')}
              </Text>
            </View>
          ) : (
            <>
              {hasOlderMessages ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isLoadingOlderMessages}
                  onPress={() => void handleLoadOlderMessages()}
                  style={{ alignSelf: 'center', borderRadius: radius.full, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, paddingHorizontal: spacing[4], paddingVertical: spacing[2], opacity: isLoadingOlderMessages ? 0.6 : 1 }}>
                  {isLoadingOlderMessages ? (
                    <SkeletonBlock width={128} height={14} radiusSize={radius.full} />
                  ) : (
                    <Text variant="caption" color={colors.text.primary}>
                      Load older messages
                    </Text>
                  )}
                </Pressable>
              ) : null}
              {chatConnectionLost ? (
                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.full, backgroundColor: colors.status.warningLight, borderWidth: 1, borderColor: colors.border.muted, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
                  <MaterialIcons name="wifi-off" size={14} color={colors.status.warning} />
                  <Text variant="caption" color={colors.text.secondary}>
                    Live chat connection lost. Reconnecting...
                  </Text>
                </View>
              ) : null}
              {isLoadingMessages && !messages.length ? (
                <View style={{ gap: spacing[3] }}>
                  {Array.from({ length: 4 }, (_, index) => (
                    <View key={index} style={{ alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end', maxWidth: '84%', gap: spacing[2] }}>
                      <SkeletonBlock width={index % 2 === 0 ? 40 : '0%'} height={index % 2 === 0 ? 40 : 0} radiusSize={radius.full} />
                      <SkeletonBlock width={index % 2 === 0 ? '78%' : '64%'} height={index % 2 === 0 ? 58 : 46} radiusSize={radius.lg} />
                    </View>
                  ))}
                </View>
              ) : messages.length ? messages.map((message) => (
            <Pressable
              key={message.id}
              disabled={!selectedChat?.canManage}
              onLongPress={() => {
                if (!selectedChat?.canManage) {
                  return;
                }

                setPendingDeleteMessageId(message.id);
                setDialog({
                  visible: true,
                  variant: 'warning',
                  title: 'Delete this message?',
                  description: 'This will remove the message for everyone in the chat.',
                });
              }}
              style={{ gap: spacing[2] }}>
              <EventChatBubble name={message.name} time={message.time} avatar={message.avatar} message={getVisibleChatMessageText(message)} />
              {message.mediaUrl ? (
                <Image source={{ uri: message.mediaUrl }} style={{ alignSelf: 'flex-start', width: 220, height: 220, borderRadius: radius.lg, backgroundColor: colors.background.muted }} resizeMode="contain" />
              ) : null}
            </Pressable>
              )) : (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
              <Text variant="body" color={colors.text.secondary}>
                No messages yet.
              </Text>
            </View>
              )}
            </>
          )}
        </KeyboardAwareScrollView>

        <KeyboardStickyView>
          <View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.primary.borderLight, backgroundColor: '#ffffff', padding: spacing[4], gap: spacing[3] }}>
              {selectedChat?.status === 'RESTRICTED' && selectedChat.canPost === false ? (
                <Text variant="caption" color={colors.status.warning}>Only admins can send messages in this chat.</Text>
              ) : null}
              {isSendingMessage ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <SkeletonBlock width={20} height={20} radiusSize={radius.full} />
                  <SkeletonBlock width={116} height={12} radiusSize={radius.full} />
                </View>
              ) : null}
              {draftImage ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                  <Image source={{ uri: draftImage.uri }} style={{ width: 54, height: 54, borderRadius: radius.md, backgroundColor: colors.background.muted }} />
                  <Pressable accessibilityRole="button" onPress={() => setDraftImage(null)}>
                    <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                  </Pressable>
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <Pressable
                  accessibilityRole="button"
                  disabled={!selectedChatId || selectedChat?.canPost === false || chatAccessBlocked || isSendingMessage}
                  style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', opacity: !selectedChatId || selectedChat?.canPost === false || chatAccessBlocked || isSendingMessage ? 0.5 : 1 }}
                  onPress={() => void handlePickImage()}>
                  <MaterialIcons name="image" size={20} color={colors.primary.DEFAULT} />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <TextField placeholder={t('placeholder.message')} variant="filled" value={draftMessage} onChangeText={setDraftMessage} disabled={!selectedChatId || selectedChat?.canPost === false || chatAccessBlocked || isSendingMessage} />
                </View>
                <Pressable
                  disabled={!selectedChatId || selectedChat?.canPost === false || chatAccessBlocked || isSendingMessage}
                  style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', opacity: !selectedChatId || selectedChat?.canPost === false || chatAccessBlocked || isSendingMessage ? 0.5 : 1 }}
                  onPress={() => void handleSend()}>
                  {isSendingMessage ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <MaterialIcons name="send" size={18} color="#ffffff" />
                  )}
                </Pressable>
              </View>
            </View>
            {composerSafeAreaBottom ? <View style={{ height: composerSafeAreaBottom, backgroundColor: '#ffffff' }} /> : null}
          </View>
        </KeyboardStickyView>
        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => {
            const messageId = pendingDeleteMessageId;
            setDialog((current) => ({ ...current, visible: false }));
            setPendingDeleteMessageId(null);
            if (messageId) {
              void handleDeleteMessage(messageId);
            }
          }}
          onCancel={() => {
            setPendingDeleteMessageId(null);
            setDialog((current) => ({ ...current, visible: false }));
          }}
        />
        {!isMatrimonyChat ? (
          <SelectionPopup
            visible={showChatSettings}
            title="Chat settings"
            subtitle={isEventChat ? 'Control whether members can post in this event chat.' : 'Control who can send messages in this chat.'}
            options={[
              { key: 'ACTIVE', label: 'Open Chat' },
              { key: 'RESTRICTED', label: 'Admin Only' },
              { key: 'DISABLED', label: 'Disable Chat' },
            ]}
            selectedKey={pendingChatStatus}
            onSelect={(key) => {
              setPendingChatStatus(key === 'RESTRICTED' || key === 'DISABLED' ? key : 'ACTIVE');
            }}
            onClose={() => setShowChatSettings(false)}
            onConfirm={() => {
              void handleUpdateChatStatus(pendingChatStatus);
            }}
            confirmLabel="Save settings"
          />
        ) : null}
        <Modal visible={showMembersModal} transparent animationType="fade" onRequestClose={closeMembersModal}>
          <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.35)', justifyContent: 'center', padding: spacing[4] }}>
            <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3], maxHeight: '70%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                  {isEventChat ? 'Event participants' : 'Group members'}
                </Text>
                <Pressable accessibilityRole="button" onPress={closeMembersModal}>
                  <MaterialIcons name="close" size={22} color={colors.text.secondary} />
                </Pressable>
              </View>
              <Text variant="caption" color={colors.text.secondary}>
                {addingMembers ? 'Add member' : `${membersTotal} ${isEventChat ? 'participants' : 'members'}`}
              </Text>
              {canManageChatMembers ? (
                <Pressable accessibilityRole="button" onPress={() => {
                  setAddingMembers((value) => !value);
                  setMemberSearch('');
                  resetMemberList();
                }} style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center', paddingVertical: spacing[2] }}>
                  <MaterialIcons name={addingMembers ? 'arrow-back' : 'person-add'} size={22} color={colors.primary.DEFAULT} />
                  <Text color={colors.primary.DEFAULT}>{addingMembers ? 'Group members' : 'Add member'}</Text>
                </Pressable>
              ) : null}
              {addingMembers ? (
                <SearchInput value={memberSearch} onChangeText={(value) => {
                  setMemberSearch(value);
                  resetMemberList();
                }} placeholder="Search members to add" />
              ) : null}
              <FlatList
                style={{ flexShrink: 1 }}
                data={availableMembers}
                keyExtractor={(member) => member.id}
                keyboardShouldPersistTaps="handled"
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                  if (membersHasNext && !isLoadingMemberOptions && !membersError) {
                    setIsLoadingMemberOptions(true);
                    setMembersPage((page) => page + 1);
                  }
                }}
                contentContainerStyle={{ gap: spacing[2] }}
                ListEmptyComponent={!isLoadingMemberOptions && !membersError ? <Text>{addingMembers ? 'No members available to add.' : 'No members found.'}</Text> : null}
                ListFooterComponent={isLoadingMemberOptions ? <ActivityIndicator style={{ padding: spacing[3] }} color={colors.primary.DEFAULT} /> : membersError ? (
                  <Pressable onPress={() => setMembersRevision((value) => value + 1)}>
                    <Text color={colors.status.error}>{membersError}</Text>
                    <Text color={colors.primary.DEFAULT}>Retry</Text>
                  </Pressable>
                ) : null}
                renderItem={({ item: member }) => (
                  <View style={{ padding: spacing[3], flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>{member.name}</Text>
                      <Text variant="caption" color={colors.text.secondary}>
                        {[member.memberId ? `ID: ${member.memberId}` : null, member.phone].filter(Boolean).join(' • ')}
                      </Text>
                    </View>
                    {canManageChatMembers && (addingMembers || member.id !== session?.user.id) ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={addingMembers ? 'Add member' : 'Remove member'}
                        disabled={Boolean(updatingMemberId)}
                        onPress={() => void (addingMembers ? handleAddMember(member.id) : handleRemoveMember(member.id))}
                        style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: updatingMemberId ? 0.65 : 1 }}>
                        {updatingMemberId === member.id ? <ActivityIndicator size="small" color={colors.primary.DEFAULT} /> : (
                          <MaterialIcons name={addingMembers ? 'person-add' : 'person-remove'} size={22} color={addingMembers ? colors.primary.DEFAULT : colors.status.error} />
                        )}
                      </Pressable>
                    ) : null}
                  </View>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaViewNative>
  );
}
