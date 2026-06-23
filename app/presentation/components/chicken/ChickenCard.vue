<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import { CHICK_GROWTH_DAYS, HUNGER_DRAIN_H, THIRST_DRAIN_H } from "#shared/chicken/ChickenConstants"
import { CHICKEN_LEVELS } from "#shared/chicken/ChickenLevel"
import { CHICKEN_SELL_PRICES } from "#shared/chicken/SellPrice"
import ducklingImg from "~/assets/images/duckling.png"
import { careBarPct } from "~/domain/chicken/ChickCare"
import { useChickenApi, type ChickStatus, type Resources } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

const MS_PER_DAY = 86_400_000
const BAR_UPDATE_INTERVAL_MS = 5_000
const LOW_BAR_THRESHOLD_PCT = 25
const FULL_PCT = 100

const props = defineProps<{
  chick: ChickStatus
  resources: Resources
}>()
const emit = defineEmits<{
  sold: []
  fed: [chickenId: number, fedAt: string, flour: number]
  watered: [chickenId: number, wateredAt: string, water: number]
}>()

const { t } = useI18n()
const api = useChickenApi()
const selling = ref(false)
const feeding = ref(false)
const watering = ref(false)

const isAdolescent = computed(() => props.chick.level === CHICKEN_LEVELS.ADOLESCENT)

// Real-time now for bar drain calculation
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | null = null

onMounted(() => { ticker = setInterval(() => { now.value = Date.now() }, BAR_UPDATE_INTERVAL_MS) })
onBeforeUnmount(() => { if (ticker) clearInterval(ticker) })

const hungerPct = computed(() => careBarPct(props.chick.fedAt, HUNGER_DRAIN_H, now.value))
const thirstPct = computed(() => careBarPct(props.chick.wateredAt, THIRST_DRAIN_H, now.value))

const hungerLow = computed(() => hungerPct.value < LOW_BAR_THRESHOLD_PCT)
const thirstLow = computed(() => thirstPct.value < LOW_BAR_THRESHOLD_PCT)

const growProgressPct = computed(() => {
  if (!props.chick.bornAt) return FULL_PCT
  const born = new Date(props.chick.bornAt).getTime()
  const elapsed = Date.now() - born
  return Math.min(FULL_PCT, Math.round((elapsed / (CHICK_GROWTH_DAYS * MS_PER_DAY)) * FULL_PCT))
})

const msUntilGrown = computed(() => {
  if (!props.chick.bornAt || isAdolescent.value) return 0
  const born = new Date(props.chick.bornAt).getTime()
  return Math.max(0, born + CHICK_GROWTH_DAYS * MS_PER_DAY - Date.now())
})

const daysLeft = computed(() => Math.ceil(msUntilGrown.value / MS_PER_DAY))

async function feed() {
  feeding.value = true
  try {
    const result = await api.feed(props.chick.id)
    emit("fed", props.chick.id, result.fedAt, result.flour)
  } finally {
    feeding.value = false
  }
}

async function giveWater() {
  watering.value = true
  try {
    const result = await api.water(props.chick.id)
    emit("watered", props.chick.id, result.wateredAt, result.water)
  } finally {
    watering.value = false
  }
}

async function sell() {
  selling.value = true
  try {
    await api.sell(props.chick.id)
    emit("sold")
  } finally {
    selling.value = false
  }
}
</script>

<template>
  <PixelCard :title="chick.name">
    <div class="flex flex-col items-center gap-6 py-4 text-center">
      <img
        v-if="!isAdolescent"
        :src="ducklingImg"
        :alt="chick.name"
        class="mx-auto h-32 w-auto"
      >
      <span
        v-else
        class="text-7xl leading-none"
      >🐔</span>

      <p class="font-ui text-base text-pixel-black">
        {{ isAdolescent ? t("Your chicken is growing up!") : t("Welcome, {name}!", { name: chick.name }) }}
      </p>

      <!-- Barres de survie (poussin uniquement) -->
      <div
        v-if="!isAdolescent"
        class="flex w-full flex-col gap-4"
      >
        <!-- Faim -->
        <div class="w-full">
          <div class="mb-2 flex items-center justify-between">
            <span class="font-ui text-base text-pixel-black">🌾 {{ t("Hunger") }}</span>
            <span
              class="font-ui text-base font-bold"
              :class="hungerLow ? 'text-red-500' : 'text-pixel-black'"
            >{{ hungerPct }}%</span>
          </div>
          <div class="h-4 w-full overflow-hidden border-4 border-pixel-black bg-pixel-white">
            <div
              class="h-full transition-all duration-500"
              :class="hungerLow ? 'bg-red-500' : 'bg-amber-500'"
              :style="{ width: `${hungerPct}%` }"
            />
          </div>
        </div>

        <!-- Soif -->
        <div class="w-full">
          <div class="mb-2 flex items-center justify-between">
            <span class="font-ui text-base text-pixel-black">💧 {{ t("Thirst") }}</span>
            <span
              class="font-ui text-base font-bold"
              :class="thirstLow ? 'text-red-500' : 'text-pixel-black'"
            >{{ thirstPct }}%</span>
          </div>
          <div class="h-4 w-full overflow-hidden border-4 border-pixel-black bg-pixel-white">
            <div
              class="h-full transition-all duration-500"
              :class="thirstLow ? 'bg-red-500' : 'bg-sky-500'"
              :style="{ width: `${thirstPct}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Progression niveau 3 -->
      <div
        v-if="!isAdolescent"
        class="w-full"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="font-ui text-base text-pixel-black">{{ t("Level 3 in {n} day(s)", { n: daysLeft }) }}</span>
          <span class="font-ui text-base font-bold text-pixel-green">{{ growProgressPct }}%</span>
        </div>
        <div class="h-4 w-full overflow-hidden border-4 border-pixel-black bg-pixel-white">
          <div
            class="h-full bg-pixel-green transition-all duration-300"
            :style="{ width: `${growProgressPct}%` }"
          />
        </div>
      </div>

      <!-- Ressources -->
      <div class="flex w-full justify-center gap-6">
        <div class="flex items-center gap-2">
          <span class="text-2xl">💧</span>
          <span class="font-ui text-base font-bold text-pixel-black">{{ resources.water }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🌾</span>
          <span class="font-ui text-base font-bold text-pixel-black">{{ resources.flour }}</span>
        </div>
      </div>

      <div
        v-if="!isAdolescent"
        class="flex w-full gap-3"
      >
        <PixelButton
          class="flex-1"
          variant="primary"
          :disabled="feeding || resources.flour < 1"
          @click="feed"
        >
          {{ feeding ? t("Feeding…") : t("Feed (1🌾)") }}
        </PixelButton>
        <PixelButton
          class="flex-1"
          variant="primary"
          :disabled="watering || resources.water < 1"
          @click="giveWater"
        >
          {{ watering ? t("Watering…") : t("Water (1💧)") }}
        </PixelButton>
      </div>

      <PixelButton
        class="w-full"
        variant="danger"
        :disabled="selling"
        @click="sell"
      >
        {{ selling ? t("Selling…") : t("Sell for {n} PO", { n: CHICKEN_SELL_PRICES[chick.level] ?? 0 }) }}
      </PixelButton>
    </div>
  </PixelCard>
</template>
