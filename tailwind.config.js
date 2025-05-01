/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Blue
        secondary: "#4338CA", // Indigo
        accent: "#047857", // Emerald
        background: "#F3F4F6", // Light gray
        dark: "#1F2937", // Dark gray
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} 