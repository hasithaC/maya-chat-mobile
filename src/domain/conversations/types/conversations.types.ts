export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  email: any;
  password: any;
  fullName: string;
  avatar: any;
  voiceUrl: any;
  phone: string;
  identity: any;
  persona: any;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerifiedAt: any;
  phoneVerifiedAt?: string;
  signupVerifyToken: any;
  signupVerifyTokenExpiresAt: any;
}

export interface Participant {
  id: string;
  conversationId: number;
  userId: string;
  isActive: boolean;
  isAdmin: boolean;
  isMuted: boolean;
  joinedAt: string;
  leftAt: any;
  lastReadAt: any;
  user: User;
}

export interface Conversation {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  type: string;
  status: string;
  name: any;
  description: any;
  avatar: any;
  createdBy: string;
  isGroup: boolean;
  isChannel: boolean;
  lastMessageAt: any;
  lastMessagePreview: any;
  participantCount: number;
  archivedAt: any;
  participants: Participant[];
  unreadCount?: number;
}

export interface ConversationMessage {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  conversationId: number;
  senderId: string;
  type: string;
  status: string;
  content: string;
  attachments?: Attachment[];
  metadata?: Metadata;
  isEdited: boolean;
  editedAt: any;
  isPinned: boolean;
  pinnedAt: any;
  deliveredAt: any;
  readAt: any;
}

export interface Metadata {
  source?: string;
  model?: string;
  actions?: Action[];
  user_id?: string;
  processing_model?: string;
  ai?: Ai;
}

export interface Action {
  id: string;
  label: string;
  payload: Payload;
  priority: string;
  actionType: string;
}

export interface Payload {
  date: string;
  query: any;
  title: string;
  content: any;
  phoneNumber: any;
  conversationId: any;
  isVoiceNote: boolean;
  audioUrl?: string;
}

export interface Ai {
  actions: Action[];
  confidence: number;
  assistantName: string;
  thoughtProcess: string[];
}

export interface ConSentMessageBody {
  conversationId: number;
  content: string;
  type: string;
  attachments: Attachment[];
  metadata: Metadata;
  tempId: number;
}

export interface PreviewConversation {
  conversationId: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  senderId: string;
  senderName: string;
  unreadCount: number;
  timestamp: string;
}

export interface Attachment {
  url: string;
  type: string;
  name: string;
  size: number;
  duration?: number;
  waveform?: any;
  transcriptionStatus?: string;
}
