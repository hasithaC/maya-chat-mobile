import {useQuery} from '@tanstack/react-query';
import {conversationsApi} from '../api/conversations.api';

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi.getConversations(),
  });
