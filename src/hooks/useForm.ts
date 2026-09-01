import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import { useFormik, type FormikConfig, type FormikValues, type FormikProps } from 'formik';

export function useAppForm<TValues extends FormikValues>(config: FormikConfig<TValues>) {
  const formik = useFormik(config);
  const formikRef = useRef<FormikProps<TValues>>(formik);

  useEffect(() => {
    formikRef.current = formik;
  }, [formik]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        formikRef.current.resetForm();
      };
    }, []),
  );

  return formik;
}
