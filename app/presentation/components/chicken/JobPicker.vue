<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

import { ALL_JOB_IDS, JOB_COST, JOB_DAILY_INCOME, JOB_EMOJI, XP_FOR_JOB } from "#shared/chicken/Job"
import { useAuthStore } from "~/application/auth/useAuthStore"
import { useChickenApi, type ChickStatus } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"

const props = defineProps<{
  chick: ChickStatus
}>()
const emit = defineEmits<{
  jobChosen: [jobId: string]
}>()

const FULL_PCT = 100

const { t } = useI18n()
const api = useChickenApi()
const auth = useAuthStore()

const canChoose = computed(() => props.chick.xp >= XP_FOR_JOB)
const xpLeft = computed(() => Math.max(0, XP_FOR_JOB - props.chick.xp))
const xpPct = computed(() => Math.min(FULL_PCT, Math.round((props.chick.xp / XP_FOR_JOB) * FULL_PCT)))
const userGold = computed(() => auth.user?.gold ?? 0)

function missingGold(jobId: string): number {
  return Math.max(0, JOB_COST[jobId as keyof typeof JOB_COST] - userGold.value)
}

const choosingJobId = ref<string | null>(null)
const error = ref<string | null>(null)

async function choose(jobId: string) {
  choosingJobId.value = jobId
  error.value = null
  try {
    await api.chooseJob(props.chick.id, jobId)
    emit("jobChosen", jobId)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Error")
  } finally {
    choosingJobId.value = null
  }
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <p class="font-ui text-base font-bold text-pixel-black">
      {{ t("Choose a job") }}
    </p>

    <!-- XP progress -->
    <div class="w-full">
      <div class="mb-2 flex items-center justify-between">
        <span class="font-ui text-sm text-pixel-black">⚡ {{ t("XP") }}</span>
        <span class="font-ui text-sm font-bold text-pixel-black">{{ chick.xp }} / {{ XP_FOR_JOB }}</span>
      </div>
      <div class="h-3 w-full overflow-hidden border-4 border-pixel-black bg-pixel-white">
        <div
          class="h-full bg-pixel-gold transition-all duration-300"
          :style="{ width: `${xpPct}%` }"
        />
      </div>
      <p
        v-if="!canChoose"
        class="mt-2 font-ui text-sm text-pixel-gray"
      >
        {{ t("XP until job choice: {n}", { n: xpLeft }) }}
      </p>
    </div>

    <!-- Job list -->
    <div
      v-if="canChoose"
      class="flex w-full flex-col gap-2"
    >
      <div
        v-for="jobId in ALL_JOB_IDS"
        :key="jobId"
        class="flex items-center justify-between gap-2 border-4 border-pixel-black bg-pixel-white px-3 py-2"
        :class="missingGold(jobId) > 0 ? 'opacity-60' : ''"
      >
        <div class="flex items-center gap-2 text-left">
          <span class="text-xl leading-none">{{ JOB_EMOJI[jobId as keyof typeof JOB_EMOJI] }}</span>
          <div class="flex flex-col">
            <span class="font-ui text-sm font-bold text-pixel-black">{{ t(jobId) }}</span>
            <span class="font-ui text-xs text-pixel-gray">
              {{ JOB_COST[jobId as keyof typeof JOB_COST] > 0 ? t("Training cost: {n} PO", { n: JOB_COST[jobId as keyof typeof JOB_COST] }) : t("Free") }}
              · {{ t("{n} PO/day", { n: JOB_DAILY_INCOME[jobId as keyof typeof JOB_DAILY_INCOME] }) }}
            </span>
            <span
              v-if="missingGold(jobId) > 0"
              class="font-ui text-xs text-pixel-red"
            >
              {{ t("Missing {n} PO", { n: missingGold(jobId) }) }}
            </span>
          </div>
        </div>
        <PixelButton
          variant="primary"
          :disabled="choosingJobId !== null || missingGold(jobId) > 0"
          class="shrink-0 px-3 py-1 text-xs"
          @click="choose(jobId)"
        >
          {{ choosingJobId === jobId ? t("Choosing…") : t("Choose") }}
        </PixelButton>
      </div>
    </div>

    <p
      v-if="error"
      class="font-ui text-sm text-pixel-red"
    >
      {{ error }}
    </p>
  </div>
</template>
