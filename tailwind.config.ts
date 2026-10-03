import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        panel: "#0d1a2b",
        alert: "#ff6b35",
        cyan: "#5ee7f0",
        mist: "#eaf1f8"
      },
      boxShadow: {
        glow: "0 20px 70px rgba(94, 231, 240, .12)"
      }
    }
  },
  plugins: []
};

export default config;
