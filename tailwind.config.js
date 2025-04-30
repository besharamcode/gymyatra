/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
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
}; 