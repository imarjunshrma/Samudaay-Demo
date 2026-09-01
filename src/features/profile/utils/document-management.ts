import { colors } from '@/src/theme';
import type { KycDocument } from '@/src/features/registration/types/registration';

export type DocumentSlot = {
  type: string;
  title: string;
  icon: 'badge' | 'description' | 'school';
};

export const REQUIRED_KYC_DOCUMENT_COUNT = 2;

export const DOCUMENT_SLOTS: DocumentSlot[] = [
  { type: 'AADHAAR_CARD', title: 'Aadhaar Card', icon: 'badge' },
  { type: 'JATI_NO_DAKHLO', title: 'Caste Certificate', icon: 'description' },
  { type: 'SCHOOL_CERTIFICATE', title: 'School Certificate', icon: 'school' },
];

export function normalizeDocumentType(value?: string | null) {
  return String(value || '').trim().toUpperCase();
}

export function inferDocumentType(document: KycDocument) {
  const explicitType = normalizeDocumentType(document.type);
  if (explicitType) {
    return explicitType;
  }

  const normalizedName = normalizeDocumentType(document.name);
  if (normalizedName.includes('AADHAAR')) {
    return 'AADHAAR_CARD';
  }
  if (normalizedName.includes('JATI') || normalizedName.includes('DAKHLO')) {
    return 'JATI_NO_DAKHLO';
  }
  if (normalizedName.includes('SCHOOL')) {
    return 'SCHOOL_CERTIFICATE';
  }
  return normalizedName;
}

export function getDocumentStatusMeta(document?: KycDocument) {
  if (!document) {
    return {
      label: 'Missing',
      fill: colors.text.muted,
      background: colors.background.surfaceAlt,
      dot: colors.text.muted,
      action: 'Upload',
      actionBackground: colors.primary.DEFAULT,
      actionText: colors.text.inverse,
      locked: false,
    };
  }

  if (document.status === 'uploaded') {
    return {
      label: 'Approved',
      fill: colors.status.success,
      background: colors.status.successLight,
      dot: colors.status.success,
      action: 'View',
      actionBackground: colors.background.elevated,
      actionText: colors.primary.dark,
      locked: true,
    };
  }

  if (document.status === 'failed') {
    return {
      label: 'Rejected',
      fill: colors.status.error,
      background: colors.status.errorLight,
      dot: colors.status.warning,
      action: 'Reupload',
      actionBackground: colors.primary.DEFAULT,
      actionText: colors.text.inverse,
      locked: false,
    };
  }

  return {
    label: 'Pending',
    fill: colors.status.warning,
    background: colors.status.warningLight,
    dot: colors.status.warning,
    action: 'View',
    actionBackground: colors.primary.DEFAULT,
    actionText: colors.text.inverse,
    locked: true,
  };
}

export function getDocumentSummary(documentsByType: Map<string, KycDocument>) {
  const summary = {
    verified: 0,
    rejected: 0,
    pending: 0,
    missing: 0,
    submitted: 0,
    required: REQUIRED_KYC_DOCUMENT_COUNT,
    total: DOCUMENT_SLOTS.length,
    needsAction: false,
  };

  for (const slot of DOCUMENT_SLOTS) {
    const document = documentsByType.get(slot.type);
    if (!document) {
      summary.missing += 1;
      continue;
    }

    if (document.status === 'uploaded') {
      summary.verified += 1;
      summary.submitted += 1;
    } else if (document.status === 'failed') {
      summary.rejected += 1;
    } else {
      summary.pending += 1;
      summary.submitted += 1;
    }
  }

  summary.needsAction = summary.rejected > 0 || summary.submitted < REQUIRED_KYC_DOCUMENT_COUNT;

  return summary;
}
