import { useState } from 'react';

import { useSession } from '@/src/core/providers/session-provider';
import { authService } from '@/src/features/auth/services/auth-service';
import { useApiQueryClient } from '@/src/services/api';
import type { LoginFormValues } from '@/src/features/auth/types/auth';

export function useAuthActions() {
  const { setAppViewMode, setSession, setStatus } = useSession();
  const queryClient = useApiQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function signIn(values: LoginFormValues) {
    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      setSession(null);
      setStatus('signedOut');
      await authService.requestSignInOtp(values);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to request OTP');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmOtp(otpCode: string) {
    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      const result = await authService.confirmSignInOtp({ otpCode });
      if (result) {
        setSession(result);
        setStatus('signedIn');
      }
      return !!result;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to verify OTP');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendOtp() {
    setIsResending(true);
    setErrorMessage(undefined);

    try {
      await authService.resendPendingOtp();
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to resend OTP');
      return false;
    } finally {
      setIsResending(false);
    }
  }

  async function clearPendingOtp() {
    setErrorMessage(undefined);
    await authService.clearPendingOtp();
  }

  async function signOut() {
    setIsSubmitting(true);
    setErrorMessage(undefined);
    try {
      setSession(null);
      setStatus('signedOut');
      await setAppViewMode('admin');
      queryClient.clear();
      await authService.logout();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign out');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    signIn,
    confirmOtp,
    resendOtp,
    clearPendingOtp,
    signOut,
    errorMessage,
    isSubmitting,
    isResending,
  };
}
