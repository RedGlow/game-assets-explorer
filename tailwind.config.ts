import type { Config } from "tailwindcss";
import flowbitePlugin from "flowbite/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          lighter: "#fefaec",
          light: "#fbf2ca",
          DEFAULT: "#f4d35e",
          dark: "#ea9e16",
          darker: "#ac5611",
        },
        secondary: {
          lighter: "#ffe5e0",
          light: "#ffafa0",
          DEFAULT: "#f95738",
          dark: "#c22f13",
          darker: "#852917",
        },
        tertiary: {
          lighter: "#7fc4fa",
          light: "#066dc3",
          DEFAULT: "#094a83",
          dark: "#0d3b66",
          darker: "#0d3b66",
        },
      },
    },
  },
  plugins: [flowbitePlugin],
};
export default config;
