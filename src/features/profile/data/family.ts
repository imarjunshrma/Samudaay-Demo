import type { ListItem } from '@/src/types/app';

export interface FamilyListMember extends ListItem {
  id: string;
  image: string;
  badge?: string;
  bloodGroup?: string | null;
  aadhaarNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: string | null;
  education?: string | null;
  schoolName?: string | null;
  currentClass?: string | null;
  occupation?: string | null;
}

export const familyMembers: FamilyListMember[] = [
  {
    id: 'fm-1',
    title: 'Rajesh Kumar',
    subtitle: 'Self • 42 Years',
    meta: 'Occupation: Master Cobbler',
    status: 'Primary',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGLYWtIwR5zAKOcFFilfaFv7Okkkp9xKSwGsblgoMxzYjvPmaz5kV6OSJe2fLY8lHwYdFa-ROzRy8RQ5j-VEw7oboofbURC6qGrigxyRdFFt0iLzFRpa5Sf4_teXQ33ogFAUzkde4uZc5XRUVQUMwFrbE_ufn8Wq4-2Qh18L0qfWInQIiERCgu4CXzjcOR5qoshVwY2bb94CZHXwjq01qxTaJb43kMDkwEvJPmXksunvPTvW_GZhA0c_rFVM6VfwjJdk1Njf8EmWlI',
    badge: 'Primary',
  },
  {
    id: 'fm-2',
    title: 'Sunita Devi',
    subtitle: 'Spouse • 38 Years',
    meta: 'Education: 10th Pass',
    status: 'Active',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrtPEuMZlpn5_Y12Gvx3BRmFuUdjcKSKjKsViZMh-LNLBNnzPwssmK5yhdf9QprdvWnuG2l1asGEZ96qSfDVirGcRY9Uppa_Za07RcRTnJdal0fmI_aVwUupyIDxXj2kDR7d3ZQh_DIzJh4zOljp4sy6IU5L2aJoZ1-L3K8ptezmcsH5FQHsn9UJJ0BMX1M1EbB2ZWIHa_6_AUOI20A0S2gua9zd6vw6luqJoup3xBxI2EvWpwq_AFHVuxP80JwD2iv3ZqKhwU_ey',
  },
  {
    id: 'fm-3',
    title: 'Anjali Kumar',
    subtitle: 'Daughter • 14 Years',
    meta: 'Class 9 • Govt. Girls School',
    status: 'Student',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCw5VD6MdutS3CaNAl1HgeEKK3soJlkRoxBMGBKzKvnKcLmfNzd3YY6gBH_UPa6X4-s3fUo-KwdBFVSkFv7bg0iWDvSjeIWfgP1gWLpFo7-myLsAxT1Ekp3KydDyJxVuOps9FEaVgv2zO_Nz9zZP9VhANIZq5X9E5n-nTx46EBT8RXr_CxksgNYnDt3mXh1gyCl5crPcU6qGkIZNW538jaBe4DzQXwuVUdADzRv5A3RmUqT8y6BfMM64cTRGQCHTsbmQnC-iPm184WO',
  },
];

export function getFamilyMemberById(memberId: string) {
  return familyMembers.find((member) => member.id === memberId);
}
