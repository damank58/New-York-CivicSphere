import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2E62F4",
          dark: "#1F3FA4",
          light: "#E6EEFF",
        },
      },
      boxShadow: {
        card: "0 10px 40px rgba(28, 40, 68, 0.08)",
      },
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;

