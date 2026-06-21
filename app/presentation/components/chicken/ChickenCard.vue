<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

import { useChickenApi, type ChickStatus  } from "~/infrastructure/api/chicken"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

const CHICKEN_SELL_PRICE = 69

const props = defineProps<{ chick: ChickStatus }>()
const emit = defineEmits<{ sold: [] }>()

const { t } = useI18n()
const api = useChickenApi()
const selling = ref(false)

async function sell() {
  selling.value = true
  try {
    await api.sell(props.chick.id)
    emit("sold")
  } finally {
    selling.value = false
  }
}
</script>

<template>
  <PixelCard :title="chick.name">
    <div class="flex flex-col items-center gap-6 py-4 text-center">
      <span class="text-7xl leading-none">🐣</span>

      <p class="font-ui text-base text-pixel-black">
        {{ t("Welcome, {name}!", { name: chick.name }) }}
      </p>

      <PixelButton
        class="w-full"
        variant="danger"
        :disabled="selling"
        @click="sell"
      >
        {{ selling ? t("Selling…") : t("Sell for {n} PO", { n: CHICKEN_SELL_PRICE }) }}
      </PixelButton>
    </div>
  </PixelCard>
</template>
