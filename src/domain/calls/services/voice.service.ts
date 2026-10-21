import {
  AudioDevice,
  Call,
  CallInvite,
  Voice,
} from '@twilio/voice-react-native-sdk';
import {Platform} from 'react-native';
import {queryClient} from '../../../core/query/query-client';
import {showToast} from '../../../core/toast/toast.store';
import {callsApi} from '../api/calls.api';
import {
  PUSH_CREDENTIAL_SID,
  fromClientAddress,
  toClientAddress,
} from '../constants/calls.constants';
import {type CallPeer, useCallStore} from '../store/call.store';
import type {EndCallRequest} from '../types/calls.types';

// Custom parameters the backend's TwiML attaches to an incoming call.
interface IncomingCallParams {
  backendCallId?: string;
  callerName?: string;
  callerPhone?: string;
  callerAvatar?: string;
}

const logError = (label: string) => (error: unknown) => {
  if (__DEV__) console.warn(`[VOICE] ${label}`, error);
};

const invalidateCallHistory = () =>
  queryClient.invalidateQueries({queryKey: ['calls', 'history']});

function peerFromParams(
  params: IncomingCallParams,
  from: string | undefined,
): CallPeer {
  return {
    id: fromClientAddress(from),
    name: params.callerName?.trim() || params.callerPhone || 'Unknown',
    avatarUrl: params.callerAvatar || undefined,
  };
}

// Owns the single Twilio Voice instance for the app and keeps the call
// store in sync with it. Lives outside React so call events (which can
// arrive on any screen, or with no screen mounted) always reach the same
// handlers, and backend sync never reads a stale access token from a
// component closure.
class VoiceService {
  private voice: Voice | null = null;
  private identity: string | null = null;
  private registeredToken: string | null = null;
  private pushRegistryInitialized = false;
  private activeCall: Call | null = null;
  private callInvite: CallInvite | null = null;

  private get store() {
    return useCallStore.getState();
  }

  private getVoice(): Voice {
    if (!this.voice) {
      const voice = new Voice();
      // The SDK's typings name the listener's argument after the listener
      // type itself (Voice.Listener.CallInvite); at runtime it's a CallInvite.
      voice.on(Voice.Event.CallInvite, invite =>
        this.handleCallInvite(invite as unknown as CallInvite),
      );
      voice.on(Voice.Event.Registered, () =>
        this.store.setVoiceRegistered(true),
      );
      voice.on(Voice.Event.Unregistered, () =>
        this.store.setVoiceRegistered(false),
      );
      voice.on(Voice.Event.AudioDevicesUpdated, (_devices, selectedDevice) =>
        this.store.updateSession({
          isSpeakerOn: selectedDevice?.type === AudioDevice.Type.Speaker,
        }),
      );
      voice.on(Voice.Event.Error, logError('voice error'));
      this.voice = voice;
    }
    return this.voice;
  }

  private async fetchToken(identity: string) {
    const {token} = await callsApi.getVoiceToken({
      identity,
      pushCredentialSid: PUSH_CREDENTIAL_SID,
    });
    return token;
  }

  // ── Registration ──

  // Registers this device for incoming calls. Outgoing calls only need the
  // identity, so it's stored first — a push registration failure (e.g. a
  // placeholder Firebase config) still leaves outgoing calling usable.
  async register(userId: string) {
    this.identity = userId;
    const voice = this.getVoice();

    if (Platform.OS === 'ios' && !this.pushRegistryInitialized) {
      await voice.initializePushRegistry();
      this.pushRegistryInitialized = true;
    }

    const token = await this.fetchToken(userId);
    // Logged out (unregister ran) while the token request was in flight.
    if (this.identity !== userId) return;
    await voice.register(token);
    this.registeredToken = token;

    await this.restorePendingCalls();
  }

