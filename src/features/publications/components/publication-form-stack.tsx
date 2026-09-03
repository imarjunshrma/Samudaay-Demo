import { View } from 'react-native';

import { TextField } from '@/src/components';
import { shadows, spacing } from '@/src/theme';

export function PublicationFormStack() {
  return (
    <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: 'rgba(24,168,117,0.05)', ...shadows.sm }}>
      {[
        ['Edition Title', 'April 2026 Community Digest'],
        ['Month', 'April 2026'],
        ['Theme', 'Events, education, trustees'],
      ].map(([label, placeholder]) => (
        <View key={label} style={{ gap: spacing[2] }}>
          <TextField
            label={label}
            placeholder={placeholder}
            variant="registration"
            labelVariant="default"
          />
        </View>
      ))}
    </View>
  );
}
