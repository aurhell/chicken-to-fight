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
      boxShadow: {
        "pixel":        "4px 4px 0 0 #181018",
        "pixel-sm":     "2px 2px 0 0 #181018",
        "pixel-inset":  "inset 2px 2px 0 0 #181018",
        "pixel-border": "-2px 0 0 0 #181018, 2px 0 0 0 #181018, 0 -2px 0 0 #181018, 0 2px 0 0 #181018",
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
          border: "2px solid #181018",
          "box-shadow": "4px 4px 0 0 #181018",
        },
        ".pixel-border-sm": {
          border: "2px solid #181018",
          "box-shadow": "2px 2px 0 0 #181018",
        },
        ".pixel-inset": {
          border: "2px solid #181018",
          "box-shadow": "inset 2px 2px 0 0 #181018",
        },
      })
    }),
  ],
} satisfies Config
