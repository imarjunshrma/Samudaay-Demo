import type { DiscoveryCardProps } from './discovery-card';

export type PremiumDiscoveryProfile = Pick<
  DiscoveryCardProps,
  'name' | 'subtitle' | 'image' | 'ageHeight' | 'education' | 'profession'
> & {
  ageGroup: string;
  educationGroup: string;
  cityGroup: string;
};

export const PREMIUM_AGE_OPTIONS = [
  { key: 'all', label: 'All Ages' },
  { key: '25-30', label: '25 - 30' },
  { key: '31-35', label: '31 - 35' },
  { key: '36-40', label: '36 - 40' },
] as const;

export const PREMIUM_EDUCATION_OPTIONS = [
  { key: 'all', label: 'All Education' },
  { key: 'graduate', label: 'Graduate' },
  { key: 'postgraduate', label: 'Post Graduate' },
  { key: 'professional', label: 'Professional' },
] as const;

export const PREMIUM_CITY_OPTIONS = [
  { key: 'all', label: 'All Cities' },
  { key: 'vadodara', label: 'Vadodara' },
  { key: 'ahmedabad', label: 'Ahmedabad' },
  { key: 'surat', label: 'Surat' },
] as const;

export const PREMIUM_DISCOVERY_PROFILES: readonly PremiumDiscoveryProfile[] = [
  {
    name: 'Aarav Shah',
    subtitle: 'Vadodara',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    ageHeight: '28 • 5\' 8"',
    education: 'MBA',
    profession: 'Business Analyst',
    ageGroup: '25-30',
    educationGroup: 'postgraduate',
    cityGroup: 'vadodara',
  },
  {
    name: 'Meera Patel',
    subtitle: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    ageHeight: '27 • 5\' 4"',
    education: 'B.Com',
    profession: 'Chartered Accountant',
    ageGroup: '25-30',
    educationGroup: 'graduate',
    cityGroup: 'ahmedabad',
  },
  {
    name: 'Rohan Mehta',
    subtitle: 'Surat',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    ageHeight: '33 • 5\' 10"',
    education: 'M.Tech',
    profession: 'Product Engineer',
    ageGroup: '31-35',
    educationGroup: 'postgraduate',
    cityGroup: 'surat',
  },
  {
    name: 'Priya Desai',
    subtitle: 'Vadodara',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    ageHeight: '29 • 5\' 5"',
    education: 'MBBS',
    profession: 'Physician',
    ageGroup: '25-30',
    educationGroup: 'professional',
    cityGroup: 'vadodara',
  },
] as const;
