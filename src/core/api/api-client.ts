import axios, {type AxiosError, type InternalAxiosRequestConfig} from 'axios';
import {refreshAccessToken} from '../auth/refresh-manager';
import {tokenManager} from '../auth/token-manager';
import {API_BASE_URL} from './config';
import {normalizeError} from './errors';

type RetryableRequestConfig = InternalAxiosRequestConfig & {_retry?: boolean};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(async config => {
  const accessToken = await tokenManager.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  config.headers.set(
    'x-request-id',
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  );

  if (__DEV__) {
    console.log('[API REQUEST]', {
      method: config.method,
      url: (config.baseURL || '') + (config.url || ''),
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
  }
  return config;
});

apiClient.interceptors.response.use(
  res => {
    if (__DEV__) {
      console.log('[API RESPONSE]', {
        url: (res.config.baseURL || '') + (res.config.url || ''),
        method: res.config.method,
        status: res.status,
        data: res.data,
        headers: res.headers,
      });
    }
    return res;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error('[API ERROR]', {
        url: (error.config?.baseURL || '') + (error.config?.url || ''),
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message,
        error,
      });
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
