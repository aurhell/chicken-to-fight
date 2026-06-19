<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import PixelButton from "~/components/ui/PixelButton.vue"
import PixelCard from "~/components/ui/PixelCard.vue"

export type EggStatus = {
  id: number
  name: string
  hatchAt: string
  humidityOk: boolean
  temperatureOk: boolean
  turnedOk: boolean
}

const props = defineProps<{ egg: EggStatus }>()
const emit = defineEmits<{ hatched: [] }>()

const { t } = useI18n()

const humidityOk = ref(props.egg.humidityOk)
const temperatureOk = ref(props.egg.temperatureOk)
const turnedOk = ref(props.egg.turnedOk)
const loadingAction = ref<string | null>(null)

const hatchAt = new Date(props.egg.hatchAt)

const timeLeft = ref(Math.max(0, hatchAt.getTime() - Date.now()))
let ticker: ReturnType<typeof setInterval>

const hours = computed(() => Math.floor(timeLeft.value / 3_600_000))
const minutes = computed(() => Math.floor((timeLeft.value % 3_600_000) / 60_000))
const seconds = computed(() => Math.floor((timeLeft.value % 60_000) / 1_000))

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

onMounted(() => {
  ticker = setInterval(() => {
    timeLeft.value = Math.max(0, hatchAt.getTime() - Date.now())
    if (timeLeft.value === 0) emit("hatched")
  }, 1_000)
})

onUnmounted(() => clearInterval(ticker))

async function care(action: "humidity" | "temperature" | "turn") {
  loadingAction.value = action
  try {
    const result = await $fetch<{ humidityOk: boolean; temperatureOk: boolean; turnedOk: boolean }>(
      `/api/chicken/${props.egg.id}/care`,
      {
        method: "POST",
        body: { action }, 
      },
    )
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
      <div class="mb-2 text-6xl leading-none">
        🥚
      </div>
      <p class="font-pixel text-[8px] leading-loose text-pixel-gray">
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
            class="font-pixel text-[8px]"
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
            class="font-pixel text-[8px]"
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
            class="font-pixel text-[8px]"
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
  </PixelCard>
</template>