  async unregister() {
    if (this.activeCall) {
      await this.activeCall.disconnect().catch(logError('disconnect'));
    }
    if (this.voice && this.registeredToken) {
      await this.voice
        .unregister(this.registeredToken)
        .catch(logError('unregister'));
    }
    this.identity = null;
    this.registeredToken = null;
    this.activeCall = null;
    this.callInvite = null;
    this.store.setVoiceRegistered(false);
    this.store.endSession();
  }

  // Picks up calls/invites the native layer received before JS was running
  // — e.g. the app was launched by answering from the lock screen.
  private async restorePendingCalls() {
    const voice = this.getVoice();
    const [calls, invites] = await Promise.all([
      voice.getCalls(),
      voice.getCallInvites(),
    ]);

    const [call] = calls.values();
    if (call && !this.activeCall) {
      const params = call.getCustomParameters() as IncomingCallParams;
      this.store.startSession({
        direction: 'incoming',
        status:
          call.getState() === Call.State.Connected ? 'connected' : 'connecting',
        peer: peerFromParams(params, call.getFrom()),
        backendCallId: params.backendCallId,
        connectedAt: call.getInitialConnectedTimestamp()?.getTime(),
      });
      this.attachCallListeners(call, params.backendCallId);
      return;
    }

    const [invite] = invites.values();
    if (invite && !this.callInvite) {
      this.handleCallInvite(invite);
    }
  }

  // ── Outgoing ──

  async startCall(peer: CallPeer & {id: string}) {
    if (this.store.session) {
      showToast('You are already on a call.', 'warning');
      return;
    }
    if (!this.identity) {
      showToast('Calling is not available right now. Please try again.');
      return;
    }

    this.store.startSession({direction: 'outgoing', status: 'dialing', peer});

    let backendCallId: string | undefined;
    try {
      const [record, token] = await Promise.all([
        callsApi.initiate({calleeId: peer.id, type: 'voice'}),
        this.fetchToken(this.identity),
      ]);
      backendCallId = String(record.id);

      // The user hung up while the call was still being set up.
      if (!this.store.session) {
        this.endOnBackend(backendCallId, 'canceled');
        return;
      }
      this.store.updateSession({backendCallId});

      const call = await this.getVoice().connect(token, {
        params: {To: toClientAddress(peer.id)},
        contactHandle: peer.name,
      });

      if (!this.store.session) {
        await call.disconnect();
        this.endOnBackend(backendCallId, 'canceled');
        return;
      }
      this.attachCallListeners(call, backendCallId);
    } catch (error) {
      logError('start call')(error);
      showToast("Couldn't start the call. Please try again.");
      if (backendCallId) this.endOnBackend(backendCallId, 'canceled');
      this.store.endSession();
    }
  }

  // ── Incoming ──

  private handleCallInvite(invite: CallInvite) {
    const params = invite.getCustomParameters() as IncomingCallParams;

    // Already on a call — decline instead of replacing the current session.
    if (this.store.session) {
      invite.reject().catch(logError('reject busy invite'));
      if (params.backendCallId) {
        callsApi
          .reject(params.backendCallId, {reason: 'canceled'})
          .catch(logError('backend reject'));
      }
      return;
    }

    this.callInvite = invite;
    this.store.startSession({
      direction: 'incoming',
      status: 'ringing',
      peer: peerFromParams(params, invite.getFrom()),
      backendCallId: params.backendCallId,
    });

    // Accept/reject can come from our UI or from the native call UI
    // (CallKit / the Android notification), so the work lives in these
    // listeners and is guarded to run once.
    let settled = false;

    invite.on(CallInvite.Event.Accepted, call => {
      if (settled) return;
      settled = true;
      this.callInvite = null;
      this.store.updateSession({status: 'connecting', isMinimized: false});
      this.attachCallListeners(call, params.backendCallId);

      const twilioCallSid = call.getSid() ?? invite.getCallSid();
      if (params.backendCallId && twilioCallSid) {
        callsApi
          .accept(params.backendCallId, {twilioCallSid})
          .catch(logError('backend accept'));
      }
    });

    invite.on(CallInvite.Event.Rejected, () => {
      if (settled) return;
      settled = true;
      this.callInvite = null;
      this.store.endSession();
      if (params.backendCallId) {
        callsApi
          .reject(params.backendCallId, {reason: 'canceled'})
          .catch(logError('backend reject'));
      }
      invalidateCallHistory();
    });

    invite.on(CallInvite.Event.Cancelled, () => {
      if (settled) return;
      settled = true;
      this.callInvite = null;
      this.store.endSession();
      if (params.backendCallId) {
        this.endOnBackend(params.backendCallId, 'canceled');
      }
      invalidateCallHistory();
    });

    invite.on(CallInvite.Event.NotificationTapped, () =>
      this.store.setMinimized(false),
    );
  }

