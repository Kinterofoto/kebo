import type { Config } from "tailwindcss"
import keboUIPreset from "@kebo/ui/tailwind.config"

const config: Config = {
  ...keboUIPreset,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
}

export default config
