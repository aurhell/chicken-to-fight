<script setup lang="ts">
import { ref, watch } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import goldSoundSrc from "~/assets/sounds/gold.mp3"
import paySoundSrc from "~/assets/sounds/pay.mp3"
import { useSound } from "~/composables/useSound"
import LanguageSwitcher from "~/presentation/components/LanguageSwitcher.vue"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"

const auth = useAuthStore()

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
  <header class="sticky top-0 z-40 border-b-4 border-pixel-black bg-pixel-black md:hidden">
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <img
          src="~/assets/images/CTF-revival-logo.png"
          alt="Chicken to Fight"
          class="h-10 w-auto"
        >
      </div>

      <div class="flex items-center gap-3">
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
        <LanguageSwitcher variant="light" />
        <PixelButton
          variant="danger"
          @click="auth.logout()"
        >
          ✕
        </PixelButton>
      </div>
    </div>
  </header>
</template>
