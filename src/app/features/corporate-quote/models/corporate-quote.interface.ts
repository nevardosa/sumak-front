export interface CorporateQuoteForm {
  readonly nombreCompleto: string;
  readonly empresa: string;
  readonly cargo?: string;
  readonly email: string;
  readonly telefono: string;
  readonly cantidad: number;
  readonly nota?: string;
  readonly honeypot?: string;
  readonly recaptchaToken?: string; // reCAPTCHA v3 token
}

export interface CorporateQuotePayload {
  readonly nombreCompleto: string;
  readonly empresa: string;
  readonly cargo: string;
  readonly email: string;
  readonly telefono: string;
  readonly cantidad: number;
  readonly nota: string;
  readonly _recaptcha: string; // Formcarry reCAPTCHA field
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
