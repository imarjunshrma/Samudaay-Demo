const configuredSecurityAuthEnabled = process.env.EXPO_PUBLIC_SECURITY_AUTH_ENABLED?.trim().toLowerCase();

export const securityConfig = {
  authSecurityEnabled: configuredSecurityAuthEnabled === 'true',
} as const;
