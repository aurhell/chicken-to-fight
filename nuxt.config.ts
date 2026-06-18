// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      {
        code: "fr",
        language: "fr-FR",
        name: "Français",
        file: "fr.json",
      },
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en.json",
      },
    ],
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    lazy: true,
    vueI18n: "./i18n/i18n.config.ts",
  },

  // Game is entirely behind auth — SSR brings no value and causes hydration issues
  ssr: false,

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
  },

  nitro: {
    externals: {
      external: ["@node-rs/argon2"],
    },
  },
})
