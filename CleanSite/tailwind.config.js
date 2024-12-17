/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A4A4A',
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}