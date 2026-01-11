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
    },
    SOCIAL_LINKS: {
      WHATSAPP: 'https://wa.me/573001234567',
      INSTAGRAM: 'https://instagram.com/sumakgourmet',
      FACEBOOK: 'https://facebook.com/sumakgourmet'
    }
  },
  
  // SEO Constants
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
  SETTINGS: '/settings'
} as const;