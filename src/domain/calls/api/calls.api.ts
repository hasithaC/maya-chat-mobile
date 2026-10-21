import {apiClient} from '../../../core/api/api-client';
import {MAYA_API_BASE_URL} from '../../../core/api/config';
import type {
  AcceptCallRequest,
  CallRecord,
  EndCallRequest,
  GetCallHistoryRequest,
  GetCallHistoryResponse,
  GetVoiceTokenRequest,
  GetVoiceTokenResponse,
  InitiateCallRequest,
  MayaCallSummaryResponse,
  RejectCallRequest,
  UpdateTwilioSidRequest,
} from '../types/calls.types';

const ENDPOINTS = {
  HISTORY: '/api/v1/voice/calls/history',
  VOICE_TOKEN: '/api/v1/voice/token',
  INITIATE: '/api/v1/voice/calls/initiate',
  ACCEPT: (callId: string) => `/api/v1/voice/calls/${callId}/accept`,
  REJECT: (callId: string) => `/api/v1/voice/calls/${callId}/reject`,
  END: (callId: string) => `/api/v1/voice/calls/${callId}/end`,
  UPDATE_SID: (callId: string) => `/api/v1/voice/calls/${callId}/twilio-sid`,
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

  getVoiceToken: (body: GetVoiceTokenRequest) =>
    apiClient
      .post<GetVoiceTokenResponse>(ENDPOINTS.VOICE_TOKEN, body)
      .then(res => res.data),

  initiate: (body: InitiateCallRequest) =>
    apiClient
      .post<CallRecord>(ENDPOINTS.INITIATE, body)
      .then(res => res.data),

  accept: (callId: string, body: AcceptCallRequest) =>
    apiClient
      .post<CallRecord>(ENDPOINTS.ACCEPT(callId), body)
      .then(res => res.data),

  reject: (callId: string, body: RejectCallRequest) =>
    apiClient
      .post<CallRecord>(ENDPOINTS.REJECT(callId), body)
      .then(res => res.data),

  end: (callId: string, body: EndCallRequest) =>
    apiClient
      .post<CallRecord>(ENDPOINTS.END(callId), body)
      .then(res => res.data),

  updateTwilioSid: (callId: string, body: UpdateTwilioSidRequest) =>
    apiClient
      .post<void>(ENDPOINTS.UPDATE_SID(callId), body)
      .then(() => undefined),
};
