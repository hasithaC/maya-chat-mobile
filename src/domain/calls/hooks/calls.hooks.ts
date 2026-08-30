import {useQuery} from '@tanstack/react-query';
import {callsApi} from '../api/calls.api';
import type {GetCallHistoryRequest} from '../types/calls.types';

export const useCallHistory = (params?: GetCallHistoryRequest) =>
  useQuery({
    queryKey: ['calls', 'history', params?.limit],
    queryFn: () => callsApi.getHistory(params),
  });
