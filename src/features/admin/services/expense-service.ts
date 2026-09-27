import { apiClient } from '@/src/services/api/client';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { getActiveTenantRequestHeaders } from '@/src/core/config/community';
import { withAuthHeaders } from '@/src/services/api/interceptors';
import { downloadAndDeliverPdf } from '@/src/services/files/pdf-file';

export type ExpenseItem = {
  id: string;
  title: string;
  amount: string;
  category: string;
  description?: string | null;
  eventLink?: string | null;
  paymentMode?: 'cash' | 'bank' | 'cheque' | null;
  attachmentFileUrl?: string | null;
  attachmentFileName?: string | null;
  attachmentMimeType?: string | null;
  attachmentFileSizeBytes?: number | null;
  status: string;
  expenseDate?: string | null;
  createdAt: string;
  receiptNo?: string | null;
  receiptFileUrl?: string | null;
  receiptGeneratedAt?: string | null;
  approvedAt?: string | null;
  reviewRemarks?: string | null;
  creator?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
  approver?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
  reviews?: {
    id: string;
    status: string;
    remarks?: string | null;
    reviewedAt?: string | null;
    reviewer?: {
      id: string;
      name?: string | null;
      email?: string | null;
    } | null;
  }[];
};

export type ExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID';

export type ExpenseSummary = {
  totalCount: number;
  totalAmount: string;
  paidCount: number;
  pendingCount: number;
  rejectedCount: number;
  draftCount: number;
};

export type ExpenseFilterKey = 'all' | 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid' | 'marketing' | 'catering' | 'venue';

export type ExpenseListResponse = {
  items: ExpenseItem[];
  summary: ExpenseSummary;
  pagination: {
    offset: number;
    limit: number;
    nextOffset: number;
    hasNextPage: boolean;
  };
};

export type CreateExpensePayload = {
  title: string;
  amount: string;
  category: string;
  expenseDate?: string | null;
  eventLink?: string | null;
  paymentMode?: 'cash' | 'bank' | 'cheque';
  description?: string;
  proofFile?: {
    uri: string;
    name: string;
    mimeType?: string;
  } | null;
  clearProofFile?: boolean;
  submitForApproval?: boolean;
  saveAsDraft?: boolean;
};

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  if (
    /^https?:\/\//i.test(fileUrl) ||
    fileUrl.startsWith('file:') ||
    fileUrl.startsWith('data:') ||
    fileUrl.startsWith('blob:')
  ) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function normalizeExpenseItem(expense: ExpenseItem): ExpenseItem {
  return {
    ...expense,
    attachmentFileUrl: resolveBackendMediaUrl(expense.attachmentFileUrl),
    receiptFileUrl: resolveBackendMediaUrl(expense.receiptFileUrl),
  };
}

async function downloadPdfFromBackend(url: string, fileName: string, token: string) {
  const headers: Record<string, string> = {
    ...getActiveTenantRequestHeaders(),
    ...(withAuthHeaders({}, { token }) as Record<string, string>),
    Accept: 'application/pdf',
  };

  return downloadAndDeliverPdf({
    url: `${apiConfig.baseUrl}${url}`,
    fileName,
    headers,
  });
}

