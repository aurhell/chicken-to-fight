<script setup lang="ts">
import { useI18n } from "vue-i18n"

import { useSwitchLocalePath } from "#imports"

withDefaults(defineProps<{
  variant?: "dark" | "light"
}>(), { variant: "dark" })

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="flex items-center gap-1 text-sm">
    <template
      v-for="(loc, index) in locales"
      :key="loc.code"
    >
      <span
        v-if="index > 0"
        :class="variant === 'light' ? 'text-pixel-gray' : 'text-gray-300'"
      >|</span>
      <NuxtLink
        v-if="loc.code !== locale"
        :to="switchLocalePath(loc.code)"
        class="font-pixel text-[12px]"
        :class="variant === 'light' ? 'text-pixel-gold hover:text-pixel-straw' : 'text-pixel-blue hover:text-pixel-blue-light'"
      >
        {{ loc.code.toUpperCase() }}
      </NuxtLink>
      <span
        v-else
        class="font-pixel text-[9px] font-bold"
        :class="variant === 'light' ? 'text-pixel-white' : 'text-pixel-black'"
      >
        {{ loc.code.toUpperCase() }}
      </span>
    </template>
  </div>
</template>
