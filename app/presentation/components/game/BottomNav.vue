<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { useLocalePath } from "#imports"

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const items = computed(() => [
  {
    icon: "🏠",
    label: t("Farm"),
    to: "/dashboard",
    soon: false,
  },
  {
    icon: "⚔️",
    label: t("Combat"),
    to: null,
    soon: true,
  },
  {
    icon: "🎮",
    label: t("Games"),
    to: "/minigames/grat-chicken",
    soon: false,
  },
  {
    icon: "💰",
    label: t("Market"),
    to: "/shop",
    soon: false,
  },
])

function isActive(to: string | null): boolean {
  if (!to) return false
  if (to === "/dashboard") {
    return route.path.startsWith(localePath("/dashboard")) || route.path.startsWith(localePath("/incubator"))
  }
  if (to === "/shop") {
    return route.path.startsWith(localePath("/shop")) || route.path.startsWith(localePath("/inventory"))
  }
  return route.path.startsWith(localePath(to))
}
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-50 border-t-4 border-pixel-black bg-pixel-black md:hidden">
    <ul class="flex h-16 items-stretch">
      <li
        v-for="item in items"
        :key="item.icon"
        class="flex flex-1 items-stretch"
      >
        <NuxtLink
          v-if="item.to && !item.soon"
          :to="localePath(item.to)"
          class="flex flex-1 flex-col items-center justify-center gap-1"
          :class="isActive(item.to) ? 'text-pixel-gold' : 'text-pixel-gray'"
        >
          <span class="text-xl leading-none">{{ item.icon }}</span>
          <span class="font-ui text-xs leading-none">{{ item.label }}</span>
        </NuxtLink>
        <button
          v-else
          disabled
          class="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 text-pixel-gray opacity-40"
        >
          <span class="text-xl leading-none">{{ item.icon }}</span>
          <span class="font-ui text-xs leading-none">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
