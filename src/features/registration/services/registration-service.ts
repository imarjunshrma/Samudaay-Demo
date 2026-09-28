import { apiClient } from '@/src/services/api/client';
import { apiConfig } from '@/src/constants/apiConfig';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import { getCurrentFirebaseUser } from '@/src/services/firebase/auth';
import {
  approveKycBundle,
  loadKycQueueRecords,
  loadRegistrationDraftRecord,
  loadUserRecord,
  saveRegistrationDraftBundle,
} from '@/src/services/firebase/firestore';
import { readStoredSession, writeStoredSession } from '@/src/features/auth/services/session-storage';
import { resolveSecondaryLanguageText } from '@/src/features/profile/services/secondary-language-text';
import type { KycQueueItem, RegistrationDraft } from '@/src/features/registration/types/registration';
import type { FileValue } from '@/src/types';

type BackendSessionContext = {
  token: string;
  tenantId: string;
  userId: string;
  mobileNumber: string;
};

type BackendKycDocument = {
  id: string;
  type?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSizeBytes?: number | null;
  status?: string | null;
  remarks?: string | null;
  rejectionReason?: string | null;
};

type BackendRegistrationSummary = {
  id: string;
  userId: string;
  tenantId: string;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  kycStatus?: string | null;
  onboardingCompleted?: boolean | null;
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
  aadhaarNumber?: string | null;
  panNumber?: string | null;
  passportNumber?: string | null;
  bloodGroup?: string | null;
  subCommunity?: string | null;
  fullNameGu?: string | null;
  addressGu?: string | null;
  photoUrl?: string | null;
  remarks?: string | null;
  phone?: string | null;
  countryCode?: string | null;
  user?: {
    id: string;
    name?: string | null;
    phone?: string | null;
    countryCode?: string | null;
    email?: string | null;
    profilePic?: string | null;
    memberId?: string | null;
  };
  community?: {
    id: string;
    name: string;
    slug: string;
  };
  kycDocuments?: BackendKycDocument[];
};

export type KycApprovalRecord = {
  id: string;
  memberName: string;
  memberId?: string;
  photoUrl?: string;
  city: string;
  state?: string;
  pincode?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  phone?: string;
  countryCode?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  dob?: string;
  gender?: string;
  submittedAt?: string;
  status: 'Pending' | 'Ready' | 'Rejected';
  remarks?: string | null;
  documents: {
    id: string;
    title: string;
    imageUrl?: string;
    status: 'uploaded' | 'uploading' | 'failed';
  }[];
};

type KycQueuePageParams = {
  limit?: number;
  offset?: number;
  search?: string;
  status?: 'Pending' | 'Ready' | 'Rejected' | 'all';
  period?: 'all' | 'today' | 'last7Days' | 'thisMonth' | 'older';
  documents?: 'all' | 'withDocuments' | 'missingDocuments' | 'multipleDocuments';
  locations?: string[];
};

type KycQueuePageResult = {
  items: KycQueueItem[];
  summary: {
    counts: Record<'Pending' | 'Ready' | 'Rejected', number>;
    locations: string[];
  };
  pagination: {
    offset: number;
    limit: number;
    nextOffset: number;
    hasNextPage: boolean;
    totalCount: number;
  } | null;
};

type RegistrationKycDraft = {
  aadhaarDocument: FileValue | null;
  passportDocument: FileValue | null;
  jatiNoDakhloDocument: FileValue | null;
  schoolCertificateDocument: FileValue | null;
  profilePhoto: FileValue | null;
  consent: boolean;
};

function inferDocumentTypeFromName(name: string) {
  const normalized = String(name || '').trim().toLowerCase();
  if (normalized.includes('aadhaar')) {
    return 'AADHAAR_CARD';
  }
  if (normalized.includes('passport')) {
    return 'PASSPORT';
  }
  if (normalized.includes('jati') || normalized.includes('dakhlo')) {
    return 'JATI_NO_DAKHLO';
  }
  if (normalized.includes('school')) {
    return 'SCHOOL_CERTIFICATE';
  }
  if (normalized.includes('photo') || normalized.includes('selfie')) {
    return 'PROFILE_PHOTO';
  }
  return undefined;
}

