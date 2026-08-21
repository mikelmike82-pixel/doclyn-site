import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F8FA",
        surface: "#FFFFFF",
        line: "#E4E7EC",
        ink: "#14181F",
        muted: "#6B7280",
        signal: {
          DEFAULT: "#3B4CF0",
          dark: "#2C39C4",
          tint: "#EEF0FE",
        },
        gain: {
          DEFAULT: "#B8790A",
          tint: "#FBF1DE",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 24, 31, 0.04), 0 1px 1px rgba(20, 24, 31, 0.03)",
      },
      borderRadius: {
        DEFAULT: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
