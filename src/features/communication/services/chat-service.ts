import { apiClient, type ApiClientInit } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { io, type Socket } from 'socket.io-client';

const CHAT_PRESENCE_EVENT = 'chat:presence';
const CHAT_DEBUG_ENABLED = __DEV__ || String(process.env.EXPO_PUBLIC_DEBUG_CHAT || '').trim().toLowerCase() === 'true';

function createChatRequestId(prefix = 'chat') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function chatDebugLog(event: string, context: Record<string, unknown> = {}) {
  if (!CHAT_DEBUG_ENABLED) {
    return;
  }

  const parts = Object.entries(context)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'object') {
        try {
          return `${key}=${JSON.stringify(value)}`;
        } catch {
          return `${key}=${String(value)}`;
        }
      }
      return `${key}=${String(value)}`;
    });

  console.debug(parts.length ? `[Chat] ${event} | ${parts.join(' | ')}` : `[Chat] ${event}`);
}

type BackendChat = {
  id: string;
  title?: string | null;
  status?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  type?: string | null;
  canPost?: boolean;
  canManage?: boolean;
  members?: {
    user?: {
      id?: string | null;
      name?: string | null;
      phone?: string | null;
      memberId?: string | null;
      isOnline?: boolean | null;
      lastSeenAt?: string | null;
    } | null;
  }[];
  _count?: {
    messages?: number;
  };
  messages?: {
    id?: string | null;
    message?: string | null;
    messageType?: string | null;
    mediaUrl?: string | null;
    mediaMimeType?: string | null;
    createdAt?: string | null;
    senderUser?: {
      id?: string | null;
      name?: string | null;
    } | null;
  }[];
};

export type CommunityChatMember = {
  id: string;
  name: string;
  phone?: string | null;
  memberId?: string | null;
  isOnline?: boolean;
  lastSeenAt?: string | null;
};

type BackendChatMessage = {
  id: string;
  message?: string | null;
  messageType?: string | null;
  mediaUrl?: string | null;
  mediaMimeType?: string | null;
  mediaFileName?: string | null;
  createdAt?: string | null;
  senderUser?: {
    id?: string | null;
    name?: string | null;
  } | null;
};

type BackendChatMessagesResponse = BackendChatMessage[] | {
  messages?: BackendChatMessage[];
  hasMore?: boolean;
  nextCursor?: string | null;
};

export type CommunityChatFeedItem = {
  id: string;
  title: string;
  preview: string;
  time: string;
  image: string;
  unread?: string;
  active?: boolean;
  status?: string;
  type?: string;
  canPost?: boolean;
  canManage?: boolean;
  memberIds?: string[];
  members?: CommunityChatMember[];
  memberCount?: number;
  messageCount?: number;
};

export type CommunityChatMessage = {
  id: string;
  name: string;
  time: string;
  avatar: string;
  text: string;
  type?: string;
  mediaUrl?: string | null;
  mediaMimeType?: string | null;
};

