import { useLocalSearchParams } from 'expo-router';

import { AdminTrusteeFormScreen } from '@/src/features/admin/screens';

export default function AdminManageTrusteesEditRoute() {
  const params = useLocalSearchParams<{ memberId?: string | string[] }>();
  const memberId = Array.isArray(params.memberId) ? params.memberId[0] : params.memberId;

  return <AdminTrusteeFormScreen memberId={memberId} mode="edit" />;
}
