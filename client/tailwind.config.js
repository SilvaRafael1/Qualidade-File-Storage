/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pdf03-rgba": "rgba(0, 0, 0, 0.3)",
        "pdf01-rgba": "rgba(0, 0, 0, 0.1)"
      }
    },
  },
  plugins: [],
}

