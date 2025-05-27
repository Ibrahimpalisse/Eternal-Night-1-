/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}", // Assure-toi que les extensions de tes fichiers React sont incluses (.jsx si tu utilises ça)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}