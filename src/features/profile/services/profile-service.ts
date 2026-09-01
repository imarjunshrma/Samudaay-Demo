import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { invalidateTenantApiData } from '@/src/services/api/cache-invalidation';
import { apiConfig } from '@/src/constants/apiConfig';
import { getCurrentFirebaseUser } from '@/src/services/firebase/auth';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { readStoredSession } from '@/src/features/auth/services/session-storage';
import type { FamilyMember, ProfileUpdateRequestItem, StudentRecord, UserProfile } from '@/src/features/profile/types/profile';
import { resolveSecondaryLanguageText } from './secondary-language-text';

type BackendProfileResponse = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  memberId?: string | null;
  status?: string | null;
  profilePic?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dob?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  bloodGroup?: string | null;
  subCommunity?: string | null;
  profileUpdateRequest?: UserProfile['profileUpdateRequest'];
};

function formatFamilyRelation(value?: string | null) {
  const normalized = String(value || '').trim().toUpperCase();
  switch (normalized) {
    case 'FATHER':
      return 'Father';
    case 'MOTHER':
      return 'Mother';
    case 'SPOUSE':
      return 'Spouse';
    case 'CHILD':
      return 'Child';
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
    case 'OTHER':
      return 'Other';
    default:
      return value || 'Other';
  }
}

async function buildProfileWithSecondaryLanguage(source: {
  memberId: string | null;
  fullNameEn: string;
  email: string;
  addressEn: string;
  mobileNumber: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  gender?: string | null;
  dob?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  bloodGroup?: string | null;
  subCommunity?: string | null;
  status: string | null;
  profilePhotoUrl: string | null;
  profileUpdateRequest?: UserProfile['profileUpdateRequest'];
  fullNameGu?: string | null;
  addressGu?: string | null;
  translateMissingSecondary?: boolean;
}): Promise<UserProfile> {
  const shouldTranslate = source.translateMissingSecondary !== false;
  const [fullNameGu, addressGu] = shouldTranslate
    ? await Promise.all([
        resolveSecondaryLanguageText(source.fullNameEn, source.fullNameGu),
        resolveSecondaryLanguageText(source.addressEn, source.addressGu),
      ])
    : [
        source.fullNameGu?.trim() || source.fullNameEn,
        source.addressGu?.trim() || source.addressEn,
      ];

  return {
    memberId: source.memberId,
    fullNameEn: source.fullNameEn,
    fullNameGu,
    email: source.email,
    addressEn: source.addressEn,
    addressGu,
    mobileNumber: source.mobileNumber,
    firstName: source.firstName ?? null,
    middleName: source.middleName ?? null,
    lastName: source.lastName ?? null,
    gender: source.gender ?? null,
    dob: source.dob ?? null,
    addressLine1: source.addressLine1 ?? null,
    addressLine2: source.addressLine2 ?? null,
    city: source.city ?? null,
    state: source.state ?? null,
    country: source.country ?? null,
    pincode: source.pincode ?? null,
    panNumber: source.panNumber ?? null,
    bloodGroup: source.bloodGroup ?? null,
    subCommunity: source.subCommunity ?? null,
    status: source.status,
    profilePhotoUrl: source.profilePhotoUrl,
    profileUpdateRequest: source.profileUpdateRequest ?? null,
  };
}

function composeAddress(profile: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
}) {
  return [
    profile.addressLine1,
    profile.addressLine2,
    profile.city,
    profile.state,
    profile.country,
    profile.pincode,
  ].filter(Boolean).join(', ');
}

