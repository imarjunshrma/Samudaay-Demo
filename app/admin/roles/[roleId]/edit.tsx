import { useLocalSearchParams } from 'expo-router';

import { AdminRoleFormContent } from '@/src/features/admin/components/admin-role-form-content';

export default function EditRoleRoute() {
  const params = useLocalSearchParams<{ roleId?: string | string[] }>();
  const roleId = Array.isArray(params.roleId) ? params.roleId[0] : params.roleId;

  return <AdminRoleFormContent mode="edit" roleId={roleId} />;
}
