<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import { ALL_STAGE_IDS, STAGE, STAGES_REQUIRED } from "#shared/chicken/Stage"
import { useChickenApi, type StageInfo } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"

const props = defineProps<{
  chickenId: number
  stages: StageInfo[]
  canGraduate: boolean
}>()

const emit = defineEmits<{
  stageStarted: [stageId: string, startedAt: string, completesAt: string]
  graduated: []
}>()

const { t } = useI18n()
const api = useChickenApi()
const starting = ref<string | null>(null)
const graduating = ref(false)
const error = ref<string | null>(null)

const MS_PER_SECOND = 1_000
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval>

onMounted(() => { ticker = setInterval(() => { now.value = Date.now() }, MS_PER_SECOND) })
onUnmounted(() => clearInterval(ticker))

const localStages = ref<StageInfo[]>([...props.stages])

function liveStatus(stage: StageInfo): "not_started" | "in_progress" | "completed" {
  if (!stage.startedAt || !stage.completesAt) return "not_started"
  return now.value >= new Date(stage.completesAt).getTime() ? "completed" : "in_progress"
}

const stagesWithStatus = computed(() =>
  ALL_STAGE_IDS.map(stageId => {
    const s = localStages.value.find(x => x.stageId === stageId) ?? {
      stageId,
      status: "not_started" as const,
      startedAt: null,
      completesAt: null,
    }
    return {
      ...s,
      status: liveStatus(s), 
    }
  }),
)

const completedCount = computed(() => stagesWithStatus.value.filter(s => s.status === "completed").length)
const liveCanGraduate = computed(() => completedCount.value >= STAGES_REQUIRED)
const anyInProgress = computed(() => stagesWithStatus.value.some(s => s.status === "in_progress"))

function msLeft(stage: StageInfo): number {
  if (!stage.completesAt) return 0
  return Math.max(0, new Date(stage.completesAt).getTime() - now.value)
}

function formatCountdown(ms: number): string {
  const MS_PER_MINUTE = 60_000
  const MS_PER_HOUR = 3_600_000
  const h = Math.floor(ms / MS_PER_HOUR)
  const m = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const STAGE_LABELS: Record<string, string> = {
  [STAGE.SELF_DEFENSE]: "Stage de self-défense",
  [STAGE.LOOK]: "Se faire un look",
  [STAGE.DOPING]: "Formation dopage",
  [STAGE.ATTACKS]: "Apprendre des attaques",
  [STAGE.MANNERS]: "Leçons de savoir-vivre",
  [STAGE.HISTORY]: "Histoire des Fighters",
  [STAGE.TRICKS]: "Ruses de combat",
}

const STAGE_DURATION_LABEL: Record<string, string> = {
  [STAGE.SELF_DEFENSE]: "48h",
  [STAGE.LOOK]: t("Instant"),
  [STAGE.DOPING]: "24h",
  [STAGE.ATTACKS]: "12h",
  [STAGE.MANNERS]: "48h",
  [STAGE.HISTORY]: "24h",
  [STAGE.TRICKS]: "48h",
}

async function startStage(stageId: string) {
  starting.value = stageId
  error.value = null
  try {
    const result = await api.startStage(props.chickenId, stageId)
    const idx = localStages.value.findIndex(s => s.stageId === stageId)
    const updated = {
      stageId,
      status: "in_progress" as const,
      startedAt: result.startedAt,
      completesAt: result.completesAt, 
    }
    if (idx !== -1) {
      localStages.value = localStages.value.map((s, i) => i === idx ? updated : s)
    } else {
      localStages.value = [
        ...localStages.value,
        updated,
      ]
    }
    emit("stageStarted", result.stageId, result.startedAt, result.completesAt)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Error")
  } finally {
    starting.value = null
  }
}

async function graduate() {
  graduating.value = true
  error.value = null
  try {
    await api.graduate(props.chickenId)
    emit("graduated")
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Error")
  } finally {
    graduating.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="font-pixel text-[8px] text-pixel-gray">{{ t("Training stages") }}</span>
      <span class="font-pixel text-[8px] text-pixel-gold">{{ completedCount }}/{{ STAGES_REQUIRED }}</span>
    </div>

    <div
      v-for="stage in stagesWithStatus"
      :key="stage.stageId"
      class="flex items-center justify-between gap-3 border-4 border-pixel-black bg-pixel-sand p-3"
    >
      <div class="flex flex-col gap-1">
        <span class="font-ui text-sm font-bold text-pixel-black">{{ STAGE_LABELS[stage.stageId] }}</span>
        <span class="font-pixel text-[8px] text-pixel-gray">{{ STAGE_DURATION_LABEL[stage.stageId] }}</span>
        <span
          v-if="stage.status === 'in_progress'"
          class="font-pixel text-[8px] text-pixel-brown"
        >
          {{ formatCountdown(msLeft(stage)) }}
        </span>
      </div>

      <span
        v-if="stage.status === 'completed'"
        class="text-xl"
      >✅</span>
      <span
        v-else-if="stage.status === 'in_progress'"
        class="text-xl"
      >⏳</span>
      <PixelButton
        v-else
        :disabled="anyInProgress || starting !== null"
        @click="startStage(stage.stageId)"
      >
        {{ starting === stage.stageId ? "…" : t("Start") }}
      </PixelButton>
    </div>

    <p
      v-if="error"
      class="font-ui text-sm text-pixel-red"
    >
      {{ error }}
    </p>

    <PixelButton
      v-if="liveCanGraduate"
      class="mt-2 w-full"
      variant="primary"
      :disabled="graduating"
      @click="graduate"
    >
      {{ graduating ? t("Graduating…") : t("Graduate to Fighter!") }}
    </PixelButton>
  </div>
</template>
