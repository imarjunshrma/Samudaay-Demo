import { FormLabel } from '@/src/components/forms/FormLabel';
import { useField } from 'formik';
import { Platform, TextInput, View } from 'react-native';

import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { TextFieldProps } from './TextField.types';

const variantStyles = {
  default: {
    minHeight: 52,
    borderRadius: radius.xl,
    borderColor: colors.primary.border,
    backgroundColor: colors.background.surface,
  },
  filled: {
    minHeight: 52,
    borderRadius: radius.xl,
    borderColor: colors.primary.borderLight,
    backgroundColor: colors.primary.subtle,
  },
  search: {
    minHeight: 52,
    borderRadius: radius.xl,
    borderColor: colors.primary.borderLight,
    backgroundColor: colors.background.surface,
  },
  compact: {
    minHeight: 44,
    borderRadius: radius.lg,
    borderColor: colors.primary.borderLight,
    backgroundColor: colors.background.surface,
  },
  registration: {
    minHeight: 48,
    borderRadius: radius.lg,
    borderColor: colors.primary.borderLight,
    backgroundColor: colors.background.surface,
  },
} as const;

type InputBodyProps = TextFieldProps & {
  value?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  resolvedError?: string;
};

function TextFieldBody({
  label,
  placeholder,
  helperText,
  hint,
  disabled,
  required,
  multiline,
  numberOfLines,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  autoCorrect,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
  maxLength,
  leftIcon,
  rightIcon,
  value,
  onChangeText,
  onBlur,
  resolvedError,
  variant = 'default',
  labelVariant = 'uppercase',
  inputStyle,
  inputRef,
  useSystemFont = false,
}: InputBodyProps) {
  const hasError = Boolean(resolvedError);
  const fieldVariant = variantStyles[variant];

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? (
        <FormLabel uppercase={labelVariant === 'uppercase'} error={hasError}>
          {`${label}${required ? ' *' : ''}`}
        </FormLabel>
      ) : null}
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        {leftIcon ? (
          <View style={{ position: 'absolute', left: spacing[3], zIndex: 1 }}>
            {leftIcon}
          </View>
        ) : null}
        {rightIcon ? (
          <View style={{ position: 'absolute', right: spacing[3], zIndex: 1 }}>
            {rightIcon}
          </View>
        ) : null}
        <TextInput
          ref={inputRef}
          value={value ?? ''}
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          maxLength={maxLength}
          style={{
            minHeight: multiline ? 96 : fieldVariant.minHeight,
            borderRadius: fieldVariant.borderRadius,
            borderWidth: 1,
            borderColor: hasError ? colors.status.error : fieldVariant.borderColor,
            backgroundColor: disabled ? colors.background.muted : fieldVariant.backgroundColor,
            paddingLeft: leftIcon ? 44 : spacing[3],
            paddingRight: rightIcon ? 44 : spacing[3],
            paddingVertical: multiline ? spacing[3] : spacing[3],
            color: colors.text.primary,
            ...(typography.text.body as object),
            ...(useSystemFont
              ? {
                  fontFamily: Platform.select({
                    ios: 'System',
                    android: 'sans-serif',
                    default: undefined,
                  }),
                  fontWeight: undefined,
                }
              : {}),
            textAlignVertical: multiline ? 'top' : 'center',
            ...(inputStyle as object),
          }}
        />
      </View>
      {hasError ? (
        <Text variant="caption" color={colors.status.error}>
          {resolvedError}
        </Text>
      ) : helperText || hint ? (
        <Text variant="caption" color={colors.text.muted}>
          {helperText ?? hint}
        </Text>
      ) : null}
    </View>
  );
}

function FormikTextField(props: TextFieldProps & { name: string }) {
  const [field, meta, helpers] = useField<string>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextFieldBody
      {...props}
      value={field.value ?? ''}
      onBlur={() => helpers.setTouched(true)}
      onChangeText={(nextValue) => helpers.setValue(nextValue)}
      resolvedError={hasError ? meta.error : props.error}
      inputRef={props.inputRef}
    />
  );
}

function ControlledTextField(props: TextFieldProps) {
  return (
    <TextFieldBody
      {...props}
      value={props.value ?? ''}
      onChangeText={props.onChangeText ?? (() => undefined)}
      resolvedError={props.error}
      inputRef={props.inputRef}
    />
  );
}

export function TextField(props: TextFieldProps) {
  if (props.name) {
    return <FormikTextField {...(props as TextFieldProps & { name: string })} />;
  }

  return <ControlledTextField {...props} />;
}
