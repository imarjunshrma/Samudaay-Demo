import { useLocalSearchParams } from 'expo-router';

import { AdminAdvertisementFormScreen } from '@/src/features/admin/screens';

export default function AdminAdvertisementEditRoute() {
  const params = useLocalSearchParams<{ promotionId?: string }>();
  const promotionId = Array.isArray(params.promotionId) ? params.promotionId[0] : params.promotionId;

  return <AdminAdvertisementFormScreen mode="edit" promotionId={promotionId} />;
}
