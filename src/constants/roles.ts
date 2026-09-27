import type { Permission, UserRole } from '@/src/types/app';

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'registration.manage',
    'kyc.approve',
    'profile_requests.manage',
    'profile.manage',
    'directory.view',
    'directory.manage',
    'user.manage',
    'users.view',
    'users.edit',
    'users.delete',
    'users.block',
    'events.view',
    'events.manage',
    'event.photo_upload',
    'events.attendance',
    'donations.view',
    'donations.manage',
    'transactions.manage',
    'analytics.view',
    'roles.manage',
    'admins.manage',
    'notifications.manage',
    'promotions.view',
    'promotions.manage',
    'matrimony.manage',
    'publications.manage',
  ],
  member: [
    'profile.manage',
    'directory.view',
    'events.view',
    'donations.view',
  ],
  community_member: [
    'profile.manage',
    'directory.view',
    'events.view',
    'donations.view',
  ],
  user: ['events.view', 'directory.view', 'profile.manage', 'donations.view'],
  trustee: ['profile.manage', 'directory.view', 'events.view', 'donations.view'],
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  member: 'Member',
  community_member: 'Community Member',
  user: 'User',
  trustee: 'Trustee',
};
