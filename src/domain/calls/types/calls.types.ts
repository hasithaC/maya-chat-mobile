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

// The backend returns the same call record shape from initiate / accept /
// reject / end — the history list is just a collection of them.
export type CallRecord = CallHistory;

export interface GetVoiceTokenRequest {
  identity: string;
  pushCredentialSid: string | null;
}

export interface GetVoiceTokenResponse {
  token: string;
  identity: string;
}

export interface InitiateCallRequest {
  calleeId: string;
  type: 'voice' | 'video';
}

export interface AcceptCallRequest {
  twilioCallSid: string;
}

export interface RejectCallRequest {
  reason: 'canceled';
}

export interface EndCallRequest {
  reason: 'completed' | 'canceled';
}

export interface UpdateTwilioSidRequest {
  twilioCallSid: string;
}

export interface MayaCallSummaryResponse {
  tabs: CallSummaryTab[];
  callId: number;
}

export interface CallSummaryTab {
  data: CallSummaryData;
  type: string;
  title: string;
}

export interface CallSummaryData {
  ai?: CallSummaryAi;
  agent?: CallSummaryAgent;
  summary?: string;
  introMessage?: string;
  messages?: CallSummaryMessage[];
}

export interface CallSummaryAi {
  actions: CallSummaryAction[];
  confidence: number;
  assistantName: string;
  thoughtProcess: string[];
}

export interface CallSummaryAction {
  id: string;
  label: string;
  payload: CallSummaryActionPayload;
  priority: string;
  actionType: string;
}

export interface CallSummaryActionPayload {
  date: string;
  query: any;
  title: string;
  content: any;
  audioUrl?: any;
  isVoiceNote: any;
  phoneNumber: any;
  conversationId: any;
}

export interface CallSummaryAgent {
  name: string;
  role: string;
}

export interface CallSummaryMessage {
  id: string;
  text: string;
  sender: CallSummaryMessageSender;
  timestamp: string;
}

export interface CallSummaryMessageSender {
  name: string;
}
