import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Only the tokens NesCodeBlock/NesCallout/CaseStudyBlockPreview actually
      // need for the case-study preview panel — the rest of this app is plain
      // Tailwind, not reskinned in the portfolio's NES theme.
      colors: {
        nesBlack: "#0a0a0a",
        nesWhite: "#fcfcfc",
        nesRed: "#E52521",
        nesGold: "#FFD700",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        body: ["VT323", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
