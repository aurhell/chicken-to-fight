<script setup lang="ts">
const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="flex items-center justify-between border-b border-amber-100 bg-white px-6 py-4">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🐔</span>
        <span class="font-bold text-amber-900">{{ t("Chicken to Fight") }}</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-amber-700">
          🪙 {{ auth.user?.gold ?? 0 }} PO
        </span>
        <span class="text-sm text-gray-600">{{ auth.user?.username }}</span>
        <LanguageSwitcher />
        <button
          class="text-sm text-red-500 transition-colors hover:text-red-700"
          @click="auth.logout()"
        >
          {{ t("Log out") }}
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-10">
      <h2 class="mb-6 text-xl font-bold text-amber-900">
        {{ t("My farm") }}
      </h2>

      <div class="rounded-2xl border border-amber-100 bg-white p-10 text-center text-gray-400">
        <div class="mb-4 text-6xl">
          🥚
        </div>
        <p class="font-medium">
          {{ t("No chicken yet") }}
        </p>
        <p class="mt-1 text-sm">
          {{ t("Adoption coming soon…") }}
        </p>
      </div>
    </main>
  </div>
</template>
