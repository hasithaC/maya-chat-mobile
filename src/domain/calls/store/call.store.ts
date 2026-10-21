import {create} from 'zustand';
import {logger} from '../../../core/store/logger';

export type CallDirection = 'incoming' | 'outgoing';

// ringing    — incoming invite waiting for answer/decline
// dialing    — outgoing call placed, the other side hasn't picked up yet
// connecting — answered, media still being set up
export type CallSessionStatus =
  | 'ringing'
  | 'dialing'
  | 'connecting'
  | 'connected'
  | 'reconnecting';

export interface CallPeer {
  id?: string;
  name: string;
  avatarUrl?: string;
}

export interface CallSession {
  direction: CallDirection;
  status: CallSessionStatus;
  peer: CallPeer;
  // Our backend's call record id — distinct from the Twilio CallSid.
  backendCallId?: string;
  // Epoch ms of when media connected; drives the in-call timer.
  connectedAt?: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  // Collapsed into the top banner so the user can keep using the app.
  isMinimized: boolean;
}

interface CallState {
  // ── State ──
  isVoiceRegistered: boolean;
  session: CallSession | null;

  // ── Actions ──
  setVoiceRegistered: (isVoiceRegistered: boolean) => void;
  startSession: (
    session: Pick<CallSession, 'direction' | 'status' | 'peer'> &
      Partial<CallSession>,
  ) => void;
  updateSession: (patch: Partial<CallSession>) => void;
  endSession: () => void;
  setMinimized: (isMinimized: boolean) => void;
}

export const useCallStore = create<CallState>()(
  logger(
    set => ({
      isVoiceRegistered: false,
      session: null,

      setVoiceRegistered: isVoiceRegistered => set({isVoiceRegistered}),

      startSession: session =>
        set({
          session: {
            isMuted: false,
            isSpeakerOn: false,
            isMinimized: false,
            ...session,
          },
        }),

      updateSession: patch =>
        set(state =>
          state.session ? {session: {...state.session, ...patch}} : state,
        ),

      endSession: () => set({session: null}),

      setMinimized: isMinimized =>
        set(state =>
          state.session ? {session: {...state.session, isMinimized}} : state,
        ),
    }),
    'CallStore',
  ),
);
