import { View } from 'react-native';

import { TextField } from '@/src/components';
import { spacing } from '@/src/theme';

export function SuperAdminStack({
  fields,
}: {
  fields: readonly [string, string][];
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      {fields.map(([label, placeholder]) => (
        <TextField key={label} label={label} placeholder={placeholder} />
      ))}
    </View>
  );
}
