import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

import { clientPaletteItems } from './client-palette-items';

export function VisualIdentityCard() {
  const [logo, setLogo] = useState<FileValue | null>(null);
  const t = useTranslations('super-admin.visual-identity');

  return (
    <View style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[5] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <MaterialIcons name="palette" size={20} color={colors.primary.DEFAULT} />
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          {t('title')}
        </Text>
      </View>
      <FileUpload
        label={t('fields.logo')}
        value={logo}
        onChange={setLogo}
        variant="dashed"
        emptyTitle={t('fields.logoUpload')}
        emptyDescription={t('fields.logoHelp')}
      />
      <View style={{ gap: spacing[4] }}>
        <FormLabel uppercase>{t('fields.palette')}</FormLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
          {clientPaletteItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              accessibilityRole="button"
              activeOpacity={0.85}
              style={{ width: '48%', borderRadius: 16, borderWidth: 1, borderColor: item.name === 'Bespoke Tan' ? colors.primary.DEFAULT : 'rgba(212,195,190,0.35)', backgroundColor: '#ffffff', padding: spacing[4], gap: spacing[2] }}>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                {item.swatches.map((swatch) => (
                  <View key={swatch} style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: swatch }} />
                ))}
              </View>
              <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ width: '48%', borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(212,195,190,0.45)', backgroundColor: '#ffffff', padding: spacing[4], alignItems: 'center', justifyContent: 'center', gap: spacing[1] }}>
            <MaterialIcons name="add-circle" size={20} color="#94a3b8" />
            <Text variant="caption" color="#94a3b8" style={{ fontFamily: typography.fontFamily.bold }}>
              {t('fields.customHex')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
