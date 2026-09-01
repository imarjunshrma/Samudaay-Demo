import { AdminTrusteeFormContent } from '../components/admin-trustee-form-content';

type AdminTrusteeFormScreenProps = {
  memberId?: string;
  mode: 'add' | 'edit';
};

export function AdminTrusteeFormScreen({ memberId, mode }: AdminTrusteeFormScreenProps) {
  return <AdminTrusteeFormContent memberId={memberId} mode={mode} />;
}

export default AdminTrusteeFormScreen;
