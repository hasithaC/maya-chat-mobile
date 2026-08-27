export const ROUTES = {
  myProfile: '/(app)/my-profile',
  addContacts: '/(app)/add-contacts',
  conversation: (id: string) => `/(app)/conversation/${id}` as const,
} as const;
