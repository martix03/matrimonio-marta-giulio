/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#8c2035',
          deep: '#380a13',
          light: '#6d1828',
          ribbon: '#8a1e32',
          soft: 'rgba(140, 32, 53, 0.08)',
        },
        blush: {
          DEFAULT: '#dfb0b0',
          warm: '#fde7e2',
          light: '#f7eeec',
          soft: 'rgba(223, 176, 176, 0.25)',
          dark: '#bfa096',
          bg: '#fbf5f4',
        },
        sage: {
          DEFAULT: '#667b4e',
          light: '#e5edd8',
          dark: '#4a5b37',
          soft: 'rgba(102, 123, 78, 0.15)',
        },
        cream: '#faf2f2',
        paper: '#ffffff',
        avorio: '#fffcf7',
        lightRosa: '#fbf5f4',
        accentGold: '#c59d5f',
      },
      fontFamily: {
        sans: ['var(--font-site)', 'sans-serif'],
        serif: ['var(--font-site)', 'serif'],
        heading: ['var(--font-site)', 'sans-serif'],
      },
      boxShadow: {
        'wedding': '0 20px 50px rgba(81, 16, 29, 0.08), 0 4px 16px rgba(81, 16, 29, 0.04)',
        'wedding-lg': '0 25px 60px rgba(81, 16, 29, 0.12), 0 8px 24px rgba(81, 16, 29, 0.06)',
        'wedding-glow': '0 0 35px rgba(215, 184, 175, 0.35)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
