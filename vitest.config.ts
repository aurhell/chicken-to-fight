import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "server/**/*.spec.ts",
      "app/**/*.spec.ts",
    ],
  },
})
