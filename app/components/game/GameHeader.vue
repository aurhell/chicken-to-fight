<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { useLocalePath } from "#imports"
import goldSoundSrc from "~/assets/sounds/gold.mp3"
import LanguageSwitcher from "~/components/LanguageSwitcher.vue"
import GameTitle from "~/components/game/GameTitle.vue"
import PixelButton from "~/components/ui/PixelButton.vue"
import { useSound } from "~/composables/useSound"
import { useAuthStore } from "~/stores/auth"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const auth = useAuthStore()

const navItems = [
  {
    label: "Farm",
    icon: "🏠",
    to: "/dashboard",
  },
  {
    label: "Games",
    icon: "🎰",
    to: "/minigames/grat-chicken",
  },
]

function isActive(to: string): boolean {
  return route.path.startsWith(localePath(to))
}

const goldDelta = ref<number | null>(null)
const animKey = ref(0)
const { play: playGoldSound } = useSound(goldSoundSrc)

watch(() => auth.user?.gold, (newVal, oldVal) => {
  if (newVal == null || oldVal == null) return
  const delta = newVal - oldVal
  if (delta <= 0) return
  goldDelta.value = delta
  animKey.value++
  playGoldSound()
})
</script>

<template>
  <header class="sticky top-0 z-40 border-b-4 border-pixel-black bg-pixel-black">
    <div class="flex items-center justify-between px-4 py-3 md:px-6">
      <div class="flex items-center gap-3">
        <img
          src="~/assets/images/CTF-revival-logo.png"
          alt="Chicken to Fight"
          class="h-10 w-auto"
        >
        <GameTitle
          compact
          variant="light"
          class="hidden md:block"
        />
      </div>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="flex items-center gap-2 border-b-4 px-4 py-1 font-ui text-sm transition-colors"
          :class="isActive(item.to)
            ? 'border-pixel-gold text-pixel-gold'
            : 'border-transparent text-pixel-gray hover:text-pixel-white'"
        >
          <span>{{ item.icon }}</span>
          <span>{{ t(item.label) }}</span>
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <span class="relative font-ui text-base font-bold text-pixel-gold">
          🪙 {{ auth.user?.gold ?? 0 }} PO
          <span
            v-if="goldDelta"
            :key="animKey"
            class="pointer-events-none absolute left-1/2 top-[-4px] -translate-x-1/2 animate-gold-float whitespace-nowrap font-ui text-base font-bold text-[#f8c840]"
          >
            +{{ goldDelta }} PO
          </span>
        </span>
        <span class="hidden font-ui text-base text-pixel-gray-light md:block">
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
    </div>
  </header>
</template>

