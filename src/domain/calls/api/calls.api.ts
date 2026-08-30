import {apiClient} from '../../../core/api/api-client';
import type {
  GetCallHistoryRequest,
  GetCallHistoryResponse,
} from '../types/calls.types';

const ENDPOINTS = {
  HISTORY: '/api/v1/voice/calls/history',
};

export const callsApi = {
  getHistory: (params?: GetCallHistoryRequest) =>
    apiClient
      .get<GetCallHistoryResponse>(ENDPOINTS.HISTORY, {params})
      .then(res => res.data),
};
