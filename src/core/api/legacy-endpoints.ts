// Not yet migrated into a domain/*/api file — split these into their own
// *.api.ts (contacts, conversations, call, maya, user) as those domains are scaffolded.
import {API_BASE_URL} from './config';

export const getImageUrl = (image: string): string =>
  `sample-api.example.com/v1/images/${image}`;

export const LEGACY_ENDPOINTS = {
  USER: {
    PRESIGN_UPLOAD: `/api/v1/users/profile/presign-upload`,
  },
  CONTACT: {
    SEARCH_CONTACTS: `/api/v1/contacts/search`,
    ALL_CONTACTS: `/api/v1/contacts`,
    ADD_CONTACT: `/api/v1/contacts`,
  },
  CONVERSATIONS: {
    CREATE_CONVERSATION: `/api/v1/conversations`,
    GET_USER_CONVERSATIONS: `/api/v1/conversations`,
    GET_CONVERSATION_MESSAGES: (conversationId: number) =>
      `/api/v1/messages/conversations/${conversationId}`,
    GET_CONVERSATION: (conversationId: number) =>
      `/api/v1/conversations/${conversationId}`,
    PRESIGN_VOICE_NOTE_UPLOAD: `/api/v1/messages/voice-notes/presign-upload`,
    PRESIGN_ATTACHMENT_UPLOAD: `/api/v1/messages/attachments/presign-upload`,
  },
  FILE_UPLOAD: `${API_BASE_URL}/api/Storage/UploadFilev2`,
  TEMP_FILE_DOWNLOAD: `/api/v1/messages/attachments/presign-download`,
};
