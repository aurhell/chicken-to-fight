<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import { CHICKEN_LEVELS } from "#shared/chicken/ChickenLevel"
import { CHICKEN_SELL_PRICES } from "#shared/chicken/SellPrice"
import egg1Src from "~/assets/images/egg-stade-1.jpeg"
import egg2Src from "~/assets/images/egg-stade-2.jpeg"
import { useChickenApi, type EggStatus } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

import type { HatchOutcome } from "~/domain/chicken/HatchOutcome"

const props = defineProps<{ egg: EggStatus }>()
const emit = defineEmits<{
  outcome: [HatchOutcome]
  sold: []
}>()

const { t } = useI18n()
const api = useChickenApi()
const selling = ref(false)

const humidityOk = ref(props.egg.humidityOk)
const temperatureOk = ref(props.egg.temperatureOk)
const turnedOk = ref(props.egg.turnedOk)
const loadingAction = ref<string | null>(null)
const hatching = ref(false)

const MS_PER_SECOND = 1_000
const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const TIMER_PAD_DIGITS = 2
const HATCH_WARNING_MS = 600_000

const hatchAt = new Date(props.egg.hatchAt)

const timeLeft = ref(Math.max(0, hatchAt.getTime() - Date.now()))
let ticker: ReturnType<typeof setInterval>

const eggImage = computed(() => timeLeft.value < HATCH_WARNING_MS ? egg2Src : egg1Src)
const hours = computed(() => Math.floor(timeLeft.value / MS_PER_HOUR))
const minutes = computed(() => Math.floor((timeLeft.value % MS_PER_HOUR) / MS_PER_MINUTE))
const seconds = computed(() => Math.floor((timeLeft.value % MS_PER_MINUTE) / MS_PER_SECOND))

function pad(n: number): string {
  return String(n).padStart(TIMER_PAD_DIGITS, "0")
}

async function resolveHatch() {
  if (hatching.value) return
  hatching.value = true
  clearInterval(ticker)
  const data = await api.hatch(props.egg.id)
  emit("outcome", {
    result: data.result,
    chickenName: props.egg.name, 
  })
}

onMounted(() => {
  ticker = setInterval(() => {
    timeLeft.value = Math.max(0, hatchAt.getTime() - Date.now())
    if (timeLeft.value === 0) resolveHatch()
  }, MS_PER_SECOND)
})

onUnmounted(() => clearInterval(ticker))

async function sell() {
  selling.value = true
  try {
    await api.sell(props.egg.id)
    emit("sold")
  } finally {
    selling.value = false
  }
}

async function care(action: "humidity" | "temperature" | "turn") {
  loadingAction.value = action
  try {
    const result = await api.care(props.egg.id, action)
    humidityOk.value = result.humidityOk
    temperatureOk.value = result.temperatureOk
    turnedOk.value = result.turnedOk
  } finally {
    loadingAction.value = null
  }
}
</script>

<template>
  <PixelCard :title="egg.name">
    <!-- Timer -->
    <div class="mb-6 text-center">
      <img
        :src="eggImage"
        :alt="egg.name"
        class="mx-auto mb-2 h-32 w-auto"
      >
      <p class="font-pixel text-[12px] leading-loose text-pixel-gray">
        {{ t("Hatches in") }}
      </p>
      <p class="font-pixel text-base leading-loose text-pixel-gold">
        {{ pad(hours) }}h {{ pad(minutes) }}m {{ pad(seconds) }}s
      </p>
    </div>

    <!-- Care actions -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-4 border-4 border-pixel-black bg-pixel-sand p-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">💧</span>
          <span class="font-ui text-base font-bold">{{ t("Humidity") }}</span>
          <span
            class="font-pixel text-[12px]"
            :class="humidityOk ? 'text-pixel-green' : 'text-pixel-red'"
          >
            {{ humidityOk ? "OK" : t("Off") }}
          </span>
        </div>
        <PixelButton
          v-if="!humidityOk"
          :disabled="loadingAction !== null"
          @click="care('humidity')"
        >
          {{ loadingAction === "humidity" ? "…" : t("Fix") }}
        </PixelButton>
      </div>

      <div class="flex items-center justify-between gap-4 border-4 border-pixel-black bg-pixel-sand p-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🌡️</span>
          <span class="font-ui text-base font-bold">{{ t("Temperature") }}</span>
          <span
            class="font-pixel text-[12px]"
            :class="temperatureOk ? 'text-pixel-green' : 'text-pixel-red'"
          >
            {{ temperatureOk ? "OK" : t("Off") }}
          </span>
        </div>
        <PixelButton
          v-if="!temperatureOk"
          :disabled="loadingAction !== null"
          @click="care('temperature')"
        >
          {{ loadingAction === "temperature" ? "…" : t("Fix") }}
        </PixelButton>
      </div>

      <div class="flex items-center justify-between gap-4 border-4 border-pixel-black bg-pixel-sand p-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🔄</span>
          <span class="font-ui text-base font-bold">{{ t("Turning") }}</span>
          <span
            class="font-pixel text-[12px]"
            :class="turnedOk ? 'text-pixel-green' : 'text-pixel-red'"
          >
            {{ turnedOk ? "OK" : t("Off") }}
          </span>
        </div>
        <PixelButton
          v-if="!turnedOk"
          :disabled="loadingAction !== null"
          @click="care('turn')"
        >
          {{ loadingAction === "turn" ? "…" : t("Fix") }}
        </PixelButton>
      </div>
    </div>

    <PixelButton
      class="mt-4 w-full"
      variant="danger"
      :disabled="selling || hatching"
      @click="sell"
    >
      {{ selling ? t("Selling…") : t("Sell for {n} PO", { n: CHICKEN_SELL_PRICES[CHICKEN_LEVELS.EGG] }) }}
    </PixelButton>
  </PixelCard>
</template>
