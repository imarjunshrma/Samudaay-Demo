import * as DocumentPicker from 'expo-document-picker';

const DOCUMENT_PICKER_CANCELLED_MESSAGE = 'Document selection was cancelled.';

let activeDocumentPick: Promise<DocumentPicker.DocumentPickerResult> | null = null;

export function isDocumentPickerConsentCancelled(error: unknown) {
  return error instanceof Error && error.message === DOCUMENT_PICKER_CANCELLED_MESSAGE;
}

export async function requestDocumentPickerConsent() {
  return;
}

export async function pickDocumentWithGuard(options: DocumentPicker.DocumentPickerOptions) {
  if (activeDocumentPick) {
    return activeDocumentPick;
  }

  // The system document picker already handles user file selection; no extra app permission is required.
  const request = DocumentPicker.getDocumentAsync(options).finally(() => {
    activeDocumentPick = null;
  });

  activeDocumentPick = request;
  return request;
}

export function createDocumentPickerCancelledError() {
  return new Error(DOCUMENT_PICKER_CANCELLED_MESSAGE);
}
