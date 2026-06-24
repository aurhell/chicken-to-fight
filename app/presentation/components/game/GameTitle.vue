<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()

withDefaults(defineProps<{
  compact?: boolean
  variant?: "dark" | "light"
}>(), {
  compact: false,
  variant: "dark",
})
</script>

<template>
  <div :class="compact ? 'text-left' : 'text-center'">
    <p
      class="font-pixel leading-normal"
      :class="[
        compact ? 'text-base' : 'text-2xl',
        variant === 'light' ? 'text-pixel-gold' : 'text-pixel-black',
      ]"
    >
      {{ t("Chicken to Fight") }}
    </p>
    <p
      class="font-pixel"
      :class="[
        compact ? 'mt-1 text-[12px]' : 'mt-3 text-base',
        variant === 'light' ? 'text-pixel-red-light' : 'text-pixel-red',
      ]"
    >
      ◆ REVIVAL ◆
    </p>
  </div>
</template>
