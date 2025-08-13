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
      },
    },
  },
  plugins: [],
};


