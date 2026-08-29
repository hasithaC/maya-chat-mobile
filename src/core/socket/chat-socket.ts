import {io, type Socket} from 'socket.io-client';
import {CHAT_SOCKET_URL} from './config';
import {usePresenceStore} from './presence.store';

let socket: Socket | null = null;

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

// Emits 'send_message' with the message data plus a client-side timestamp.
export const sendMessage = (data: {
  conversationId: string;
  content: string;
  tempId?: string;
}) => {
  socket?.emit('send_message', {
    ...data,
    timestamp: Date.now(),
  });
};

// Listens for 'receive_message', fired when a new message arrives for this client.
export const onReceiveMessage = (cb: (msg: any) => void) => {
  socket?.on('receive_message', cb);
};

// Listens for 'message_ack', the server's acknowledgement that a sent message was received.
export const onMessageAck = (cb: (ack: any) => void) => {
  socket?.on('message_ack', cb);
};

// Listens for 'message_error', fired when sending a message fails server-side.
export const onMessageError = (cb: (err: any) => void) => {
  socket?.on('message_error', cb);
};

/* ---------------- READ / STATUS ---------------- */

// Emits 'message_status' to update a message's delivery/read status.
export const updateMessageStatus = (data: {
  messageId: string;
  status: 'delivered' | 'read';
}) => {
  socket?.emit('message_status', data);
};

// Emits 'message_read' to mark a specific message as read.
export const markMessageRead = (messageId: string) => {
  socket?.emit('message_read', {messageId});
};

// Listens for 'message_status_update', fired when a message's status changes.
export const onMessageStatusUpdate = (cb: (data: any) => void) => {
  socket?.on('message_status_update', cb);
};

// Listens for 'message_read_receipt', fired when another user reads a message.
export const onReadReceipt = (cb: (data: any) => void) => {
  socket?.on('message_read_receipt', cb);
};

/* ---------------- TYPING ---------------- */

// Emits 'typing' to notify the conversation that this user is currently typing.
export const sendTyping = (conversationId: string) => {
  socket?.emit('typing', {conversationId});
};

// Listens for 'user_typing', fired when another user in the conversation is typing.
export const onUserTyping = (cb: (data: any) => void) => {
  socket?.on('user_typing', cb);
};
