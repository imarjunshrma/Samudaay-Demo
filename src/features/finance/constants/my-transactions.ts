export const myTransactionsItems = [
  { title: 'Annual Charity Fund', meta: 'Oct 22, 2023 • Contribution', amount: '-$500.00', icon: 'volunteer-activism', tone: '#16a34a', bg: '#dcfce7' },
  { title: 'Gala Night 2023', meta: 'Oct 15, 2023 • Event Registration', amount: '-$150.00', icon: 'event-available', tone: '#2563eb', bg: '#dbeafe' },
  { title: 'Premium Membership', meta: 'Oct 01, 2023 • Matrimony Sub.', amount: '-$299.00', icon: 'favorite', tone: '#f2780d', bg: 'rgba(242,120,13,0.1)' },
  { title: 'Community Kitchen', meta: 'Sep 28, 2023 • Contribution', amount: '-$301.00', icon: 'volunteer-activism', tone: '#16a34a', bg: '#dcfce7' },
] as const;

export const myTransactionsBottomNav = [
  { icon: 'home', label: 'Home', active: false },
  { icon: 'account-balance-wallet', label: 'Transactions', active: true },
  { icon: 'person', label: 'Profile', active: false },
  { icon: 'settings', label: 'Settings', active: false },
] as const;
