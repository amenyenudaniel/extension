/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        dm_sans: ["DM Sans", "sans-serif"],
        work_sans: ["Work Sans", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF5722",
      },
    },
  },
  plugins: [],
};
