export const ROUTES = {
  myProfile: '/(app)/my-profile',
  addContacts: '/(app)/add-contacts',
  conversation: (id: string) => `/(app)/conversation/${id}` as const,
  attachmentPreview: '/(app)/conversation/attachment-preview',
  dashboard: '/(app)/(tabs)',
  chats: '/(app)/(tabs)/chats',
  trainMaya: '/(app)/train-maya',
  trainMayaVoicePersona: '/(app)/train-maya/voice-persona',
  trainMayaAboutYou: '/(app)/train-maya/about-you',
} as const;
