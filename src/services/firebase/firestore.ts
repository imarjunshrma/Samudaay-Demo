import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { RegistrationDraft, KycQueueItem } from '@/src/features/registration/types/registration';
import type { UserProfile } from '@/src/features/profile/types/profile';
import { getFirebaseAvailabilityMessage, isNativeFirebaseAvailable } from '@/src/services/firebase/app';
import type { AppLanguage, Permission, UserRole } from '@/src/types/app';

export interface FirebaseUserRecord {
  fullName: string;
  mobileNumber: string;
  email?: string;
  role: UserRole;
  permissions: Permission[];
  preferredLanguage: AppLanguage;
  onboardingComplete: boolean;
  tenantId: string;
  pinHash?: string | null;
  kycStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseProfileRecord extends UserProfile {
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseRegistrationDraftRecord extends RegistrationDraft {
  userId: string;
  city: string;
  status: 'Pending' | 'Ready' | 'Rejected';
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseEventRecord {
  title: string;
  subtitle: string;
  eventDate: string;
  status: 'Live' | 'Pending' | 'Archived';
  capacity: number;
  registeredCount: number;
  addOnPrice: number;
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseEventRegistrationRecord {
  userId: string;
  eventId: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  attendees: number;
  addOn: string;
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseDonationRecord {
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  amount: number;
  donorName: string;
  pincode: string;
  createdAt: number;
  updatedAt: number;
}

const USERS_COLLECTION = 'users';
const PROFILES_COLLECTION = 'profiles';
const REGISTRATION_DRAFTS_COLLECTION = 'registrationDrafts';
const KYC_QUEUE_COLLECTION = 'kycQueue';
const EVENTS_COLLECTION = 'events';
const EVENT_REGISTRATIONS_COLLECTION = 'eventRegistrations';
const DONATIONS_COLLECTION = 'donations';

type FirestoreWritableValue =
  | null
  | string
  | number
  | boolean
  | Date
  | FirestoreWritableValue[]
  | { [key: string]: FirestoreWritableValue };

function stripUndefinedFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefinedFields(item)) as T;
  }

  if (!value || typeof value !== 'object' || value instanceof Date) {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, FirestoreWritableValue>>((result, [key, item]) => {
    if (item === undefined) {
      return result;
    }

    result[key] = stripUndefinedFields(item) as FirestoreWritableValue;
    return result;
  }, {}) as T;
}

function getDb() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const firestoreModule = require('@react-native-firebase/firestore').default as typeof import('@react-native-firebase/firestore').default;
    return firestoreModule();
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

function getFirestoreModule() {
  if (!isNativeFirebaseAvailable()) {
    throw new Error(getFirebaseAvailabilityMessage());
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-firebase/firestore').default as typeof import('@react-native-firebase/firestore').default;
  } catch {
    throw new Error(getFirebaseAvailabilityMessage());
  }
}

export async function loadUserRecord(uid: string) {
  const snapshot = await getDb().collection(USERS_COLLECTION).doc(uid).get();
  return snapshot.exists() ? (snapshot.data() as FirebaseUserRecord) : null;
}

export async function saveUserRecord(uid: string, record: Partial<FirebaseUserRecord>) {
  await getDb().collection(USERS_COLLECTION).doc(uid).set(stripUndefinedFields(record), { merge: true });
}

export async function loadProfileRecord(uid: string) {
  const snapshot = await getDb().collection(PROFILES_COLLECTION).doc(uid).get();
  return snapshot.exists() ? (snapshot.data() as FirebaseProfileRecord) : null;
}

export async function saveProfileRecord(uid: string, record: FirebaseProfileRecord) {
  await getDb().collection(PROFILES_COLLECTION).doc(uid).set(stripUndefinedFields(record), { merge: true });
}

export async function loadRegistrationDraftRecord(uid: string) {
  const snapshot = await getDb().collection(REGISTRATION_DRAFTS_COLLECTION).doc(uid).get();
  return snapshot.exists() ? (snapshot.data() as FirebaseRegistrationDraftRecord) : null;
}

export async function saveRegistrationDraftRecord(uid: string, record: FirebaseRegistrationDraftRecord) {
  await getDb().collection(REGISTRATION_DRAFTS_COLLECTION).doc(uid).set(stripUndefinedFields(record), { merge: true });
}

export async function loadKycQueueRecords() {
  const snapshot = await getDb().collection(KYC_QUEUE_COLLECTION).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FirebaseRegistrationDraftRecord, 'id'>),
  }));
}

