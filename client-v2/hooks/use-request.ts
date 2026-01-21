'use client';

import axios, { AxiosError } from 'axios';
import { useState } from 'react';

interface UseRequestOptions {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  body?: Record<string, unknown>;
  onSuccess?: (data: unknown) => void;
}

interface ErrorResponse {
  errors: Array<{ message: string }>;
}

interface UseRequestReturn {
  doRequest: (props?: Record<string, unknown>) => Promise<unknown>;
  errors: Array<{ message: string }> | null;
  isLoading: boolean;
}

export function useRequest({
  url,
  method,
  body,
  onSuccess,
}: UseRequestOptions): UseRequestReturn {
  const [errors, setErrors] = useState<Array<{ message: string }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const doRequest = async (props: Record<string, unknown> = {}) => {
    try {
      setErrors(null);
      setIsLoading(true);

      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorData = axiosError?.response?.data?.errors || [
        { message: 'An unexpected error occurred' },
      ];
      setErrors(errorData);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { doRequest, errors, isLoading };
}
