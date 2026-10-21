import {Platform} from 'react-native';

// Twilio Push Credential SIDs (Twilio Console → Voice → Credentials) for the
// com.aecendir.maya app — one per platform, since iOS pushes go through an
// APNs VoIP certificate and Android through FCM. Sent with the voice-token
// request so the access token can register this device for incoming calls.
// While null the backend falls back to its own default credential.
const PUSH_CREDENTIAL_SIDS = {
  ios: null as string | null,
  android: null as string | null,
};

export const PUSH_CREDENTIAL_SID =
  Platform.OS === 'ios'
    ? PUSH_CREDENTIAL_SIDS.ios
    : PUSH_CREDENTIAL_SIDS.android;

// Twilio app-to-app calls address the other client by identity, which the
// backend sets to the user's id.
export const toClientAddress = (userId: string) => `client:${userId}`;
export const fromClientAddress = (address?: string) =>
  address?.replace(/^client:/, '');
