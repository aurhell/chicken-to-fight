<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import { JOB_DAILY_INCOME, JOB_EMOJI, SALARY_COOLDOWN_H } from "#shared/chicken/Job"
import { useChickenApi, type ChickStatus } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"

const MS_PER_HOUR = 3_600_000
const TICK_MS = 60_000

const props = defineProps<{
  chick: ChickStatus
}>()
const emit = defineEmits<{
  salaryCollected: [goldEarned: number, newGold: number]
}>()

const { t } = useI18n()
const api = useChickenApi()

const collecting = ref(false)
const error = ref<string | null>(null)
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | null = null

onMounted(() => { ticker = setInterval(() => { now.value = Date.now() }, TICK_MS) })
onBeforeUnmount(() => { if (ticker) clearInterval(ticker) })

const jobId = computed(() => props.chick.jobId!)
const dailyIncome = computed(() => JOB_DAILY_INCOME[jobId.value as keyof typeof JOB_DAILY_INCOME] ?? 0)

const canCollect = computed(() => {
  if (!props.chick.lastSalaryAt) return true
  const last = new Date(props.chick.lastSalaryAt).getTime()
  return now.value - last >= SALARY_COOLDOWN_H * MS_PER_HOUR
})

const nextCollectionMs = computed(() => {
  if (!props.chick.lastSalaryAt) return 0
  const last = new Date(props.chick.lastSalaryAt).getTime()
  return Math.max(0, last + SALARY_COOLDOWN_H * MS_PER_HOUR - now.value)
})

const nextCollectionLabel = computed(() => {
  const ms = nextCollectionMs.value
  if (ms <= 0) return ""
  const h = Math.floor(ms / MS_PER_HOUR)
  const m = Math.floor((ms % MS_PER_HOUR) / TICK_MS)
  return t("Next collection in: {h}h {m}m", {
    h,
    m, 
  })
})

async function collect() {
  collecting.value = true
  error.value = null
  try {
    const result = await api.collectSalary(props.chick.id)
    emit("salaryCollected", result.goldEarned, result.newGold)
  } catch(e) {
    error.value = e instanceof Error ? e.message : t("Error")
  } finally {
    collecting.value = false
  }
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex items-center justify-between border-4 border-pixel-black bg-pixel-white px-4 py-3">
      <div class="flex flex-col text-left">
        <span class="font-ui text-sm font-bold text-pixel-black">{{ t(jobId) }}</span>
        <span class="font-ui text-xs text-pixel-gold">{{ t("{n} PO/day", { n: dailyIncome }) }}</span>
      </div>
      <span class="text-2xl leading-none">{{ JOB_EMOJI[jobId as keyof typeof JOB_EMOJI] ?? "💼" }}</span>
    </div>

    <PixelButton
      class="w-full"
      variant="primary"
      :disabled="!canCollect || collecting"
      @click="collect"
    >
      {{ collecting ? t("Collecting…") : t("Collect salary") }}
    </PixelButton>

    <p
      v-if="!canCollect && nextCollectionLabel"
      class="font-ui text-xs text-pixel-gray"
    >
      {{ nextCollectionLabel }}
    </p>

    <p
      v-if="error"
      class="font-ui text-sm text-pixel-red"
    >
      {{ error }}
    </p>
  </div>
</template>
