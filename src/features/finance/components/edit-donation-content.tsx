import { useLocalSearchParams } from 'expo-router';

import { RecordManualDonationContent } from './record-manual-donation-content';

export function EditDonationContent() {
  const params = useLocalSearchParams<{ donationId?: string }>();
  const donationId = typeof params.donationId === 'string' ? params.donationId : undefined;

  return <RecordManualDonationContent donationId={donationId} editMode title="Edit Contribution" submitLabel="Update Contribution" />;
}