function formatDocumentTitle(type?: string | null, fileName?: string | null) {
  const normalizedType = String(type || '').trim().toUpperCase();
  switch (normalizedType) {
    case 'AADHAAR_CARD':
      return 'Aadhaar Card';
    case 'PASSPORT':
      return 'Passport';
    case 'JATI_NO_DAKHLO':
      return 'Caste Certificate';
    case 'SCHOOL_CERTIFICATE':
      return 'School Certificate';
    case 'PROFILE_PHOTO':
      return 'Profile Photo';
    default:
      break;
  }

  const inferredType = inferDocumentTypeFromName(fileName || type || '');
  switch (inferredType) {
    case 'AADHAAR_CARD':
      return 'Aadhaar Card';
    case 'PASSPORT':
      return 'Passport';
    case 'JATI_NO_DAKHLO':
      return 'Caste Certificate';
    case 'SCHOOL_CERTIFICATE':
      return 'School Certificate';
    case 'PROFILE_PHOTO':
      return 'Profile Photo';
    default:
      return 'Document';
  }
}

function formatPhoneWithCountryCode(phone?: string | null, countryCode?: string | null) {
  const normalizedPhone = String(phone || '').trim();
  if (!normalizedPhone) {
    return undefined;
  }

  if (normalizedPhone.startsWith('+')) {
    return normalizedPhone;
  }

  const normalizedCountryCode = String(countryCode || '').replace(/[^\d]/g, '');
  return normalizedCountryCode ? `+${normalizedCountryCode} ${normalizedPhone}` : normalizedPhone;
}

function upsertDraftDocument(
  documents: NonNullable<RegistrationDraft['documents']>,
  nextDocument: NonNullable<RegistrationDraft['documents']>[number],
) {
  const nextType = String(nextDocument.type || '').trim().toUpperCase();
  return [
    ...documents.filter((document) => String(document.type || '').trim().toUpperCase() !== nextType),
    nextDocument,
  ];
}

async function resolveSessionUid() {
  const user = getCurrentFirebaseUser();
  if (user) {
    return user.uid;
  }

  const session = await readStoredSession();
  if (session?.user.id) {
    return session.user.id;
  }

  throw new Error('You must be signed in before accessing registration data.');
}

function isBackendEnabled() {
  return apiConfig.isConfigured && apiConfig.baseUrl !== 'https://example.invalid';
}

async function getBackendSessionContext(): Promise<BackendSessionContext | null> {
  const session = await readStoredSession();
  if (!session?.accessToken || session.source !== 'backend' || !session.user.tenantId) {
    return null;
  }

  return {
    token: session.accessToken,
    tenantId: session.user.tenantId,
    userId: session.user.id,
    mobileNumber: session.user.mobileNumber,
  };
}

function splitName(fullName: string) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: parts[0] || '',
    middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
  };
}

