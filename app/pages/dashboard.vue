<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

import { useIncubation } from "~/application/chicken/useIncubation"
import ChickenCard from "~/presentation/components/chicken/ChickenCard.vue"
import DebugIncubator from "~/presentation/components/chicken/DebugIncubator.vue"
import EggAdoptForm from "~/presentation/components/chicken/EggAdoptForm.vue"
import EggIncubator from "~/presentation/components/chicken/EggIncubator.vue"
import EggOutcomeScreen from "~/presentation/components/chicken/EggOutcomeScreen.vue"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const isDev = import.meta.dev

const {
  egg, chick, resources, loading, outcome, chickenDied,
  fetchStatus, onAdopted, onOutcome, dismissOutcome, dismissDeath, onSold, onFed, onWatered,
} = useIncubation()

onMounted(fetchStatus)
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-6 md:px-6 md:py-10">
    <h2 class="mb-4 font-ui text-lg font-bold text-pixel-black md:mb-6">
      {{ t("My farm") }}
    </h2>

    <div
      v-if="loading"
      class="py-12 text-center font-ui text-base text-pixel-gray"
    >
      {{ t("Loading…") }}
    </div>

    <EggOutcomeScreen
      v-else-if="outcome"
      :result="outcome.result"
      :chicken-name="outcome.chickenName"
      @dismiss="dismissOutcome"
    />

    <!-- Écran de mort du poussin -->
    <PixelCard
      v-else-if="chickenDied"
      :title="t('Your chick has died')"
    >
      <div class="flex flex-col items-center gap-6 py-4 text-center">
        <span class="text-7xl leading-none">💀</span>
        <p class="font-ui text-base text-pixel-black">
          {{ t("You forgot to feed or water your chick… it didn't make it.") }}
        </p>
        <PixelButton
          class="w-full"
          variant="primary"
          @click="dismissDeath"
        >
          {{ t("Adopt a new egg") }}
        </PixelButton>
      </div>
    </PixelCard>

    <EggIncubator
      v-else-if="egg"
      :key="egg.hatchAt"
      :egg="egg"
      @outcome="onOutcome"
    />

    <ChickenCard
      v-else-if="chick"
      :chick="chick"
      :resources="resources"
      @sold="onSold"
      @fed="onFed"
      @watered="onWatered"
    />

    <EggAdoptForm
      v-else
      @adopted="onAdopted"
    />

    <DebugIncubator
      v-if="isDev"
      :egg-id="egg?.id"
      :chick-id="chick?.id"
      @refresh="fetchStatus"
    />
  </div>
</template>
