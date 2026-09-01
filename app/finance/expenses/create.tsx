import { ExpenseManagementScreen } from '@/src/features/admin/screens';

export default function MemberCreateExpenseRoute() {
  return <ExpenseManagementScreen mode="create" viewMode="member" submissionMode="member" />;
}
