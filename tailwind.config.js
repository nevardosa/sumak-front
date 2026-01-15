/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // SUMAK Gourmet Brand Colors
        sumak: {
          green: '#063A3D',      // Verde profundo - Identidad SUMAK
          gold: '#C5A572',       // Dorado artesanal - Acentos premium
          brown: '#5A2B13',      // Marrón tierra - Madera/raíz
          wine: '#6A1410',       // Rojo tierra profundo - Vino/cacao
        },
        // Text Colors
        text: {
          primary: '#1C1C1C',    // Títulos principales
          secondary: '#3A3A3A',  // Subtítulos
          body: '#6B6B6B',       // Texto de párrafo
          light: '#F3F3F3',      // Texto sobre fondo oscuro
        },
        // Legacy colors for compatibility
        primary: {
          50: '#f0f9ff',
          500: '#063A3D',
          600: '#063A3D',
          700: '#052e31',
        },
        secondary: {
          50: '#f8fafc',
          500: '#5A2B13',
          600: '#4a2310',
          700: '#3a1c0d',
        }
      },
      fontFamily: {
        // SUMAK Gourmet Typography
        'against': ['Against', 'serif'],                        // Tipografía principal - títulos y headings
        'garet': ['Garet', 'Inter', 'system-ui', 'sans-serif'], // Tipografía secundaria - texto y párrafos
        // Aliases para consistencia
        'primary': ['Against', 'serif'],                        // Alias para tipografía principal
        'secondary': ['Garet', 'Inter', 'system-ui', 'sans-serif'], // Alias para tipografía secundaria
        // Fallbacks
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      letterSpacing: {
        'wider': '0.05em',
        'widest': '0.1em',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
