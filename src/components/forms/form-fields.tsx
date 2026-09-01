import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, radius, spacing, typography } from '@/src/theme/tokens';

interface FormTextFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad' | 'email-address';
  editable?: boolean;
  disabled?: boolean;
}

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  editable = true,
  disabled = false,
}: FormTextFieldProps<TFieldValues>) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
          <TextInput
            value={typeof value === 'string' ? value : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={editable && !disabled}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: editable && !disabled ? colors.surface : colors.surfaceAlt,
                borderColor: error ? colors.danger : colors.border,
                opacity: editable && !disabled ? 1 : 0.7,
              },
            ]}
            accessibilityLabel={label}
            accessibilityState={{ disabled: !editable || disabled }}
          />
          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

export function FormSubmitButton({
  label,
  onPress,
  disabled,
  loading,
  loadingLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}) {
  const { resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      style={[
        styles.submitButton,
        {
          backgroundColor: disabled || loading ? colors.surfaceAlt : colors.primary,
        },
      ]}>
      <View style={styles.submitContent}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
        <Text style={styles.submitLabel}>{loading ? (loadingLabel ?? `${label}...`) : label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  error: {
    ...typography.body,
  },
  submitButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  submitLabel: {
    color: '#fff',
    ...typography.body,
    fontWeight: '700',
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
