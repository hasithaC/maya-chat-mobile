import {apiClient} from '../../../core/api/api-client';
import type {
  AddContactRequest,
  AddContactResponse,
  GetAllContactsResponse,
  SearchedUserResponse,
  UpdateContactRequest,
} from '../types/contacts.types';

const ENDPOINTS = {
  BASE: '/api/v1/contacts',
  SEARCH: '/api/v1/contacts/search',
  BY_ID: (contactId: number) => `/api/v1/contacts/${contactId}`,
};

export const contactsApi = {
  // Bearer auth is already attached by apiClient's request interceptor, so
  // there's no need to build the Authorization header manually per call.
  getAll: () =>
    apiClient.get<GetAllContactsResponse>(ENDPOINTS.BASE).then(res => res.data),

  search: (keyword: string) =>
    apiClient
      .get<SearchedUserResponse>(ENDPOINTS.SEARCH, {params: {keyword}})
      .then(res => res.data),

  addContact: (data: AddContactRequest) =>
    apiClient.post<AddContactResponse>(ENDPOINTS.BASE, data).then(res => res.data),

  updateContact: (contactId: number, data: UpdateContactRequest) =>
    apiClient
      .patch<AddContactResponse>(ENDPOINTS.BY_ID(contactId), data)
      .then(res => res.data),
};
