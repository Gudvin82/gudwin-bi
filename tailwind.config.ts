import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F8FC",
        card: "#FFFFFF",
        accent: "#0F766E",
        accentSoft: "#E6FFFB",
        text: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
