<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { useLocalePath } from "#imports"
import { useAuthStore } from "~/application/auth/useAuthStore"
import goldSoundSrc from "~/assets/sounds/gold.mp3"
import paySoundSrc from "~/assets/sounds/pay.mp3"
import { useSound } from "~/composables/useSound"
import LanguageSwitcher from "~/presentation/components/LanguageSwitcher.vue"
import GameTitle from "~/presentation/components/game/GameTitle.vue"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const auth = useAuthStore()

const isFarmActive = computed(() =>
  route.path.startsWith(localePath("/incubator")) || route.path.startsWith(localePath("/dashboard")),
)
const isMarketActive = computed(() =>
  route.path.startsWith(localePath("/shop")) || route.path.startsWith(localePath("/inventory")),
)

function isActive(to: string): boolean {
  return route.path.startsWith(localePath(to))
}

const goldDelta = ref<number | null>(null)
const animKey = ref(0)
const { play: playGoldSound } = useSound(goldSoundSrc)
const { play: playPaySound } = useSound(paySoundSrc)

watch(() => auth.user?.gold, (newVal, oldVal) => {
  if (newVal == null || oldVal == null) return
  const delta = newVal - oldVal
  if (delta === 0) return
  goldDelta.value = delta
  animKey.value++
  if (delta > 0) playPaySound()
  else playGoldSound()
})
</script>

<template>
  <aside class="fixed inset-y-0 left-0 hidden w-52 flex-col border-r-4 border-pixel-black bg-pixel-black md:flex">
    <!-- Logo -->
    <div class="flex items-center gap-3 border-b-4 border-pixel-black/40 p-4">
      <img
        src="~/assets/images/CTF-revival-logo.png"
        alt="Chicken to Fight"
        class="h-10 w-auto"
      >
      <GameTitle
        compact
        variant="light"
      />
    </div>

    <!-- Nav -->
    <nav class="flex flex-1 flex-col overflow-hidden p-2">
      <!-- Élevage -->
      <p
        class="px-3 py-1 font-pixel text-[12px] uppercase"
        :class="isFarmActive ? 'text-pixel-gold' : 'text-pixel-gray/60'"
      >
        {{ t("Farm") }}
      </p>
      <NuxtLink
        :to="localePath('/incubator')"
        class="flex items-center gap-2 rounded px-3 py-1.5 font-ui text-sm transition-colors"
        :class="isActive('/incubator')
          ? 'bg-pixel-black/40 text-pixel-gold'
          : 'text-pixel-gray hover:bg-pixel-black/20 hover:text-pixel-white'"
      >
        <span class="text-base leading-none">🐣</span>
        <span>{{ t("Incubator") }}</span>
      </NuxtLink>
      <NuxtLink
        :to="localePath('/dashboard')"
        class="flex items-center gap-2 rounded px-3 py-1.5 font-ui text-sm transition-colors"
        :class="isActive('/dashboard')
          ? 'bg-pixel-black/40 text-pixel-gold'
          : 'text-pixel-gray hover:bg-pixel-black/20 hover:text-pixel-white'"
      >
        <span class="text-base leading-none">🐔</span>
        <span>{{ t("Chickens") }}</span>
      </NuxtLink>

      <!-- Combat (soon) -->
      <div class="mt-1 flex cursor-not-allowed items-center gap-2 rounded px-3 py-1.5 font-ui text-sm text-pixel-gray opacity-40">
        <span class="text-base leading-none">⚔️</span>
        <span>{{ t("Combat") }}</span>
        <span class="ml-auto font-pixel text-[12px]">soon</span>
      </div>

      <!-- Jeux -->
      <NuxtLink
        :to="localePath('/minigames/grat-chicken')"
        class="flex items-center gap-2 rounded px-3 py-1.5 font-ui text-sm transition-colors"
        :class="isActive('/minigames')
          ? 'bg-pixel-black/40 text-pixel-gold'
          : 'text-pixel-gray hover:bg-pixel-black/20 hover:text-pixel-white'"
      >
        <span class="text-base leading-none">🎮</span>
        <span>{{ t("Games") }}</span>
      </NuxtLink>

      <!-- Marché -->
      <p
        class="px-3 pb-1 pt-2 font-pixel text-[12px] uppercase"
        :class="isMarketActive ? 'text-pixel-gold' : 'text-pixel-gray/60'"
      >
        {{ t("Market") }}
      </p>
      <NuxtLink
        :to="localePath('/shop')"
        class="flex items-center gap-2 rounded px-3 py-1.5 font-ui text-sm transition-colors"
        :class="isActive('/shop')
          ? 'bg-pixel-black/40 text-pixel-gold'
          : 'text-pixel-gray hover:bg-pixel-black/20 hover:text-pixel-white'"
      >
        <span class="text-base leading-none">🛒</span>
        <span>{{ t("Shop") }}</span>
      </NuxtLink>
      <NuxtLink
        :to="localePath('/inventory')"
        class="flex items-center gap-2 rounded px-3 py-1.5 font-ui text-sm transition-colors"
        :class="isActive('/inventory')
          ? 'bg-pixel-black/40 text-pixel-gold'
          : 'text-pixel-gray hover:bg-pixel-black/20 hover:text-pixel-white'"
      >
        <span class="text-base leading-none">🎒</span>
        <span>{{ t("Inventory") }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="flex flex-col gap-2 border-t-4 border-pixel-black/40 px-4 py-3">
      <span class="relative font-ui text-base font-bold text-pixel-gold">
        🪙 {{ auth.user?.gold ?? 0 }} PO
        <span
          v-if="goldDelta"
          :key="animKey"
          class="pointer-events-none absolute left-1/2 whitespace-nowrap font-ui text-base font-bold"
          :class="goldDelta > 0
            ? 'top-[-4px] animate-gold-float text-[#f8c840]'
            : 'top-[4px] animate-gold-sink text-pixel-red'"
        >
          {{ goldDelta > 0 ? "+" : "" }}{{ goldDelta }} PO
        </span>
      </span>
      <span class="truncate font-ui text-sm text-pixel-gray-light">{{ auth.user?.username }}</span>
      <div class="flex items-center justify-between">
        <LanguageSwitcher variant="light" />
        <button
          class="font-ui text-xs text-pixel-gray transition-colors hover:text-pixel-red"
          @click="auth.logout()"
        >
          {{ t("Log out") }}
        </button>
      </div>
    </div>
  </aside>
</template>
