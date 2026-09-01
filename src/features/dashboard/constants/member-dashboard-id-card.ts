export const memberDashboardCards = [
  { title: 'My Profile', subtitle: 'Manage details', icon: 'person' },
  { title: 'Family', subtitle: '4 Registered', icon: 'family-restroom' },
  { title: 'Events', subtitle: 'Next: Annual Meet', icon: 'calendar-month' },
  { title: 'Donations', subtitle: 'History & Support', icon: 'volunteer-activism' },
  { title: 'Publication', subtitle: "The Cobbler's Journal", icon: 'newspaper' },
  { title: 'Matrimony', subtitle: 'Find matches', icon: 'favorite' },
] as const;

export const memberDashboardUpdates = [
  {
    type: 'image',
    title: 'Skill Workshop in Mumbai',
    subtitle: '2 days ago • Community Center',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB',
  },
  {
    type: 'icon',
    title: 'Health Insurance Drive Started',
    subtitle: '5 days ago • Welfare Board',
    icon: 'campaign',
  },
] as const;

export const memberDashboardBottomNav = [
  { key: 'home', label: 'Home', icon: 'home', active: true },
  { key: 'directory', label: 'Members', icon: 'groups', active: false },
  { key: 'services', label: 'Services', icon: 'handyman', active: false },
  { key: 'account', label: 'Account', icon: 'account-circle', active: false },
] as const;

export const memberDashboardImages = {
  memberPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcTdiOPDFjB0DIG6ekJmydxKptp_AKtUY16EjP9JCuLZYwa-fdfH48OI1asmtP4RTU3E45Muq36kU4TuPc1ppDyympPbZY5FhgXEqmPhKsIC_ZdY21lYRrRK06RsbgH1MBaXXXP5tXi0uU2U2n_90x-G_mqpzQ5VxeXLxWlkRDrz-4C6mFxPatuU1QBa-FsEv9PlFfeZcjweOkW6Rhgadcs6krvBlRwAKU-ZN_cShw6PwgAW5oE4kEZYvAklE75L9J3aPyI_OR9inX',
  qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_NQ8t26AbRvCgZ3RZC1OfRIuu86GwJnKa5qlryBtDBAeI52PY0ugDkPAVgekUW2Pgv3mk42jBL1S7VrWt9ZLGVLfas1hOk1JW1NwKUMl9gzz_Y9xoPNrGg6moTcX1UVMjkaI6dqozojsU7YYzCqIocqkeB7yCQZXm0QeLE3X0og5kbGivGmR8lCtVKmhg3y1WqAyPj4wcCdv7E7rtEvbbuk4eKncK4bmwhD8ST1ewFAV1NsZXsM9mC8jAgqZ4h9c_n0Hi6ss-qd2V',
} as const;
