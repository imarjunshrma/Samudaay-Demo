import { useLocalSearchParams } from 'expo-router';

import { AdminAdvertisementFormScreen } from '@/src/features/admin/screens';

export default function AdminAdvertisementDetailsRoute() {
  const params = useLocalSearchParams<{ promotionId?: string }>();
  const promotionId = Array.isArray(params.promotionId) ? params.promotionId[0] : params.promotionId;

  return <AdminAdvertisementFormScreen mode="view" promotionId={promotionId} />;
}
