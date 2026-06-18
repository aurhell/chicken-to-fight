<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="border-2 border-pixel-black bg-pixel-white shadow-pixel">
    <div
      v-if="$props.title"
      class="bg-pixel-black px-4 py-2 font-pixel text-[8px] leading-relaxed text-pixel-white"
    >
      {{ $props.title }}
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>
