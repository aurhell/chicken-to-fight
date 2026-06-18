// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com", 
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "", 
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap",
        },
      ],
    },
  },

  components: false,
  imports: { autoImport: false },

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },

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
    vueI18n: "./i18n.config.ts",
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
