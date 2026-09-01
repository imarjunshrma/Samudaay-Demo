import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AdminDirectoryMemberFormContent } from '../components/admin-directory-member-form-content';

type AdminDirectoryMemberFormScreenProps = {
  memberId?: string;
  mode: 'add' | 'edit';
};

export function AdminDirectoryMemberFormScreen({ memberId, mode }: AdminDirectoryMemberFormScreenProps) {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFormInstanceKey((current) => current + 1);

      return undefined;
    }, []),
  );

  return <AdminDirectoryMemberFormContent key={`${mode}-${formInstanceKey}-${memberId ?? 'new'}`} memberId={memberId} mode={mode} />;
}

export default AdminDirectoryMemberFormScreen;
