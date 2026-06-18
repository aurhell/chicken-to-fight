<script setup lang="ts">
const { t } = useI18n()
const auth = useAuthStore()
const email = ref("")
const password = ref("")
const error = ref<string | null>(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Login failed")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-amber-50 p-4">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-4 flex justify-end">
        <LanguageSwitcher />
      </div>
      <div class="mb-8 text-center">
        <div class="mb-3 text-5xl">
          🐔
        </div>
        <h1 class="text-2xl font-bold text-amber-900">
          {{ t("Chicken to Fight") }}
        </h1>
        <p class="mt-1 text-sm text-amber-700">
          {{ t("Log in to your farm") }}
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-700"
            for="email"
          >Email</label>
          <input
            id="email"
            v-model="email"
            autocomplete="email"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="coach@example.com"
            required
            type="email"
          >
        </div>

        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-700"
            for="password"
          >{{ t("Password") }}</label>
          <input
            id="password"
            v-model="password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="••••••••"
            required
            type="password"
          >
        </div>

        <p
          v-if="error"
          class="text-sm text-red-600"
        >
          {{ error }}
        </p>

        <button
          :disabled="loading"
          class="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
          type="submit"
        >
          {{ loading ? t("Logging in…") : t("Log in") }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ t("No account yet?") }}
        <NuxtLinkLocale
          class="font-medium text-amber-600 hover:underline"
          to="/register"
        >
          {{ t("Sign up") }}
        </NuxtLinkLocale>
      </p>
    </div>
  </div>
</template>
