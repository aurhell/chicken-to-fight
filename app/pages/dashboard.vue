<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

import DebugIncubator from "~/components/chicken/DebugIncubator.vue"
import EggAdoptForm, { type EggStatus } from "~/components/chicken/EggAdoptForm.vue"
import EggIncubator from "~/components/chicken/EggIncubator.vue"
import { useAuthStore } from "~/stores/auth"

const isDev = import.meta.dev

definePageMeta({ layout: "game" })

const { t } = useI18n()
const auth = useAuthStore()

const egg = ref<EggStatus | null>(null)
const loading = ref(true)

async function fetchStatus() {
  loading.value = true
  try {
    const data = await $fetch<{ egg: EggStatus | null }>("/api/chicken/status")
    egg.value = data.egg
  } finally {
    loading.value = false
  }
}

function onAdopted(newEgg: EggStatus) {
  egg.value = newEgg
  auth.fetchMe()
}

function onHatched() {
  egg.value = null
  auth.fetchMe()
}

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

    <EggIncubator
      v-else-if="egg"
      :key="egg.hatchAt"
      :egg="egg"
      @hatched="onHatched"
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
