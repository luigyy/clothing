import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        text: ["var(--font-text)"],
        title: ["var(--font-title)"],
        fancy: ["var(--font-fancy)"],
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
