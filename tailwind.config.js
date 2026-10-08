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
          DEFAULT: '#51101d',
          light: '#6d1828',
          dark: '#380a13',
          soft: 'rgba(81, 16, 29, 0.08)',
        },
        blush: {
          DEFAULT: '#d7b8af',
          light: '#f7eeec',
          soft: 'rgba(215, 184, 175, 0.25)',
          dark: '#bfa096',
        },
        cream: '#faf2f2',
        paper: '#ffffff',
        accentGold: '#c59d5f',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Arial', 'sans-serif'],
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
