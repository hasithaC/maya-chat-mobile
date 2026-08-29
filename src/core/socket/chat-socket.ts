import {io, type Socket} from 'socket.io-client';
import type {ConversationMessage} from '../../domain/conversations/types/conversations.types';
import {CHAT_SOCKET_URL} from './config';
import {usePresenceStore} from './presence.store';

let socket: Socket | null = null;
let onlineUsersPollTimer: ReturnType<typeof setInterval> | null = null;
const ONLINE_USERS_POLL_INTERVAL_MS = 20000;

/* ---------------- CONNECT ---------------- */

export const initChatSocket = (jwt: string) => {
  if (socket) return socket; // prevent multiple instances

  socket = io(CHAT_SOCKET_URL, {
    transports: ['websocket'],
    auth: {token: jwt},
    reconnection: true,
  });

  socket.on('connect', () => {
    if (__DEV__) console.log('[SOCKET CONNECTED]', socket?.id);
    requestOnlineUsers();

    // The server only appears to push 'online_users' in response to our own
    // request, not proactively when someone else's status changes, so poll
    // periodically to keep presence from going stale mid-session.
    if (onlineUsersPollTimer) clearInterval(onlineUsersPollTimer);
    onlineUsersPollTimer = setInterval(requestOnlineUsers, ONLINE_USERS_POLL_INTERVAL_MS);
  });

  socket.on('connected', data => {
    if (__DEV__) console.log('[SOCKET AUTHENTICATED]', data);
  });

  socket.on('disconnect', reason => {
    if (__DEV__) console.log('[SOCKET DISCONNECTED]', reason);
  });

  socket.on('error', err => {
    if (__DEV__) console.log('[SOCKET ERROR]', err);
  });

  socket.onAny((event, payload) => {
    if (__DEV__) console.log('[SOCKET EVENT]', event, payload);
  });

  socket.on(
    'online_users',
    (payload: {count: number; timestamp: string; userIds: string[]}) => {
      if (__DEV__) console.log('[SOCKET ONLINE USERS]', payload);
      usePresenceStore.getState().setOnlineUserIds(payload.userIds ?? []);
    },
  );

  return socket;
};

export const disconnectChatSocket = () => {
  if (onlineUsersPollTimer) {
    clearInterval(onlineUsersPollTimer);
    onlineUsersPollTimer = null;
  }
  if (!socket) return;
  if (__DEV__) console.log('[SOCKET DISCONNECTING]', socket.id);
  socket.disconnect();
  socket = null;
  usePresenceStore.getState().setOnlineUserIds([]);
};

export const getChatSocket = () => socket;

/* ---------------- ONLINE USERS ---------------- */

// Emits 'get_online_users' to request the current list of online users.
export const requestOnlineUsers = () => {
  socket?.emit('get_online_users');
};

// Listens for 'online_users' and invokes callback with the received user list.
export const onOnlineUsers = (callback: (users: any) => void) => {
  socket?.on('online_users', data => {
    if (__DEV__) console.log('[SOCKET ONLINE USERS]', data);
    callback(data);
  });
};

/* ---------------- CONVERSATION ---------------- */

// Emits 'join_conversation' to join a conversation's room.
export const joinConversation = (conversationId: string) => {
  socket?.emit('join_conversation', {conversationId});
};

// Emits 'leave_conversation' to leave the given conversation's room.
export const leaveConversation = (conversationId: string) => {
  socket?.emit('leave_conversation', {conversationId});
};

// Listens for 'joined_conversation', fired when this client has successfully joined a conversation.
export const onJoinedConversation = (cb: (data: any) => void) => {
  socket?.on('joined_conversation', cb);
};

// Listens for 'user:joined_conversation', fired when another user joins the conversation.
export const onUserJoinedConversation = (cb: (data: any) => void) => {
  socket?.on('user:joined_conversation', cb);
};

// Listens for 'user:left_conversation', fired when another user leaves the conversation.
export const onUserLeftConversation = (cb: (data: any) => void) => {
  socket?.on('user:left_conversation', cb);
};

/* ---------------- MESSAGES ---------------- */

export interface MessageAckPayload {
  tempId: string;
  messageId?: number;
  status?: string;
  [key: string]: unknown;
}

