import {useQuery} from '@tanstack/react-query';
import {conversationsApi} from '../api/conversations.api';

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.getConversations(),
  });

export const useConversation = (conversationId: string) =>
  useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: () => conversationsApi.getConversation(conversationId),
    enabled: Boolean(conversationId),
  });

export const useConversationMessages = (conversationId: string) =>
  useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: () => conversationsApi.getMessages(conversationId),
    enabled: Boolean(conversationId),
    refetchOnMount: 'always',
  });
