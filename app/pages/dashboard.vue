<script setup lang="ts">
import PixelCard from "~/components/ui/PixelCard.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
    <h2 class="mb-4 font-ui text-lg font-bold text-pixel-black md:mb-6">
      {{ t("My farm") }}
    </h2>

    <PixelCard>
      <div class="py-8 text-center">
        <div class="mb-4 text-6xl leading-none">
          🥚
        </div>
        <p class="font-ui text-base font-semibold text-pixel-brown">
          {{ t("No chicken yet") }}
        </p>
        <p class="mt-2 font-ui text-sm text-pixel-gray">
          {{ t("Adoption coming soon…") }}
        </p>
      </div>
    </PixelCard>
  </div>
</template>
