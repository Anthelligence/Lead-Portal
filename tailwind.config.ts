import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cotit: {
          orange: "#FE5E17",
          softGray: "#DADBD6",
          offWhite: "#FAFAFA",
          green: "#93D753",
          blue: "#4D93D6",
          black: "#1D1D1D",
          white: "#FFFFFF"
        }
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.05)"
      }
    }
  },
  plugins: []
};

export default config;

