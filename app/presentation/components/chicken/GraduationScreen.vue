<script setup lang="ts">
import { useI18n } from "vue-i18n"

import duckBaseImg from "~/assets/images/duck-base.png"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

defineProps<{ chickenName: string }>()
const emit = defineEmits<{ dismiss: [] }>()

const { t } = useI18n()
</script>

<template>
  <PixelCard :title="t('Graduation!')">
    <div class="flex flex-col items-center gap-6 py-4 text-center">
      <div class="relative">
        <img
          :src="duckBaseImg"
          :alt="chickenName"
          class="mx-auto h-40 w-auto"
        >
        <span class="absolute -right-2 -top-2 text-3xl">🏆</span>
      </div>

      <p class="font-ui text-base text-pixel-black">
        {{ t("{name} is now an Apprentice Fighter!", { name: chickenName }) }}
      </p>
      <p class="font-ui text-sm text-pixel-gray">
        {{ t("Training complete. The real fights begin soon.") }}
      </p>

      <PixelButton
        class="w-full"
        variant="primary"
        @click="emit('dismiss')"
      >
        {{ t("Back to the farm") }}
      </PixelButton>
    </div>
  </PixelCard>
</template>
