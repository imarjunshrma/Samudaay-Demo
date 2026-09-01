import { useFormikContext } from 'formik';

import { Button } from '@/src/components/ui';

export function SubmitButton({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger';
}) {
  const formik = useFormikContext();

  return (
    <Button variant={variant} fullWidth loading={formik.isSubmitting} onPress={() => formik.handleSubmit()}>
      {label}
    </Button>
  );
}
