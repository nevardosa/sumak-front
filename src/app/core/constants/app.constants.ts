export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'theme_preference',
    LANGUAGE: 'language_preference'
  },
  
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    },
    USERS: '/users'
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_PATTERN: /^\+?[\d\s\-\(\)]+$/
  },
  
  TIMEOUTS: {
    API_REQUEST: 30000,
    DEBOUNCE_SEARCH: 300,
    TOAST_DURATION: 5000
  },
  
  // Home Page Constants
  HOME: {
    TESTIMONIAL_ROTATION_INTERVAL: 5000,
    ANIMATION_DURATION: 300,
    HERO_CTA_ROUTES: {
      PRIMARY: '/catalog',
      SECONDARY: '/about'
    }
  },
  
  // Social Media Constants
  SOCIAL_MEDIA: {
    INSTAGRAM: {
      URL: 'https://www.instagram.com/sumak_gourmet/',
      LABEL: 'Instagram',
      HANDLE: '@sumak_gourmet'
    },
    FACEBOOK: {
      URL: 'https://www.facebook.com/profile.php?id=61584393061696',
      LABEL: 'Facebook',
      HANDLE: 'Sumak Gourmet'
    },
    TIKTOK: {
      URL: 'https://www.tiktok.com/@sumak_gourmet',
      LABEL: 'TikTok',
      HANDLE: '@sumak_gourmet'
    }
  },
  
  // FAQ Constants
  FAQ: {
    CATEGORIES: {
      GENERAL: { id: 'general', name: 'General', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      ORDERS: { id: 'orders', name: 'Pedidos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      SHIPPING: { id: 'shipping', name: 'Envíos', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
      PRODUCTS: { id: 'products', name: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      PAYMENTS: { id: 'payments', name: 'Pagos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
    }
  },
  SEO: {
    HOME: {
      TITLE: 'Sumak Gourmet - Sabores Auténticos de Colombia',
      DESCRIPTION: 'Descubre la riqueza gastronómica colombiana con productos artesanales seleccionados directamente desde el origen. Calidad premium, entrega rápida.',
      KEYWORDS: 'gourmet, colombia, productos artesanales, comida tradicional, sabores auténticos',
      OG_IMAGE: '/assets/images/sumak-og-image.jpg'
    }
  }
} as const;

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  FAQ: '/faq'
} as const;