import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        surface: "#0E0E10",
        card: "#17181A",
        primary: "#F8E8D8",
        accent: "#C89B6D",
        highlight: "#FFE7C2",
        secondary: "#A5A5A5",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      letterSpacing: {
        cinematic: "0.22em",
      },
      boxShadow: {
        glass: "0 20px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
        goldglow: "0 0 60px -10px rgba(200,155,109,0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        shake: {
          "10%,90%": { transform: "translateX(-2px)" },
          "20%,80%": { transform: "translateX(4px)" },
          "30%,50%,70%": { transform: "translateX(-8px)" },
          "40%,60%": { transform: "translateX(8px)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
    },
  },
  plugins: [],
};

export default config;
