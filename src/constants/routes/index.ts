export const ROUTES = {
  myProfile: '/(app)/my-profile',
  addContacts: '/(app)/add-contacts',
  conversation: (id: string) => `/(app)/conversation/${id}` as const,
  attachmentPreview: '/(app)/conversation/attachment-preview',
  // Points straight at Chats, not the bare '/(app)/(tabs)' group path — the
  // group's own initialRouteName/unstable_settings aren't reliably honored
  // by a Redirect/router call, so bare group paths silently fall back to
  // Home (the file-order default) instead of the intended landing tab.
  dashboard: '/(app)/(tabs)/chats',
  chats: '/(app)/(tabs)/chats',
  trainMaya: '/(app)/train-maya',
  trainMayaVoicePersona: '/(app)/train-maya/voice-persona',
  trainMayaAboutYou: '/(app)/train-maya/about-you',
} as const;
