import type { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

interface AttachmentSendRequest {
  conversationId: string;
  assets: ImagePickerAsset[];
  caption: string;
}

interface AttachmentDraftState {
  conversationId: string | null;
  assets: ImagePickerAsset[];
  sendRequest: AttachmentSendRequest | null;
  setPickedAssets: (conversationId: string, assets: ImagePickerAsset[]) => void;
  removeAsset: (index: number) => void;
  clear: () => void;
  requestSend: (caption: string) => void;
  clearSendRequest: () => void;
}

// Bridges the attachment-preview screen back to the conversation screen: the
// conversation screen owns all the send/upload/retry bookkeeping, so the
// preview screen just hands off "send these assets with this caption" and
// the conversation screen (still mounted underneath in the stack) picks it
// up via useEffect.
export const useAttachmentDraftStore = create<AttachmentDraftState>((set, get) => ({
  conversationId: null,
  assets: [],
  sendRequest: null,
  setPickedAssets: (conversationId, assets) => set({ conversationId, assets }),
  removeAsset: (index) =>
    set((state) => ({ assets: state.assets.filter((_, i) => i !== index) })),
  clear: () => set({ conversationId: null, assets: [] }),
  requestSend: (caption) => {
    const { conversationId, assets } = get();
    if (!conversationId || assets.length === 0) return;
    set({ sendRequest: { conversationId, assets, caption }, conversationId: null, assets: [] });
  },
  clearSendRequest: () => set({ sendRequest: null }),
}));
