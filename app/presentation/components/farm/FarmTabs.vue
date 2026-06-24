<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { useLocalePath } from "#imports"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const tabs = [
  {
    label: "Incubator",
    icon: "🐣",
    to: "/incubator", 
  },
  {
    label: "Chickens",
    icon: "🐔",
    to: "/dashboard", 
  },
]

function isActive(to: string): boolean {
  return route.path.startsWith(localePath(to))
}
</script>

<template>
  <nav class="mb-6 flex gap-1 border-b-4 border-pixel-black md:hidden">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="localePath(tab.to)"
      class="-mb-1 flex items-center gap-2 border-b-4 px-4 py-2 font-ui text-sm transition-colors"
      :class="isActive(tab.to)
        ? 'border-pixel-gold font-bold text-pixel-black'
        : 'border-transparent text-pixel-gray hover:text-pixel-black'"
    >
      <span>{{ tab.icon }}</span>
      <span>{{ t(tab.label) }}</span>
    </NuxtLink>
  </nav>
</template>
