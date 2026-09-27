import type { AppLanguage, UserSession } from '@/src/types/app';

export interface LoginFormValues {
  mobileNumber: string;
  preferredLanguage: AppLanguage;
  tenantId?: string;
  subCommunity?: string;
  pin?: string;
}

export interface OtpRequestPayload {
  mobileNumber: string;
}

export interface OtpVerificationPayload {
  otpCode: string;
}

export interface PendingLoginContext {
  mobileNumber: string;
  preferredLanguage: AppLanguage;
  tenantId?: string;
  subCommunity?: string;
  testOtp?: string;
  provider?: 'firebase' | 'local-dev';
  loginAttemptId?: string;
  otpRequestedAt?: number;
}

export interface AuthBootstrapResult {
  session: UserSession | null;
  source: 'firebase' | 'backend' | 'local-dev' | 'none';
}
