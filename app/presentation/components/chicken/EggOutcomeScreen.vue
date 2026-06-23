<script setup lang="ts">
import { useI18n } from "vue-i18n"

import egg3Src from "~/assets/images/egg-stade-3.png"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

const props = defineProps<{ result: "hatched" | "lost"; chickenName: string }>()
const emit = defineEmits<{ dismiss: [] }>()

const { t } = useI18n()
</script>

<template>
  <PixelCard :title="props.result === 'hatched' ? t('It hatched!') : t('The egg is lost…')">
    <div class="flex flex-col items-center gap-6 py-4 text-center">
      <img
        v-if="props.result === 'hatched'"
        :src="egg3Src"
        alt=""
        class="mx-auto h-40 w-auto"
      >
      <span
        v-else
        class="text-7xl leading-none"
      >💔</span>

      <p
        v-if="props.result === 'hatched'"
        class="font-ui text-base text-pixel-black"
      >
        {{ t("Welcome, {name}!", { name: props.chickenName }) }}
      </p>
      <p
        v-else
        class="font-ui text-base text-pixel-brown"
      >
        {{ t("The care conditions were not met. {name} did not survive.", { name: props.chickenName }) }}
      </p>

      <PixelButton
        class="w-full"
        @click="emit('dismiss')"
      >
        {{ t("Back to the farm") }}
      </PixelButton>
    </div>
  </PixelCard>
</template>
