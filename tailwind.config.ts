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
        // Custom Finance Colors
        finance: {
          income: "#00FFA3",
          "income-dark": "#00CC82",
          expense: "#FF3366",
          "expense-dark": "#CC2952",
          balance: "#00E5FF",
          "balance-dark": "#00B8D4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #00E5FF 0%, #0066FF 100%)",
        "gradient-success": "linear-gradient(135deg, #00FFA3 0%, #00C853 100%)",
        "gradient-danger": "linear-gradient(135deg, #FF3366 0%, #F50057 100%)",
        "gradient-surface": "linear-gradient(135deg, #111113 0%, #1A1A1D 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 229, 255, 0.4), 0 0 40px rgba(0, 229, 255, 0.2)",
        "glow-success": "0 0 20px rgba(0, 255, 163, 0.4)",
        "glow-danger": "0 0 20px rgba(255, 51, 102, 0.4)",
        "glow-sm": "0 0 10px rgba(0, 229, 255, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "counter": "counter 1.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 229, 255, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 229, 255, 0.6)" },
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
              50: "#E0F7FF",
              100: "#B3EDFF",
              200: "#80E3FF",
              300: "#4DD9FF",
              400: "#26D1FF",
              500: "#00E5FF",
              600: "#00B8D4",
              700: "#008BA3",
              800: "#005E72",
              900: "#003141",
              DEFAULT: "#00E5FF",
              foreground: "#0A0A0B",
            },
            success: {
              DEFAULT: "#00FFA3",
              foreground: "#0A0A0B",
            },
            danger: {
              DEFAULT: "#FF3366",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FFB800",
              foreground: "#0A0A0B",
            },
            content1: "#111113",
            content2: "#1A1A1D",
            content3: "#222227",
            content4: "#2A2A2F",
            default: {
              100: "#1A1A1D",
              200: "#222227",
              300: "#2A2A2F",
              DEFAULT: "#1A1A1D",
              foreground: "#FFFFFF",
            },
          },
        },
        light: {
          colors: {
            background: "#FAFAFA",
            foreground: "#0A0A0B",
            primary: {
              50: "#E6F2FF",
              100: "#CCE5FF",
              200: "#99CBFF",
              300: "#66B1FF",
              400: "#3397FF",
              500: "#0066FF",
              600: "#0052CC",
              700: "#003D99",
              800: "#002966",
              900: "#001433",
              DEFAULT: "#0066FF",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#00C853",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#F50057",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FFB800",
              foreground: "#0A0A0B",
            },
            content1: "#FFFFFF",
            content2: "#F5F5F7",
            content3: "#EBEBED",
            content4: "#E0E0E3",
          },
        },
      },
    }),
  ],
};

export default config;
