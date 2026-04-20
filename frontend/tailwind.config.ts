import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a1628',
          50: '#eaf0fb',
          100: '#c7d3e8',
          200: '#8fa3c5',
          300: '#5a739e',
          400: '#33496f',
          500: '#182a4a',
          600: '#0f1f3a',
          700: '#0b182e',
          800: '#081322',
          900: '#050c1a',
        },
        cyan: {
          DEFAULT: '#5fd0e3',
          300: '#85dcea',
          400: '#6ed4e5',
          500: '#4ac8dc',
          600: '#2fb0c6',
        },
        brand: {
          DEFAULT: '#172c5c',
          50: '#eef1f8',
          100: '#d6dcec',
          200: '#a9b4d2',
          300: '#7684b3',
          400: '#4a5b92',
          500: '#2d3f77',
          600: '#172c5c',
          700: '#122449',
          800: '#0d1b37',
          900: '#081126',
          accent: '#d4af37',
        },
        gold: {
          50: '#fbf6e6',
          100: '#f5ead0',
          200: '#ebd69f',
          300: '#e1c06d',
          400: '#d4af37',
          500: '#b8932a',
          600: '#8f7220',
          700: '#6b5618',
          800: '#473a10',
          900: '#251e08',
        },
      },
      fontFamily: {
        sans: ['Prompt', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Prompt', 'sans-serif'],
        plate: ['"Anuphan"', 'Prompt', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 30px -12px rgba(5, 12, 26, 0.55)',
        glow: '0 0 0 1px rgba(95, 208, 227, 0.35), 0 18px 40px -18px rgba(95, 208, 227, 0.5)',
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px -10px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
