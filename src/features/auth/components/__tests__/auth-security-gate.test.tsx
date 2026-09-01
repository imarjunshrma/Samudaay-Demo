import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const mockSecurityConfig = { authSecurityEnabled: false };
const mockSessionState = {
  status: 'signedOut' as 'loading' | 'signedOut' | 'signedIn',
  session: null as null | { user: { id: string } },
};
const mockAuthSecurityState = {
  isLocked: false,
  isReady: true,
  isSetupRequired: false,
};

jest.mock('@/src/core/config/security', () => ({
  get securityConfig() {
    return mockSecurityConfig;
  },
}));

jest.mock('@/src/core/providers/session-provider', () => ({
  useSession: () => mockSessionState,
}));

jest.mock('@/src/features/auth/hooks/use-auth-security', () => ({
  useAuthSecurity: () => mockAuthSecurityState,
}));

// Use require inside the factory to avoid out-of-scope JSX variables
jest.mock('../auth-security-flow', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  return {
    AuthSecurityFlow: () => ReactLib.createElement(View, { testID: 'auth-security-flow' }),
  };
});

import { AuthSecurityGate } from '../auth-security-gate';

describe('AuthSecurityGate', () => {
  beforeEach(() => {
    mockSecurityConfig.authSecurityEnabled = false;
    mockSessionState.status = 'signedOut';
    mockSessionState.session = null;
    mockAuthSecurityState.isLocked = false;
    mockAuthSecurityState.isReady = true;
    mockAuthSecurityState.isSetupRequired = false;
  });

  it('renders nothing when authSecurityEnabled is false', () => {
    mockSecurityConfig.authSecurityEnabled = false;
    const { queryByTestId } = render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );
    expect(queryByTestId('protected-child')).toBeTruthy();
  });

  it('renders children when auth security is disabled', () => {
    render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );
    expect(screen.getByTestId('protected-child')).toBeTruthy();
  });

  it('renders children when signed out and auth security is enabled', () => {
    mockSecurityConfig.authSecurityEnabled = true;

    render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );
    expect(screen.getByTestId('protected-child')).toBeTruthy();
  });

  it('renders AuthSecurityFlow when authSecurityEnabled is true', () => {
    mockSecurityConfig.authSecurityEnabled = true;
    mockSessionState.status = 'signedIn';
    mockSessionState.session = { user: { id: 'user-1' } };
    mockAuthSecurityState.isLocked = true;

    render(<AuthSecurityGate />);
    expect(screen.getByTestId('auth-security-flow')).toBeTruthy();
  });

  it('does not render children while the app is locked', () => {
    mockSecurityConfig.authSecurityEnabled = true;
    mockSessionState.status = 'signedIn';
    mockSessionState.session = { user: { id: 'user-1' } };
    mockAuthSecurityState.isLocked = true;

    render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );

    expect(screen.queryByTestId('protected-child')).toBeNull();
  });

  it('does not render children while the lock state is still resolving', () => {
    mockSecurityConfig.authSecurityEnabled = true;
    mockSessionState.status = 'signedIn';
    mockSessionState.session = { user: { id: 'user-1' } };
    mockAuthSecurityState.isReady = false;

    render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );

    expect(screen.queryByTestId('protected-child')).toBeNull();
    expect(screen.queryByTestId('auth-security-flow')).toBeNull();
  });

  it('renders children after unlock', () => {
    mockSecurityConfig.authSecurityEnabled = true;
    mockSessionState.status = 'signedIn';
    mockSessionState.session = { user: { id: 'user-1' } };

    render(
      <AuthSecurityGate>
        <View testID="protected-child" />
      </AuthSecurityGate>,
    );

    expect(screen.getByTestId('protected-child')).toBeTruthy();
  });

  it('mounts protected children only once after the lock is cleared', () => {
    const mountSpy = jest.fn();

    function ProtectedChild() {
      useEffect(() => {
        mountSpy();
      }, []);

      return <View testID="protected-child" />;
    }

    mockSecurityConfig.authSecurityEnabled = true;
    mockSessionState.status = 'signedIn';
    mockSessionState.session = { user: { id: 'user-1' } };
    mockAuthSecurityState.isLocked = true;

    const { rerender } = render(
      <AuthSecurityGate>
        <ProtectedChild />
      </AuthSecurityGate>,
    );

    expect(screen.queryByTestId('protected-child')).toBeNull();
    expect(mountSpy).not.toHaveBeenCalled();

    mockAuthSecurityState.isLocked = false;
    rerender(
      <AuthSecurityGate>
        <ProtectedChild />
      </AuthSecurityGate>,
    );

    expect(screen.getByTestId('protected-child')).toBeTruthy();
    expect(mountSpy).toHaveBeenCalledTimes(1);
  });
});
