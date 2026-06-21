<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

import { useIncubation } from "~/application/chicken/useIncubation"
import ChickenCard from "~/presentation/components/chicken/ChickenCard.vue"
import DebugIncubator from "~/presentation/components/chicken/DebugIncubator.vue"
import EggAdoptForm from "~/presentation/components/chicken/EggAdoptForm.vue"
import EggIncubator from "~/presentation/components/chicken/EggIncubator.vue"
import EggOutcomeScreen from "~/presentation/components/chicken/EggOutcomeScreen.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const isDev = import.meta.dev

const { egg, chick, loading, outcome, fetchStatus, onAdopted, onOutcome, dismissOutcome, onSold } = useIncubation()

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

    <EggIncubator
      v-else-if="egg"
      :key="egg.hatchAt"
      :egg="egg"
      @outcome="onOutcome"
    />

    <ChickenCard
      v-else-if="chick"
      :chick="chick"
      @sold="onSold"
    />

    <EggAdoptForm
      v-else
      @adopted="onAdopted"
    />

    <DebugIncubator
      v-if="isDev"
      :egg-id="egg?.id"
      @refresh="fetchStatus"
    />
  </div>
</template>
