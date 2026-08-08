import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        depth: {
          DEFAULT: "#0A1F2E",
          surface: "#12293D",
        },
        seafoam: "#3FBFB5",
        risk: {
          low: "#3FBFB5",
          medium: "#E8B94E",
          high: "#E8735C",
        },
        ink: {
          DEFAULT: "#EAF2F2",
          muted: "#8FA8AC",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        body: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      backgroundImage: {
        "depth-gradient": "linear-gradient(180deg, #0A1F2E 0%, #0D2436 50%, #0A1F2E 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