  async accept() {
    try {
      await this.callInvite?.accept();
    } catch (error) {
      logError('accept')(error);
      showToast("Couldn't answer the call.");
    }
  }

  async reject() {
    await this.callInvite?.reject().catch(logError('reject'));
  }

  // ── Active call ──

  private attachCallListeners(call: Call, backendCallId?: string) {
    this.activeCall = call;
    const isOutgoing = this.store.session?.direction === 'outgoing';
    let sidSynced = !isOutgoing;
    let finished = false;

    // The callee side learns the CallSid from the accept request; the
    // caller reports it once Twilio assigns one (by the time it rings).
    const syncSid = () => {
      const twilioCallSid = call.getSid();
      if (sidSynced || !backendCallId || !twilioCallSid) return;
      sidSynced = true;
      callsApi
        .updateTwilioSid(backendCallId, {twilioCallSid})
        .catch(logError('backend sid'));
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      const wasConnected = Boolean(this.store.session?.connectedAt);
      if (backendCallId) {
        this.endOnBackend(backendCallId, wasConnected ? 'completed' : 'canceled');
      }
      if (this.activeCall === call) this.activeCall = null;
      this.store.endSession();
      invalidateCallHistory();
    };

    call.on(Call.Event.Ringing, syncSid);
    call.on(Call.Event.Connected, () => {
      syncSid();
      this.store.updateSession({status: 'connected', connectedAt: Date.now()});
    });
    call.on(Call.Event.Reconnecting, () =>
      this.store.updateSession({status: 'reconnecting'}),
    );
    call.on(Call.Event.Reconnected, () =>
      this.store.updateSession({status: 'connected'}),
    );
    call.on(Call.Event.Disconnected, finish);
    call.on(Call.Event.ConnectFailure, error => {
      logError('connect failure')(error);
      showToast('The call could not be connected.');
      finish();
    });
  }

  async hangup() {
    if (this.callInvite) {
      await this.reject();
      return;
    }
    if (this.activeCall) {
      // The Disconnected listener handles backend sync and cleanup.
      await this.activeCall.disconnect().catch(logError('disconnect'));
      return;
    }
    // An outgoing call still being set up — startCall sees the cleared
    // session and cancels it once its pending requests return.
    this.store.endSession();
  }

  async toggleMute() {
    const session = this.store.session;
    if (!this.activeCall || !session) return;
    const isMuted = await this.activeCall.mute(!session.isMuted);
    this.store.updateSession({isMuted});
  }

  async toggleSpeaker() {
    const session = this.store.session;
    if (!session) return;
    const {audioDevices} = await this.getVoice().getAudioDevices();
    const targetType = session.isSpeakerOn
      ? AudioDevice.Type.Earpiece
      : AudioDevice.Type.Speaker;
    const target = audioDevices.find(device => device.type === targetType);
    if (!target) return;
    await target.select();
    this.store.updateSession({isSpeakerOn: !session.isSpeakerOn});
  }

  private endOnBackend(callId: string, reason: EndCallRequest['reason']) {
    callsApi.end(callId, {reason}).catch(logError('backend end'));
  }
}

export const voiceService = new VoiceService();
