import { apiClient } from '../../../core/api/api-client';
import { MAYA_API_BASE_URL } from '../../../core/api/config';
import type {
  MayaEnvelope,
  MayaPersonaType,
  MayaTrainingStep,
} from '../types/maya.types';

const ENDPOINTS = {
  START: `${MAYA_API_BASE_URL}/api/onboarding/start`,
  SELECT_PERSONA: `${MAYA_API_BASE_URL}/api/voice/select-persona`,
  UPLOAD_VOICE_SAMPLE: `${MAYA_API_BASE_URL}/api/voice/upload-sample`,
  TRAIN_VOICE_AGENT: `${MAYA_API_BASE_URL}/api/onboarding/message`,
  TRAINING_COMPLETE: `${MAYA_API_BASE_URL}/api/onboarding/complete`,
};

const withUserId = (userId: string) => ({
  headers: { 'X-User-Id': userId },
});

export const mayaApi = {
  start: (userId: string) =>
    apiClient
      .post<MayaEnvelope<MayaTrainingStep>>(ENDPOINTS.START, {}, withUserId(userId))
      .then(res => res.data),

  selectPersona: (userId: string, persona: MayaPersonaType) =>
    apiClient
      .post<MayaEnvelope>(
        ENDPOINTS.SELECT_PERSONA,
        { persona_type: persona },
        withUserId(userId),
      )
      .then(res => res.data),

  uploadVoiceSample: (userId: string, fileUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'audio/m4a',
      name: 'voice-sample.m4a',
    } as any);

    return apiClient
      .post<MayaEnvelope>(ENDPOINTS.UPLOAD_VOICE_SAMPLE, formData, withUserId(userId))
      .then(res => res.data);
  },

  trainVoiceAgent: (userId: string, message: string) =>
    apiClient
      .post<MayaEnvelope<MayaTrainingStep>>(
        ENDPOINTS.TRAIN_VOICE_AGENT,
        { message },
        withUserId(userId),
      )
      .then(res => res.data),

  trainingComplete: (userId: string) =>
    apiClient
      .post<MayaEnvelope>(ENDPOINTS.TRAINING_COMPLETE, {}, withUserId(userId))
      .then(res => res.data),
};
