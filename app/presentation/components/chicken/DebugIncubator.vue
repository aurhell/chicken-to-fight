<script setup lang="ts">
import { ref } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import { useDebugApi } from "~/infrastructure/api/debug"

const props = defineProps<{ eggId?: number; chickId?: number; adolescentId?: number; fighterId?: number }>()
const emit = defineEmits<{ refresh: [] }>()

const auth = useAuthStore()
const api = useDebugApi()
const loading = ref(false)

const ADD_GOLD_AMOUNT = 50

async function eggAction(type: "fast-hatch" | "drift-care" | "reset-care") {
  if (!props.eggId) return
  loading.value = true
  try {
    if (type === "fast-hatch") await api.fastHatch(props.eggId)
    else if (type === "drift-care") await api.driftCare(props.eggId)
    else await api.resetCare(props.eggId)
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function addGold() {
  loading.value = true
  try {
    await api.addGold(ADD_GOLD_AMOUNT)
    await auth.fetchMe()
  } finally {
    loading.value = false
  }
}

async function refillInventory() {
  loading.value = true
  try {
    await api.refillInventory()
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function drainChick() {
  loading.value = true
  try {
    await api.drainChick()
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function fastGrowChick() {
  loading.value = true
  try {
    await api.fastGrowChick()
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function completeStages() {
  if (!props.adolescentId) return
  loading.value = true
  try {
    await api.completeStages(props.adolescentId)
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function resetStages() {
  if (!props.adolescentId) return
  loading.value = true
  try {
    await api.resetStages(props.adolescentId)
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function addXp() {
  if (!props.fighterId) return
  loading.value = true
  try {
    await api.addXp(props.fighterId)
    emit("refresh")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed bottom-20 right-4 z-50 flex flex-col gap-2 rounded border-2 border-yellow-400 bg-black/90 p-3">
    <p class="font-ui text-xs font-bold text-yellow-400">
      🛠 Debug
    </p>
    <button
      class="rounded bg-yellow-400 px-2 py-1 font-ui text-xs text-black disabled:opacity-50"
      :disabled="loading"
      @click="addGold"
    >
      🪙 +{{ ADD_GOLD_AMOUNT }} PO
    </button>
    <template v-if="eggId">
      <button
        class="rounded bg-yellow-500 px-2 py-1 font-ui text-xs text-black disabled:opacity-50"
        :disabled="loading"
        @click="eggAction('fast-hatch')"
      >
        ⚡ Hatch in 10s
      </button>
      <button
        class="rounded bg-blue-500 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="eggAction('drift-care')"
      >
        💧 Drift care
      </button>
      <button
        class="rounded bg-green-600 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="eggAction('reset-care')"
      >
        ✅ Reset care
      </button>
    </template>
    <template v-if="chickId">
      <button
        class="rounded bg-blue-400 px-2 py-1 font-ui text-xs text-black disabled:opacity-50"
        :disabled="loading"
        @click="refillInventory"
      >
        💧🌾 +20 eau/farine
      </button>
      <button
        class="rounded bg-red-600 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="drainChick"
      >
        🔴 Vider faim & soif (0%)
      </button>
      <button
        class="rounded bg-purple-500 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="fastGrowChick"
      >
        ⏩ Passer 3 jours
      </button>
    </template>
    <template v-if="adolescentId">
      <button
        class="rounded bg-emerald-500 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="completeStages"
      >
        ✅ Compléter 6 stages
      </button>
      <button
        class="rounded bg-gray-500 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="resetStages"
      >
        🔄 Reset stages
      </button>
    </template>
    <template v-if="fighterId">
      <button
        class="rounded bg-indigo-500 px-2 py-1 font-ui text-xs text-white disabled:opacity-50"
        :disabled="loading"
        @click="addXp"
      >
        ⚡ +1000 XP
      </button>
    </template>
  </div>
</template>
