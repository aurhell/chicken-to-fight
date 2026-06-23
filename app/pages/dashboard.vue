<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"

import { CHICKEN_LEVELS } from "#shared/chicken/ChickenLevel"
import { useIncubation } from "~/application/chicken/useIncubation"
import ChickenCard from "~/presentation/components/chicken/ChickenCard.vue"
import DebugIncubator from "~/presentation/components/chicken/DebugIncubator.vue"
import EggAdoptForm from "~/presentation/components/chicken/EggAdoptForm.vue"
import EggIncubator from "~/presentation/components/chicken/EggIncubator.vue"
import EggOutcomeScreen from "~/presentation/components/chicken/EggOutcomeScreen.vue"
import GraduationScreen from "~/presentation/components/chicken/GraduationScreen.vue"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const isDev = import.meta.dev

const {
  eggs, chicks, resources, loading, outcome, chickenDied, graduatedName,
  fetchStatus, onAdopted, onOutcome, dismissOutcome, dismissDeath, dismissGraduation,
  onSold, onFed, onWatered, onStageStarted, onGraduated,
} = useIncubation()

const isEmpty = computed(() => eggs.value.length === 0 && chicks.value.length === 0)
const showDeathScreen = computed(() => chickenDied.value && isEmpty.value)

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

    <GraduationScreen
      v-else-if="graduatedName"
      :chicken-name="graduatedName"
      @dismiss="dismissGraduation"
    />

    <!-- Écran de mort (uniquement si plus aucun poulet ni oeuf) -->
    <PixelCard
      v-else-if="showDeathScreen"
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

    <template v-else>
      <div class="flex flex-col gap-6">
        <!-- Oeufs en cours d'incubation -->
        <EggIncubator
          v-for="egg in eggs"
          :key="egg.id"
          :egg="egg"
          @outcome="onOutcome"
          @sold="onSold"
        />

        <!-- Poulets vivants -->
        <ChickenCard
          v-for="chick in chicks"
          :key="chick.id"
          :chick="chick"
          :resources="resources"
          @sold="onSold"
          @fed="(id, fedAt, flour) => onFed(id, fedAt, flour)"
          @watered="(id, wateredAt, water) => onWatered(id, wateredAt, water)"
          @stage-started="(id, stageId, startedAt, completesAt) => onStageStarted(id, stageId, startedAt, completesAt)"
          @graduated="(id, name) => onGraduated(id, name)"
        />

        <!-- Adopter un nouvel oeuf -->
        <EggAdoptForm @adopted="onAdopted" />
      </div>
    </template>

    <DebugIncubator
      v-if="isDev"
      :egg-id="eggs[0]?.id"
      :chick-id="chicks.find(c => c.level === CHICKEN_LEVELS.CHICK)?.id"
      :adolescent-id="chicks.find(c => c.level === CHICKEN_LEVELS.ADOLESCENT)?.id"
      @refresh="fetchStatus"
    />
  </div>
</template>
