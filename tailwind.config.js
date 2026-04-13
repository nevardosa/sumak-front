/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    // Solo clases dinámicas críticas que no se detectan en purge
    'bg-sumak-green',
    'bg-sumak-gold',
    'text-sumak-green',
    'text-sumak-gold',
    'border-sumak-green',
    'border-sumak-gold',
  ],
  theme: {
    extend: {
      colors: {
        // SUMAK Gourmet Brand Colors
        sumak: {
          green: '#063A3D',
          gold: '#C5A572',
        },
        // Text Colors
        text: {
          primary: '#1C1C1C',
          secondary: '#3A3A3A',
          body: '#6B6B6B',
          light: '#F3F3F3',
        },
      },
      fontFamily: {
        'against': ['Against', 'serif'],
        'garet': ['Garet', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        'premium': '1.1',
      },
    },
  },
  plugins: [],
}
