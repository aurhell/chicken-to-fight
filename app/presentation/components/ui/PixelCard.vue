<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="border-4 border-pixel-black bg-pixel-white shadow-pixel-nes">
    <div
      v-if="$props.title"
      class="border-b-4 border-pixel-black bg-pixel-black px-4 py-3 font-pixel text-base leading-normal text-pixel-white"
    >
      {{ $props.title }}
    </div>
    <div class="p-8">
      <slot />
    </div>
  </div>
</template>
