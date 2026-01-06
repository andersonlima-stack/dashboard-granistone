/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        card: '#0f172a',
        border: '#1e293b',
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
      },
    },
  },
  plugins: [],
}
