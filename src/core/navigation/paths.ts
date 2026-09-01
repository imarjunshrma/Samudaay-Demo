export const appPaths = {
  auth: {
    login: '/login',
  },
  onboarding: {
    intro: '/welcome',
    registration: '/registration-kyc',
    approval: '/kyc-approval',
  },
  member: {
    home: '/member',
    community: '/member/community',
    members: '/member/members',
    matrimony: '/member/matrimony',
    profile: '/member/profile',
    directory: '/member/community-directory',
    events: '/member/events',
    donations: '/member/donations',
  },
  admin: {
    home: '/admin/dashboard',
    analytics: '/admin/analytics',
    finance: '/admin/transaction-management',
  },
} as const;
