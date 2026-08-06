import axios from 'axios';
import {API_BASE_URL} from '../api/config';
import {authEvents} from './auth-events';
import {tokenManager, type AuthTokens} from './token-manager';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Raw axios call (not apiClient) so this request never passes back
  // through the 401 interceptor and re-triggers itself.
  const res = await axios.post<AuthTokens>(
    `${API_BASE_URL}${REFRESH_ENDPOINT}`,
    {refreshToken},
  );

  await tokenManager.setTokens(res.data);
  return res.data.accessToken;
}

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = performRefresh()
      .catch(async err => {
        await tokenManager.clearTokens();
        authEvents.emit('forceLogout');
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
