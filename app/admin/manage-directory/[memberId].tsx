import { useLocalSearchParams } from 'expo-router';

import { AdminDirectoryMemberFormScreen } from '@/src/features/admin/screens';

export default function AdminManageDirectoryMemberRoute() {
  const params = useLocalSearchParams<{ memberId?: string }>();
  const memberId = Array.isArray(params.memberId) ? params.memberId[0] : params.memberId;
  return <AdminDirectoryMemberFormScreen mode="edit" memberId={memberId} />;
}
