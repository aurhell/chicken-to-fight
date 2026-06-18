<script setup lang="ts">
import LanguageSwitcher from "~/components/LanguageSwitcher.vue"
import PixelButton from "~/components/ui/PixelButton.vue"

const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <header class="sticky top-0 z-40 flex items-center justify-between border-b-2 border-pixel-black bg-pixel-black px-4 py-3 md:px-6">
    <div class="flex items-center gap-2">
      <span class="text-2xl leading-none">🐔</span>
      <span class="hidden font-pixel text-[8px] leading-relaxed text-pixel-gold md:block">
        {{ t("Chicken to Fight") }}
      </span>
    </div>

    <div class="flex items-center gap-3">
      <span class="font-ui text-sm font-bold text-pixel-gold">
        🪙 {{ auth.user?.gold ?? 0 }} PO
      </span>
      <span class="hidden font-ui text-sm text-pixel-gray-light md:block">
        {{ auth.user?.username }}
      </span>
      <LanguageSwitcher variant="light" />
      <PixelButton
        variant="danger"
        @click="auth.logout()"
      >
        <span class="md:hidden">✕</span>
        <span class="hidden md:inline">{{ t("Log out") }}</span>
      </PixelButton>
    </div>
  </header>
</template>
