export type AppLanguage = 'en' | 'gu';

export type ThemeMode = 'light' | 'dark' | 'system';

export type UserRole =
  | 'admin'
  | 'member'
  | 'community_member'
  | 'user'
  | 'trustee';

export type Permission =
  | 'registration.manage'
  | 'kyc.approve'
  | 'profile_requests.manage'
  | 'marksheet.view'
  | 'marksheet.manage'
  | 'children_education.view'
  | 'children_education.manage'
  | 'profile.manage'
  | 'directory.view'
  | 'directory.manage'
  | 'user.manage'
  | 'users.view'
  | 'phone.view'
  | 'users.edit'
  | 'users.delete'
  | 'users.block'
  | 'events.view'
  | 'events.manage'
  | 'event.manage'
  | 'events.attendance'
  | 'donations.view'
  | 'donations.manage'
  | 'transactions.manage'
  | 'analytics.view'
  | 'roles.manage'
  | 'admins.manage'
  | 'notifications.manage'
  | 'communication.manage'
  | 'chats.manage'
  | 'chat.manage'
  | 'promotions.view'
  | 'promotions.manage'
  | 'matrimony.manage'
  | 'publications.manage';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

export interface SessionUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  countryCode?: string;
  email?: string;
  role: UserRole;
  permissions: Permission[];
  preferredLanguage: AppLanguage;
  onboardingComplete: boolean;
  tenantId: string;
  communityMembershipId?: string;
  communityMembershipStatus?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
  kycStatus?: 'NOT_UPLOADED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESUBMISSION_REQUIRED';
  communityRoleKeys?: string[];
  communityPermissions?: Permission[];
  subCommunity?: string;
  profilePhotoUrl?: string | null;
}

export interface UserSession {
  user: SessionUser;
  issuedAt: number;
  source: 'firebase' | 'backend' | 'local-dev';
  accessToken?: string;
}

export interface AppFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage?: string;
}

export type ScreenVariant =
  | 'dashboard'
  | 'analytics'
  | 'form'
  | 'directory'
  | 'detail'
  | 'chat'
  | 'gallery'
  | 'finance'
  | 'navigation'
  | 'scanner'
  | 'splash';

export type ModuleId =
  | 'registration'
  | 'profile'
  | 'events'
  | 'donations'
  | 'notifications'
  | 'advertisements'
  | 'streaming'
  | 'trustees'
  | 'communication'
  | 'matrimony'
  | 'transactions'
  | 'analytics'
  | 'publications'
  | 'birthdays'
  | 'expenses'
  | 'roles';

export interface LocalizedText {
  en: string;
  gu: string;
}

export interface AppModule {
  id: ModuleId;
  title: LocalizedText;
  summary: LocalizedText;
  roles: string[];
  priority: 'core' | 'high' | 'extended';
}

export interface HtmlScreenSource {
  fileName: string;
  slug: string;
}

export interface ScreenCatalogEntry extends HtmlScreenSource {
  title: LocalizedText;
  summary: LocalizedText;
  moduleId: ModuleId;
  variant: ScreenVariant;
  category: LocalizedText;
}

export interface MetricItem {
  label: string;
  value: string;
  accent?: 'primary' | 'accent' | 'warning' | 'danger';
}

export interface ListItem {
  id?: string;
  title: string;
  subtitle: string;
  meta?: string;
  status?: string;
  city?: string;
  startAt?: string | null;
  endAt?: string | null;
}
