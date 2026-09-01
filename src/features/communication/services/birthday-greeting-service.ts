import { useEffect, useSyncExternalStore } from 'react';

import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { birthdayGreetingLogs, type BirthdayGreetingLog } from '../constants';
import { getBirthdayGreetingSearchText, sortBirthdayGreetingLogs, type BirthdayGreetingSortKey } from './birthday-greeting-log-utils';

type GreetingListener = () => void;
type GreetingInput = Omit<BirthdayGreetingLog, 'sentAt' | 'status'> & {
  status: BirthdayGreetingLog['status'];
  templateId?: string;
  message?: string;
  recipientIds?: string[];
  scheduledAt?: string;
};
export type BirthdayGreetingListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Delivered' | 'Scheduled' | 'all';
  channel?: 'In-app' | 'Scheduled' | 'all';
  sort?: BirthdayGreetingSortKey;
};
export type BirthdayGreetingListResult = {
  items: BirthdayGreetingLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

let greetingLogs: BirthdayGreetingLog[] = birthdayGreetingLogs.map((log) => ({ ...log }));
const listeners = new Set<GreetingListener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: GreetingListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return greetingLogs;
}

function formatSentAt(status: BirthdayGreetingLog['status'], scheduledAt?: string) {
  if (status === 'Scheduled') {
    if (scheduledAt) {
      const parsedDate = new Date(scheduledAt);
      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }
    }

    return 'Tomorrow, 8:00 AM';
  }

  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function applyLocalQuery(logs: BirthdayGreetingLog[], query: BirthdayGreetingListQuery = {}): BirthdayGreetingListResult {
  const page = Number.isFinite(query.page) && (query.page ?? 0) > 0 ? Number(query.page) : 1;
  const limit = Number.isFinite(query.limit) && (query.limit ?? 0) > 0 ? Number(query.limit) : 20;
  const search = query.search?.trim().toLowerCase() ?? '';
  const status = query.status && query.status !== 'all' ? query.status : '';
  const channel = query.channel && query.channel !== 'all' ? query.channel : '';
  const filtered = logs.filter((log) => {
    const searchMatches = !search || getBirthdayGreetingSearchText(log).includes(search);
    const statusMatches = !status || log.status === status;
    const channelMatches = !channel || log.channel === channel;
    return searchMatches && statusMatches && channelMatches;
  });
  const sorted = sortBirthdayGreetingLogs(filtered, query.sort ?? 'latest');
  const offset = (page - 1) * limit;
  const items = sorted.slice(offset, offset + limit);
  return {
    items,
    pagination: {
      total: sorted.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(sorted.length / limit)),
    },
  };
}

export const birthdayGreetingService = {
  list() {
    this.refresh().catch(() => {
      return;
    });
    return greetingLogs;
  },

  async refresh() {
    const firstPage = await this.listPaginated({ page: 1, limit: 50, sort: 'latest' });
    greetingLogs = firstPage.items;
    emitChange();
    return greetingLogs;
  },

  async listPaginated(query: BirthdayGreetingListQuery = {}): Promise<BirthdayGreetingListResult> {
    if (!isBackendApiConfigured()) {
      return applyLocalQuery(greetingLogs, query);
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return applyLocalQuery(greetingLogs, query);
    }

    const response = await apiClient<{ data: BirthdayGreetingListResult }>(
      apiEndpoints.communityBirthdayGreetings(backendSession.tenantId, {
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: query.status && query.status !== 'all' ? query.status : undefined,
        channel: query.channel && query.channel !== 'all' ? query.channel : undefined,
        sort: query.sort,
      }),
      { token: backendSession.token },
    );

    return response.data;
  },

  async add(input: GreetingInput) {
    let nextLogs: BirthdayGreetingLog[] = [{
      ...input,
      sentAt: formatSentAt(input.status, input.scheduledAt),
    }];

    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession && input.templateId && input.message && input.recipientIds?.length) {
        const response = await apiClient<{ data: BirthdayGreetingLog[] }>(
          apiEndpoints.communityBirthdayGreetings(backendSession.tenantId),
          {
            method: 'POST',
            token: backendSession.token,
            body: JSON.stringify({
              templateId: input.templateId,
              message: input.message,
              recipientIds: input.recipientIds,
              status: input.status,
              scheduledAt: input.scheduledAt,
            }),
          },
        );

        nextLogs = response.data;
      }
    }

    greetingLogs = [...nextLogs, ...greetingLogs];
    emitChange();
    return nextLogs[0];
  },
};

export function useBirthdayGreetingLogs() {
  useEffect(() => {
    birthdayGreetingService.refresh().catch(() => {
      return;
    });
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