function formatDateValue(value?: string | Date) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function buildAddressText(parts: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
}) {
  return [
    parts.addressLine1,
    parts.addressLine2,
    parts.city,
    parts.state,
    parts.country,
    parts.pincode,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(', ');
}

async function translateRegistrationDraft(nextDraft: RegistrationDraft) {
  const addressEn = buildAddressText({
    addressLine1: nextDraft.addressLine1,
    addressLine2: nextDraft.addressLine2,
    city: nextDraft.city,
    state: nextDraft.state,
    country: nextDraft.country,
    pincode: nextDraft.pincode,
  });

  const [fullNameGu, addressGu] = await Promise.all([
    resolveSecondaryLanguageText(nextDraft.fullNameEn, nextDraft.fullNameGu),
    resolveSecondaryLanguageText(addressEn, nextDraft.addressGu),
  ]);

  return {
    ...nextDraft,
    fullNameGu,
    addressGu,
  } satisfies RegistrationDraft;
}

async function persistTranslatedFirebaseDraft(nextDraft: RegistrationDraft) {
  const translatedDraft = await translateRegistrationDraft(nextDraft);
  return persistFirebaseDraft(translatedDraft);
}

function normalizeBackendDocumentStatus(
  documentStatus?: string | null,
  options: { approved?: boolean; rejected?: boolean } = {},
) {
  const normalizedStatus = String(documentStatus || '').trim().toUpperCase();

  if (['APPROVED', 'ACTIVE', 'VERIFIED', 'READY'].includes(normalizedStatus)) {
    return 'uploaded' as const;
  }

  if (['REJECTED', 'FAILED', 'DECLINED'].includes(normalizedStatus) || options.rejected) {
    return 'failed' as const;
  }

  if (['PENDING_REVIEW', 'PENDING', 'UNDER_REVIEW', 'SUBMITTED', 'UPLOADED'].includes(normalizedStatus)) {
    return options.approved ? 'uploaded' as const : 'uploading' as const;
  }

  return options.approved ? 'uploaded' as const : 'failed' as const;
}

function mapDocuments(
  documents?: BackendKycDocument[] | null,
  options: { approved?: boolean; rejected?: boolean; rejectionReason?: string | null } = {},
) {
  return (documents ?? []).map(
    (document) => {
      const status = normalizeBackendDocumentStatus(document.status, options);
      const rejectionReason = document.rejectionReason || document.remarks || options.rejectionReason || undefined;

      return {
        id: document.id,
        type: document.type ?? inferDocumentTypeFromName(document.fileName || document.type || ''),
        name: document.fileName || document.type || 'Document',
        status,
        downloadUrl: resolveBackendMediaUrl(document.fileUrl),
        storagePath: undefined,
        contentType: document.mimeType ?? undefined,
        fileSizeLabel: document.fileSizeBytes ? `${Math.round(document.fileSizeBytes / 1024)} KB` : undefined,
        rejectionReason: status === 'failed' ? rejectionReason : undefined,
        errorMessage: status === 'failed' ? rejectionReason : undefined,
      } satisfies NonNullable<RegistrationDraft['documents']>[number];
    },
  );
}

async function mapBackendMembershipToDraft(membership: BackendRegistrationSummary): Promise<RegistrationDraft> {
  const approved = membership.status === 'ACTIVE' || membership.status === 'APPROVED' || membership.kycStatus === 'APPROVED';
  const rejected = membership.status === 'REJECTED' || membership.kycStatus === 'REJECTED';
  const nameParts = {
    firstName: membership.firstName ?? splitName(membership.user?.name ?? membership.phone ?? '').firstName,
    middleName: membership.middleName ?? splitName(membership.user?.name ?? membership.phone ?? '').middleName,
    lastName: membership.lastName ?? splitName(membership.user?.name ?? membership.phone ?? '').lastName,
  };

  const fallbackFullName = [nameParts.firstName, nameParts.middleName, nameParts.lastName].filter(Boolean).join(' ').trim();

  return {
    registrationId: membership.id,
    mobileNumber: membership.phone ?? membership.user?.phone ?? '',
    firstName: nameParts.firstName,
    middleName: nameParts.middleName || undefined,
    lastName: nameParts.lastName,
    gender: membership.gender ?? undefined,
    dob: membership.dob ?? undefined,
    addressLine1: membership.addressLine1 ?? undefined,
    addressLine2: membership.addressLine2 ?? undefined,
    city: membership.city ?? undefined,
    state: membership.state ?? undefined,
    country: membership.country ?? undefined,
    pincode: membership.pincode ?? undefined,
    aadhaarNumber: membership.aadhaarNumber ?? undefined,
    panNumber: membership.panNumber ?? undefined,
    passportNumber: membership.passportNumber ?? undefined,
    bloodGroup: membership.bloodGroup ?? undefined,
    subCommunity: membership.subCommunity ?? undefined,
    fullNameEn: fallbackFullName,
    fullNameGu: membership.fullNameGu ?? '',
    addressGu: membership.addressGu ?? '',
    documents: mapDocuments(membership.kycDocuments, {
      approved,
      rejected,
      rejectionReason: membership.remarks,
    }),
  } satisfies RegistrationDraft;
}

function mapBackendSummaryToApprovalRecord(record: BackendRegistrationSummary): KycApprovalRecord {
  const approved = record.status === 'ACTIVE' || record.status === 'APPROVED' || record.kycStatus === 'APPROVED';
  const rejected = record.status === 'REJECTED' || record.kycStatus === 'REJECTED';
  const memberName = [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || record.user?.name || 'Member';

  return {
    id: record.id,
    memberName,
    memberId: record.user?.memberId || undefined,
    photoUrl: resolveBackendMediaUrl(record.photoUrl || record.user?.profilePic),
    phone: formatPhoneWithCountryCode(record.phone || record.user?.phone, record.countryCode || record.user?.countryCode),
    countryCode: record.countryCode || record.user?.countryCode || undefined,
    city: record.city || 'Unknown',
    state: record.state || undefined,
    pincode: record.pincode || undefined,
    addressLine1: record.addressLine1 || undefined,
    addressLine2: record.addressLine2 || undefined,
    country: record.country || undefined,
    aadhaarNumber: record.aadhaarNumber || undefined,
    panNumber: record.panNumber || undefined,
    passportNumber: record.passportNumber || undefined,
    dob: record.dob || undefined,
    gender: record.gender || undefined,
    submittedAt: record.updatedAt || record.createdAt || undefined,
    status: approved ? 'Ready' : rejected ? 'Rejected' : 'Pending',
    remarks: record.remarks || null,
    documents: (record.kycDocuments ?? []).map((document) => {
      const status = normalizeBackendDocumentStatus(document.status, { approved, rejected });
      return {
        id: document.id,
        title: formatDocumentTitle(document.type, document.fileName),
        imageUrl: resolveBackendMediaUrl(document.fileUrl) || undefined,
        status,
      };
    }).concat(record.photoUrl || record.user?.profilePic ? [{
      id: `${record.id}-profile-photo`,
      title: 'Profile Photo',
      imageUrl: resolveBackendMediaUrl(record.photoUrl || record.user?.profilePic) || undefined,
      status: 'uploaded' as const,
    }] : []),
  };
}

async function persistFirebaseDraft(nextDraft: RegistrationDraft) {
  const uid = await resolveSessionUid();
  const now = Date.now();
  const existingDraft = await loadRegistrationDraftRecord(uid);
  const createdAt = existingDraft?.createdAt ?? now;

  await saveRegistrationDraftBundle(
    uid,
    {
      ...nextDraft,
      userId: uid,
      city: nextDraft.city || 'Rajkot',
      status: 'Pending',
      createdAt,
      updatedAt: now,
    },
    {
      fullName: nextDraft.fullNameEn,
      mobileNumber: nextDraft.mobileNumber,
      kycStatus: 'pending',
      updatedAt: now,
    },
  );

  return {
    ...nextDraft,
    registrationId: uid,
  };
}

async function uploadDocumentToBackend(
  context: BackendSessionContext,
  registrationId: string,
  type: string,
  file: FileValue,
) {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('uploadedByUserId', context.userId);
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || 'application/octet-stream',
  } as never);

  const response = await apiClient<{ data: BackendRegistrationSummary }>(
    apiEndpoints.communityRegistrationDocuments(context.tenantId, registrationId),
    {
      method: 'POST',
      token: context.token,
      body: formData,
    },
  );

  return response.data;
}

