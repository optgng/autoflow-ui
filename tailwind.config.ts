import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          income:         "#00FFA3",
          "income-dark":  "#00CC82",
          expense:        "#FF3366",
          "expense-dark": "#CC2952",
          balance:        "#00874A",   // ← заменили cyan
          "balance-dark": "#006B3B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        // ← Тёмная тема: зелёный градиент
        "gradient-primary":  "linear-gradient(135deg, #00874A 0%, #005c32 100%)",
        "gradient-success":  "linear-gradient(135deg, #00FFA3 0%, #00C853 100%)",
        "gradient-danger":   "linear-gradient(135deg, #FF3366 0%, #F50057 100%)",
        "gradient-surface":  "linear-gradient(135deg, #111113 0%, #1A1A1D 100%)",
        // ← Светлая тема: синий градиент
        "gradient-primary-light": "linear-gradient(135deg, #1A6EF5 0%, #003DAD 100%)",
        "gradient-surface-light": "linear-gradient(135deg, #F7F4F0 0%, #EDE8E1 100%)",
      },
      boxShadow: {
        // ← Все glow теперь зелёные для тёмной темы
        glow:          "0 0 20px rgba(0, 135, 74, 0.5), 0 0 40px rgba(0, 135, 74, 0.25)",
        "glow-success":"0 0 20px rgba(0, 255, 163, 0.4)",
        "glow-danger": "0 0 20px rgba(255, 51, 102, 0.4)",
        "glow-sm":     "0 0 10px rgba(0, 135, 74, 0.35)",
        "glass-light": "0 8px 32px rgba(120, 100, 80, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "scale-in":   "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        counter:      "counter 1.5s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        scaleIn: {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        // ← Зелёный glow pulse
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 135, 74, 0.5)" },
          "50%":      { boxShadow: "0 0 40px rgba(0, 135, 74, 0.75)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0A0A0B",
            foreground: "#FFFFFF",
            primary: {
              50:  "#E6F5EE",
              100: "#C0E8D4",
              200: "#8FD4B0",
              300: "#5ABF8C",
              400: "#2DAD70",
              500: "#00874A",   // ← основной акцент тёмной темы
              600: "#006B3B",
              700: "#00502C",
              800: "#00351D",
              900: "#001A0E",
              DEFAULT:    "#00874A",
              foreground: "#FFFFFF",
            },
            success: { DEFAULT: "#00FFA3", foreground: "#0A0A0B" },
            danger:  { DEFAULT: "#FF3366", foreground: "#FFFFFF"  },
            warning: { DEFAULT: "#FFB800", foreground: "#0A0A0B"  },
            content1: "#111113",
            content2: "#1A1A1D",
            content3: "#222227",
            content4: "#2A2A2F",
            default: {
              100: "#1A1A1D",
              200: "#222227",
              300: "#2A2A2F",
              DEFAULT:    "#1A1A1D",
              foreground: "#FFFFFF",
            },
          },
        },
        light: {
          colors: {
            background: "#F5F0E8",
            foreground: "#1A1510",
            primary: {
              50:  "#EEF4FF",
              100: "#D5E5FF",
              200: "#AACAFF",
              300: "#7AADFF",
              400: "#4D90FF",
              500: "#1A6EF5",   // светлая тема остаётся синей
              600: "#0052D4",
              700: "#003DAD",
              800: "#002A86",
              900: "#001A5F",
              DEFAULT:    "#1A6EF5",
              foreground: "#FFFFFF",
            },
            success: { DEFAULT: "#00874A", foreground: "#FFFFFF" },
            danger:  { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#D97706", foreground: "#FFFFFF" },
            content1: "#EDE8DF",
            content2: "#E5DED3",
            content3: "#D9D0C4",
            content4: "#CFC5B7",
            default: {
              100: "#EDE8DF",
              200: "#E5DED3",
              300: "#D9D0C4",
              DEFAULT:    "#E5DED3",
              foreground: "#1A1510",
            },
          },
        },
      },
    }),
  ],
};

export default config;

