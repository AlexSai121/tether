/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a', // Ensure dark slate is available if not default
        },
        indigo: {
          500: '#6366f1',
        }
      },
    },
  },
  plugins: [],
}
