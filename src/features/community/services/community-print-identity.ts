import { COMMUNITY_SELECTION_ENABLED, communityConfig, communityStore } from '@/src/core/config/community';
import { DONATION_RECEIPT_LOGO_URI, DONATION_RECEIPT_QR_URI } from '@/src/features/finance/services/donation-receipt-assets';

import { getPrintAssets } from './community-selection.service';

/** Trust details printed on receipts and reports for the active community. */
export interface CommunityPrintIdentity {
  trustName: string;
  trustNameLocal: string | null;
  address: string | null;
  addressLocal: string | null;
  registrationNumber: string | null;
  phoneNumber: string | null;
  bankAccountName: string | null;
  bankName: string | null;
  bankBranch: string | null;
  bankIfscCode: string | null;
  bankAccountNumber: string | null;
  registration80GNumber: string | null;
  panNumber: string | null;
}

export interface ReceiptPrintContext {
  logoUri: string | null;
  qrUri: string | null;
  /** null = dedicated build: keep the template's built-in trust details. */
  identity: CommunityPrintIdentity | null;
}

export function getReceiptPrintContext(): ReceiptPrintContext {
  if (!COMMUNITY_SELECTION_ENABLED) {
    return { logoUri: DONATION_RECEIPT_LOGO_URI, qrUri: DONATION_RECEIPT_QR_URI, identity: null };
  }

  const config = communityStore.getState().appConfig;
  const assets = getPrintAssets();
  return {
    logoUri: assets.receiptLogo,
    qrUri: assets.receiptQr,
    identity: {
      trustName: config?.general.trustName || communityConfig.tenantName || 'Community',
      trustNameLocal: config?.general.trustNameLocal ?? null,
      address: config?.general.address ?? null,
      addressLocal: config?.general.addressLocal ?? null,
      registrationNumber: config?.general.registrationNumber ?? null,
      phoneNumber: config?.general.phoneNumber ?? null,
      bankAccountName: config?.bank.bankAccountName ?? null,
      bankName: config?.bank.bankName ?? null,
      bankBranch: config?.bank.bankBranch ?? null,
      bankIfscCode: config?.bank.bankIfscCode ?? null,
      bankAccountNumber: config?.bank.bankAccountNumber ?? null,
      registration80GNumber: config?.general.registration80GNumber ?? null,
      panNumber: config?.general.panNumber ?? null,
    },
  };
}

/** Logo for generated reports and certificates; the bundled logo only in dedicated builds. */
export function getReportLogoUri() {
  if (!COMMUNITY_SELECTION_ENABLED) {
    return DONATION_RECEIPT_LOGO_URI;
  }
  const assets = getPrintAssets();
  return assets.reportLogo || assets.receiptLogo || '';
}
