import { useState, useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { useAlert } from '../contexts/AlertContext';

interface UseApiOptions {
  autoFetch?: boolean;
  showAlert?: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = { autoFetch: true, showAlert: true }
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useAlert();

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<T>(url);
      setData(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || err.message || 'Error desconocido';
      setError(errorMessage);
      if (options.showAlert) {
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options.showAlert, showError]);

  useEffect(() => {
    if (options.autoFetch) {
      void fetch();
    }
  }, [fetch, options.autoFetch]);

  const refetch = useCallback(() => void fetch(), [fetch]);

  return { data, loading, error, refetch, setData };
}

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: (message?: string) => void;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
) {
  const [values, setValues] = useState(options.initialValues);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const inputElement = e.target as HTMLInputElement;
      const finalValue =
        type === 'checkbox' ? inputElement.checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Clear error for this field
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setLoading(true);
      setErrors({});
      try {
        await options.onSubmit(values);
        options.onSuccess?.();
      } finally {
        setLoading(false);
      }
    },
    [values, options]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(options.initialValues);
    setErrors({});
  }, [options.initialValues]);

  return {
    values,
    loading,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    reset,
    setValues,
  };
}

export function useMutate() {
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useAlert();

  const mutate = useCallback(
    async <T,>(fn: () => Promise<T>, onSuccess?: (data: T) => void) => {
      try {
        setLoading(true);
        const data = await fn();
        success('Operación completada');
        onSuccess?.(data);
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail || err.message || 'Error al procesar';
        showError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [success, showError]
  );

  return { loading, mutate };
}
