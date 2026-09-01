import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { UploadMarksheetContent as UploadMarksheetContentView } from '../components/upload-marksheet-content';

export function UploadMarksheetScreen() {
  const params = useLocalSearchParams<{ familyMemberId?: string | string[] }>();
  const familyMemberId = Array.isArray(params.familyMemberId) ? params.familyMemberId[0] : params.familyMemberId;

  return <UploadMarksheetContentView selectedFamilyMemberId={familyMemberId ?? null} />;
}

export default UploadMarksheetScreen;
