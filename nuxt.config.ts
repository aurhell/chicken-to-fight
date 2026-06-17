// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  // Game is entirely behind auth — SSR brings no value and causes hydration issues
  ssr: false,

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
})
