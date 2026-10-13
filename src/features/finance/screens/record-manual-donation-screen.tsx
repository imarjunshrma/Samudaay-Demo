import React from 'react';

import { AppSafeAreaView, EmptyState } from '@/src/components';
import { useDonationModuleVisibility } from '@/src/features/finance/hooks';
import { RecordManualDonationContent as RecordManualDonationContentView } from '../components/record-manual-donation-content';

export function RecordManualDonationScreen() {
  const { enabled: donationModuleEnabled } = useDonationModuleVisibility();

  if (!donationModuleEnabled) {
    return (
      <AppSafeAreaView style={{ flex: 1 }}>
        <EmptyState
          icon="volunteer-activism"
          title="Contribution module is unavailable"
          description="This module is currently hidden for this app."
        />
      </AppSafeAreaView>
    );
  }

  return <RecordManualDonationContentView />;
}

export default RecordManualDonationScreen;
