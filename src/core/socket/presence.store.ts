import {create} from 'zustand';

interface PresenceState {
  onlineUserIds: Set<string>;
  setOnlineUserIds: (userIds: string[]) => void;
}

export const usePresenceStore = create<PresenceState>(set => ({
  onlineUserIds: new Set(),
  setOnlineUserIds: userIds => set({onlineUserIds: new Set(userIds)}),
}));
