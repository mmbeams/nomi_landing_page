/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        bg: '#FFFFFF',
        'ui-white': '#FEFCF9',
        main: '#2D2A26',
        dim: '#7C746C',
        accent: '#C97B3A',
      },
    },
  },
  plugins: [],
}
