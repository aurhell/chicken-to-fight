<script setup lang="ts">
import { useI18n } from "vue-i18n"

import { INVENTORY_ITEM_DESCRIPTIONS, INVENTORY_ITEM_ICONS } from "#shared/economy/InventoryItem"
import PixelButton from "~/presentation/components/ui/PixelButton.vue"

import type { ShopItem } from "#shared/economy/ShopItem"

const props = defineProps<{
  item: ShopItem
  loading: boolean
}>()
const emit = defineEmits<{ buy: [] }>()

const { t } = useI18n()

const LABELS: Record<string, string> = {
  "water_trough": "Water trough",
  "flour": "Flour",
  "seeds": "Seeds",
  "beer": "Beer",
  "treats": "Treats",
}
</script>

<template>
  <div class="flex items-center justify-between gap-4 border-4 border-pixel-black bg-pixel-white p-4">
    <div class="flex items-center gap-3">
      <span class="text-3xl leading-none">{{ INVENTORY_ITEM_ICONS[item.inventoryKey] ?? "📦" }}</span>
      <div>
        <p class="font-ui text-base font-bold text-pixel-black">
          {{ t(LABELS[item.id] ?? item.id) }}
        </p>
        <p class="font-ui text-xs text-pixel-gray">
          {{ t(INVENTORY_ITEM_DESCRIPTIONS[item.inventoryKey] ?? "") }}
        </p>
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-3">
      <span class="font-pixel text-[8px] text-pixel-gold">{{ item.price }} PO</span>
      <PixelButton
        :disabled="loading"
        @click="emit('buy')"
      >
        {{ loading ? t("Buying…") : t("Buy") }}
      </PixelButton>
    </div>
  </div>
</template>
