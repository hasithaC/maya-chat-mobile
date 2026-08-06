export interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export function unwrap<T>(envelope: Envelope<T>): T {
  return envelope.data;
}

export function unwrapList<T>(envelope: Envelope<T[]>): T[] {
  return envelope.data ?? [];
}
