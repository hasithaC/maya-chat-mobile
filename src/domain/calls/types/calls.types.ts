export interface GetCallHistoryRequest {
  limit?: number;
}

export interface CallHistory {
  id: number;
  callerId: string;
  calleeId: string;
  callerName: string;
  callerAvatar: any;
  calleeName: string;
  calleeAvatar: any;
  type: string;
  status: string;
  twilioCallSid: any;
  startedAt: string;
  answeredAt: any;
  endedAt?: string;
  duration: any;
  recordingUrl: any;
  createdAt: string;
  updatedAt: string;
}

export type GetCallHistoryResponse = CallHistory[];
