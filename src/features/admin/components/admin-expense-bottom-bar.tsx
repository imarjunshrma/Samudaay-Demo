import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, Button, SelectField, Text, TextField } from '@/src/components';

import { getVisibleAdminBottomBarItems } from '@/src/core/navigation/admin-shell';
import { useSession } from '@/src/core/providers/session-provider';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminExpenseBottomBar({
  activeKey = 'invoices',
  onChange,
}: {
  activeKey?: 'home' | 'clients' | 'invoices' | 'profile';
  onChange?: (key: 'home' | 'clients' | 'invoices' | 'profile') => void;
}) {
  const { session } = useSession();

  return (
    <AppBottomBar
      variant="admin"
      activeKey={activeKey}
      showLabels
      items={getVisibleAdminBottomBarItems(session)}
      onChange={(key) => onChange?.(key as 'home' | 'clients' | 'invoices' | 'profile')}
    />
  );
}
