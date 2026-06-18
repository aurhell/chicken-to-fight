<script setup lang="ts">
const { t } = useI18n()
const auth = useAuthStore()
const username = ref("")
const email = ref("")
const password = ref("")
const error = ref<string | null>(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.register(username.value, email.value, password.value)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Registration failed")
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
          🥚
        </div>
        <h1 class="text-2xl font-bold text-amber-900">
          {{ t("Join the arena") }}
        </h1>
        <p class="mt-1 text-sm text-amber-700">
          {{ t("Create your coach account") }}
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <label
            class="mb-1 block text-sm font-medium text-gray-700"
            for="username"
          >{{ t("Coach name") }}</label>
          <input
            id="username"
            v-model="username"
            autocomplete="username"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="GrandCoach42"
            required
            type="text"
          >
        </div>

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
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            minlength="8"
            :placeholder="t('8 characters minimum')"
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
          {{ loading ? t("Creating…") : t("Create my account") }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ t("Already have an account?") }}
        <NuxtLinkLocale
          class="font-medium text-amber-600 hover:underline"
          to="/login"
        >
          {{ t("Log in") }}
        </NuxtLinkLocale>
      </p>
    </div>
  </div>
</template>
