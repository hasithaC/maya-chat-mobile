export interface MayaEnvelope<T = unknown> {
  success: boolean;
  message: string;
  response?: T;
}

export interface MayaTrainingStep {
  message: string;
  current_step: string;
  options: string[];
  completed: boolean;
}

export type MayaPersonaType =
  | 'professional_calm'
  | 'friendly_conversational'
  | 'confident_direct';
