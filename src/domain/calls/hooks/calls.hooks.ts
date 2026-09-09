import {useQuery} from '@tanstack/react-query';
import {callsApi} from '../api/calls.api';
import type {GetCallHistoryRequest} from '../types/calls.types';

export const useCallHistory = (params?: GetCallHistoryRequest) =>
  useQuery({
    queryKey: ['calls', 'history', params?.limit],
    queryFn: () => callsApi.getHistory(params),
  });

export const useCallSummary = (callId: string) =>
  useQuery({
    queryKey: ['calls', callId, 'summary'],
    queryFn: () => callsApi.getSummary(callId),
    enabled: Boolean(callId),
  });
