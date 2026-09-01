import { useLocalSearchParams } from 'expo-router';

import { FamilyMemberFormScreen } from '@/src/features/profile/screens';

export default function FamilyManagementEditRoute() {
  const { memberId } = useLocalSearchParams<{ memberId?: string }>();

  return <FamilyMemberFormScreen mode="edit" memberId={Array.isArray(memberId) ? memberId[0] : memberId} />;
}
