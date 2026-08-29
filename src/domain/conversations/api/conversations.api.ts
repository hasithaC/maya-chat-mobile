import {apiClient} from '../../../core/api/api-client';
import type {Conversation, ConversationMessage} from '../types/conversations.types';

const ENDPOINTS = {
  GET_CONVERSATIONS: '/api/v1/conversations',
  GET_CONVERSATION: (conversationId: number | string) =>
    `/api/v1/conversations/${conversationId}`,
  GET_MESSAGES: (conversationId: number | string) =>
    `/api/v1/messages/conversations/${conversationId}`,
};

export const conversationsApi = {
  getConversations: () =>
    apiClient
      .get<Conversation[]>(ENDPOINTS.GET_CONVERSATIONS)
      .then(res => res.data),

  getConversation: (conversationId: number | string) =>
    apiClient
      .get<Conversation>(ENDPOINTS.GET_CONVERSATION(conversationId))
      .then(res => res.data),

  getMessages: (conversationId: number | string) =>
    apiClient
      .get<ConversationMessage[]>(ENDPOINTS.GET_MESSAGES(conversationId))
      .then(res => res.data),
};