export type CommunityChatMessagesPage = {
  messages: CommunityChatMessage[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type CommunityChatsPage = {
  items: CommunityChatFeedItem[];
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalCount?: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

type ChatSocket = Socket<{
  'chat:message': (payload: { chatId: string; message: BackendChatMessage }) => void;
  'chat:updated': (payload: { chat: BackendChat }) => void;
  'chat:presence': (payload: { userId: string; isOnline: boolean; lastSeenAt?: string | null }) => void;
}, {
  'chat:join': (payload: { chatId: string; requestId?: string }, ack?: (response: { ok: boolean; error?: string }) => void) => void;
  'chat:leave': (payload: { chatId: string; requestId?: string }) => void;
  'chat:message:send': (payload: { chatId: string; message: string; requestId?: string }, ack?: (response: { ok: boolean; message?: BackendChatMessage; error?: string }) => void) => void;
}>;

let chatSocket: ChatSocket | null = null;
let chatSocketTenantId: string | null = null;

function buildAvatarSeed(value: string) {
  const seed = encodeURIComponent(value.trim() || 'community-chat');
  return `https://api.dicebear.com/7.x/initials/png?seed=${seed}`;
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:')) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function formatChatTime(value?: string | null) {
  if (!value) {
    return '';
  }

  try {
    return new Date(value).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function mapChat(chat: BackendChat): CommunityChatFeedItem {
  const memberName = chat.title || chat.members?.[0]?.user?.name || 'Community Chat';
  const latestMessage = chat.messages?.[0];

  return {
    id: chat.id,
    title: memberName,
    preview: latestMessage?.message || 'No messages yet',
    time: formatChatTime(chat.updatedAt || chat.createdAt),
    image: buildAvatarSeed(memberName),
    active: String(chat.status || '').toUpperCase() === 'ACTIVE',
    status: chat.status || undefined,
    type: chat.type || undefined,
    canPost: chat.canPost,
    canManage: chat.canManage,
    memberIds: (chat.members ?? []).map((member) => member.user?.id).filter((value): value is string => Boolean(value)),
    members: (chat.members ?? []).map((member) => ({
      id: String(member.user?.id || ''),
      name: String(member.user?.name || member.user?.phone || 'Community member'),
      phone: member.user?.phone || null,
      memberId: member.user?.memberId || null,
      isOnline: Boolean(member.user?.isOnline),
      lastSeenAt: member.user?.lastSeenAt || null,
    })).filter((member) => Boolean(member.id)),
    memberCount: chat.members?.length ?? 0,
    messageCount: Number(chat._count?.messages || 0),
  };
}

function mapMessage(message: BackendChatMessage): CommunityChatMessage {
  return {
    id: message.id,
    name: message.senderUser?.name || 'Member',
    time: formatChatTime(message.createdAt) || 'Now',
    avatar: buildAvatarSeed(message.senderUser?.name || 'Member'),
    text: message.message || '',
    type: message.messageType || 'TEXT',
    mediaUrl: resolveBackendMediaUrl(message.mediaUrl),
    mediaMimeType: message.mediaMimeType || null,
  };
}

async function getChatSocket() {
  if (!isBackendApiConfigured()) {
    return null;
  }

  const backendSession = await getBackendSessionContext();
  if (!backendSession) {
    return null;
  }

  if (chatSocket && chatSocketTenantId === backendSession.tenantId) {
    return chatSocket;
  }

  chatSocket?.disconnect();
  chatSocketTenantId = backendSession.tenantId;
  const requestId = createChatRequestId('socket-connect');
  chatSocket = io(apiConfig.baseUrl, {
    transports: ['websocket'],
    auth: {
      token: backendSession.token,
      tenantId: backendSession.tenantId,
      requestId,
    },
  }) as ChatSocket;
  chatSocket.on('connect', () => {
    chatDebugLog('Socket connected', {
      socketId: chatSocket?.id || null,
      userId: backendSession.userId,
      tenantId: backendSession.tenantId,
      requestId,
      transport: chatSocket?.io.engine.transport.name || 'unknown',
      status: 'success',
    });
  });
  chatSocket.on('disconnect', (reason) => {
    chatDebugLog('Socket disconnected', {
      socketId: chatSocket?.id || null,
      userId: backendSession.userId,
      tenantId: backendSession.tenantId,
      reason,
      transport: chatSocket?.io.engine.transport.name || 'unknown',
    });
  });
  chatSocket.io.on('reconnect_attempt', (attempt) => {
    chatDebugLog('Socket reconnect attempt', {
      attempt,
      tenantId: backendSession.tenantId,
    });
  });
  chatSocket.io.on('reconnect', (attempt) => {
    chatDebugLog('Socket reconnected', {
      attempt,
      socketId: chatSocket?.id || null,
      tenantId: backendSession.tenantId,
      transport: chatSocket?.io.engine.transport.name || 'unknown',
      status: 'success',
    });
  });
  chatSocket.io.on('error', (error) => {
    chatDebugLog('Socket manager error', {
      tenantId: backendSession.tenantId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      status: 'failure',
    });
  });

  return chatSocket;
}

export const chatService = {
  async loadChats(options: { context?: 'communication' | 'event' | 'matrimony' } = {}) {
    const result = await this.loadChatsPage(options);
    return result.items;
  },

  async loadChatsPage(options: { context?: 'communication' | 'event' | 'matrimony'; page?: number; limit?: number; search?: string } = {}): Promise<CommunityChatsPage> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null };
    }

    try {
      const params = new URLSearchParams();
      if (options.context) params.set('context', options.context);
      if (options.page) params.set('page', String(options.page));
      if (options.limit) params.set('limit', String(options.limit));
      if (options.search?.trim()) params.set('search', options.search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient<{ data: BackendChat[]; pagination?: CommunityChatsPage['pagination'] }>(`${apiEndpoints.communityChats(backendSession.tenantId)}${query}`, {
        token: backendSession.token,
      });

      return {
        items: (response.data ?? []).map(mapChat),
        pagination: response.pagination ?? null,
      };
    } catch {
      return { items: [], pagination: null };
    }
  },

  async loadChat(chatId: string) {
    if (!isBackendApiConfigured() || !chatId) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChatById(backendSession.tenantId, chatId), {
        token: backendSession.token,
      });

      return response.data ? mapChat(response.data) : null;
    } catch {
      return null;
    }
  },

  async loadChatMessages(chatId: string, options: { beforeMessageId?: string | null; limit?: number } = {}): Promise<CommunityChatMessagesPage> {
    if (!isBackendApiConfigured() || !chatId) {
      return { messages: [], hasMore: false, nextCursor: null };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { messages: [], hasMore: false, nextCursor: null };
    }

    const requestId = createChatRequestId('chat-history');
    const startedAt = Date.now();
    chatDebugLog('Initial REST chat load started', {
      chatId,
      userId: backendSession.userId,
      requestId,
      beforeMessageId: options.beforeMessageId || null,
      limit: options.limit || null,
    });
    try {
      const params = new URLSearchParams();
      if (options.beforeMessageId) {
        params.set('beforeMessageId', options.beforeMessageId);
      }
      if (options.limit) {
        params.set('limit', String(options.limit));
      }
      const query = params.toString();
      const response = await apiClient<{ data: BackendChatMessagesResponse }>(
        `${apiEndpoints.communityChatMessages(backendSession.tenantId, chatId)}${query ? `?${query}` : ''}`,
        {
          token: backendSession.token,
          headers: {
            'X-Request-Id': requestId,
          },
        },
      );

      if (Array.isArray(response.data)) {
        chatDebugLog('Initial REST chat load completed', {
          chatId,
          userId: backendSession.userId,
          requestId,
          executionMs: Date.now() - startedAt,
          count: response.data.length,
          hasMore: false,
          status: 'success',
        });
        return {
          messages: response.data.map(mapMessage),
          hasMore: false,
          nextCursor: null,
        };
      }

      chatDebugLog('Initial REST chat load completed', {
        chatId,
        userId: backendSession.userId,
        requestId,
        executionMs: Date.now() - startedAt,
        count: response.data?.messages?.length ?? 0,
        hasMore: Boolean(response.data?.hasMore),
        status: 'success',
      });
      return {
        messages: (response.data?.messages ?? []).map(mapMessage),
        hasMore: Boolean(response.data?.hasMore),
        nextCursor: response.data?.nextCursor || null,
      };
    } catch (error) {
      chatDebugLog('Initial REST chat load failed', {
        chatId,
        userId: backendSession.userId,
        requestId,
        executionMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
        status: 'failure',
      });
      return { messages: [], hasMore: false, nextCursor: null };
    }
  },

  async subscribeToChat(
    chatId: string,
    handlers: {
      onMessage?: (message: CommunityChatMessage) => void;
      onPresence?: (payload: { userId: string; isOnline: boolean; lastSeenAt?: string | null }) => void;
      onError?: (message: string) => void;
      onJoined?: () => void;
    },
  ) {
    const socket = await getChatSocket();
    if (!socket || !chatId) {
      handlers.onError?.('Unable to connect to live chat.');
      return () => {};
    }

    const handleMessage = (payload: { chatId: string; message: BackendChatMessage }) => {
      if (payload.chatId === chatId) {
        chatDebugLog('Message received', {
          chatId,
          messageId: payload.message.id,
          senderUserId: payload.message.senderUser?.id || null,
          socketId: socket.id || null,
          transport: socket.io.engine.transport.name || 'unknown',
        });
        handlers.onMessage?.(mapMessage(payload.message));
      }
    };
    const handlePresence = (payload: { userId: string; isOnline: boolean; lastSeenAt?: string | null }) => {
      handlers.onPresence?.(payload);
    };

    socket.on('chat:message', handleMessage);
    socket.on(CHAT_PRESENCE_EVENT, handlePresence);
    const requestId = createChatRequestId('chat-join');
    const startedAt = Date.now();
    socket.emit('chat:join', { chatId, requestId }, (response) => {
      if (!response?.ok) {
        chatDebugLog('Socket join failed', {
          chatId,
          requestId,
          socketId: socket.id || null,
          executionMs: Date.now() - startedAt,
          error: response?.error || 'Unable to join chat.',
          status: 'failure',
        });
        handlers.onError?.(response?.error || 'Unable to join chat.');
        return;
      }
      chatDebugLog('Socket joined room', {
        chatId,
        requestId,
        socketId: socket.id || null,
        executionMs: Date.now() - startedAt,
        transport: socket.io.engine.transport.name || 'unknown',
        status: 'success',
      });
      handlers.onJoined?.();
    });

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off(CHAT_PRESENCE_EVENT, handlePresence);
      socket.emit('chat:leave', { chatId, requestId: createChatRequestId('chat-leave') });
    };
  },

  async createChat(payload: { title: string; status?: string; type?: string; memberIds?: string[]; cities?: string[]; roleKeys?: string[]; audienceSegments?: string[]; allUsers?: boolean }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChats(backendSession.tenantId), {
      method: 'POST',
      token: backendSession.token,
      body: JSON.stringify(payload),
    });

    return mapChat(response.data);
  },

  async updateChat(chatId: string, payload: { title?: string; status?: string; memberIds?: string[]; cities?: string[]; roleKeys?: string[]; audienceSegments?: string[]; allUsers?: boolean }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChatById(backendSession.tenantId, chatId), {
      method: 'PATCH',
      token: backendSession.token,
      body: JSON.stringify(payload),
    });

    return mapChat(response.data);
  },

  async updateChatSettings(chatId: string, payload: { title?: string; status?: string }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChatSettings(backendSession.tenantId, chatId), {
      method: 'PATCH',
      token: backendSession.token,
      body: JSON.stringify(payload),
    });

    return mapChat(response.data);
  },

  async archiveChat(chatId: string) {
    return this.updateChatSettings(chatId, { status: 'DISABLED' });
  },

  async deleteChat(chatId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    await apiClient<{ data?: { success?: boolean } }>(apiEndpoints.communityChatById(backendSession.tenantId, chatId), {
      method: 'DELETE',
      token: backendSession.token,
    });

    return true;
  },

  async addChatMembers(chatId: string, payload: { memberIds?: string[]; cities?: string[]; roleKeys?: string[]; audienceSegments?: string[]; allUsers?: boolean }) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChatMembers(backendSession.tenantId, chatId), {
      method: 'POST',
      token: backendSession.token,
      body: JSON.stringify(payload),
    });

    return mapChat(response.data);
  },

  async removeChatMember(chatId: string, memberId: string) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: BackendChat }>(apiEndpoints.communityChatMemberById(backendSession.tenantId, chatId, memberId), {
      method: 'DELETE',
      token: backendSession.token,
    });

    return mapChat(response.data);
  },

  async sendChatMessage(chatId: string, message: string, file?: { uri: string; name?: string; type?: string }) {
    if (!isBackendApiConfigured() || !chatId) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const requestId = createChatRequestId('chat-upload');
    const startedAt = Date.now();
    try {
      const init: ApiClientInit = {
        method: 'POST',
        token: backendSession.token,
        headers: {
          'X-Request-Id': requestId,
        },
      };
      if (file) {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('file', {
          uri: file.uri,
          name: file.name || `chat-${chatId}.jpg`,
          type: file.type || 'image/jpeg',
        } as never);
        init.body = formData;
      } else {
        init.body = JSON.stringify({ message });
      }

      const response = await apiClient<{ data: BackendChatMessage }>(
        file ? apiEndpoints.communityChatMedia(backendSession.tenantId, chatId) : apiEndpoints.communityChatMessages(backendSession.tenantId, chatId),
        init,
      );

      const created = response.data;
      if (!created) {
        return null;
      }

      chatDebugLog('Message sent via REST', {
        chatId,
        requestId,
        userId: backendSession.userId,
        messageId: created.id,
        executionMs: Date.now() - startedAt,
        hasFile: Boolean(file),
        status: 'success',
      });
      return mapMessage(created);
    } catch (error) {
      chatDebugLog('Message send via REST failed', {
        chatId,
        requestId,
        userId: backendSession.userId,
        executionMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
        status: 'failure',
      });
      throw error instanceof Error ? error : new Error('Unable to send chat message.');
    }
  },

  async sendSocketChatMessage(chatId: string, message: string) {
    const socket = await getChatSocket();
    if (!chatId) {
      return null;
    }

    if (!socket) {
      return this.sendChatMessage(chatId, message);
    }

    return new Promise<CommunityChatMessage | null>((resolve, reject) => {
      let settled = false;
      const requestId = createChatRequestId('chat-send');
      const startedAt = Date.now();
      const timeout = setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        chatDebugLog('Socket acknowledgment timed out', {
          chatId,
          requestId,
          socketId: socket.id || null,
          ackTimeMs: Date.now() - startedAt,
          status: 'failure',
        });
        void this.sendChatMessage(chatId, message)
          .then(resolve)
          .catch(reject);
      }, 4000);

      socket.emit('chat:message:send', { chatId, message, requestId }, (response) => {
        if (settled) {
          return;
        }

        clearTimeout(timeout);

        if (!response?.ok || !response.message) {
          settled = true;
          chatDebugLog('Socket message send failed', {
            chatId,
            requestId,
            socketId: socket.id || null,
            ackTimeMs: Date.now() - startedAt,
            error: response?.error || 'Unable to send message.',
            status: 'failure',
          });
          void this.sendChatMessage(chatId, message)
            .then(resolve)
            .catch((error) => {
              if (response?.error) {
                reject(new Error(response.error));
                return;
              }
              reject(error);
            });
          return;
        }

        settled = true;
        chatDebugLog('Socket acknowledgment received', {
          chatId,
          requestId,
          socketId: socket.id || null,
          messageId: response.message.id,
          ackTimeMs: Date.now() - startedAt,
          transport: socket.io.engine.transport.name || 'unknown',
          status: 'success',
        });
        resolve(mapMessage(response.message));
      });
    });
  },

  async deleteChatMessage(chatId: string, messageId: string) {
    if (!isBackendApiConfigured() || !chatId || !messageId) {
      return false;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return false;
    }

    await apiClient<{ data: { deleted: boolean } }>(
      apiEndpoints.communityChatMessageById(backendSession.tenantId, chatId, messageId),
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );

    return true;
  },
};

export { CHAT_DEBUG_ENABLED as chatDebugEnabled, chatDebugLog };
