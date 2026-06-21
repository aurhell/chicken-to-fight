<script setup lang="ts">
import BottomNav from "~/presentation/components/game/BottomNav.vue"
import GameHeader from "~/presentation/components/game/GameHeader.vue"
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-pixel-sand">
    <GameHeader />
    <main class="flex-1 pb-16 md:pb-0">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
