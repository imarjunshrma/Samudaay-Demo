import type { ListItem } from '@/src/types/app';
import type { FileValue } from '@/src/types';

export interface UserProfile {
  memberId?: string | null;
  fullNameEn: string;
  fullNameGu: string;
  email: string;
  addressEn: string;
  addressGu: string;
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
  status?: string | null;
  profilePhotoUrl?: string | null;
  profilePhoto?: FileValue | null;
  profileUpdateRequest?: {
    id: string;
    status: string;
    createdAt?: string | Date | null;
    requestedData?: Record<string, unknown> | null;
  } | null;
}

export type ProfileUpdateRequestItem = {
  id: string;
  status: string;
  requestedData: Record<string, unknown>;
  currentData?: Record<string, unknown>;
  remarks?: string | null;
  createdAt?: string | Date | null;
  reviewedAt?: string | Date | null;
  requester: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    memberId?: string | null;
    profilePic?: string | null;
    currentProfilePic?: string | null;
  };
};

export interface FamilyMember extends ListItem {
  id: string;
  image?: string;
  badge?: string;
  bloodGroup?: string | null;
  aadhaarNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: string | null;
  education?: string | null;
  schoolName?: string | null;
  currentClass?: string | null;
  occupation?: string | null;
}

export interface StudentRecord extends ListItem {
  id: string;
}
