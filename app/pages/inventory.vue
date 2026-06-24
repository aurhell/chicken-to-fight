<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

import { useInventory } from "~/application/inventory/useInventory"
import InventoryList from "~/presentation/components/inventory/InventoryList.vue"
import MarketTabs from "~/presentation/components/market/MarketTabs.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const { items, loading, fetchInventory } = useInventory()

onMounted(fetchInventory)
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-6 md:px-6 md:py-10">
    <MarketTabs />
    <h2 class="mb-4 font-ui text-lg font-bold text-pixel-black md:mb-6">
      {{ t("Inventory") }}
    </h2>

    <div
      v-if="loading"
      class="py-12 text-center font-ui text-base text-pixel-gray"
    >
      {{ t("Loading…") }}
    </div>

    <InventoryList
      v-else
      :items="items"
    />
  </div>
</template>
