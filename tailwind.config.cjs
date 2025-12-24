/**********
 * Tailwind config for trading landing + dashboard skeleton.
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#e8edff",
          100: "#cfd8ff",
          200: "#a2b4ff",
          300: "#6c8cff",
          400: "#3f63ff",
          500: "#1f4cff",
          600: "#0036ff",
          700: "#0a2dd1",
          800: "#0c2aa8",
          900: "#0d257f",
        },
        navy: {
          50: "#e9ecf5",
          100: "#cfd5e6",
          200: "#a4b0cd",
          300: "#7c8cb4",
          400: "#556692",
          500: "#33456f",
          600: "#1f2f54",
          700: "#162541",
          800: "#0f1c33",
          900: "#0a122a",
        },
        slate: {
          925: "#0b1220",
        },
      },
      boxShadow: {
        card: "0 14px 45px rgba(15,30,60,0.12)",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
