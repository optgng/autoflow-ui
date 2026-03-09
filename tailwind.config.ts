import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          income: "#10b981",
          expense: "#ef4444",
          balance: "#3b82f6",
        },
      },
      backgroundImage: {
        "finance-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#09090b",
            foreground: "#ecedee",
            primary: {
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
              DEFAULT: "#0ea5e9",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#10b981",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#ef4444",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#f59e0b",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;