import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6'
        },
        neon: '#c084fc',
        dark: '#0b0b22'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...fontFamily.sans]
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(124, 58, 237, 0.35)'
      }
    }
  },
  plugins: []
};
