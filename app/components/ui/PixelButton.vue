<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  variant?: "primary" | "danger" | "ghost"
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="props.disabled"
    :class="[
      'min-h-[44px] cursor-pointer px-4 py-2 font-ui text-sm font-bold transition-all duration-75',
      'border-2 border-pixel-black',
      'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
      'disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
      {
        'bg-pixel-gold text-pixel-black shadow-pixel hover:bg-pixel-straw': !props.variant || props.variant === 'primary',
        'bg-pixel-red text-pixel-white shadow-pixel hover:bg-pixel-red-light': props.variant === 'danger',
        'bg-transparent text-pixel-black shadow-pixel-sm hover:bg-pixel-sand': props.variant === 'ghost',
      },
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
