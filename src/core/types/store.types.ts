export interface StoreError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}
