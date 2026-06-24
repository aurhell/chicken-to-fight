<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  label?: string
  id?: string
  error?: string
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :for="id"
      class="font-ui text-base font-bold text-pixel-black"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      class="border-4 border-pixel-black bg-pixel-sand p-3 font-ui text-base text-pixel-black placeholder:text-pixel-gray focus:border-pixel-straw focus:outline-none"
      v-bind="$attrs"
    >
    <span
      v-if="error"
      class="font-pixel text-[12px] leading-relaxed text-pixel-red"
    >
      ▶ {{ error }}
    </span>
  </div>
</template>
