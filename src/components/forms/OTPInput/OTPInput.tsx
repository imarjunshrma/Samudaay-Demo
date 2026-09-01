import { useField } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Text } from '@/src/components/ui';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

type OTPInputProps = {
  name?: string;
  length?: number;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  onHelperPress?: () => void;
  helperDisabled?: boolean;
};

type OTPInputBodyProps = OTPInputProps & {
  value?: string;
  onChange: (value: string) => void;
};

function toOtpSlots(value: string | undefined, length: number) {
  const digits = String(value ?? '').replace(/[^\d]/g, '').slice(0, length).split('');
  return digits.concat(Array.from({ length }, () => '')).slice(0, length);
}

function findNextEditableIndex(slots: string[], length: number) {
  const firstEmpty = slots.findIndex((slot) => slot.length === 0);
  if (firstEmpty >= 0) {
    return firstEmpty;
  }

  return Math.max(0, length - 1);
}

function OTPInputBody({
  value,
  onChange,
  error,
  helperText,
  onHelperPress,
  helperDisabled = false,
  label = 'OTP Code',
  length = 6,
}: OTPInputBodyProps) {
  const t = useTranslations();
  const inputRef = useRef<TextInput | null>(null);
  const lastEmittedValueRef = useRef<string>('');
  const [slots, setSlots] = useState(() => toOtpSlots(value, length));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [hiddenValue, setHiddenValue] = useState('');

  const externalValue = useMemo(
    () => String(value ?? '').replace(/[^\d]/g, '').slice(0, length),
    [length, value],
  );
  const currentValue = useMemo(() => slots.join(''), [slots]);

  useEffect(() => {
    if (externalValue === lastEmittedValueRef.current || externalValue === currentValue) {
      return;
    }

    const nextSlots = toOtpSlots(externalValue, length);
    setSlots(nextSlots);
    setActiveIndex(findNextEditableIndex(nextSlots, length));
  }, [currentValue, externalValue, length]);

  const emitSlots = (nextSlots: string[], nextIndex?: number) => {
    const nextValue = nextSlots.join('');
    lastEmittedValueRef.current = nextValue;
    setSlots(nextSlots);
    if (typeof nextIndex === 'number') {
      setActiveIndex(Math.max(0, Math.min(nextIndex, length - 1)));
    }
    onChange(nextValue);
  };

  const focusInput = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, length - 1)));
    inputRef.current?.focus();
  };

  const handleDigitEntry = (rawValue: string) => {
    const clean = rawValue.replace(/[^\d]/g, '');
    setHiddenValue('');

    if (!clean) {
      return;
    }

    const next = [...slots];
    clean.slice(0, length - activeIndex).split('').forEach((char, offset) => {
      next[activeIndex + offset] = char;
    });

    const nextIndex = Math.min(activeIndex + clean.length, length - 1);
    const shouldAdvance = activeIndex + clean.length < length;

    emitSlots(next, shouldAdvance ? nextIndex : length - 1);
  };

  const handleBackspace = () => {
    const next = [...slots];

    if (slots[activeIndex]) {
      next[activeIndex] = '';
      emitSlots(next, Math.max(0, activeIndex - 1));
      return;
    }

    if (activeIndex > 0) {
      next[activeIndex - 1] = '';
      emitSlots(next, activeIndex - 1);
    }
  };

  return (
    <View style={{ gap: spacing[2] }}>
      <Text
        variant="caption"
        color={error ? colors.status.error : '#6b7280'}
        style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label || t('otp.label')}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => focusInput(findNextEditableIndex(slots, length))}
        style={{ position: 'relative' }}>
        <TextInput
          ref={inputRef}
          value={hiddenValue}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          caretHidden
          selectionColor="transparent"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleDigitEntry}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              handleBackspace();
            }
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[2] }}>
          {slots.map((digit, index) => {
            const isActive = activeIndex === index;
            const showCursor = isFocused && isActive && !digit;

            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                onPress={() => focusInput(index)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.lg,
                  borderWidth: 1,
                  borderColor: error
                    ? colors.status.error
                    : isActive && isFocused
                      ? colors.primary.DEFAULT
                      : colors.primary.border,
                  backgroundColor: colors.background.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                {digit ? (
                  <Text
                    pointerEvents="none"
                    variant="h5"
                    style={{
                      position: 'absolute',
                      color: colors.text.primary,
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 18,
                      fontWeight: '600',
                      lineHeight: 20,
                    }}>
                    {digit}
                  </Text>
                ) : null}

                {showCursor ? (
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      marginLeft: -1,
                      width: 2,
                      height: 20,
                      borderRadius: 999,
                      backgroundColor: colors.primary.DEFAULT,
                    }}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Pressable>

      {helperText ? (
        onHelperPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={onHelperPress}
            disabled={helperDisabled}
            style={{ alignSelf: 'flex-end', opacity: helperDisabled ? 0.5 : 1 }}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ textAlign: 'right', fontFamily: typography.fontFamily.medium }}>
              {helperText}
            </Text>
          </Pressable>
        ) : (
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ textAlign: 'right', fontFamily: typography.fontFamily.medium }}>
            {helperText}
          </Text>
        )
      ) : null}

      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
    </View>
  );
}

function FormikOTPInput(props: OTPInputProps & { name: string }) {
  const [field, meta, helpers] = useField<string>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <OTPInputBody
      {...props}
      value={field.value ?? ''}
      onChange={(nextValue) => helpers.setValue(nextValue)}
      error={hasError ? meta.error : props.error}
    />
  );
}

export function OTPInput(props: OTPInputProps) {
  if (props.name) {
    return <FormikOTPInput {...(props as OTPInputProps & { name: string })} />;
  }

  return <OTPInputBody {...props} value={props.value ?? ''} onChange={props.onChange ?? (() => undefined)} />;
}
