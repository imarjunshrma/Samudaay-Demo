import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { createAndDeliverPdf } from '@/src/services/files/pdf-file';
import { getActiveTenantRequestHeaders } from '@/src/core/config/community';

export type ChildDirectoryItem = {
  id: string;
  name: string;
  gujaratiName: string;
  parent: string;
  school: string;
  classLabel: string;
  image: string;
  raised?: boolean;
};

type ChildrenPageResponse = {
  items: ChildDirectoryItem[];
  pagination: null | {
    page: number;
    limit: number;
    total: number;
    totalCount?: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type MarksheetRecordItem = {
  id: string;
  department: string;
  standardSemester: string;
  academicYear: string;
  fileUrl: string;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  createdAt: string;
};

export type MarksheetUploadPayload = {
  familyMemberId: string;
  academicYear: string;
  standardSemester: string;
  department: string;
  file: {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
  };
};

export type MarksheetReportItem = {
  id: string;
  number: number;
  studentName: string;
  parentName: string;
  standardSemester: string;
  department: string;
  academicYear: string;
  uploadedMarksheet: boolean;
  fileUrl: string;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  createdAt: string;
};

export type MarksheetReportResponse = {
  academicYears: string[];
  items: MarksheetReportItem[];
};

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  if (/^file:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

const childLikeRelations = new Set(['CHILD', 'SON', 'DAUGHTER', 'DAUGHTER_IN_LAW', 'GRAND_SON', 'GRAND_DAUGHTER']);

function formatChildRelation(value?: string | null) {
  const normalized = String(value || '').trim().toUpperCase();
  switch (normalized) {
    case 'SON':
      return 'Son';
    case 'DAUGHTER':
      return 'Daughter';
    case 'DAUGHTER_IN_LAW':
      return 'Daughter InLaw';
    case 'GRAND_SON':
      return 'Grand Son';
    case 'GRAND_DAUGHTER':
      return 'Grand Daughter';
    default:
      return 'Child';
  }
}

export const childrenEducationService = {
  async loadChildren(): Promise<ChildDirectoryItem[]> {
    const page = await this.loadChildrenPage();
    return page.items;
  },

  async loadChildrenPage(params?: { page?: number; limit?: number; search?: string }): Promise<ChildrenPageResponse> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const query = new URLSearchParams();
          if (params?.page) query.set('page', String(params.page));
          if (params?.limit) query.set('limit', String(params.limit));
          if (params?.search?.trim()) query.set('search', params.search.trim());
          const response = await apiClient<{
            data: { id: string; name: string; parent: string; city?: string | null; relation?: string | null; dob?: string | null; image?: string | null; status?: string | null }[];
            pagination?: ChildrenPageResponse['pagination'];
          }>(
            `${apiEndpoints.communityChildren(backendSession.tenantId)}${query.toString() ? `?${query.toString()}` : ''}`,
            { token: backendSession.token },
          );

          return {
            items: (response.data ?? []).map(
            (item, index) =>
              ({
                id: item.id,
                name: item.name,
                gujaratiName: item.name,
                parent: item.parent || 'Community member',
                school: item.city || 'Community school',
                classLabel: formatChildRelation(item.relation),
                image: item.image || '',
                raised: index % 2 === 1,
              }) satisfies ChildDirectoryItem,
            ),
            pagination: response.pagination ?? null,
          };
        } catch {
          return { items: [], pagination: null };
        }
      }
    }

    return { items: [], pagination: null };
  },

  async loadFamilyChildren(): Promise<ChildDirectoryItem[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [];
    }

    try {
      const response = await apiClient<{ data: { id: string; name: string; relation: string; dob?: string | null; phone?: string | null; email?: string | null }[] }>(
        apiEndpoints.communityFamilyMembers(backendSession.tenantId),
        { token: backendSession.token },
      );

      return (response.data ?? [])
        .filter((item) => childLikeRelations.has(String(item.relation || '').trim().toUpperCase()))
        .map(
          (item, index) =>
            ({
              id: item.id,
              name: item.name,
              gujaratiName: item.name,
              parent: item.phone || 'Family member',
              school: item.email || 'Child record',
              classLabel: formatChildRelation(item.relation),
              image: '',
              raised: index % 2 === 1,
            }) satisfies ChildDirectoryItem,
        );
    } catch {
      return [];
    }
  },

  async loadMarksheetRecords(familyMemberId: string): Promise<MarksheetRecordItem[]> {
    if (!isBackendApiConfigured()) {
      return [];
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [];
    }

    try {
      const response = await apiClient<{ data: MarksheetRecordItem[] }>(
        apiEndpoints.communityChildMarksheetRecords(backendSession.tenantId, familyMemberId),
        { token: backendSession.token },
      );

      return (response.data ?? []).map((record) => ({
        ...record,
        fileUrl: resolveBackendMediaUrl(record.fileUrl),
      }));
    } catch {
      return [];
    }
  },

  async saveMarksheet(payload: MarksheetUploadPayload): Promise<{ id: string; fileUrl: string; academicYear: string; standardSemester: string }> {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const formData = new FormData();
    formData.append('department', payload.department);
    formData.append('academicYear', payload.academicYear);
    formData.append('standardSemester', payload.standardSemester);
    formData.append('file', {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.mimeType || 'application/octet-stream',
    } as never);

    const response = await apiClient<{
      data: { id: string; fileUrl: string; academicYear: string; standardSemester: string };
    }>(apiEndpoints.communityChildMarksheetRecords(backendSession.tenantId, payload.familyMemberId), {
      method: 'POST',
      body: formData,
      token: backendSession.token,
    });

    return {
      ...response.data,
      fileUrl: resolveBackendMediaUrl(response.data.fileUrl),
    };
  },

  async loadMarksheetReport(academicYear?: string | null): Promise<MarksheetReportResponse> {
    if (!isBackendApiConfigured()) {
      return { academicYears: [], items: [] };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { academicYears: [], items: [] };
    }

    try {
      const response = await apiClient<{ data: MarksheetReportResponse }>(
        apiEndpoints.communityMarksheetReport(
          backendSession.tenantId,
          academicYear && academicYear !== '__all__' ? academicYear : undefined,
        ),
        { token: backendSession.token },
      );

      return {
        academicYears: response.data?.academicYears ?? [],
        items: (response.data?.items ?? []).map((item) => ({
          ...item,
          fileUrl: resolveBackendMediaUrl(item.fileUrl),
        })),
      };
    } catch {
      return { academicYears: [], items: [] };
    }
  },

  async downloadMarksheetReportPdf(academicYear?: string | null) {
    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session not found.');
    }

    const normalizedAcademicYear =
      academicYear && academicYear !== '__all__' ? academicYear : undefined;

    const headers: Record<string, string> = {
      ...getActiveTenantRequestHeaders(),
      Authorization: `Bearer ${backendSession.token}`,
      Accept: 'application/pdf',
    };

    return createAndDeliverPdf({
      source: {
        type: 'url',
        url: `${apiConfig.baseUrl}${apiEndpoints.communityMarksheetReportPdf(
          backendSession.tenantId,
          normalizedAcademicYear,
        )}`,
        headers,
      },
      fileName: normalizedAcademicYear
        ? `marksheet-report-${normalizedAcademicYear}.pdf`
        : 'marksheet-report-all-years.pdf',
      delivery: 'share',
    });
  },
};
