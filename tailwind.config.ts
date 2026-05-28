import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: "#23E28B",
          green: "#19BA75",
          navy: "#00204F",
          ink: "#071626",
          paper: "#F7FAF8"
        }
      },
      fontFamily: {
        heading: ["Qualy", "MazzardL", "Arial", "sans-serif"],
        body: ["MazzardL", "Arial", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 70px rgba(0, 32, 79, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
