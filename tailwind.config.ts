import plugin from "tailwindcss/plugin"
import type { Config } from "tailwindcss"

export default {
  content: [
    "./app/**/*.{vue,ts,js}",
  ],
  safelist: [
    { pattern: /^bg-pixel-/ },
    { pattern: /^text-pixel-/ },
    { pattern: /^border-pixel-/ },
    { pattern: /^shadow-pixel/ },
    { pattern: /^font-(pixel|ui)$/ },
    { pattern: /^hover:bg-pixel-/ },
    { pattern: /^hover:text-pixel-/ },
  ],
  theme: {
    fontSize: {
      xs:    ["1.125rem",  { lineHeight: "1.5rem" }],
      sm:    ["1.3125rem", { lineHeight: "1.875rem" }],
      base:  ["1.5rem",    { lineHeight: "2.25rem" }],
      lg:    ["1.6875rem", { lineHeight: "2.5rem" }],
      xl:    ["1.875rem",  { lineHeight: "2.5rem" }],
      "2xl": ["2.25rem",   { lineHeight: "3rem" }],
      "3xl": ["2.8125rem", { lineHeight: "3.375rem" }],
      "4xl": ["3.375rem",  { lineHeight: "3.75rem" }],
      "5xl": ["4.5rem",    { lineHeight: "1" }],
      "6xl": ["5.625rem",  { lineHeight: "1" }],
      "7xl": ["6.75rem",   { lineHeight: "1" }],
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        ui: ['"Pixelify Sans"', "sans-serif"],
      },
      colors: {
        pixel: {
          black:         "#181018",
          white:         "#f8f0e8",
          sand:          "#f0d080",
          straw:         "#c89828",
          gold:          "#f8b800",
          brown:         "#804818",
          red:           "#c02020",
          "red-light":   "#f04040",
          green:         "#188020",
          "green-light": "#38c040",
          blue:          "#1840b8",
          "blue-light":  "#4878f0",
          purple:        "#781890",
          gray:          "#887878",
          "gray-light":  "#c8b8b8",
        },
      },
      keyframes: {
        "gold-float": {
          "0%":   { opacity: "1", transform: "translateY(0) scale(1)" },
          "20%":  { opacity: "1", transform: "translateY(-4px) scale(1.15)" },
          "80%":  { opacity: "0.6", transform: "translateY(-20px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-28px) scale(0.9)" },
        },
        "gold-sink": {
          "0%":   { opacity: "1", transform: "translateY(0) scale(1)" },
          "20%":  { opacity: "1", transform: "translateY(4px) scale(1.15)" },
          "80%":  { opacity: "0.6", transform: "translateY(20px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(28px) scale(0.9)" },
        },
      },
      animation: {
        "gold-float": "gold-float 2.2s ease-out forwards",
        "gold-sink": "gold-sink 2.2s ease-out forwards",
      },
      boxShadow: {
        "pixel":        "8px 8px 0 0 #181018",
        "pixel-sm":     "4px 4px 0 0 #181018",
        "pixel-lg":     "16px 16px 0 0 #181018",
        // NES.css signature: outer drop shadow + inner frame
        "pixel-nes":    "inset 0 0 0 4px #181018, 8px 8px 0 0 #181018",
        "pixel-inset":  "inset 4px 4px 0 0 #181018",
        "pixel-border": "-4px 0 0 0 #181018, 4px 0 0 0 #181018, 0 -4px 0 0 #181018, 0 4px 0 0 #181018",
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents }) => {
      addBase({
        "html": { "background-color": "#f0d080", color: "#181018" },
        "*": { "-webkit-font-smoothing": "none", "-moz-osx-font-smoothing": "unset" },
        "img, canvas, svg": { "image-rendering": "pixelated" },
      })
      addComponents({
        ".pixel-border": {
          border: "4px solid #181018",
          "box-shadow": "inset 0 0 0 4px #181018, 8px 8px 0 0 #181018",
        },
        ".pixel-border-sm": {
          border: "4px solid #181018",
          "box-shadow": "4px 4px 0 0 #181018",
        },
        ".pixel-inset": {
          border: "4px solid #181018",
          "box-shadow": "inset 0 0 0 4px #181018",
        },
      })
    }),
  ],
} satisfies Config
