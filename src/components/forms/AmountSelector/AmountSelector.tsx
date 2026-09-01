import { useField } from 'formik';
import { Pressable, TextInput, View } from 'react-native';

import { Text } from '@/src/components/ui';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

type AmountSelectorProps = {
  name?: string;
  label?: string;
  customAmountLabel?: string;
  customHelperText?: string;
  amounts?: number[];
  presets?: number[];
  value?: number | '';
  onChange?: (value: number | '') => void;
  allowCustom?: boolean;
  error?: string;
  variant?: 'pill' | 'grid' | 'inline';
  chipRadius?: number;
  inputRadius?: number;
  inputBackgroundColor?: string;
};

function AmountSelectorBody({
  label,
  customAmountLabel,
  customHelperText,
  amounts,
  presets,
  value,
  onChange,
  allowCustom = true,
  error,
  variant = 'pill',
  chipRadius,
  inputRadius = radius.xl,
  inputBackgroundColor = colors.background.surface,
}: AmountSelectorProps & { onChange: (value: number | '') => void }) {
  const t = useTranslations();
  const items = presets ?? amounts ?? [];

  return (
    <View style={{ gap: spacing[3] }}>
      {label ? (
        <Text
          variant="caption"
          color={error ? colors.status.error : '#6b7280'}
          style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </Text>
      ) : null}
      {items.length ? (
        <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
          {items.map((amount) => {
            const active = Number(value) === amount;
            return (
              <Pressable
                key={amount}
                onPress={() => onChange(amount)}
                style={{
                  borderRadius: chipRadius ?? (variant === 'pill' ? radius.full : radius.lg),
                  borderWidth: 1,
                  borderColor: colors.primary.border,
                  backgroundColor: active ? colors.primary.muted : colors.background.surface,
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[3],
                }}>
                <Text variant="body" color={active ? colors.primary.DEFAULT : colors.primary.dark!}>
                  ₹{amount}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {allowCustom ? (
        <View style={{ gap: spacing[2] }}>
          {customAmountLabel ? (
            <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {customAmountLabel}
            </Text>
          ) : null}
          <TextInput
            value={value === '' ? '' : String(value ?? '')}
            onChangeText={(nextValue) => onChange(nextValue ? Number(nextValue.replace(/[^\d]/g, '')) : '')}
            keyboardType="number-pad"
            placeholder={t('amount.customPlaceholder')}
            placeholderTextColor="#94a3b8"
            style={{
              minHeight: 52,
              borderRadius: inputRadius,
              borderWidth: 1,
              borderColor: error ? colors.status.error : colors.primary.border,
              backgroundColor: inputBackgroundColor,
              paddingHorizontal: spacing[3],
              color: colors.text.primary,
            }}
          />
          {customHelperText ? (
            <Text variant="caption" color={colors.text.muted} style={{ lineHeight: 18 }}>
              {customHelperText}
            </Text>
          ) : null}
        </View>
      ) : null}
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function FormikAmountSelector(props: AmountSelectorProps & { name: string }) {
  const [field, meta, helpers] = useField<number | ''>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <AmountSelectorBody
      {...props}
      value={field.value}
      onChange={(nextValue) => helpers.setValue(nextValue)}
      error={hasError ? meta.error : props.error}
    />
  );
}

export function AmountSelector(props: AmountSelectorProps) {
  if (props.name) {
    return <FormikAmountSelector {...(props as AmountSelectorProps & { name: string })} />;
  }

  return <AmountSelectorBody {...props} value={props.value} onChange={props.onChange ?? (() => undefined)} />;
}
