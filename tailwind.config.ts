import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["var(--font-quicksand)"],
        antonio: ["var(--font-antonio)"],
        racing: ["var(--font-racing)"],
      },
      colors: {
        blue: "#141631",
        green: "#93A571",
        orange: "#D8690E",
        creme: "#FFFDF4",
      },
    },
  },
  plugins: [],
} satisfies Config;