export const registrationService = {
  async loadDraft() {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        try {
          const response = await apiClient<{ data: BackendRegistrationSummary }>(
            apiEndpoints.communityRegistrationMe(context.tenantId),
            { token: context.token },
          );
          return await mapBackendMembershipToDraft(response.data);
        } catch {
          // Fall through to local draft storage when the backend is unavailable.
        }
      }
    }

    const firebaseUser = getCurrentFirebaseUser();
    if (!firebaseUser) {
      return {
        mobileNumber: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: undefined,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        subCommunity: '',
        fullNameEn: '',
        fullNameGu: '',
        addressGu: '',
        documents: [],
      };
    }

    const [draft, userRecord] = await Promise.all([
      loadRegistrationDraftRecord(firebaseUser.uid),
      loadUserRecord(firebaseUser.uid),
    ]);

    const localFullName = draft?.fullNameEn ?? userRecord?.fullName ?? '';
    const parsedName = splitName(localFullName);

    return {
      registrationId: draft?.userId,
      mobileNumber: draft?.mobileNumber ?? userRecord?.mobileNumber ?? firebaseUser.phoneNumber ?? '',
      firstName: draft?.firstName ?? parsedName.firstName,
      middleName: draft?.middleName ?? (parsedName.middleName || undefined),
      lastName: draft?.lastName ?? parsedName.lastName,
      gender: draft?.gender ?? undefined,
      dob: draft?.dob ?? undefined,
      addressLine1: draft?.addressLine1 ?? undefined,
      addressLine2: draft?.addressLine2 ?? undefined,
      city: draft?.city ?? undefined,
      state: draft?.state ?? undefined,
      country: draft?.country ?? undefined,
      pincode: draft?.pincode ?? undefined,
      bloodGroup: draft?.bloodGroup ?? undefined,
      subCommunity: draft?.subCommunity ?? undefined,
      fullNameEn: localFullName,
      fullNameGu: draft?.fullNameGu ?? '',
      addressGu: draft?.addressGu ?? '',
      documents: draft?.documents ?? [],
    } satisfies RegistrationDraft;
  },

  async saveDraft(nextDraft: RegistrationDraft) {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        const response = await apiClient<{ data: BackendRegistrationSummary }>(
          apiEndpoints.communityRegistration(context.tenantId),
          {
            method: 'POST',
            token: context.token,
            body: JSON.stringify({
              tenantId: context.tenantId,
              phone: nextDraft.mobileNumber || context.mobileNumber,
              firstName: nextDraft.firstName || splitName(nextDraft.fullNameEn).firstName,
              middleName: nextDraft.middleName || splitName(nextDraft.fullNameEn).middleName || null,
              lastName: nextDraft.lastName || splitName(nextDraft.fullNameEn).lastName,
              gender: nextDraft.gender || null,
              dob: formatDateValue(nextDraft.dob),
              addressLine1: nextDraft.addressLine1 || null,
              addressLine2: nextDraft.addressLine2 || null,
              city: nextDraft.city || null,
              state: nextDraft.state || null,
              country: nextDraft.country || null,
              pincode: nextDraft.pincode || null,
              aadhaarNumber: nextDraft.aadhaarNumber || null,
              panNumber: nextDraft.panNumber || null,
              passportNumber: nextDraft.passportNumber || null,
              bloodGroup: nextDraft.bloodGroup || null,
              subCommunity: nextDraft.subCommunity || null,
              photoUrl: nextDraft.documents.find((document) => document.name.toLowerCase().includes('photo'))?.downloadUrl || null,
            }),
          },
        );

        return await mapBackendMembershipToDraft(response.data);
      }
    }

    return persistTranslatedFirebaseDraft(nextDraft);
  },

  async finalizeRegistration(
    registrationId: string,
    kycDraft: RegistrationKycDraft,
  ) {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        if (!registrationId) {
          throw new Error('Registration id is required before submitting KYC.');
        }

        if (kycDraft.profilePhoto) {
          const photoFormData = new FormData();
          photoFormData.append('file', {
            uri: kycDraft.profilePhoto.uri,
            name: kycDraft.profilePhoto.name,
            type: kycDraft.profilePhoto.mimeType || 'application/octet-stream',
          } as never);

          await apiClient<{ data: BackendRegistrationSummary }>(
            apiEndpoints.communityRegistrationById(context.tenantId, registrationId),
            {
              method: 'PATCH',
              token: context.token,
              body: photoFormData,
            },
          );
        }

        const uploads: { type: string; file: FileValue | null }[] = [
          { type: 'AADHAAR_CARD', file: kycDraft.aadhaarDocument },
          { type: 'PASSPORT', file: kycDraft.passportDocument },
          { type: 'JATI_NO_DAKHLO', file: kycDraft.jatiNoDakhloDocument },
          { type: 'SCHOOL_CERTIFICATE', file: kycDraft.schoolCertificateDocument },
        ];

        for (const upload of uploads) {
          if (upload.file) {
            await uploadDocumentToBackend(context, registrationId, upload.type, upload.file);
          }
        }

        const response = await apiClient<{ data: BackendRegistrationSummary }>(
          apiEndpoints.communityRegistrationSubmit(context.tenantId, registrationId),
          {
            method: 'POST',
            token: context.token,
            body: JSON.stringify({ tenantId: context.tenantId }),
          },
        );

        const storedSession = await readStoredSession();
        if (storedSession?.source === 'backend') {
          await writeStoredSession({
            ...storedSession,
            user: {
              ...storedSession.user,
              onboardingComplete: true,
              communityMembershipStatus: (response.data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING') as
                | 'PENDING'
                | 'ACTIVE'
                | 'INACTIVE'
                | 'REJECTED'
                | 'SUSPENDED',
              kycStatus: (response.data.kycStatus === 'APPROVED'
                ? 'APPROVED'
                : response.data.kycStatus === 'REJECTED'
                  ? 'REJECTED'
                  : 'PENDING_REVIEW') as
                | 'NOT_UPLOADED'
                | 'PENDING_REVIEW'
                | 'APPROVED'
                | 'REJECTED'
                | 'RESUBMISSION_REQUIRED',
            },
          });
        }

        return await mapBackendMembershipToDraft(response.data);
      }
    }

    const uid = await resolveSessionUid();
    const existingDraft = await loadRegistrationDraftRecord(uid);
    const now = Date.now();
    const toFallbackDocument = (file: FileValue, name: string) => ({
      id: `${uid}-${name.replace(/\s+/g, '-').toLowerCase()}-${now}`,
      type: inferDocumentTypeFromName(name),
      name,
      status: 'uploaded' as const,
      downloadUrl: file.uri,
      storagePath: undefined,
      contentType: file.mimeType,
      fileSizeLabel: file.size ? `${Math.round(file.size / 1024)} KB` : undefined,
      localUri: file.uri,
    });

    let nextDocuments = existingDraft?.documents ?? [];
    if (kycDraft.aadhaarDocument) {
      nextDocuments = upsertDraftDocument(nextDocuments, toFallbackDocument(kycDraft.aadhaarDocument, 'Aadhaar Card'));
    }
    if (kycDraft.passportDocument) {
      nextDocuments = upsertDraftDocument(nextDocuments, toFallbackDocument(kycDraft.passportDocument, 'Passport'));
    }
    if (kycDraft.jatiNoDakhloDocument) {
      nextDocuments = upsertDraftDocument(nextDocuments, toFallbackDocument(kycDraft.jatiNoDakhloDocument, 'Caste Certificate'));
    }
    if (kycDraft.schoolCertificateDocument) {
      nextDocuments = upsertDraftDocument(nextDocuments, toFallbackDocument(kycDraft.schoolCertificateDocument, 'School Certificate'));
    }
    if (kycDraft.profilePhoto) {
      nextDocuments = upsertDraftDocument(nextDocuments, toFallbackDocument(kycDraft.profilePhoto, 'Profile Photo'));
    }

    await saveRegistrationDraftBundle(
      uid,
      {
        ...existingDraft,
        userId: uid,
        city: existingDraft?.city ?? 'Rajkot',
        mobileNumber: existingDraft?.mobileNumber ?? '',
        fullNameEn: existingDraft?.fullNameEn ?? '',
        fullNameGu: existingDraft?.fullNameGu ?? '',
        createdAt: existingDraft?.createdAt ?? now,
        documents: nextDocuments,
        status: 'Ready',
        updatedAt: now,
      },
      {
        fullName: existingDraft?.fullNameEn ?? '',
        mobileNumber: existingDraft?.mobileNumber ?? '',
        kycStatus: 'pending',
      },
    );

    await approveKycBundle(uid, 'Ready');
    return {
      registrationId: uid,
      mobileNumber: existingDraft?.mobileNumber ?? '',
      fullNameEn: existingDraft?.fullNameEn ?? '',
      fullNameGu: existingDraft?.fullNameGu ?? '',
      documents: nextDocuments,
    } satisfies RegistrationDraft;
  },

  async uploadKycDocument(registrationId: string, type: string, file: FileValue) {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        const response = await uploadDocumentToBackend(context, registrationId, type, file);
        return await mapBackendMembershipToDraft(response);
      }
    }

    const uid = await resolveSessionUid();
    const existingDraft = await loadRegistrationDraftRecord(uid);
    const now = Date.now();
    const nextDocument = {
      id: `${uid}-${type.toLowerCase()}-${now}`,
      type,
      name: file.name,
      status: 'uploaded' as const,
      downloadUrl: file.uri,
      storagePath: undefined,
      contentType: file.mimeType,
      fileSizeLabel: file.size ? `${Math.round(file.size / 1024)} KB` : undefined,
      localUri: file.uri,
    };

    const nextDocuments = [
      ...((existingDraft?.documents ?? []).filter((document) => String(document.type || '').trim().toUpperCase() !== type.toUpperCase())),
      nextDocument,
    ];

    await saveRegistrationDraftBundle(
      uid,
      {
        ...existingDraft,
        userId: uid,
        city: existingDraft?.city ?? 'Rajkot',
        mobileNumber: existingDraft?.mobileNumber ?? '',
        fullNameEn: existingDraft?.fullNameEn ?? '',
        fullNameGu: existingDraft?.fullNameGu ?? '',
        createdAt: existingDraft?.createdAt ?? now,
        documents: nextDocuments,
        status: 'Ready',
        updatedAt: now,
      },
      {
        fullName: existingDraft?.fullNameEn ?? '',
        mobileNumber: existingDraft?.mobileNumber ?? '',
        kycStatus: 'pending',
      },
    );

    return {
      ...existingDraft,
      registrationId: uid,
      mobileNumber: existingDraft?.mobileNumber ?? '',
      fullNameEn: existingDraft?.fullNameEn ?? '',
      fullNameGu: existingDraft?.fullNameGu ?? '',
      documents: nextDocuments,
    } satisfies RegistrationDraft;
  },

  async loadKycQueue() {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        const response = await apiClient<{ data: BackendRegistrationSummary[] }>(
          apiEndpoints.communityApprovalQueue(context.tenantId),
          { token: context.token },
        );

        return response.data.map(
          (record) =>
            ({
              id: record.id,
              memberName: [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') || record.user?.name || 'Member',
              memberId: record.user?.memberId || undefined,
              phone: formatPhoneWithCountryCode(record.phone || record.user?.phone, record.countryCode || record.user?.countryCode),
              countryCode: record.countryCode || record.user?.countryCode || undefined,
              photoUrl: resolveBackendMediaUrl(record.photoUrl || record.user?.profilePic),
              city: record.city || 'Unknown',
              documents: mapDocuments(record.kycDocuments).map((document) => document.name),
              submittedAt: record.updatedAt || undefined,
              status:
                record.status === 'ACTIVE' || record.status === 'APPROVED' || record.kycStatus === 'APPROVED'
                  ? 'Ready'
                  : record.status === 'REJECTED' || record.kycStatus === 'REJECTED'
                    ? 'Rejected'
                    : 'Pending',
            }) satisfies KycQueueItem,
        );
      }
    }

    const records = await loadKycQueueRecords();
    return records.map(
      (record) =>
        ({
          id: record.id,
          memberName: record.fullNameEn,
          memberId: undefined,
          phone: record.mobileNumber || undefined,
          countryCode: undefined,
          photoUrl: undefined,
          city: record.city,
          documents: record.documents.map((document) => document.name),
          submittedAt: undefined,
          status: record.status,
        }) satisfies KycQueueItem,
    );
  },

  async loadKycQueuePage(params: KycQueuePageParams = {}): Promise<KycQueuePageResult> {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        const searchParams = new URLSearchParams();
        searchParams.set('paginated', 'true');
        searchParams.set('limit', String(params.limit ?? 20));
        searchParams.set('offset', String(params.offset ?? 0));
        if (params.search?.trim()) {
          searchParams.set('q', params.search.trim());
        }
        if (params.status && params.status !== 'all') {
          searchParams.set('status', params.status);
        }
        if (params.period && params.period !== 'all') {
          searchParams.set('period', params.period);
        }
        if (params.documents && params.documents !== 'all') {
          searchParams.set('documents', params.documents);
        }
        if (params.locations?.length) {
          searchParams.set('locations', params.locations.join(','));
        }

        const response = await apiClient<{
          data: {
            items: BackendRegistrationSummary[];
            summary: KycQueuePageResult['summary'];
          };
          pagination: NonNullable<KycQueuePageResult['pagination']>;
        }>(
          `${apiEndpoints.communityApprovalQueue(context.tenantId)}?${searchParams.toString()}`,
          { token: context.token },
        );

        return {
          items: response.data.items.map(
            (record) =>
              ({
                id: record.id,
                memberName: [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') || record.user?.name || 'Member',
                memberId: record.user?.memberId || undefined,
                phone: formatPhoneWithCountryCode(record.phone || record.user?.phone, record.countryCode || record.user?.countryCode),
                countryCode: record.countryCode || record.user?.countryCode || undefined,
                photoUrl: resolveBackendMediaUrl(record.photoUrl || record.user?.profilePic),
                city: record.city || 'Unknown',
                documents: mapDocuments(record.kycDocuments).map((document) => document.name),
                submittedAt: record.updatedAt || undefined,
                status:
                  record.status === 'ACTIVE' || record.status === 'APPROVED' || record.kycStatus === 'APPROVED'
                    ? 'Ready'
                    : record.status === 'REJECTED' || record.kycStatus === 'REJECTED'
                      ? 'Rejected'
                      : 'Pending',
              }) satisfies KycQueueItem,
          ),
          summary: response.data.summary,
          pagination: response.pagination,
        };
      }
    }

    const items = await this.loadKycQueue();
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;
    const pagedItems = items.slice(offset, offset + limit);
    const nextOffset = offset + pagedItems.length;
    return {
      items: pagedItems,
      summary: {
        counts: {
          Pending: items.filter((item) => item.status === 'Pending').length,
          Ready: items.filter((item) => item.status === 'Ready').length,
          Rejected: items.filter((item) => item.status === 'Rejected').length,
        },
        locations: Array.from(new Set(items.map((item) => item.city).filter(Boolean))).sort(),
      },
      pagination: {
        offset,
        limit,
        nextOffset,
        hasNextPage: nextOffset < items.length,
        totalCount: items.length,
      },
    };
  },

  async loadKycApprovalRecord(registrationId: string) {
    if (!registrationId) {
      throw new Error('Registration id is required.');
    }

    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        const response = await apiClient<{ data: BackendRegistrationSummary }>(
          apiEndpoints.communityRegistrationById(context.tenantId, registrationId),
          { token: context.token },
        );

        return mapBackendSummaryToApprovalRecord(response.data);
      }
    }

    const records = await loadKycQueueRecords();
    const record = records.find((entry) => entry.id === registrationId);
    if (!record) {
      throw new Error('Registration not found.');
    }

      return {
        id: record.id,
        memberName: record.fullNameEn,
        memberId: undefined,
        photoUrl: undefined,
        city: record.city,
        state: undefined,
        pincode: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        country: undefined,
        dob: undefined,
        gender: undefined,
        submittedAt: undefined,
        status: record.status,
        documents: record.documents.map((document) => ({
          id: document.id,
          title: formatDocumentTitle(document.type, document.name),
          imageUrl: document.downloadUrl,
          status: document.status,
        })),
      } satisfies KycApprovalRecord;
  },

  async approveKyc(id: string) {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        await apiClient<{ data: BackendRegistrationSummary }>(
          apiEndpoints.communityApprovalDecision(context.tenantId, id, 'approve'),
          {
            method: 'POST',
            token: context.token,
            body: JSON.stringify({ tenantId: context.tenantId }),
          },
        );

        return {
          id,
          status: 'Ready',
        };
      }
    }

    await approveKycBundle(id, 'Ready');
    return {
      id,
      status: 'Ready',
    };
  },

  async rejectKyc(id: string, rejectionReason?: string) {
    if (isBackendEnabled()) {
      const context = await getBackendSessionContext();
      if (context) {
        await apiClient<{ data: BackendRegistrationSummary }>(
          apiEndpoints.communityApprovalDecision(context.tenantId, id, 'reject'),
          {
            method: 'POST',
            token: context.token,
            body: JSON.stringify({
              tenantId: context.tenantId,
              remarks: rejectionReason || undefined,
              rejectionReason: rejectionReason || undefined,
            }),
          },
        );

        return {
          id,
          status: 'Rejected',
        };
      }
    }

    await approveKycBundle(id, 'Rejected');
    return {
      id,
      status: 'Rejected',
    };
  },
};
