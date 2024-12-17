/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        'draw-path': {
          '0%': { strokeDashoffset: '200' },
          '100%': { strokeDashoffset: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'draw-path': 'draw-path 1.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
