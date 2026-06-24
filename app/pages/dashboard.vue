<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"

import { CHICKEN_LEVELS } from "#shared/chicken/ChickenLevel"
import { useIncubation } from "~/application/chicken/useIncubation"
import ChickenCard from "~/presentation/components/chicken/ChickenCard.vue"
import DebugIncubator from "~/presentation/components/chicken/DebugIncubator.vue"
import GraduationScreen from "~/presentation/components/chicken/GraduationScreen.vue"
import FarmTabs from "~/presentation/components/farm/FarmTabs.vue"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const isDev = import.meta.dev

const {
  chicks, resources, loading, chickenDied, graduatedName,
  fetchStatus, dismissDeath, dismissGraduation,
  onSold, onFed, onWatered, onStageStarted, onGraduated,
  onJobChosen, onSalaryCollected,
} = useIncubation()

const showDeathScreen = computed(() => chickenDied.value && chicks.value.length === 0)
const fighterId = computed(() => chicks.value.find(c => c.level >= CHICKEN_LEVELS.APPRENTICE)?.id)

onMounted(fetchStatus)
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-6 md:px-6 md:py-10">
    <FarmTabs />

    <h2 class="mb-4 font-ui text-lg font-bold text-pixel-black md:mb-6">
      {{ t("My farm") }}
    </h2>

    <div
      v-if="loading"
      class="py-12 text-center font-ui text-base text-pixel-gray"
    >
      {{ t("Loading…") }}
    </div>

    <GraduationScreen
      v-else-if="graduatedName"
      :chicken-name="graduatedName"
      @dismiss="dismissGraduation"
    />

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

    <div
      v-else-if="chicks.length === 0"
      class="py-12 text-center font-ui text-base text-pixel-gray"
    >
      {{ t("No chicken yet") }}
    </div>

    <div
      v-else
      class="flex flex-col gap-6"
    >
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
        @job-chosen="(id, jobId) => onJobChosen(id, jobId)"
        @salary-collected="(id) => onSalaryCollected(id)"
      />
    </div>

    <DebugIncubator
      v-if="isDev"
      :chick-id="chicks.find(c => c.level === CHICKEN_LEVELS.CHICK)?.id"
      :adolescent-id="chicks.find(c => c.level === CHICKEN_LEVELS.ADOLESCENT)?.id"
      :fighter-id="fighterId"
      @refresh="fetchStatus"
    />
  </div>
</template>
