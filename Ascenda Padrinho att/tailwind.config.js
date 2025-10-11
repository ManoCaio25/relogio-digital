import defaultTheme from 'tailwindcss/defaultTheme';

const withOpacityValue = (variable) => ({ opacityValue } = {}) => {
  if (opacityValue === undefined) {
    return `rgb(var(${variable}) / 1)`;
  }
  return `rgb(var(${variable}) / ${opacityValue})`;
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: withOpacityValue('--bg-rgb'),
        surface: withOpacityValue('--surface-rgb'),
        surface2: withOpacityValue('--surface-2-rgb'),
        background: withOpacityValue('--surface-rgb'),
        foreground: withOpacityValue('--text-primary-rgb'),
        primary: withOpacityValue('--text-primary-rgb'),
        secondary: withOpacityValue('--text-secondary-rgb'),
        muted: withOpacityValue('--text-muted-rgb'),
        'muted-foreground': withOpacityValue('--text-muted-rgb'),
        brand: withOpacityValue('--brand-rgb'),
        brand2: withOpacityValue('--brand-2-rgb'),
        success: withOpacityValue('--success-rgb'),
        warning: withOpacityValue('--warning-rgb'),
        error: withOpacityValue('--error-rgb'),
        border: withOpacityValue('--border-rgb'),
        ring: withOpacityValue('--ring-rgb'),
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'loading-stripes': {
          '0%': { transform: 'translateX(-120%)' },
          '50%': { transform: 'translateX(30%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        'loading-stripes': 'loading-stripes 1.4s ease-in-out infinite',
      },
      transitionDuration: {
        350: '350ms',
      },
    },
  },
  plugins: [],
};
