export type MatrimonyStatus = 'New Request' | 'Approved' | 'Rejected';

export type MatrimonyTabKey = 'new' | 'approved' | 'rejected';

export type MatrimonyPeriodFilterKey = 'all' | 'today' | 'last7Days' | 'thisMonth' | 'older' | 'custom';

export type MatrimonyReviewItem = {
  id: string;
  name: string;
  ageLocation: string;
  profession: string;
  image: string;
  status: MatrimonyStatus;
  submittedAt: string;
  city: string;
  note?: string;
  rejectionReason?: string;
};

export const MATRIMONY_REVIEWS: MatrimonyReviewItem[] = [
  {
    id: 'mat-1',
    name: 'Rajesh Kumar',
    ageLocation: '28 yrs • Agra, Uttar Pradesh',
    profession: 'Leather Artisan (Footwear Designer)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmJHfev4IgLlWlFQHpoNr3lTyaVJieAzz0IbDAUHY08MH2kK0J74C6_aiBQA40ejaCVIbys0jA-QZy3Mf6aokHXKrBExhu_tKGmKMa4OAmWcqWTJFBSnkmgtEdkNcgUHlpDLkTkmfrWodXdP8MrocSQ7E-MSinIedJIbrcNlBs5tn52jZFQObPYQ3uHpmu2PnQ8SSwxLnB1WTcEsMpsL1pBDivm78cjyqbrMMGiqVEg61jkEyIRlRyvIEHJLRLDIeBP495lJTbtOw4',
    status: 'New Request',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    city: 'Agra',
    note: 'Fresh request from community referral.',
  },
  {
    id: 'mat-2',
    name: 'Priya Verma',
    ageLocation: '25 yrs • Mumbai, Maharashtra',
    profession: 'Boutique Owner',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsObRfnNG2NKOdtjuWxYp35mRfoYVnCO_wpaDH2zgBZHgvaYDb0VKKKVpGi852mpopS0B2VPaP3X6Z0RoGQXn2j9e31ZLbjU3PFddHk_FHhgdFCOorXEoQxyHu396bOI_HXXQXhZweHLYSdW3JxqxxPIZhG6_kWraAVeV8FPH_m-S-sZL5qBht1U7fTpXc8xRYFVQRev7-rwevrl9lc_SgrPg6CooPtirPyBo4V5ujkkxKqhlgNi5P9E2lPPA4bvaUvU-J60U9JinL',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    city: 'Mumbai',
    note: 'Approved after manual profile review.',
  },
  {
    id: 'mat-3',
    name: 'Amit Jaiswal',
    ageLocation: '30 yrs • Meerut, Uttar Pradesh',
    profession: 'Store Owner',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpgp5827KyKV1Z6_-vW9n5N5CwRaeNN6b25IIlxvmI4KoESOPtavy07e9JrhaGMmuAy9i1edUmBre7XqT79baQLfeNuxL940Mu3ANluE0rmF-yIPi43iiMAO7q9pB6awVsG7T9VCpQfYT8_vrpxc4A3O-ratLKwdTMDzsT7rs9sjq1e4tojgTG09yBPLE5rY-XOIFdMMKZ72Zf90fsL5t18yr7_EnQKMTeCySlU8xTTkEPpa854Eg-TxdrvGfntYjxzrmgX6qvrkgh',
    status: 'Rejected',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    city: 'Meerut',
    note: 'Rejected after profile verification.',
    rejectionReason: 'Incomplete profile details.',
  },
];

export function getMatrimonyReviewById(id: string) {
  return MATRIMONY_REVIEWS.find((item) => item.id === id) ?? null;
}
