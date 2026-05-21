/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0D1117",
          card: "#161B27",
          elevated: "#1C2333",
          sidebar: "#111827",
        },
        accent: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          soft: "rgba(99,102,241,0.15)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
