/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#147D64',
          'green-dark': '#0E5B48',
          'green-light': '#E9F5F1',
          blue: '#2357A5',
          'blue-dark': '#183E75',
          'blue-light': '#EEF4FC',
          yellow: '#F2B544',
          'yellow-light': '#FEF7E8',
          'yellow-dark': '#C99126',
          offwhite: '#F5F7F4',
          surface: '#FFFFFF',
          dark: '#162220',
          muted: '#5F736C',
          border: '#E2E8E5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 125, 100, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'hover': '0 14px 34px rgba(20, 125, 100, 0.14)',
      }
    },
  },
  plugins: [],
}
