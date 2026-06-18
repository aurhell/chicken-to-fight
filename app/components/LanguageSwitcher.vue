<script setup lang="ts">
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
        class="text-gray-300"
      >|</span>
      <NuxtLink
        v-if="loc.code !== locale"
        :to="switchLocalePath(loc.code)"
        class="text-amber-600 hover:underline"
      >
        {{ loc.code.toUpperCase() }}
      </NuxtLink>
      <span
        v-else
        class="font-semibold text-amber-900"
      >
        {{ loc.code.toUpperCase() }}
      </span>
    </template>
  </div>
</template>
