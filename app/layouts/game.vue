<script setup lang="ts">
import BottomNav from "~/presentation/components/game/BottomNav.vue"
import GameHeader from "~/presentation/components/game/GameHeader.vue"
import GameSidebar from "~/presentation/components/game/GameSidebar.vue"
</script>

<template>
  <div class="min-h-dvh bg-pixel-sand">
    <GameSidebar />
    <div class="flex min-h-dvh flex-col md:ml-52">
      <GameHeader />
      <main class="flex-1 pb-16 md:pb-0">
        <slot />
      </main>
    </div>
    <BottomNav />
  </div>
</template>
