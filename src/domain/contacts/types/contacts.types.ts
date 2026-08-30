export interface SearchedUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  isMutualContact: boolean;
  isContact: boolean;
  hasAddedYou: boolean;
  displayName: string;
}

export interface SearchedUserResponse {
  users: SearchedUser[];
  total: number;
}

// ContactUser's exact shape wasn't given — assumed to match the common
// user-profile fields used elsewhere (SearchedUser, the auth User type).
export interface ContactUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatar: string | null;
}

export interface Contact {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  contactUserId: number;
  contactUser: ContactUser;
  displayName: string;
  isBlocked: boolean;
  isFavorite: boolean;
  addedAt: string;
  blockedAt: any;
}

export interface GetAllContactsResponse {
  contacts: Contact[];
  total: number;
}

// The given shape also listed `accessToken` as a request field, but Bearer
// auth is already attached by apiClient's request interceptor — omitted
// here since callers should never need to pass it explicitly.
export interface AddContactRequest {
  contactUserId: number;
  displayName: string;
  isFavorite: boolean;
}

export interface AddContactResponse {
  id: number;
  userId: number;
  contactUserId: number;
  contactUser: ContactUser;
  displayName: string;
  isBlocked: boolean;
  isFavorite: boolean;
  addedAt: string;
  blockedAt: any;
  createdAt: string;
  updatedAt: string;
}

// PATCH /api/v1/contacts/{contactId} — the contact's own id, not the
// contactUserId, and no contactUserId in the body (it's immutable).
export interface UpdateContactRequest {
  displayName: string;
  isFavorite: boolean;
}
