import { act, renderHook } from '@testing-library/react-native';

import { useAuthActions } from '../use-auth-actions';

// --- mocks ---

const mockSetSession = jest.fn();
const mockSetStatus = jest.fn();
const mockQueryClientClear = jest.fn();

jest.mock('@/src/core/providers/session-provider', () => ({
  useSession: () => ({
    setSession: mockSetSession,
    setStatus: mockSetStatus,
  }),
}));

jest.mock('@/src/services/api', () => ({
  useApiQueryClient: () => ({ clear: mockQueryClientClear }),
}));

const mockRequestSignInOtp = jest.fn();
const mockConfirmSignInOtp = jest.fn();
const mockResendPendingOtp = jest.fn();
const mockClearPendingOtp = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/src/features/auth/services/auth-service', () => ({
  authService: {
    requestSignInOtp: (...args: unknown[]) => mockRequestSignInOtp(...args),
    confirmSignInOtp: (...args: unknown[]) => mockConfirmSignInOtp(...args),
    resendPendingOtp: (...args: unknown[]) => mockResendPendingOtp(...args),
    clearPendingOtp: (...args: unknown[]) => mockClearPendingOtp(...args),
    logout: (...args: unknown[]) => mockLogout(...args),
  },
}));

// --- helpers ---

const loginValues = {
  mobileNumber: '+911234567890',
  preferredLanguage: 'en' as const,
  tenantId: 'tenant1',
  subCommunity: '',
};

// --- tests ---

describe('useAuthActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('calls requestSignInOtp and returns true on success', async () => {
      mockRequestSignInOtp.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAuthActions());

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.signIn(loginValues);
      });

      expect(mockRequestSignInOtp).toHaveBeenCalledWith(loginValues);
      expect(returnValue).toBe(true);
      expect(result.current.errorMessage).toBeUndefined();
    });

    it('sets errorMessage and returns false when requestSignInOtp throws', async () => {
      mockRequestSignInOtp.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useAuthActions());

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.signIn(loginValues);
      });

      expect(returnValue).toBe(false);
      expect(result.current.errorMessage).toBe('Network error');
    });

    it('sets isSubmitting to true during request, false after', async () => {
      let resolveOtp!: () => void;
      mockRequestSignInOtp.mockReturnValue(new Promise<void>((res) => { resolveOtp = res; }));
      const { result } = renderHook(() => useAuthActions());

      act(() => { void result.current.signIn(loginValues); });
      expect(result.current.isSubmitting).toBe(true);

      await act(async () => { resolveOtp(); });
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('confirmOtp', () => {
    it('returns true on success', async () => {
      const mockSession = { user: { id: '1' }, source: 'backend' };
      mockConfirmSignInOtp.mockResolvedValue(mockSession);
      const { result } = renderHook(() => useAuthActions());

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.confirmOtp('123456');
      });

      expect(mockConfirmSignInOtp).toHaveBeenCalledWith({ otpCode: '123456' });
      expect(returnValue).toBe(true);
      expect(mockSetSession).toHaveBeenCalledWith(mockSession);
      expect(mockSetStatus).toHaveBeenCalledWith('signedIn');
    });

    it('returns false and sets errorMessage on failure', async () => {
      mockConfirmSignInOtp.mockRejectedValue(new Error('Invalid OTP'));
      const { result } = renderHook(() => useAuthActions());

      let returnValue: unknown;
      await act(async () => {
        returnValue = await result.current.confirmOtp('000000');
      });

      expect(returnValue).toBe(false);
      expect(result.current.errorMessage).toBe('Invalid OTP');
    });
  });

  describe('resendOtp', () => {
    it('returns true on success', async () => {
      mockResendPendingOtp.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAuthActions());

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.resendOtp();
      });

      expect(returnValue).toBe(true);
      expect(result.current.isResending).toBe(false);
    });

    it('returns false and sets errorMessage on failure', async () => {
      mockResendPendingOtp.mockRejectedValue(new Error('Resend failed'));
      const { result } = renderHook(() => useAuthActions());

      let returnValue: boolean | undefined;
      await act(async () => {
        returnValue = await result.current.resendOtp();
      });

      expect(returnValue).toBe(false);
      expect(result.current.errorMessage).toBe('Resend failed');
    });
  });

  describe('signOut', () => {
    it('clears session, status, and query cache', async () => {
      mockLogout.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSetSession).toHaveBeenCalledWith(null);
      expect(mockSetStatus).toHaveBeenCalledWith('signedOut');
      expect(mockQueryClientClear).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
    });

    it('sets errorMessage if logout throws', async () => {
      mockLogout.mockRejectedValue(new Error('Logout failed'));
      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.errorMessage).toBe('Logout failed');
    });
  });

  describe('clearPendingOtp', () => {
    it('calls authService.clearPendingOtp and clears errorMessage', async () => {
      mockClearPendingOtp.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAuthActions());

      await act(async () => {
        await result.current.clearPendingOtp();
      });

      expect(mockClearPendingOtp).toHaveBeenCalled();
      expect(result.current.errorMessage).toBeUndefined();
    });
  });
});
