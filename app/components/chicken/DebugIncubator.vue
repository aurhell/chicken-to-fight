<script setup lang="ts">
import { ref } from "vue"

import { useAuthStore } from "~/stores/auth"

const props = defineProps<{ eggId?: number }>()
const emit = defineEmits<{ refresh: [] }>()

const auth = useAuthStore()
const loading = ref(false)

const ADD_GOLD_AMOUNT = 50

async function eggAction(type: "fast-hatch" | "drift-care" | "reset-care") {
  if (!props.eggId) return
  loading.value = true
  try {
    await $fetch(`/api/debug/chicken/${props.eggId}/${type}`, { method: "POST" })
    emit("refresh")
  } finally {
    loading.value = false
  }
}

async function addGold() {
  loading.value = true
  try {
    await $fetch("/api/debug/add-gold", {
      method: "POST",
      body: { amount: ADD_GOLD_AMOUNT }, 
    })
    await auth.fetchMe()
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
        ⚡ Hatch now
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
  </div>
</template>
