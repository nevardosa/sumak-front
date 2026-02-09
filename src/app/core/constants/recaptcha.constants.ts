/**
 * reCAPTCHA v3 Constants
 * Centralized configuration for reCAPTCHA integration
 */

export const RECAPTCHA_CONSTANTS = {
  /** Field name for reCAPTCHA token in form payloads */
  TOKEN_FIELD_NAME: 'recaptchaToken',
  
  /** Action names for different form submissions */
  ACTIONS: {
    CORPORATE_QUOTE: 'corporate_quote_submit',
    LOGIN: 'login_submit',
    CHECKOUT: 'checkout_submit'
  },
  
  /** Timeout for reCAPTCHA execution (milliseconds) */
  EXECUTION_TIMEOUT_MS: 5000,
  
  /** Maximum retry attempts */
  MAX_RETRY_ATTEMPTS: 1
} as const;
