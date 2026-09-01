import React from 'react';
import { ExpenseManagementContent as ExpenseManagementContentView } from '../components/expense-management-content';

type ExpenseManagementScreenProps = Parameters<typeof ExpenseManagementContentView>[0];

export function ExpenseManagementScreen(props: ExpenseManagementScreenProps) {
  return <ExpenseManagementContentView {...(props ?? {})} />;
}

export default ExpenseManagementScreen;