function composeFullName(profile: {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fullNameEn?: string | null;
}) {
  return [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ') || profile.fullNameEn || '';
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return null;
  }

  const trimmed = fileUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(https?:|file:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  return `${apiConfig.baseUrl}/${trimmed.replace(/^\/+/, '')}`;
}

function mapProfileUpdateRequest(item: ProfileUpdateRequestItem): ProfileUpdateRequestItem {
  const requestedData = { ...item.requestedData };
  const currentData = item.currentData ? { ...item.currentData } : undefined;
  const requestedProfilePicSource = typeof requestedData.profilePic === 'string'
    ? requestedData.profilePic
    : typeof requestedData.profilePhoto === 'string'
      ? requestedData.profilePhoto
      : null;
  const currentProfilePicSource = currentData && typeof currentData.profilePic === 'string'
    ? currentData.profilePic
    : currentData && typeof currentData.profilePhoto === 'string'
      ? currentData.profilePhoto
      : null;
  const requestedProfilePic = typeof requestedProfilePicSource === 'string'
    ? resolveBackendMediaUrl(requestedProfilePicSource)
    : null;
  const currentProfilePic = typeof currentProfilePicSource === 'string'
    ? resolveBackendMediaUrl(currentProfilePicSource)
    : null;

  if ('profilePhoto' in requestedData) {
    delete requestedData.profilePhoto;
  }

  if (requestedProfilePic) {
    requestedData.profilePic = requestedProfilePic;
  }

  if (currentData && 'profilePhoto' in currentData) {
    delete currentData.profilePhoto;
  }

  if (currentData && currentProfilePic) {
    currentData.profilePic = currentProfilePic;
  }

  return {
    ...item,
    currentData,
    requestedData,
    requester: {
      ...item.requester,
      profilePic: resolveBackendMediaUrl(item.requester.profilePic) ?? null,
      currentProfilePic: resolveBackendMediaUrl(item.requester.currentProfilePic) ?? null,
    },
  };
}

function normalizeProfileRequestFieldKey(key: string) {
  if (key === 'profilePhoto') {
    return 'profilePic';
  }

  if (key === 'name' || key === 'fullNameEn') {
    return 'name';
  }

  return key;
}

function getProfileRequestFieldKeys(requestedData: Record<string, unknown>) {
  return Object.keys(requestedData)
    .filter((key) => requestedData[key] !== null && requestedData[key] !== undefined && requestedData[key] !== '')
    .map(normalizeProfileRequestFieldKey)
    .sort();
}

function getProfileRequestScopeKey(item: ProfileUpdateRequestItem) {
  const fieldKeys = getProfileRequestFieldKeys(item.requestedData);
  return `${item.requester.id}:${fieldKeys.join('|') || 'general'}`;
}

function getRequestCreatedAtValue(item: ProfileUpdateRequestItem) {
  const value = item.createdAt ? new Date(item.createdAt).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}

function sortProfileRequestsByLatest(items: ProfileUpdateRequestItem[]) {
  return [...items].sort((a, b) => getRequestCreatedAtValue(b) - getRequestCreatedAtValue(a));
}

function getLatestActionableProfileRequests(items: ProfileUpdateRequestItem[]) {
  const latestByScope = new Map<string, ProfileUpdateRequestItem>();

  for (const item of sortProfileRequestsByLatest(items)) {
    const scopeKey = getProfileRequestScopeKey(item);
    if (!latestByScope.has(scopeKey)) {
      latestByScope.set(scopeKey, item);
    }
  }

  return Array.from(latestByScope.values());
}

type ProfileUpdateRequestPageParams = {
  limit?: number;
  offset?: number;
  search?: string;
  period?: 'all' | 'today' | 'last7Days' | 'thisMonth' | 'older';
  changeFilter?: 'all' | 'photo' | 'contact' | 'address' | 'personal' | 'multiple';
  status?: string;
};

type ProfileUpdateRequestPageResult = {
  items: ProfileUpdateRequestItem[];
  summary: {
    pending: number;
    last7Days: number;
    photo: number;
    multiple: number;
  };
  pagination: {
    offset: number;
    limit: number;
    nextOffset: number;
    hasNextPage: boolean;
    totalCount: number;
  } | null;
};

async function mapBackendProfile(
  data: BackendProfileResponse,
  fallback: {
    memberId?: string | null;
    fullNameEn?: string | null;
    email?: string | null;
    mobileNumber?: string | null;
    status?: string | null;
    profilePhotoUrl?: string | null;
  } = {},
) {
  const fullNameEn = data.name ?? composeFullName(data) ?? fallback.fullNameEn ?? '';
  return buildProfileWithSecondaryLanguage({
    memberId: data.memberId ?? fallback.memberId ?? null,
    fullNameEn,
    email: data.email ?? fallback.email ?? '',
    addressEn: composeAddress(data),
    fullNameGu: null,
    addressGu: null,
    mobileNumber: data.phone ?? fallback.mobileNumber ?? '',
    firstName: data.firstName ?? null,
    middleName: data.middleName ?? null,
    lastName: data.lastName ?? null,
    gender: data.gender ?? null,
    dob: data.dob ?? null,
    addressLine1: data.addressLine1 ?? null,
    addressLine2: data.addressLine2 ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    country: data.country ?? null,
    pincode: data.pincode ?? null,
    panNumber: data.panNumber ?? null,
    bloodGroup: data.bloodGroup ?? null,
    subCommunity: data.subCommunity ?? null,
    status: data.status ?? fallback.status ?? null,
    profilePhotoUrl: resolveBackendMediaUrl(data.profilePic ?? fallback.profilePhotoUrl ?? null),
    profileUpdateRequest: data.profileUpdateRequest ?? null,
    translateMissingSecondary: true,
  });
}

export const profileService = {
  async loadProfile() {
    const firebaseUser = getCurrentFirebaseUser();
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: BackendProfileResponse }>(
            apiEndpoints.communityMe(backendSession.tenantId),
            { token: backendSession.token },
          );
          return await mapBackendProfile(response.data, {
            memberId: response.data.memberId ?? backendSession.session.user.communityMembershipId ?? null,
            fullNameEn: backendSession.session.user.fullName ?? '',
            email: response.data.email ?? backendSession.session.user.email ?? '',
            mobileNumber: response.data.phone ?? backendSession.session.user.mobileNumber ?? firebaseUser?.phoneNumber ?? '',
            status: response.data.status ?? backendSession.session.user.communityMembershipStatus ?? null,
            profilePhotoUrl: resolveBackendMediaUrl(response.data.profilePic) ?? backendSession.session.user.profilePhotoUrl ?? null,
          });
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Unable to load profile from the backend.');
        }
      }
    }

    const storedSession = await readStoredSession();
    if (!firebaseUser && storedSession) {
      return await buildProfileWithSecondaryLanguage({
        memberId: null,
        fullNameEn: storedSession.user.fullName,
        email: storedSession.user.email ?? '',
        addressEn: '',
        fullNameGu: '',
        addressGu: '',
        mobileNumber: storedSession.user.mobileNumber,
        status: null,
        profilePhotoUrl: null,
        translateMissingSecondary: false,
      });
    }

    throw new Error('Backend session is required before loading profile details.');
  },

  async updateProfile(nextProfile: UserProfile) {
    const [fullNameGu, addressGu] = await Promise.all([
      resolveSecondaryLanguageText(nextProfile.fullNameEn, nextProfile.fullNameGu),
      resolveSecondaryLanguageText(nextProfile.addressEn, nextProfile.addressGu),
    ]);
    const nextProfileToPersist: UserProfile = {
      ...nextProfile,
      fullNameGu,
      addressGu,
    };

    if (!isBackendApiConfigured()) {
      throw new Error('Backend API is not configured for profile updates.');
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available. Please sign out and sign in again.');
    }

    const mapSavedProfile = async (data: BackendProfileResponse) => mapBackendProfile(data, {
      memberId: data.memberId ?? nextProfileToPersist.memberId ?? null,
      fullNameEn: data.name ?? nextProfileToPersist.fullNameEn,
      email: data.email ?? nextProfileToPersist.email,
      mobileNumber: data.phone ?? nextProfileToPersist.mobileNumber,
      status: data.status ?? nextProfileToPersist.status ?? null,
      profilePhotoUrl: resolveBackendMediaUrl(data.profilePic ?? nextProfileToPersist.profilePhotoUrl ?? null),
    });

    if (nextProfileToPersist.profilePhoto) {
      const formData = new FormData();
      formData.append('name', nextProfileToPersist.fullNameEn);
      formData.append('email', nextProfileToPersist.email);
      formData.append('firstName', nextProfileToPersist.firstName ?? '');
      formData.append('middleName', nextProfileToPersist.middleName ?? '');
      formData.append('lastName', nextProfileToPersist.lastName ?? '');
      formData.append('gender', nextProfileToPersist.gender ?? '');
      formData.append('dob', nextProfileToPersist.dob ?? '');
      formData.append('addressLine1', nextProfileToPersist.addressLine1 ?? '');
      formData.append('addressLine2', nextProfileToPersist.addressLine2 ?? '');
      formData.append('city', nextProfileToPersist.city ?? '');
      formData.append('state', nextProfileToPersist.state ?? '');
      formData.append('country', nextProfileToPersist.country ?? '');
      formData.append('pincode', nextProfileToPersist.pincode ?? '');
      formData.append('panNumber', nextProfileToPersist.panNumber ?? '');
      formData.append('bloodGroup', nextProfileToPersist.bloodGroup ?? '');
      formData.append('subCommunity', nextProfileToPersist.subCommunity ?? '');
      formData.append('file', {
        uri: nextProfileToPersist.profilePhoto.uri,
        name: nextProfileToPersist.profilePhoto.name,
        type: nextProfileToPersist.profilePhoto.mimeType || 'application/octet-stream',
      } as never);

      const response = await apiClient<{ data: BackendProfileResponse }>(
        apiEndpoints.communityProfile(backendSession.tenantId),
        {
          method: 'PUT',
          token: backendSession.token,
          body: formData,
        },
      );
      await invalidateTenantApiData(backendSession.tenantId);
      return mapSavedProfile(response.data);
    }

    const response = await apiClient<{ data: BackendProfileResponse }>(
      apiEndpoints.communityProfile(backendSession.tenantId),
      {
        method: 'PUT',
        token: backendSession.token,
        body: JSON.stringify({
          name: nextProfileToPersist.fullNameEn,
          email: nextProfileToPersist.email,
          firstName: nextProfileToPersist.firstName,
          middleName: nextProfileToPersist.middleName,
          lastName: nextProfileToPersist.lastName,
          gender: nextProfileToPersist.gender,
          dob: nextProfileToPersist.dob,
          addressLine1: nextProfileToPersist.addressLine1,
          addressLine2: nextProfileToPersist.addressLine2,
          city: nextProfileToPersist.city,
          state: nextProfileToPersist.state,
          country: nextProfileToPersist.country,
          pincode: nextProfileToPersist.pincode,
          panNumber: nextProfileToPersist.panNumber,
          bloodGroup: nextProfileToPersist.bloodGroup,
          subCommunity: nextProfileToPersist.subCommunity,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return mapSavedProfile(response.data);
  },

  async loadProfileUpdateRequests(status = 'PENDING') {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return [];
    }

    const response = await apiClient<{ data: ProfileUpdateRequestItem[] }>(
      apiEndpoints.communityProfileUpdateRequests(backendSession.tenantId, status),
      { token: backendSession.token },
    );

    return sortProfileRequestsByLatest(response.data.map(mapProfileUpdateRequest));
  },

  async loadActionableProfileUpdateRequests(status = 'PENDING') {
    const requests = await this.loadProfileUpdateRequests(status);
    return getLatestActionableProfileRequests(requests);
  },

  async loadActionableProfileUpdateRequestsPage(params: ProfileUpdateRequestPageParams = {}): Promise<ProfileUpdateRequestPageResult> {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return {
        items: [],
        summary: {
          pending: 0,
          last7Days: 0,
          photo: 0,
          multiple: 0,
        },
        pagination: {
          offset: 0,
          limit: params.limit ?? 20,
          nextOffset: 0,
          hasNextPage: false,
          totalCount: 0,
        },
      };
    }

    const searchParams = new URLSearchParams();
    searchParams.set('actionable', 'true');
    searchParams.set('paginated', 'true');
    searchParams.set('limit', String(params.limit ?? 20));
    searchParams.set('offset', String(params.offset ?? 0));
    if (params.search?.trim()) {
      searchParams.set('q', params.search.trim());
    }
    if (params.period && params.period !== 'all') {
      searchParams.set('period', params.period);
    }
    if (params.changeFilter && params.changeFilter !== 'all') {
      searchParams.set('changeFilter', params.changeFilter);
    }

    const baseUrl = apiEndpoints.communityProfileUpdateRequests(backendSession.tenantId, params.status ?? 'PENDING');
    const separator = baseUrl.includes('?') ? '&' : '?';

    const response = await apiClient<{
      data: {
        items: ProfileUpdateRequestItem[];
        summary: ProfileUpdateRequestPageResult['summary'];
      };
      pagination: NonNullable<ProfileUpdateRequestPageResult['pagination']>;
    }>(
      `${baseUrl}${separator}${searchParams.toString()}`,
      { token: backendSession.token },
    );

    return {
      items: response.data.items.map(mapProfileUpdateRequest),
      summary: response.data.summary,
      pagination: response.pagination,
    };
  },

  async loadActionableProfileUpdateRequestById(requestId: string, status = 'PENDING') {
    const actionableRequests = await this.loadActionableProfileUpdateRequests(status);
    return actionableRequests.find((item) => item.id === requestId) ?? null;
  },

  async reviewProfileUpdateRequest(requestId: string, action: 'approve' | 'reject', remarks?: string | null) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Unable to resolve the current community session.');
    }

    const actionableRequest = await this.loadActionableProfileUpdateRequestById(requestId, 'PENDING');
    if (!actionableRequest) {
      throw new Error('This request has been superseded by a newer update and can no longer be reviewed.');
    }

    const response = await apiClient<{ data: { id: string; status: string } }>(
      apiEndpoints.communityProfileUpdateRequestDecision(backendSession.tenantId, requestId, action),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({ remarks: remarks ?? null }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);

    return response.data;
  },

  async loadFamilyMembers() {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; name: string; relation: string; dob?: string | null; bloodGroup?: string | null; aadhaarNumber?: string | null; phone?: string | null; email?: string | null; gender?: string | null; education?: string | null; schoolName?: string | null; currentClass?: string | null; occupation?: string | null }[] }>(
            apiEndpoints.communityFamilyMembers(backendSession.tenantId),
            { token: backendSession.token },
          );
          return response.data.map(
            (item) =>
              ({
                id: item.id,
                title: item.name,
                subtitle: formatFamilyRelation(item.relation),
                meta: item.dob ?? '',
                status: 'Active',
                bloodGroup: item.bloodGroup ?? null,
                aadhaarNumber: item.aadhaarNumber ?? null,
                phone: item.phone ?? null,
                email: item.email ?? null,
                dob: item.dob ?? null,
                gender: item.gender ?? null,
                education: item.education ?? null,
                schoolName: item.schoolName ?? null,
                currentClass: item.currentClass ?? null,
                occupation: item.occupation ?? null,
              }) satisfies FamilyMember,
          );
        } catch {
          return [];
        }
      }
    }

    return [];
  },
  async loadFamilyMembersPage(params?: { page?: number; limit?: number; search?: string; relation?: string }) {
    if (!isBackendApiConfigured()) {
      return { items: [], pagination: null as null | { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean } };
    }

    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      return { items: [], pagination: null as null | { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean } };
    }

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search?.trim()) searchParams.set('search', params.search.trim());
    if (params?.relation?.trim()) searchParams.set('relation', params.relation.trim());
    const query = searchParams.toString();

    const response = await apiClient<{
      data: { id: string; name: string; relation: string; dob?: string | null; bloodGroup?: string | null; aadhaarNumber?: string | null; phone?: string | null; email?: string | null; gender?: string | null; education?: string | null; schoolName?: string | null; currentClass?: string | null; occupation?: string | null }[];
      pagination?: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean } | null;
    }>(
      `${apiEndpoints.communityFamilyMembers(backendSession.tenantId)}${query ? `?${query}` : ''}`,
      { token: backendSession.token },
    );

    return {
      items: (response.data ?? []).map(
        (item) =>
          ({
            id: item.id,
            title: item.name,
            subtitle: formatFamilyRelation(item.relation),
            meta: item.dob ?? '',
            status: 'Active',
            bloodGroup: item.bloodGroup ?? null,
            aadhaarNumber: item.aadhaarNumber ?? null,
            phone: item.phone ?? null,
            email: item.email ?? null,
            dob: item.dob ?? null,
            gender: item.gender ?? null,
            education: item.education ?? null,
            schoolName: item.schoolName ?? null,
            currentClass: item.currentClass ?? null,
            occupation: item.occupation ?? null,
          }) satisfies FamilyMember,
      ),
      pagination: response.pagination ?? null,
    };
  },

  async loadFamilyMember(memberId: string) {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; name: string; relation: string; dob?: string | null; bloodGroup?: string | null; aadhaarNumber?: string | null; phone?: string | null; email?: string | null; status?: string | null; gender?: string | null; education?: string | null; schoolName?: string | null; currentClass?: string | null; occupation?: string | null } }>(
            apiEndpoints.communityFamilyMember(backendSession.tenantId, memberId),
            { token: backendSession.token },
          );
          return {
            id: response.data.id,
            title: response.data.name,
            subtitle: formatFamilyRelation(response.data.relation),
            meta: response.data.dob ?? '',
            status: response.data.status || 'Active',
            image: '',
            bloodGroup: response.data.bloodGroup ?? null,
            aadhaarNumber: response.data.aadhaarNumber ?? null,
            phone: response.data.phone ?? null,
            email: response.data.email ?? null,
            dob: response.data.dob ?? null,
            gender: response.data.gender ?? null,
            education: response.data.education ?? null,
            schoolName: response.data.schoolName ?? null,
            currentClass: response.data.currentClass ?? null,
            occupation: response.data.occupation ?? null,
          } satisfies FamilyMember;
        } catch {
          return null;
        }
      }
    }

    return null;
  },

  async createFamilyMember(nextMember: {
    fullName: string;
    relation: string;
    gender: 'male' | 'female' | 'other' | '';
    dateOfBirth?: Date;
    bloodGroup: string;
    aadhaarNumber: string;
    phone?: string | null;
    email?: string | null;
    education: string;
    schoolName: string;
    currentClass: string;
    occupation: string;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const result = await apiClient(
      apiEndpoints.communityFamilyMembers(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: JSON.stringify({
          tenantId: backendSession.tenantId,
          userCommunityId: backendSession.session.user.communityMembershipId,
          name: nextMember.fullName,
          relation: nextMember.relation,
          gender: nextMember.gender || null,
          dob: nextMember.dateOfBirth?.toISOString() ?? null,
          bloodGroup: nextMember.bloodGroup.trim(),
          aadhaarNumber: nextMember.aadhaarNumber.replace(/\D/g, '') || null,
          phone: nextMember.phone?.trim() || null,
          email: nextMember.email?.trim() || null,
          education: nextMember.education || null,
          schoolName: nextMember.schoolName || null,
          currentClass: nextMember.currentClass || null,
          occupation: nextMember.occupation || null,
          status: 'ACTIVE',
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return result;
  },

  async updateFamilyMember(memberId: string, nextMember: {
    fullName: string;
    relation: string;
    gender: 'male' | 'female' | 'other' | '';
    dateOfBirth?: Date;
    bloodGroup: string;
    aadhaarNumber: string;
    phone?: string | null;
    email?: string | null;
    education: string;
    schoolName: string;
    currentClass: string;
    occupation: string;
  }) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const result = await apiClient(
      apiEndpoints.communityFamilyMember(backendSession.tenantId, memberId),
      {
        method: 'PATCH',
        token: backendSession.token,
        body: JSON.stringify({
          name: nextMember.fullName,
          relation: nextMember.relation,
          gender: nextMember.gender || null,
          dob: nextMember.dateOfBirth?.toISOString() ?? null,
          bloodGroup: nextMember.bloodGroup.trim(),
          aadhaarNumber: nextMember.aadhaarNumber.replace(/\D/g, '') || null,
          phone: nextMember.phone?.trim() || null,
          email: nextMember.email?.trim() || null,
          education: nextMember.education || null,
          schoolName: nextMember.schoolName || null,
          currentClass: nextMember.currentClass || null,
          occupation: nextMember.occupation || null,
        }),
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return result;
  },

  async deleteFamilyMember(memberId: string) {
    const backendSession = await getBackendSessionContext();
    if (!backendSession) {
      throw new Error('Backend session is not available.');
    }

    const result = await apiClient(
      apiEndpoints.communityFamilyMember(backendSession.tenantId, memberId),
      {
        method: 'DELETE',
        token: backendSession.token,
      },
    );
    await invalidateTenantApiData(backendSession.tenantId);
    return result;
  },

  async loadStudentRecords() {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; name: string; parent: string; city?: string | null; relation?: string | null; dob?: string | null; image?: string | null; status?: string | null }[] }>(
            apiEndpoints.communityChildren(backendSession.tenantId),
            { token: backendSession.token },
          );
          return (response.data ?? []).map(
            (item) =>
              ({
                id: item.id,
                title: item.name,
                subtitle: formatFamilyRelation(item.relation) || item.parent || 'Child',
                meta: item.city || item.dob || '',
                status: item.status || 'Active',
              }) satisfies StudentRecord,
          );
        } catch {
          return [];
        }
      }
    }

    return [];
  },
};
