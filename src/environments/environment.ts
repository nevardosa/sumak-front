export const environment = {
  production: true,
  apiUrl: 'https://api.sumakgourmet.com/api',
  appName: 'SUMAK',
  version: '1.0.0',
  enableLogging: false,
  enableAnalytics: true,
  features: {
    enablePWA: true,
    enableOfflineMode: true,
  },
  payment: {
    breAccount: '@DAVISUMAK',
    whatsappNumber: '573208663691',
    whatsappBaseUrl: 'https://wa.me/'
  },
  emailjs: {
    serviceId: 'service_sumak_secure',
    templateId: 'template_order_csv',
    publicKey: 'DEVELOPMENT_MODE', // Placeholder for development
    adminEmail: 'suumak25@gmail.com'
  },
  forms: {
    corporateQuote: {
      provider: 'formcarry',
      endpoint: 'https://formcarry.com/s/8dlE37BRyEd'
    }
  },
  security: {
    encryptionEnabled: true,
    auditEnabled: true,
    antiDebugEnabled: true, // ✅ ENABLED for production
    keyDerivationIterations: 100000
  },
  recaptcha: {
    siteKey: '6Lf1yGUsAAAAAPWDonLO7z9GlhDvJzF0zpuk9kSv' // Site Key de Google reCAPTCHA v3
  }
};
