/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f8f9fa',
          text: '#1a1a1a',
          'text-secondary': '#6c757d',
          border: '#dee2e6',
          primary: '#4ecca3',
          'primary-dark': '#3db88f',
          accent: '#e94560',
        },
        // Dark mode
        dark: {
          bg: '#0a0a0a',
          'bg-secondary': '#1a1a2e',
          'bg-tertiary': '#16213e',
          text: '#ffffff',
          'text-secondary': '#b0b0b0',
          border: '#333333',
          primary: '#4ecca3',
          'primary-dark': '#3db88f',
          accent: '#e94560',
        },
      },
    },
  },
  plugins: [],
}
