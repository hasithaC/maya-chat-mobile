import {create} from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning';

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toast: ToastState | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
}

let nextToastId = 0;

export const useToastStore = create<ToastStore>(set => ({
  toast: null,
  showToast: (message, variant = 'error') =>
    set({toast: {id: ++nextToastId, message, variant}}),
  hideToast: () => set({toast: null}),
}));

// Plain function form for use outside components (deep in async handlers,
// API error paths, etc.) — mirrors how chat-socket.ts exposes plain
// functions rather than requiring a hook at the call site.
export const showToast = (message: string, variant: ToastVariant = 'error') =>
  useToastStore.getState().showToast(message, variant);
