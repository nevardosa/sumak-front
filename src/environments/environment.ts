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
  security: {
    encryptionEnabled: true,
    auditEnabled: true,
    antiDebugEnabled: true,
    keyDerivationIterations: 100000
  }
};
