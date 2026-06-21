<script setup lang="ts">
import { useI18n } from "vue-i18n"

import { INVENTORY_ITEM_DESCRIPTIONS, INVENTORY_ITEM_ICONS } from "#shared/economy/InventoryItem"
import PixelCard from "~/presentation/components/ui/PixelCard.vue"

const ITEM_LABELS: Record<string, string> = {
  flour: "Flour",
  water: "Water",
  seeds: "Seeds",
  beer: "Beer",
  treats: "Treats",
}

defineProps<{ items: Record<string, number> }>()

const { t } = useI18n()
</script>

<template>
  <PixelCard :title="t('Resources')">
    <ul class="flex flex-col gap-3">
      <li
        v-for="(qty, key) in items"
        :key="key"
        class="flex items-center justify-between gap-4 border-4 border-pixel-black bg-pixel-sand p-3"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl leading-none">{{ INVENTORY_ITEM_ICONS[key] ?? "📦" }}</span>
          <div>
            <p class="font-ui text-base font-bold text-pixel-black">
              {{ t(ITEM_LABELS[key] ?? key) }}
            </p>
            <p
              v-if="INVENTORY_ITEM_DESCRIPTIONS[key]"
              class="font-ui text-xs text-pixel-gray"
            >
              {{ t(INVENTORY_ITEM_DESCRIPTIONS[key]) }}
            </p>
          </div>
        </div>
        <span class="font-pixel text-base text-pixel-black">{{ qty }}</span>
      </li>
    </ul>
    <p
      v-if="Object.keys(items).length === 0"
      class="py-4 text-center font-ui text-base text-pixel-gray"
    >
      {{ t("Your inventory is empty.") }}
    </p>
  </PixelCard>
</template>