export interface MessageErrorPayload {
  tempId?: string;
  message?: string;
  [key: string]: unknown;
}

// Emits 'send_message' with the message data plus a client-side timestamp.
export const sendMessage = (data: {
  conversationId: string;
  content: string;
  tempId?: string;
  type?: string;
  attachments?: unknown[];
}) => {
  socket?.emit('send_message', {
    ...data,
    timestamp: Date.now(),
  });
};

// Listens for 'receive_message', fired when a new message arrives for this client.
export const onReceiveMessage = (cb: (msg: ConversationMessage) => void) => {
  socket?.on('receive_message', cb);
};

export const offReceiveMessage = (cb: (msg: ConversationMessage) => void) => {
  socket?.off('receive_message', cb);
};

// Listens for 'message_ack', the server's acknowledgement that a sent message was received.
export const onMessageAck = (cb: (ack: MessageAckPayload) => void) => {
  socket?.on('message_ack', cb);
};

export const offMessageAck = (cb: (ack: MessageAckPayload) => void) => {
  socket?.off('message_ack', cb);
};

// Listens for 'message_error', fired when sending a message fails server-side.
export const onMessageError = (cb: (err: MessageErrorPayload) => void) => {
  socket?.on('message_error', cb);
};

export const offMessageError = (cb: (err: MessageErrorPayload) => void) => {
  socket?.off('message_error', cb);
};

/* ---------------- READ / STATUS ---------------- */

export interface MessageStatusUpdatePayload {
  messageId: number;
  status: string;
  conversationId?: string;
  [key: string]: unknown;
}

export interface MessageReadReceiptPayload {
  messageId: number;
  readerId?: string;
  readAt?: string;
  conversationId?: string;
  [key: string]: unknown;
}

// Emits 'message_status' to update a message's delivery/read status.
export const updateMessageStatus = (data: {
  messageId: number;
  status: 'delivered' | 'read';
}) => {
  socket?.emit('message_status', data);
};

// Emits 'message_read' to mark a specific message as read.
export const markMessageRead = (messageId: number) => {
  socket?.emit('message_read', {messageId});
};

// Listens for 'message_status_update', fired when a message's status changes.
export const onMessageStatusUpdate = (
  cb: (data: MessageStatusUpdatePayload) => void,
) => {
  socket?.on('message_status_update', cb);
};

export const offMessageStatusUpdate = (
  cb: (data: MessageStatusUpdatePayload) => void,
) => {
  socket?.off('message_status_update', cb);
};

// Listens for 'message_read_receipt', fired when another user reads a message.
export const onReadReceipt = (cb: (data: MessageReadReceiptPayload) => void) => {
  socket?.on('message_read_receipt', cb);
};

export const offReadReceipt = (cb: (data: MessageReadReceiptPayload) => void) => {
  socket?.off('message_read_receipt', cb);
};

/* ---------------- CONVERSATION LIST ---------------- */

export interface ConversationUpdatedPayload {
  conversationId: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  senderId: string;
  senderName: string;
  unreadCount: number;
  timestamp: string;
}

// Listens for 'conversation:updated', fired when a conversation's latest
// message or unread count changes (e.g. after sending/receiving a message).
export const onConversationUpdated = (
  cb: (data: ConversationUpdatedPayload) => void,
) => {
  socket?.on('conversation:updated', cb);
};

export const offConversationUpdated = (
  cb: (data: ConversationUpdatedPayload) => void,
) => {
  socket?.off('conversation:updated', cb);
};

/* ---------------- TYPING ---------------- */

export interface UserTypingPayload {
  userId: string;
  conversationId?: string;
  isTyping: boolean;
}

// Emits 'typing' to notify the conversation that this user started/stopped typing.
export const sendTyping = (conversationId: string, isTyping: boolean) => {
  socket?.emit('typing', {conversationId, isTyping});
};

// Listens for 'user_typing', fired when another user in the conversation
// starts or stops typing.
export const onUserTyping = (cb: (data: UserTypingPayload) => void) => {
  socket?.on('user_typing', cb);
};

// Removes a previously registered 'user_typing' listener.
export const offUserTyping = (cb: (data: UserTypingPayload) => void) => {
  socket?.off('user_typing', cb);
};