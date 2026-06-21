<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

import { useChickenApi, type EggStatus  } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"
import PixelInput from "~/presentation/components/ui/PixelInput.vue"

const EGG_ADOPTION_COST = 30

const emit = defineEmits<{ adopted: [egg: EggStatus] }>()

const { t } = useI18n()
const api = useChickenApi()
const name = ref("")
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (!name.value.trim()) return
  loading.value = true
  error.value = null
  try {
    const result = await api.adopt(name.value.trim())
    emit("adopted", result.chicken)
  } catch(e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = t(msg ?? "Adoption failed")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PixelCard :title="t('Adopt an egg')">
    <div class="mb-6 text-center">
      <div class="mb-3 text-6xl leading-none">
        🥚
      </div>
      <p class="font-ui text-base text-pixel-brown">
        {{ t("Costs") }} {{ EGG_ADOPTION_COST }} PO
      </p>
    </div>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <PixelInput
        id="egg-name"
        v-model="name"
        :label="t('Name your egg')"
        :placeholder="t('My little egg')"
        maxlength="30"
        required
      />

      <p
        v-if="error"
        class="font-pixel text-[8px] leading-relaxed text-pixel-red"
      >
        ▶ {{ error }}
      </p>

      <PixelButton
        :disabled="loading || !name.trim()"
        type="submit"
        class="w-full"
      >
        {{ loading ? t("Adopting…") : t("Adopt") }}
      </PixelButton>
    </form>
  </PixelCard>
</template>
