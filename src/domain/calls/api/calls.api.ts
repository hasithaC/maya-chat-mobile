import {apiClient} from '../../../core/api/api-client';
import {MAYA_API_BASE_URL} from '../../../core/api/config';
import type {
  GetCallHistoryRequest,
  GetCallHistoryResponse,
  MayaCallSummaryResponse,
} from '../types/calls.types';

const ENDPOINTS = {
  HISTORY: '/api/v1/voice/calls/history',
  // Served from the Maya host (app.aecendir.com), not the main API host —
  // pass the absolute URL through so axios doesn't prefix it with baseURL.
  SUMMARY: (callId: string | number) =>
    `${MAYA_API_BASE_URL}/api/chat/call-summary/${callId}`,
};

export const callsApi = {
  getHistory: (params?: GetCallHistoryRequest) =>
    apiClient
      .get<GetCallHistoryResponse>(ENDPOINTS.HISTORY, {params})
      .then(res => res.data),

  getSummary: (callId: string | number) =>
    apiClient
      .get<MayaCallSummaryResponse>(ENDPOINTS.SUMMARY(callId))
      .then(res => res.data),
};
