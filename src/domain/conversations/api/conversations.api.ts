import {apiClient} from '../../../core/api/api-client';
import type {Conversation} from '../types/conversations.types';

const ENDPOINTS = {
  GET_CONVERSATIONS: '/api/v1/conversations',
};

export const conversationsApi = {
  getConversations: () =>
    apiClient
      .get<Conversation[]>(ENDPOINTS.GET_CONVERSATIONS)
      .then(res => res.data),
};
