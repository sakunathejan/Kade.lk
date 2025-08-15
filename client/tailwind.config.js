/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6F00', // Primary Orange
          secondary: '#00897B', // Teal
        },
        neutral: {
          light: '#F5F5F5',
          dark: '#121212',
          surface: '#212121',
        },
        primary: {
          DEFAULT: '#4CAF50', // Green
          dark: '#388E3C',
          light: '#81C784',
        },
        accent: {
          DEFAULT: '#2196F3', // Blue
          dark: '#1976D2',
          light: '#64B5F6',
        },
        secondary: {
          DEFAULT: '#FFC107', // Amber
          dark: '#FFA000',
          light: '#FFD54F',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'focus:ring-primary',
    'focus:ring-accent',
    'focus:ring-secondary',
    'border-primary',
    'border-accent',
    'border-secondary',
    'text-primary',
    'text-accent',
    'text-secondary',
    'bg-primary',
    'bg-accent',
    'bg-secondary',
    'from-primary',
    'to-accent',
    'via-accent',
    'from-accent',
    'to-secondary',
    'via-secondary',
  ],
};