export async function saveKycQueueRecord(uid: string, record: FirebaseRegistrationDraftRecord) {
  await getDb().collection(KYC_QUEUE_COLLECTION).doc(uid).set(stripUndefinedFields(record), { merge: true });
}

export async function updateKycQueueStatus(uid: string, status: KycQueueItem['status']) {
  await getDb().collection(KYC_QUEUE_COLLECTION).doc(uid).set(stripUndefinedFields({ status, updatedAt: Date.now() }), { merge: true });
}

export async function saveRegistrationDraftBundle(
  uid: string,
  draftRecord: FirebaseRegistrationDraftRecord,
  userRecord: Partial<FirebaseUserRecord>,
) {
  const batch = getDb().batch();
  batch.set(getDb().collection(REGISTRATION_DRAFTS_COLLECTION).doc(uid), stripUndefinedFields(draftRecord), { merge: true });
  batch.set(getDb().collection(KYC_QUEUE_COLLECTION).doc(uid), stripUndefinedFields(draftRecord), { merge: true });
  batch.set(getDb().collection(USERS_COLLECTION).doc(uid), stripUndefinedFields(userRecord), { merge: true });
  await batch.commit();
}

export async function approveKycBundle(uid: string, status: KycQueueItem['status']) {
  const batch = getDb().batch();
  const update = stripUndefinedFields({ status, updatedAt: Date.now() });
  batch.set(getDb().collection(KYC_QUEUE_COLLECTION).doc(uid), update, { merge: true });
  batch.set(getDb().collection(REGISTRATION_DRAFTS_COLLECTION).doc(uid), update, { merge: true });
  batch.set(
    getDb().collection(USERS_COLLECTION).doc(uid),
    stripUndefinedFields({
      onboardingComplete: status === 'Ready',
      kycStatus: status === 'Ready' ? 'approved' : status === 'Rejected' ? 'rejected' : 'pending',
      updatedAt: Date.now(),
    }),
    { merge: true },
  );
  await batch.commit();
}

export async function saveProfileBundle(
  uid: string,
  profileRecord: FirebaseProfileRecord,
  userRecord: Partial<FirebaseUserRecord>,
) {
  const batch = getDb().batch();
  batch.set(getDb().collection(PROFILES_COLLECTION).doc(uid), stripUndefinedFields(profileRecord), { merge: true });
  batch.set(getDb().collection(USERS_COLLECTION).doc(uid), stripUndefinedFields(userRecord), { merge: true });
  await batch.commit();
}

export async function loadEventRecords() {
  const snapshot = await getDb().collection(EVENTS_COLLECTION).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirebaseEventRecord),
  }));
}

export async function loadFeaturedEventRecord() {
  const snapshot = await getDb()
    .collection(EVENTS_COLLECTION)
    .orderBy('updatedAt', 'desc')
    .limit(10)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const liveDoc = snapshot.docs.find((doc) => (doc.data() as FirebaseEventRecord).status === 'Live');
  const doc = liveDoc ?? snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as FirebaseEventRecord),
  };
}

export async function loadEventRegistrationRecords(userId?: string) {
  let query: FirebaseFirestoreTypes.Query = getDb().collection(EVENT_REGISTRATIONS_COLLECTION);

  if (userId) {
    query = query.where('userId', '==', userId);
  }

  const snapshot = await query.get();
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirebaseEventRegistrationRecord),
    }))
    .sort((left, right) => right.updatedAt - left.updatedAt);
}

export async function saveEventRegistrationRecord(
  id: string,
  record: FirebaseEventRegistrationRecord,
) {
  const batch = getDb().batch();
  const registrationRef = getDb().collection(EVENT_REGISTRATIONS_COLLECTION).doc(id);
  batch.set(registrationRef, stripUndefinedFields(record), { merge: true });

  const eventRef = getDb().collection(EVENTS_COLLECTION).doc(record.eventId);
  batch.set(
    eventRef,
    {
      registeredCount: getFirestoreModule().FieldValue.increment(record.attendees),
      updatedAt: record.updatedAt,
    },
    { merge: true },
  );
  await batch.commit();
}

export async function loadDonationRecords() {
  const snapshot = await getDb().collection(DONATIONS_COLLECTION).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirebaseDonationRecord),
  }));
}

export async function saveDonationRecord(id: string, record: FirebaseDonationRecord) {
  await getDb().collection(DONATIONS_COLLECTION).doc(id).set(stripUndefinedFields(record), { merge: true });
}