export const expenseService = {
  async loadExpenses(
    offset = 0,
    limit = 20,
    filterKey: ExpenseFilterKey = 'all',
    options?: { mine?: boolean; excludeMine?: boolean; month?: string; year?: string; sort?: 'latest' | 'oldest' },
  ): Promise<ExpenseListResponse | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const searchParams = new URLSearchParams();
      searchParams.set('offset', String(offset));
      searchParams.set('limit', String(limit));
      if (options?.month) searchParams.set('month', options.month);
      if (options?.year) searchParams.set('year', options.year);
      if (options?.sort) searchParams.set('sort', options.sort);
      if (options?.mine) {
        searchParams.set('mine', 'true');
      }
      if (options?.excludeMine) {
        searchParams.set('excludeMine', 'true');
      }

      if (filterKey === 'paid' || filterKey === 'approved' || filterKey === 'submitted' || filterKey === 'rejected' || filterKey === 'draft') {
        searchParams.set('status', filterKey);
      } else if (filterKey !== 'all') {
        searchParams.set('category', filterKey);
      }

      const response = await apiClient<{ data: ExpenseListResponse }>(
        `${apiEndpoints.communityExpenses(backendSession.tenantId)}?${searchParams.toString()}`,
        { token: backendSession.token },
      );
      return {
        ...response.data,
        items: (response.data.items ?? []).map(normalizeExpenseItem),
      };
    } catch {
      return null;
    }
  },

  async createExpense(payload: CreateExpensePayload): Promise<ExpenseItem> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const init = payload.proofFile
      ? (() => {
          const formData = new FormData();
          formData.append('title', payload.title);
          formData.append('amount', payload.amount);
          formData.append('category', payload.category);
          formData.append('tenantId', backendSession.tenantId);
          if (payload.expenseDate) formData.append('expenseDate', payload.expenseDate);
          if (payload.eventLink) formData.append('eventLink', payload.eventLink);
          if (payload.paymentMode) formData.append('paymentMode', payload.paymentMode);
          if (payload.description) formData.append('description', payload.description);
          if (payload.clearProofFile !== undefined) formData.append('clearProofFile', String(payload.clearProofFile));
          if (payload.submitForApproval !== undefined) formData.append('submitForApproval', String(payload.submitForApproval));
          if (payload.saveAsDraft !== undefined) formData.append('saveAsDraft', String(payload.saveAsDraft));
          formData.append('receipt', {
            uri: payload.proofFile.uri,
            name: payload.proofFile.name,
            type: payload.proofFile.mimeType || 'image/jpeg',
          } as never);
          return {
            method: 'POST' as const,
            token: backendSession.token,
            body: formData,
          };
        })()
      : {
          method: 'POST' as const,
          token: backendSession.token,
          body: JSON.stringify({
            ...payload,
            tenantId: backendSession.tenantId,
          }),
        };

    const response = await apiClient<{ data: ExpenseItem }>(apiEndpoints.communityExpenses(backendSession.tenantId), init);
    await invalidateTenantApiData(backendSession.tenantId);

    return normalizeExpenseItem(response.data);
  },

  async updateExpense(expenseId: string, payload: CreateExpensePayload): Promise<ExpenseItem> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const init = payload.proofFile
      ? (() => {
          const formData = new FormData();
          formData.append('title', payload.title);
          formData.append('amount', payload.amount);
          formData.append('category', payload.category);
          formData.append('tenantId', backendSession.tenantId);
          if (payload.expenseDate) formData.append('expenseDate', payload.expenseDate);
          if (payload.eventLink) formData.append('eventLink', payload.eventLink);
          if (payload.paymentMode) formData.append('paymentMode', payload.paymentMode);
          if (payload.description) formData.append('description', payload.description);
          if (payload.clearProofFile !== undefined) formData.append('clearProofFile', String(payload.clearProofFile));
          if (payload.submitForApproval !== undefined) formData.append('submitForApproval', String(payload.submitForApproval));
          if (payload.saveAsDraft !== undefined) formData.append('saveAsDraft', String(payload.saveAsDraft));
          formData.append('receipt', {
            uri: payload.proofFile.uri,
            name: payload.proofFile.name,
            type: payload.proofFile.mimeType || 'image/jpeg',
          } as never);
          return {
            method: 'PATCH' as const,
            token: backendSession.token,
            body: formData,
          };
        })()
      : {
          method: 'PATCH' as const,
          token: backendSession.token,
          body: JSON.stringify({
            ...payload,
            tenantId: backendSession.tenantId,
          }),
        };

    const response = await apiClient<{ data: ExpenseItem }>(
      apiEndpoints.communityExpenseById(backendSession.tenantId, expenseId),
      init,
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return normalizeExpenseItem(response.data);
  },

  async updateExpenseStatus(expenseId: string, status: ExpenseStatus, remarks?: string | null): Promise<ExpenseItem> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const response = await apiClient<{ data: ExpenseItem }>(
      `${apiEndpoints.communityExpenses(backendSession.tenantId)}/${encodeURIComponent(expenseId)}/status`,
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({
          status,
          remarks: remarks || undefined,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return normalizeExpenseItem(response.data);
  },

  async markExpensePaid(expenseId: string): Promise<ExpenseItem> {
    return expenseService.updateExpenseStatus(expenseId, 'PAID');
  },

  async loadExpense(expenseId: string): Promise<ExpenseItem | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    try {
      const response = await apiClient<{ data: ExpenseItem }>(
        apiEndpoints.communityExpenseById(backendSession.tenantId, expenseId),
        { token: backendSession.token },
      );
      return normalizeExpenseItem(response.data);
    } catch {
      return null;
    }
  },

  async downloadExpenseReceipt(expenseId: string, receiptNo?: string | null) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    return downloadPdfFromBackend(
      apiEndpoints.communityExpenseReceipt(backendSession.tenantId, expenseId),
      `expense-receipt-${receiptNo || expenseId}.pdf`,
      backendSession.token,
    );
  },
};
