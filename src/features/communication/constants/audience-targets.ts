export type AudienceTargetKey =
  | 'all'
  | 'user'
  | 'trustee'
  | 'admin'
  | 'member'
  | 'community_member'
  | 'paid_donors'
  | 'matrimony_profiles'
  | 'family_profiles'
  | 'custom';

export type AudienceTargetOption = {
  key: AudienceTargetKey;
  label: string;
  roles?: string[];
  audienceSegments?: string[];
  allUsers?: boolean;
  custom?: boolean;
};

export const audienceTargetOptions: AudienceTargetOption[] = [
  { key: 'all', label: 'All Users', allUsers: true },
  { key: 'user', label: 'Users', roles: ['user'] },
  { key: 'trustee', label: 'Trustees', roles: ['trustee'] },
  { key: 'admin', label: 'Admin', roles: ['admin'] },
  { key: 'member', label: 'Members', roles: ['member'] },
  { key: 'community_member', label: 'Committee Member', roles: ['community_member'] },
  { key: 'paid_donors', label: 'Paid Contributors', audienceSegments: ['paid_donors'] },
  { key: 'matrimony_profiles', label: 'Matrimony Profiles', audienceSegments: ['matrimony_profiles'] },
  { key: 'family_profiles', label: 'People With Family', audienceSegments: ['family_profiles'] },
  { key: 'custom', label: 'Custom Role', custom: true },
];

export function getAudienceTargetOption(key: AudienceTargetKey) {
  return audienceTargetOptions.find((option) => option.key === key) ?? audienceTargetOptions[0];
}
