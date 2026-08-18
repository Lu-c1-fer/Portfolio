import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nesBlack: "#0a0a0a",
        nesWhite: "#fcfcfc",
        nesRed: "#E52521",
        nesGreen: "#43B047",
        nesBlue: "#5C94FC",
        nesGold: "#FFD700",
        nesBrown: "#A0522D",
        nesSky: "#5C94FC",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        body: ["VT323", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
