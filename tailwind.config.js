/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "sans-serif",
          "system-ui",
          "-apple-system",
        ],
      },
      colors: {
        ink: "#1d1d1f",
        chalk: "#f5f5f7",
        canvas: "#ffffff",
        blue: "#0066cc",
        blueFocus: "#0071e3",
        muted: "#7a7a7a",
        hairline: "#e0e0e0",
        tile: "#272729",
      },
      boxShadow: {
        nav: "0 22px 70px rgba(29, 29, 31, 0.18), 0 8px 24px rgba(29, 29, 31, 0.10)",
        soft: "0 24px 80px rgba(22, 22, 22, 0.12)",
        product: "3px 5px 30px rgba(0, 0, 0, 0.22)",
      },
    },
  },
  plugins: [],
};
