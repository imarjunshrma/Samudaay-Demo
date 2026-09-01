import { useField } from 'formik';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { Icon, Text } from '@/src/components/ui';
import { useTranslations } from '@/src/i18n/use-translations';
import { formatDateLabel, getIntlLocale } from '@/src/utils';
import { colors, radius, spacing, typography } from '@/src/theme';

type DateFieldProps = {
  name?: string;
  label?: string;
  value?: Date;
  onChange?: (value: Date) => void;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  variant?: 'default' | 'registration';
  labelVariant?: 'uppercase' | 'default';
  required?: boolean;
};

function getDefaultPlaceholder(mode: DateFieldProps['mode'], t: ReturnType<typeof useTranslations>) {
  if (mode === 'time') {
    return t('dateField.selectTime');
  }

  if (mode === 'datetime') {
    return t('dateField.selectDateTime');
  }

  return t('dateField.selectDate');
}

function formatValue(value: Date, mode: DateFieldProps['mode'], language: 'en' | 'gu') {
  if (mode === 'time') {
    return value.toLocaleTimeString(getIntlLocale(language), {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (mode === 'datetime') {
    return `${formatDateLabel(value, language)} ${value.toLocaleTimeString(getIntlLocale(language), {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  return formatDateLabel(value, language);
}

function getPickerMode(mode: DateFieldProps['mode']): 'date' | 'time' | 'datetime' {
  return mode ?? 'date';
}

type DateFieldBodyProps = DateFieldProps & {
  value?: Date;
  onChange: (value: Date) => void;
};

function DateFieldBody({
  label,
  value,
  onChange,
  error,
  mode = 'date',
  placeholder,
  minimumDate,
  maximumDate,
  variant = 'default',
  labelVariant = 'uppercase',
  required = false,
}: DateFieldBodyProps) {
  const { language } = useAppPreferences();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const resolvedValue = value ? new Date(value) : new Date();
  const pickerMode = getPickerMode(mode);

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? (
        <Text
          variant="caption"
          color={error ? colors.status.error : labelVariant === 'uppercase' ? '#6b7280' : colors.text.primary}
          style={{
            fontFamily: labelVariant === 'uppercase' ? typography.fontFamily.bold : typography.fontFamily.semibold,
            textTransform: labelVariant === 'uppercase' ? 'uppercase' : 'none',
            letterSpacing: labelVariant === 'uppercase' ? 0.8 : 0,
            fontSize: labelVariant === 'uppercase' ? 12 : 14,
          }}>
          {`${label}${required ? ' *' : ''}`}
        </Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          minHeight: variant === 'registration' ? 48 : 52,
          borderRadius: variant === 'registration' ? radius.lg : radius.xl,
          borderWidth: 1,
          borderColor: error ? colors.status.error : colors.primary.borderLight,
          backgroundColor: colors.background.surface,
          paddingHorizontal: spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text color={value ? colors.text.primary : '#94a3b8'}>
          {value ? formatValue(resolvedValue, mode, language) : placeholder ?? getDefaultPlaceholder(mode, t)}
        </Text>
        <Icon name={mode === 'time' ? 'schedule' : 'calendar-today'} size="sm" color={colors.primary.DEFAULT} />
      </Pressable>
      {Platform.OS === 'web' ? (
        open ? (
          <DateTimePicker
            value={resolvedValue}
            mode={pickerMode}
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={(_, nextValue) => {
              setOpen(false);
              if (nextValue) {
                onChange(nextValue);
              }
            }}
          />
        ) : null
      ) : (
        <DateTimePickerModal
          isVisible={open}
          mode={pickerMode}
          date={resolvedValue}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onConfirm={(nextValue) => {
            setOpen(false);
            onChange(nextValue);
          }}
          onCancel={() => setOpen(false)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function FormikDateField(props: DateFieldProps & { name: string }) {
  const [field, meta, helpers] = useField<Date | undefined>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <DateFieldBody
      {...props}
      value={field.value}
      onChange={(nextValue) => helpers.setValue(nextValue)}
      error={hasError ? meta.error : props.error}
    />
  );
}

export function DateField(props: DateFieldProps) {
  if (props.name) {
    return <FormikDateField {...(props as DateFieldProps & { name: string })} />;
  }

  return <DateFieldBody {...props} value={props.value} onChange={props.onChange ?? (() => undefined)} />;
}
