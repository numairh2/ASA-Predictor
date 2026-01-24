import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#f0c14b',
          500: '#daa520',
          600: '#b8860b',
        },
        bronze: {
          500: '#cd7f32',
          600: '#b87333',
        },
        cream: {
          100: '#fef3e2',
          200: '#fde8d0',
          300: '#fce5cd',
        },
        brown: {
          700: '#6b5d54',
          800: '#2d2520',
        },
        tan: {
          300: '#e8d4b8',
          400: '#8b7355',
        },
        // Dark mode colors
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
