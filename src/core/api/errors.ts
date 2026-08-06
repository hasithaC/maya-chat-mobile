import type {AxiosError} from 'axios';
import type {StoreError} from '../types/store.types';

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class ValidationError extends ApiError {
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
    data?: unknown,
  ) {
    super(message, status, data);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export type NormalizedError = ApiError | ValidationError | NetworkError;

export function normalizeError(error: AxiosError): NormalizedError {
  if (!error.response) {
    return new NetworkError(error.message);
  }

  const status = error.response.status;
  const data = error.response.data as
    | {message?: string; title?: string; errors?: Record<string, string[]>}
    | undefined;
  const message =
    data?.message || data?.title || error.message || 'Request failed';

  if (status === 422 || data?.errors) {
    return new ValidationError(message, status, data?.errors, data);
  }

  return new ApiError(message, status, data);
}

export function toStoreError(error: unknown): StoreError {
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      status: error.status,
      fieldErrors: error.fieldErrors,
    };
  }
  if (error instanceof ApiError) {
    return {message: error.message, status: error.status};
  }
  if (error instanceof Error) {
    return {message: error.message};
  }
  return {message: 'Something went wrong'};
}
