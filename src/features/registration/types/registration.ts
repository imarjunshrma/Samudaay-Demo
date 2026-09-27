export interface KycDocument {
  id: string;
  type?: string;
  name: string;
  status: 'uploaded' | 'uploading' | 'failed';
  downloadUrl?: string;
  storagePath?: string;
  contentType?: string;
  fileSizeLabel?: string;
  localUri?: string;
  progress?: number;
  errorMessage?: string;
  rejectionReason?: string | null;
}

export interface RegistrationDraft {
  registrationId?: string;
  mobileNumber: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  bloodGroup?: string;
  subCommunity?: string;
  fullNameEn: string;
  fullNameGu: string;
  addressGu?: string;
  documents: KycDocument[];
}

export interface KycQueueItem {
  id: string;
  memberName: string;
  memberId?: string;
  phone?: string;
  photoUrl?: string;
  city: string;
  documents: string[];
  submittedAt?: string;
  status: 'Pending' | 'Ready' | 'Rejected';
}
