import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        h1: "var(--h1-color)",
        paragraph: "var(--paragraph)",
        button: "var(--button)",
        "button-text": "var(--button-text)",
        border: "var(--border)",
        tertiary: "var(--tertiary)",
        danger: "var(--danger)",
      },
      borderRadius: {
        lg: "var(--radius, 8px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
