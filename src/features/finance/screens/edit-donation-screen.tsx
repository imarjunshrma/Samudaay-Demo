import React from 'react';

import { AppSafeAreaView, EmptyState } from '@/src/components';
import { useDonationModuleVisibility } from '@/src/features/finance/hooks';
import { EditDonationContent as EditDonationContentView } from '../components/edit-donation-content';

export function EditDonationScreen() {
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

  return <EditDonationContentView />;
}

export default EditDonationScreen;
