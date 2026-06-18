<script setup lang="ts">
import { ref } from "vue"

import ScratchCanvas from "~/components/ui/ScratchCanvas.vue"

/* eslint-disable no-magic-numbers */
const WINNING_LINES = [
  [
    0,
    1,
    2,
  ],
  [
    3,
    4,
    5,
  ],
  [
    6,
    7,
    8,
  ],
  [
    0,
    3,
    6,
  ],
  [
    1,
    4,
    7,
  ],
  [
    2,
    5,
    8,
  ],
  [
    0,
    4,
    8,
  ],
  [
    2,
    4,
    6,
  ],
] as const
/* eslint-enable no-magic-numbers */

const WIN_STAGGER_MS = 120
const NOT_FOUND = -1

const props = defineProps<{
  grid: string[]
}>()

const emit = defineEmits<{
  completed: [won: boolean, winLine: readonly number[] | null]
}>()

const CELL_EMOJI: Record<string, string> = {
  CHICKEN: "🐔",
  EGG: "🥚",
  CORN: "🌽",
  FEATHER: "🪶",
}

const scratched = ref(false)
const winLine = ref<readonly number[] | null>(null)
const scratchRef = ref<{ revealAll: () => void } | null>(null)

function winDelay(i: number): string {
  const pos = winLine.value?.indexOf(i) ?? NOT_FOUND
  return pos >= 0 ? `${pos * WIN_STAGGER_MS}ms` : "0ms"
}

function onRevealed() {
  if (scratched.value) return
  scratched.value = true

  const line = WINNING_LINES.find(l =>
    l.every(i => props.grid[i] === "CHICKEN"),
  ) ?? null

  winLine.value = line
  scratchRef.value?.revealAll()
  emit("completed", line !== null, line)
}
</script>

<template>
  <ScratchCanvas
    ref="scratchRef"
    :threshold="90"
    @revealed="onRevealed"
  >
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="(cell, i) in grid"
        :key="i"
        class="relative flex size-24 items-center justify-center border-4"
        :class="scratched && winLine?.includes(i)
          ? 'win-cell border-pixel-gold bg-pixel-sand'
          : 'border-pixel-black bg-pixel-sand'"
        :style="scratched && winLine?.includes(i)
          ? { animationDelay: winDelay(i) }
          : {}"
      >
        <span
          class="select-none text-5xl leading-none"
          :class="scratched && winLine?.includes(i) ? 'win-emoji' : ''"
          :style="scratched && winLine?.includes(i)
            ? { animationDelay: `calc(${winDelay(i)} + 180ms)` }
            : {}"
        >{{ CELL_EMOJI[cell] }}</span>
      </div>
    </div>
  </ScratchCanvas>
</template>

<style scoped>
@keyframes cell-pop {
  0%   { transform: scale(1) translateY(0); box-shadow: 8px 8px 0 0 #181018; }
  35%  { transform: scale(1.18) translateY(-8px); box-shadow: 10px 10px 0 0 #c8a820; }
  65%  { transform: scale(0.94) translateY(3px); box-shadow: 8px 8px 0 0 #c8a820; }
  100% { transform: scale(1) translateY(0); box-shadow: 8px 8px 0 0 #c8a820; }
}

@keyframes border-pulse {
  0%, 100% { box-shadow: 8px 8px 0 0 #c8a820; }
  50%       { box-shadow: 8px 8px 0 0 #f8c840, 0 0 0 4px #f8c840; }
}

@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  40%       { transform: translateY(-6px) rotate(-12deg); }
  70%       { transform: translateY(-2px) rotate(8deg); }
}

.win-cell {
  animation:
    cell-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    border-pulse 1.2s ease-in-out 0.5s infinite;
}

.win-emoji {
  animation: emoji-bounce 0.5s ease-out both;
}
</style>
