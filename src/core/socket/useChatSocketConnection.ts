import {useEffect} from 'react';
import {useAuthStore} from '../../domain/auth/store/auth.store';
import {disconnectChatSocket, initChatSocket} from './chat-socket';

// Connects the chat socket once the user is authenticated and their profile
// is loaded, and disconnects on logout. Mount once near the app root so the
// connection lives for the whole session, independent of the active screen.
export function useChatSocketConnection() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const accessToken = useAuthStore(state => state.accessToken);
  const userId = useAuthStore(state => state.user?.id);

  useEffect(() => {
    if (isAuthenticated && accessToken && userId) {
      if (__DEV__) console.log('[SOCKET] connecting for user', userId);
      initChatSocket(accessToken);
    } else {
      disconnectChatSocket();
    }

    return () => {
      disconnectChatSocket();
    };
  }, [isAuthenticated, accessToken, userId]);
}
