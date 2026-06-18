<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import GratChickenCard from "~/components/minigames/GratChickenCard.vue"
import PixelButton from "~/components/ui/PixelButton.vue"
import PixelCard from "~/components/ui/PixelCard.vue"
import { useAuthStore } from "~/stores/auth"

import type { PlayResult } from "~/server/application/minigames/PlayScratchCardUseCase"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const auth = useAuthStore()

type GameState = "idle" | "playing" | "won" | "lost"

const state = ref<GameState>("idle")
const playsRemaining = ref(0)
const activeGrid = ref<string[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchStatus() {
  const data = await $fetch<{ playsRemaining: number }>("/api/minigames/gratchicken/status")
  playsRemaining.value = data.playsRemaining
}

async function play() {
  if (loading.value) return
  loading.value = true
  error.value = null
  try {
    const result = await $fetch<PlayResult>("/api/minigames/gratchicken/play", { method: "POST" })
    activeGrid.value = result.grid
    playsRemaining.value = result.playsRemaining
    state.value = "playing"
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Play failed")
  } finally {
    loading.value = false
  }
}

function onCardCompleted(won: boolean) {
  state.value = won ? "won" : "lost"
  if (won) auth.fetchMe()
}

function reset() {
  state.value = "idle"
  activeGrid.value = null
}

onMounted(fetchStatus)
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-6 md:px-6 md:py-10">
    <PixelCard :title="t('Grat\'Chicken')">
      <!-- Header -->
      <div class="mb-6 text-center">
        <p class="font-ui text-base text-pixel-brown">
          {{ t("Find 3 aligned chickens to win") }}
          <span class="font-bold text-pixel-gold">{{ t("{n} PO", { n: 50 }) }}</span>
        </p>
        <p class="mt-2 font-ui text-sm text-pixel-gray">
          {{ t("{n} free plays per day", { n: 2 }) }}
        </p>
      </div>

      <!-- Plays remaining -->
      <div class="mb-6 flex items-center justify-center gap-2">
        <span
          v-for="n in 2"
          :key="n"
          class="font-pixel text-[8px] leading-none"
          :class="n <= playsRemaining ? 'text-pixel-gold' : 'text-pixel-gray'"
        >
          {{ n <= playsRemaining ? "🎰" : "✕" }}
        </span>
        <span class="font-ui text-sm text-pixel-gray">
          {{ t("{n} play left", { n: playsRemaining }, playsRemaining) }}
        </span>
      </div>

      <!-- Scratch card -->
      <div
        v-if="activeGrid && state !== 'idle'"
        class="mb-6"
      >
        <p
          v-if="state === 'playing'"
          class="mb-3 text-center font-ui text-sm text-pixel-gray"
        >
          {{ t("Scratch each card to reveal it") }} ✏️
        </p>
        <div class="flex justify-center">
          <GratChickenCard
            :grid="activeGrid"
            @completed="onCardCompleted"
          />
        </div>
      </div>

      <!-- Result banner -->
      <div
        v-if="state === 'won'"
        class="mb-6 border-4 border-pixel-gold bg-pixel-black p-4 text-center shadow-pixel"
      >
        <p class="font-pixel text-base leading-normal text-pixel-gold">
          {{ t("You won!") }}
        </p>
        <p class="mt-2 font-ui text-base font-bold text-pixel-gold">
          +{{ t("{n} PO", { n: 50 }) }}
        </p>
      </div>

      <div
        v-if="state === 'lost'"
        class="mb-6 border-4 border-pixel-black bg-pixel-sand p-4 text-center"
      >
        <p class="font-pixel text-[8px] leading-relaxed text-pixel-brown">
          {{ t("No luck this time…") }}
        </p>
      </div>

      <!-- Error -->
      <p
        v-if="error"
        class="mb-4 text-center font-pixel text-[8px] leading-relaxed text-pixel-red"
      >
        ▶ {{ error }}
      </p>

      <!-- CTA -->
      <div class="flex justify-center">
        <PixelButton
          v-if="playsRemaining > 0 && (state === 'idle' || state === 'won' || state === 'lost')"
          :disabled="loading"
          @click="state === 'idle' ? play() : reset()"
        >
          <span v-if="state === 'idle'">
            {{ loading ? t("Loading…") : t("Scratch!") }}
          </span>
          <span v-else>{{ t("Play again") }}</span>
        </PixelButton>

        <p
          v-if="playsRemaining === 0 && state !== 'playing'"
          class="font-ui text-sm text-pixel-gray"
        >
          {{ t("Come back tomorrow") }} 🌙
        </p>
      </div>
    </PixelCard>
  </div>
</template>
