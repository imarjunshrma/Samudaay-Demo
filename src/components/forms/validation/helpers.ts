export function getFieldError<TValues extends Record<string, unknown>>(
  touched: Partial<Record<keyof TValues, boolean>>,
  errors: Partial<Record<keyof TValues, string>>,
  key: keyof TValues,
) {
  return touched[key] ? errors[key] : undefined;
}
