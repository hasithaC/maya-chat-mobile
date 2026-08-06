type AuthEvent = 'forceLogout';
type Listener = () => void;

class AuthEventBus {
  private listeners = new Map<AuthEvent, Set<Listener>>();

  on(event: AuthEvent, listener: Listener): () => void {
    const set = this.listeners.get(event) ?? new Set<Listener>();
    set.add(listener);
    this.listeners.set(event, set);
    return () => set.delete(listener);
  }

  emit(event: AuthEvent): void {
    this.listeners.get(event)?.forEach(listener => listener());
  }
}

export const authEvents = new AuthEventBus();
