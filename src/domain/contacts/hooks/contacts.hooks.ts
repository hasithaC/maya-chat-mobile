import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {contactsApi} from '../api/contacts.api';

export const useContacts = () =>
  useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsApi.getAll(),
  });

export const useSearchContacts = (keyword: string) =>
  useQuery({
    queryKey: ['contacts', 'search', keyword],
    queryFn: () => contactsApi.search(keyword),
    enabled: keyword.trim().length > 0,
  });

export const useAddContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsApi.addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['contacts']});
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {contactId: number; displayName: string; isFavorite: boolean}) =>
      contactsApi.updateContact(variables.contactId, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['contacts']});
    },
  });
};
