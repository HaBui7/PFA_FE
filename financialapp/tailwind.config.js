/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        aiLogo: "hsl(var(--aiLogo))",
        "aiLogo-foreground": "hsl(var(--aiLogo-foreground))",
        greenButton: "hsl(var(--greenButton))",
        "greenButton-foreground": "hsl(var(--greenButton-foreground))",
        whiteButton: "hsl(var(--whiteButton))",
        "whiteButton-foreground": "hsl(var(--whiteButton-foreground))",
        footer: "hsl(var(--footer))",
        "footer-foreground": "hsl(var(--footer-foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
