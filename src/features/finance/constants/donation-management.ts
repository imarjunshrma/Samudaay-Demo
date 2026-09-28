export const donationHistoryItems = [
  { amount: '₹5,000', meta: 'Oct 12, 2023 • Self' },
  { amount: '₹10,000', meta: 'Sep 28, 2023 • Ramesh Kumar (Father)' },
  { amount: '₹2,500', meta: 'Aug 15, 2023 • Self' },
] as const;

export const donationBottomNav = [
  { key: 'home', label: 'Home', icon: 'home', active: false },
  { key: 'family', label: 'Family', icon: 'groups', active: false },
  { key: 'donations', label: 'Contributions', icon: 'volunteer-activism', active: true },
  { key: 'profile', label: 'Profile', icon: 'person', active: false },
] as const;
