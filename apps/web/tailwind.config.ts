import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4ecca3',
          dark: '#3db88f',
          light: '#6fd9b5',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f3460',
        },
        accent: {
          DEFAULT: '#e94560',
          light: '#ff6b6b',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}
export default config
