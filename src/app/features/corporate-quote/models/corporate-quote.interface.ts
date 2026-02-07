export interface CorporateQuoteForm {
  readonly nombreCompleto: string;
  readonly empresa: string;
  readonly cargo?: string;
  readonly email: string;
  readonly telefono: string;
  readonly cantidad: number;
  readonly nota?: string;
  readonly honeypot?: string;
}

export interface CorporateQuotePayload {
  readonly nombreCompleto: string;
  readonly empresa: string;
  readonly cargo: string;
  readonly email: string;
  readonly telefono: string;
  readonly cantidad: number;
  readonly nota: string;
}

export enum FormStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface FormState {
  readonly status: FormStatus;
  readonly errorMessage?: string;
  readonly lastSubmitTime?: number;
}
