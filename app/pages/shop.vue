<script setup lang="ts">
import { useI18n } from "vue-i18n"

import { useShop } from "~/application/shop/useShop"
import MarketTabs from "~/presentation/components/market/MarketTabs.vue"
import ShopItemCard from "~/presentation/components/shop/ShopItemCard.vue"

definePageMeta({ layout: "game" })

const { t } = useI18n()
const { items, buying, error, buy } = useShop()
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-6 md:px-6 md:py-10">
    <MarketTabs />
    <h2 class="mb-6 font-ui text-lg font-bold text-pixel-black">
      {{ t("Shop") }}
    </h2>

    <section>
      <h3 class="mb-3 font-pixel text-[12px] uppercase text-pixel-gray">
        {{ t("Food & wellbeing") }}
      </h3>

      <div class="flex flex-col gap-3">
        <ShopItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :loading="buying === item.id"
          @buy="buy(item.id)"
        />
      </div>
    </section>

    <p
      v-if="error"
      class="mt-4 font-ui text-base text-pixel-red"
    >
      {{ t(error) }}
    </p>
  </div>
</template>
