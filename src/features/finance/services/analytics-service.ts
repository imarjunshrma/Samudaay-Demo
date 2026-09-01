import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';

export type AnalyticsBreakdownItem = {
  label: string;
  value: number;
};

export type AnalyticsTransactionItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: string;
  status: string;
  direction: 'income' | 'expense' | string;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  receiptNo?: string | null;
  receiptUrl?: string | null;
  createdAt?: string | null;
};

export type TenantTransactionsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type TenantTransactionsSummary = {
  typeCounts: {
    all: number;
    donation: number;
    event: number;
    matrimony: number;
    expense: number;
  };
  statusCounts: {
    all: number;
    completed: number;
    pending: number;
    failed: number;
  };
};

export type TenantTransactionsPageResponse = {
  items: AnalyticsTransactionItem[];
  pagination: TenantTransactionsPagination | null;
  summary: TenantTransactionsSummary;
};

export const emptyTenantTransactionsSummary: TenantTransactionsSummary = {
  typeCounts: {
    all: 0,
    donation: 0,
    event: 0,
    matrimony: 0,
    expense: 0,
  },
  statusCounts: {
    all: 0,
    completed: 0,
    pending: 0,
    failed: 0,
  },
};

export type TenantAnalytics = {
  filters: {
    financialYear: string;
    startDate: string;
    endDate: string;
  };
  people: {
    totalRegisteredPeople: number;
    newRegistrationsCurrentMonth: number;
    previousMonthRegistrations: number;
    registrationGrowthPercent: number;
    activeMatrimonyPeople: number;
    byCity: AnalyticsBreakdownItem[];
  };
  transactions: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    byType: AnalyticsBreakdownItem[];
    byLocation: AnalyticsBreakdownItem[];
    monthly: { label: string; income: number; expense: number; count: number }[];
    recent: AnalyticsTransactionItem[];
  };
  events: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    totalRegisteredUsers: number;
    totalAttendance: number;
    addonUsage: number;
    recent: {
      id: string;
      title: string;
      registrations: number;
      attendance: number;
      income: number;
      expense: number;
      addonUsage: number;
      createdAt: string;
    }[];
  };
  children: {
    totalChildrenProfiles: number;
    byDepartment: AnalyticsBreakdownItem[];
    recentMarksheets: {
      id: string;
      childName: string;
      parentName: string;
      city?: string | null;
      department: string;
      standardSemester: string;
      academicYear: string;
      fileUrl: string;
    }[];
  };
  profitLoss: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    monthly: { label: string; income: number; expense: number }[];
    categories: AnalyticsBreakdownItem[];
  };
  matrimony: {
    subscriptionsRevenue: number;
    recentProfiles: {
      id: string;
      name: string;
      status: string;
      city?: string | null;
      updatedAt: string;
    }[];
  };
};

export function formatAnalyticsCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatAnalyticsNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value || 0);
}

export const analyticsService = {
  async loadTenantAnalytics(params?: { startDate?: string; endDate?: string }): Promise<TenantAnalytics | null> {
    if (!isBackendApiConfigured()) {
      return null;
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return null;
    }

    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    const query = searchParams.toString();

    const response = await apiClient<{ data: TenantAnalytics }>(
      `${apiEndpoints.communityAnalytics(backendSession.tenantId)}${query ? `?${query}` : ''}`,
      { token: backendSession.token },
    );

    return response.data;
  },
  async loadTenantTransactionsPage(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TenantTransactionsPageResponse> {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null, summary: emptyTenantTransactionsSummary };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null, summary: emptyTenantTransactionsSummary };
    }

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    const query = searchParams.toString();

    const response = await apiClient<{
      data: AnalyticsTransactionItem[] | {
        items?: AnalyticsTransactionItem[];
        summary?: Partial<TenantTransactionsSummary> | null;
      };
      pagination?: TenantTransactionsPagination | null;
    }>(
      `${apiEndpoints.communityAnalyticsTransactions(backendSession.tenantId)}${query ? `?${query}` : ''}`,
      { token: backendSession.token },
    );
    const responseItems = Array.isArray(response.data) ? response.data : response.data?.items ?? [];
    const responseSummary = Array.isArray(response.data) ? null : response.data?.summary ?? null;

    return {
      items: responseItems,
      pagination: response.pagination ?? null,
      summary: {
        typeCounts: {
          all: Number(responseSummary?.typeCounts?.all || response.pagination?.total || responseItems.length || 0),
          donation: Number(responseSummary?.typeCounts?.donation || 0),
          event: Number(responseSummary?.typeCounts?.event || 0),
          matrimony: Number(responseSummary?.typeCounts?.matrimony || 0),
          expense: Number(responseSummary?.typeCounts?.expense || 0),
        },
        statusCounts: {
          all: Number(responseSummary?.statusCounts?.all || response.pagination?.total || responseItems.length || 0),
          completed: Number(responseSummary?.statusCounts?.completed || 0),
          pending: Number(responseSummary?.statusCounts?.pending || 0),
          failed: Number(responseSummary?.statusCounts?.failed || 0),
        },
      },
    };
  },
};
