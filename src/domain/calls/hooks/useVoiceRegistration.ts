import {useEffect} from 'react';
import {useAuthStore} from '../../auth/store/auth.store';
import {voiceService} from '../services/voice.service';

// Registers the device with Twilio once the user is authenticated and their
// profile is loaded, and unregisters on logout. Mount once near the app root
// so incoming calls are received for the whole session, on any screen.
export function useVoiceRegistration() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userId = useAuthStore(state => state.user?.id);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    voiceService.register(userId).catch(error => {
      if (__DEV__) console.warn('[VOICE] registration failed', error);
    });

    return () => {
      voiceService.unregister();
    };
  }, [isAuthenticated, userId]);
}
